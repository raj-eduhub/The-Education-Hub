import { app } from "@azure/functions";
import { developmentBypass, getPrincipal, principalEmail } from "../lib/auth.js";
import { getProfile } from "../lib/signupStore.js";
import { userCanAccess } from "../lib/userStore.js";

app.http("profile", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "profile",
  handler: async (request, context) => {
    try {
      const principal = await getPrincipal(request);
      const email = principalEmail(principal) || (developmentBypass() ? "local@example.com" : "");
      if (!email || (!developmentBypass() && !(await userCanAccess(email)))) return { status: 403 };
      return { jsonBody: { profile: await getProfile(email) } };
    } catch (error) {
      context.error(error);
      return { status: 500, jsonBody: { error: "The learner profile could not be loaded." } };
    }
  },
});
