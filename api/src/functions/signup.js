import { app } from "@azure/functions";
import { verifyPaidAccount } from "../lib/passwordAuth.js";
import { validateLearnerDetails } from "../lib/learnerDetails.js";
import { completeSignup, getSignupInvite } from "../lib/signupStore.js";
import { updateSubscriptionByAccountKey } from "../lib/subscriptionStore.js";

// The emailed one-time signup link.
//
// Onboarding now happens in the app straight after payment, through
// /api/onboarding, and no new invitations are issued. This route stays so that
// any link already sitting in someone's inbox still works until it expires.
app.http("signup", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "signup/{token}",
  handler: async (request, context) => {
    try {
      const token = request.params.token;
      const invite = await getSignupInvite(token);
      if (!invite) return { status: 410, jsonBody: { error: "This signup link is invalid, expired, or already used." } };
      if (request.method === "GET") return { jsonBody: { email: invite.email, expiresAt: invite.expiresAt } };

      const body = await request.json();
      if (typeof body.password !== "string" || body.password.length < 15 || body.password.length > 128) {
        return { status: 400, jsonBody: { error: "Set an account password of 15-128 characters." } };
      }
      const checked = validateLearnerDetails(body);
      if (!checked.valid) return { status: 400, jsonBody: { error: checked.error } };

      await verifyPaidAccount(invite.email, body.password);
      const profile = await completeSignup(token, checked.value);
      await updateSubscriptionByAccountKey(invite.accountKey, { onboardingComplete: true });
      return { status: 201, jsonBody: { profile } };
    } catch (error) {
      context.error(error);
      return { status: error.statusCode ?? 500, jsonBody: { error: error.message ?? "Signup could not be completed." } };
    }
  },
});
