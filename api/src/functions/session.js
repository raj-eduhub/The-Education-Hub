import { app } from "@azure/functions";
import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "../lib/auth.js";
import { getUserByEmail } from "../lib/userStore.js";

app.http("session", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "session",
  handler: async (request, context) => {
    try {
      const principal = await getPrincipal(request);
      if (!principal && !developmentBypass()) {
        return { status: 401, jsonBody: { error: "Log in to continue." } };
      }

      const admin = developmentBypass() || isAdministrator(principal);
      const accessUser = admin ? null : await getUserByEmail(principalEmail(principal));
      const hasAccess = admin || accessUser?.status === "active";
      return {
        jsonBody: {
          hasAccess,
          isAdmin: admin,
          accessRole: admin ? "admin" : accessUser?.role ?? null,
          user: principal
            ? {
                name: principal.name ?? principal.userDetails,
                email: principalEmail(principal),
                picture: principal.picture ?? "",
              }
            : { name: "Local administrator", email: "local@example.com", picture: "" },
        },
      };
    } catch (error) {
      context.error(error);
      return { status: 500, jsonBody: { error: "Unable to verify application access." } };
    }
  },
});
