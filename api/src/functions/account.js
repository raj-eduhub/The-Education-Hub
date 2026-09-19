import { app } from "@azure/functions";
import Stripe from "stripe";
import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "../lib/auth.js";
import { deleteProgress } from "../lib/progressStore.js";
import { deleteFlags } from "../lib/safeguardingStore.js";
import { deleteCredentials } from "../lib/passwordAuth.js";
import { deleteProfile } from "../lib/signupStore.js";
import { deleteSubscription, getSubscriptionEntity } from "../lib/subscriptionStore.js";
import { deleteUserByEmail, userCanAccess } from "../lib/userStore.js";

app.http("account", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "account",
  handler: async (request, context) => {
    try {
      const principal = await getPrincipal(request);
      const email = principalEmail(principal) || (developmentBypass() ? "local@example.com" : "");
      if (!email || (!developmentBypass() && !(await userCanAccess(email)))) {
        return { status: 403, jsonBody: { error: "An active account is required." } };
      }
      if (!developmentBypass() && isAdministrator(principal)) {
        return { status: 409, jsonBody: { error: "Administrators must first be removed from ADMIN_EMAILS." } };
      }

      const subscription = await getSubscriptionEntity(email);
      if (subscription?.stripeSubscriptionId && process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      }

      await Promise.all([
        deleteProgress(email),
        // Safeguarding flags go with the account, because the privacy notice
        // promises deletion and this app makes no separate retention promise.
        // An operator with a safeguarding policy that requires retention should
        // change this line and say so in the notice.
        deleteFlags(email),
        deleteCredentials(email),
        deleteProfile(email),
        deleteSubscription(email),
        deleteUserByEmail(email),
      ]);
      return { status: 204 };
    } catch (error) {
      context.error(error);
      return { status: 500, jsonBody: { error: "The account could not be deleted." } };
    }
  },
});
