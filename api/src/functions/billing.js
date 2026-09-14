import { app } from "@azure/functions";
import Stripe from "stripe";
import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "../lib/auth.js";
import {
  accountKey,
  getSubscription,
  getSubscriptionEntity,
  savePendingSubscription,
} from "../lib/subscriptionStore.js";
import { userCanAccess } from "../lib/userStore.js";
import { handleStripeEvent } from "../lib/billingEvents.js";

const priceIds = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual: process.env.STRIPE_PRICE_ANNUAL,
};

function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured.");
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

      if (request.method !== "POST") return { status: 405 };
      const stripe = stripeClient();
      const origin = process.env.APP_BASE_URL ?? new URL(request.url).origin;

      if (action === "checkout") {
        const body = await request.json();
        if (!["monthly", "annual"].includes(body.billingPeriod)) {
          return { status: 400, jsonBody: { error: "A billing period is required." } };
        }
        const price = priceIds[body.billingPeriod];
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
          metadata: { accountKey: key, plan: "learner", billingPeriod: body.billingPeriod },
          subscription_data: {
            metadata: { accountKey: key, plan: "learner", billingPeriod: body.billingPeriod },
          },
        });
        await savePendingSubscription(email, {
          plan: "learner",
          billingPeriod: body.billingPeriod,
        });
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

      return { status: 404, jsonBody: { error: "Billing action not found." } };
    } catch (error) {
      context.error(error);
      return { status: 500, jsonBody: { error: "Billing is unavailable. Check the Stripe and storage settings." } };
    }
  },
});
