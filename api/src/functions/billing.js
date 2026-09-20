import { app } from "@azure/functions";
import Stripe from "stripe";
import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "../lib/auth.js";
import {
  accountKey,
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
      host: url.hostname,
      port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
      protocol: url.protocol === "https:" ? "https" : "http",
    });
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
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

      const { email, admin, allowed } = await identity(request);
      if (!allowed) return { status: 403, jsonBody: { error: "Your Education Hub access is inactive." } };

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
              setupIncomplete: counted((row) => grantsAccess(row.status) && !row.onboardingComplete),
            },
          },
        };
      }

      if (request.method !== "POST") return { status: 405 };
      const stripe = stripeClient();
      const origin = process.env.APP_BASE_URL ?? new URL(request.url).origin;

      if (action === "checkout") {
        const price = priceId();
        if (!price) return { status: 503, jsonBody: { error: "This subscription price is not configured yet." } };
        const key = accountKey(email);
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          customer_email: email,
          billing_address_collection: "required",
          phone_number_collection: { enabled: true },
          client_reference_id: key,
          line_items: [{ price, quantity: 1 }],
          allow_promotion_codes: true,
          success_url: `${origin}/?checkout=success`,
          cancel_url: `${origin}/?checkout=cancelled`,
          metadata: { accountKey: key, plan: "learner", billingPeriod },
          subscription_data: {
            metadata: { accountKey: key, plan: "learner", billingPeriod },
          },
        });
        await savePendingSubscription(email, { plan: "learner", billingPeriod });
        return { jsonBody: { url: session.url } };
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
