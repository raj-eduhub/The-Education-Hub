import { OAuth2Client } from "google-auth-library";
import { passwordPrincipal } from "./passwordAuth.js";

const googleClient = new OAuth2Client();

export async function getPrincipal(request) {
  const passwordUser = await passwordPrincipal(request);
  if (passwordUser) return passwordUser;
  const authorization = request.headers.get("authorization") ?? "";
  if (authorization.startsWith("Bearer ") && process.env.GOOGLE_CLIENT_ID) {
    const ticket = await googleClient.verifyIdToken({
      idToken: authorization.slice(7),
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || payload.email_verified !== true) return null;
    return {
      identityProvider: "google",
      userId: payload.sub,
      userDetails: payload.email,
      userRoles: ["authenticated"],
      name: payload.name ?? payload.email,
      picture: payload.picture ?? "",
    };
  }

  return null;
}

export function principalEmail(principal) {
  return principal?.userDetails?.trim().toLowerCase() ?? "";
}

export function isAdministrator(principal) {
  if (principal?.identityProvider === "password" && !principal.emailVerified) return false;
  const roles = principal?.userRoles ?? [];
  const configuredAdmins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return (
    roles.includes("admin") ||
    roles.includes("administrator") ||
    configuredAdmins.includes(principalEmail(principal))
  );
}

export function developmentBypass() {
  return (
    process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Development" &&
    process.env.DEV_AUTH_BYPASS === "true"
  );
}
