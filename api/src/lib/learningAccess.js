import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "./auth.js";
import { getProfile } from "./signupStore.js";
import { getSubscription, grantsAccess } from "./subscriptionStore.js";
import { userCanAccess } from "./userStore.js";

// allowed means the whole curriculum, and stays the only thing most routes
// check. trial means a set-up account that has not paid, which may study one
// topic: the routes that serve a topic opt in through mayStudyTopic(), so any
// route that does not is closed to a trial by default rather than open to it.
export async function getLearningAccess(request) {
  const principal = await getPrincipal(request);
  const email = principalEmail(principal) || (developmentBypass() ? "local@example.com" : "");
  const admin = developmentBypass() || isAdministrator(principal);
  if (admin) return { allowed: true, trial: false, admin, email, profile: null };
  if (!email || !(await userCanAccess(email))) return { allowed: false, trial: false, admin, email, profile: null };
  const [subscription, profile] = await Promise.all([getSubscription(email), getProfile(email)]);
  const setUp = subscription?.onboardingComplete === true && Boolean(profile);
  const allowed = setUp && grantsAccess(subscription?.status);
  return {
    allowed,
    trial: setUp && !allowed,
    freeTopicId: subscription?.freeTopicId ?? null,
    admin,
    email,
    profile,
    subscription,
  };
}

// Whether this request may use a topic: everything for a subscriber, and only
// the chosen free topic for a trial. Choosing it is a separate, deliberate
// step (billing/free-topic), never a side effect of opening a topic - the app
// opens one on its own at first load, and that must not spend the choice.
export function mayStudyTopic(access, topicId) {
  if (access.allowed) return true;
  return access.trial && Boolean(topicId) && topicId === access.freeTopicId;
}

// The refusal for a trial reaching past its topic. The code lets the app offer
// the way on - choose this topic, or subscribe - instead of showing an error.
export function trialRefusal(access) {
  if (!access.trial) {
    return { status: 403, jsonBody: { error: "Your Y7to11.AI access is inactive or has not been added yet." } };
  }
  return {
    status: 403,
    jsonBody: {
      error: access.freeTopicId
        ? "This topic is part of the full subscription. Your free topic is still open."
        : "Choose this as your free topic to start learning it.",
      code: access.freeTopicId ? "trial-topic-locked" : "trial-topic-unchosen",
    },
  };
}
