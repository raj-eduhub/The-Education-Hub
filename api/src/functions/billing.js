import { app } from "@azure/functions";
import Stripe from "stripe";
import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "../lib/auth.js";
import { emailForCheckoutGrant } from "../lib/passwordAuth.js";
import { curriculum } from "../../../src/data/curriculumCatalog.js";
import { getProfile } from "../lib/signupStore.js";
import {
  accountKey,
  claimFreeTopic,
  getSubscription,
  getSubscriptionEntity,
  grantsAccess,
  listSubscriptions,
  savePendingSubscription,
  updateSubscriptionByAccountKey,
} from "../lib/subscriptionStore.js";
import { userCanAccess } from "../lib/userStore.js";
import { handleStripeEvent } from "../lib/billingEvents.js";

// One plan, billed monthly. The billing period still travels in the Stripe
// metadata so the webhook, the subscription record and the billing portal keep
// the shape they already had.
const billingPeriod = "monthly";
const priceId = () => process.env.STRIPE_PRICE_MONTHLY;

function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured.");
  // Local development only: point the SDK at a stub so the payment path can be
  // walked end to end without a Stripe account. Guarded on the Functions host
  // running in Development, so setting the variable in Azure does nothing.
  const base = process.env.STRIPE_API_BASE;
  if (base && process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Development") {
    const url = new URL(base);
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia; custom_checkout_payment_form_preview=v1",
      host: url.hostname,
      port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
      protocol: url.protocol === "https:" ? "https" : "http",
    });
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia; custom_checkout_payment_form_preview=v1" });
}

async function identity(request) {
  const principal = await getPrincipal(request);
  const email = principalEmail(principal) || (developmentBypass() ? "local@example.com" : "");
  const admin = developmentBypass() || isAdministrator(principal);
  const allowed = admin || (await userCanAccess(email));
  return { email, admin, allowed };
}

app.http("billing", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "billing/{action}",
  handler: async (request, context) => {
    try {
      const action = request.params.action;

      // Stripe posts here unauthenticated, and this function owns the whole
      // billing/{action} route, so the webhook is handled before the access
      // check. A separate function on billing/webhook was shadowed by this
      // wildcard route and every Stripe delivery was answered with 403.
      if (action === "webhook") {
        if (request.method !== "POST") return { status: 405 };
        let event;
        try {
          if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error("Stripe webhook settings are missing.");
          }
          const stripe = stripeClient();
          const payload = await request.text();
          event = stripe.webhooks.constructEvent(payload, request.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET);
        } catch (verifyError) {
          context.error("Stripe webhook rejected", verifyError.message);
          return { status: 400, jsonBody: { error: "Invalid webhook." } };
        }
        try {
          const result = await handleStripeEvent(event, {
            appUrl: process.env.APP_BASE_URL ?? new URL(request.url).origin,
            log: (message) => context.warn(message),
          });
          return { status: 200, jsonBody: { received: true, ...result } };
        } catch (applyError) {
          // A verified event that could not be applied returns 500 so Stripe
          // retries. A 200 here would silently lose a paid subscription.
          context.error("Stripe event could not be applied", applyError.message);
          return { status: 500, jsonBody: { error: "The event could not be applied." } };
        }
      }

      const identified = await identity(request);
      // Checkout is the one action a brand-new account must reach before it has
      // any access, because paying is how access is granted. A sign-up carries
      // a checkout grant for exactly that: it resolves to one email address and
      // authorises one thing. Every other action still needs real access.
      let { email, admin, allowed } = identified;
      if (!allowed && action === "checkout" && request.method === "POST") {
        const body = await request.clone().json().catch(() => ({}));
        const granted = await emailForCheckoutGrant(typeof body.checkoutToken === "string" ? body.checkoutToken : "");
        if (granted) {
          email = granted;
          allowed = true;
          admin = false;
        }
      }
      if (!allowed) return { status: 403, jsonBody: { error: "Your Y7to11.AI access is inactive." } };

      if (request.method === "GET" && action === "status") {
        if (admin) return { jsonBody: { subscription: { plan: "admin", status: "active" } } };
        return { jsonBody: { subscription: await getSubscription(email) } };
      }

      // Who is paying, for an administrator. Read from the local table rather
      // than from Stripe: it is one row per account and answers instantly, and
      // the reconcile action below exists for the cases where the two disagree.
      if (request.method === "GET" && action === "subscribers") {
        if (!admin) return { status: 403, jsonBody: { error: "An administrator account is required." } };
        const subscribers = await listSubscriptions();
        const counted = (predicate) => subscribers.filter(predicate).length;
        // The price comes from Stripe so the revenue figure cannot drift away
        // from what customers are actually charged.
        let monthlyPrice = null;
        try {
          const price = priceId() ? await stripeClient().prices.retrieve(priceId()) : null;
          if (price?.unit_amount != null) monthlyPrice = price.unit_amount / 100;
        } catch (priceError) {
          context.warn(`Subscription price could not be read from Stripe: ${priceError.message}`);
        }
        return {
          jsonBody: {
            subscribers,
            monthlyPrice,
            currency: "GBP",
            totals: {
              all: subscribers.length,
              active: counted((row) => row.status === "active"),
              pastDue: counted((row) => row.status === "past_due"),
              cancelling: counted((row) => row.status === "active" && row.cancelAtPeriodEnd),
              cancelled: counted((row) => ["canceled", "unpaid"].includes(row.status)),
              pending: counted((row) => row.status === "checkout_pending"),
              trial: counted((row) => row.status === "trial"),
              setupIncomplete: counted((row) => grantsAccess(row.status) && !row.onboardingComplete),
            },
          },
        };
      }

      if (request.method !== "POST") return { status: 405 };

      // An unpaid account's one free topic. It has to be a topic in the
      // learner's own year, and the first choice stands - the store refuses to
      // overwrite it - so the reply always names the topic that is actually free.
      if (action === "free-topic") {
        if (admin) return { status: 400, jsonBody: { error: "Administrator access already covers every topic." } };
        const subscription = await getSubscription(email);
        if (grantsAccess(subscription?.status)) return { status: 409, jsonBody: { error: "Your subscription already covers every topic." } };
        if (!subscription?.onboardingComplete) return { status: 409, jsonBody: { error: "Finish learner setup first." } };
        const body = await request.json().catch(() => ({}));
        const profile = await getProfile(email);
        const topic = curriculum.find((entry) => entry.id === body.topicId);
        if (!topic || !profile || topic.year !== profile.year) {
          return { status: 400, jsonBody: { error: "Choose a topic from the learner's own year." } };
        }
        const freeTopicId = await claimFreeTopic(email, topic.id);
        if (freeTopicId !== topic.id) {
          return { status: 409, jsonBody: { error: "A free topic has already been chosen.", freeTopicId } };
        }
        return { jsonBody: { freeTopicId } };
      }

      const stripe = stripeClient();
      const origin = process.env.APP_BASE_URL ?? new URL(request.url).origin;

      if (action === "checkout") {
        const price = priceId();
        if (!price) return { status: 503, jsonBody: { error: "This subscription price is not configured yet." } };
        const key = accountKey(email);
        const session = await stripe.checkout.sessions.create({
          // Configured in Checkout Studio.
          ui_mode: "form",
          billing_address_collection: "auto",
          phone_number_collection: { enabled: false },
          automatic_tax: { enabled: false },
          payment_method_collection: "always",
          submit_type: "auto",
          integration_identifier: "custom_embedded_web_0001",

          mode: "subscription",
          line_items: [{ price, quantity: 1 }],

          // Not Checkout Studio options: this is how a payment is matched back
          // to an account. handleStripeEvent() reads metadata.accountKey on
          // checkout.session.completed, and subscription_data.metadata carries
          // it onto every later customer.subscription.* event. Without them a
          // card is charged and no subscription is ever activated, so they stay.
          customer_email: email,
          client_reference_id: key,
          metadata: { accountKey: key, plan: "learner", billingPeriod },
          subscription_data: {
            metadata: { accountKey: key, plan: "learner", billingPeriod },
          },
        });
        await savePendingSubscription(email, { plan: "learner", billingPeriod });
        // The embedded form mounts against the session rather than redirecting,
        // so client_secret is what the subscription page needs. url is passed
        // through as well because the local Stripe stub has no card form and
        // answers with a plain redirect instead; against real Stripe in this
        // ui_mode it is null and the embedded form is used.
        return { jsonBody: { client_secret: session.client_secret ?? null, url: session.url ?? null } };
      }

      if (action === "portal") {
        const subscription = await getSubscriptionEntity(email);
        if (!subscription?.stripeCustomerId) return { status: 409, jsonBody: { error: "No billing account is available." } };
        const session = await stripe.billingPortal.sessions.create({
          customer: subscription.stripeCustomerId,
          return_url: `${origin}/#account`,
        });
        return { jsonBody: { url: session.url } };
      }

      // Everything the app knows about a subscription arrives by webhook. If one
      // is missed - a misconfigured endpoint, an outage while Stripe gives up
      // retrying - the local row silently stays out of date, and a cancelled
      // customer keeps their access. This reads the subscription back from
      // Stripe and repairs the row.
      if (action === "reconcile") {
        if (!admin) return { status: 403, jsonBody: { error: "An administrator account is required." } };
        const body = await request.json();
        const target = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        if (!target) return { status: 400, jsonBody: { error: "An account email is required." } };
        const stored = await getSubscriptionEntity(target);
        if (!stored?.stripeSubscriptionId) {
          return { status: 404, jsonBody: { error: "That account has no Stripe subscription to reconcile against." } };
        }
        const live = await stripe.subscriptions.retrieve(stored.stripeSubscriptionId);
        const changed = stored.status !== live.status || stored.cancelAtPeriodEnd !== live.cancel_at_period_end;
        await updateSubscriptionByAccountKey(accountKey(target), {
          status: live.status,
          cancelAtPeriodEnd: live.cancel_at_period_end,
          currentPeriodEnd: live.current_period_end ? new Date(live.current_period_end * 1000).toISOString() : null,
          stripeCustomerId: live.customer,
          reconciledAt: new Date().toISOString(),
        });
        return { jsonBody: { email: target, status: live.status, cancelAtPeriodEnd: live.cancel_at_period_end, changed } };
      }

      return { status: 404, jsonBody: { error: "Billing action not found." } };
    } catch (error) {
      context.error(error);
      return { status: 500, jsonBody: { error: "Billing is unavailable. Check the Stripe and storage settings." } };
    }
  },
});
