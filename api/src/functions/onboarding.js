import { app } from "@azure/functions";
import { developmentBypass, getPrincipal, principalEmail } from "../lib/auth.js";
import { validateLearnerDetails } from "../lib/learnerDetails.js";
import { saveLearnerProfile } from "../lib/signupStore.js";
import { completeOnboarding } from "../lib/subscriptionStore.js";
import { userCanAccess } from "../lib/userStore.js";

// Learner setup, completed in the app before or after payment. A free trial
// needs it first: the free topic is chosen from the learner's year.
//
// This replaces the emailed one-time link. The account already exists and is
// signed in by the time anyone reaches checkout, so sending them out to their
// inbox for a 48-hour token only added a step that could expire, be lost to a
// spam filter, or strand a paying customer. The route is deliberately its own
// path rather than another segment under signup/{token}, because a wildcard
// route in this app has shadowed a literal one before.
app.http("onboarding", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "onboarding",
  handler: async (request, context) => {
    try {
      const principal = await getPrincipal(request);
      const email = principalEmail(principal) || (developmentBypass() ? "local@example.com" : "");
      if (!email) return { status: 401, jsonBody: { error: "Sign in to complete learner setup." } };

      // Open to any account on the roster, paid or not. Getting on the roster
      // takes a confirmed email address, so an unproven sign-up still cannot
      // attach a child's details to an address it does not own.
      if (!developmentBypass() && !(await userCanAccess(email))) {
        return { status: 403, jsonBody: { error: "Confirm your email address before learner setup." } };
      }

      const body = await request.json();
      const checked = validateLearnerDetails(body);
      if (!checked.valid) return { status: 400, jsonBody: { error: checked.error } };

      const profile = await saveLearnerProfile(email, checked.value);
      await completeOnboarding(email);
      return { status: 201, jsonBody: { profile } };
    } catch (error) {
      context.error("Learner onboarding failure", error.message);
      return {
        status: error.statusCode ?? 500,
        jsonBody: { error: error.message ?? "Learner setup could not be completed." },
      };
    }
  },
});
