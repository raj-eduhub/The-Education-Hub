import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "./auth.js";
import { getProfile } from "./signupStore.js";
import { getSubscription } from "./subscriptionStore.js";
import { userCanAccess } from "./userStore.js";

export async function getLearningAccess(request) {
  const principal = await getPrincipal(request);
  const email = principalEmail(principal) || (developmentBypass() ? "local@example.com" : "");
  const admin = developmentBypass() || isAdministrator(principal);
  if (admin) return { allowed: true, admin, email, profile: null };
  if (!email || !(await userCanAccess(email))) return { allowed: false, admin, email, profile: null };
  const [subscription, profile] = await Promise.all([getSubscription(email), getProfile(email)]);
  const allowed = subscription?.status === "active" && subscription.onboardingComplete === true && Boolean(profile);
  return { allowed, admin, email, profile };
}
