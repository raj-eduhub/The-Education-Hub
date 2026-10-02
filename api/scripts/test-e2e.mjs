// Walks the whole flow a new customer walks - register, learner setup, the
// card trial and its topic, cancelling, subscribing, ending a trial early,
// learn - over HTTP against a running Functions host, with Stripe and Azure
// Communication Services replaced by local stubs. Storage, authentication, the
// tutor guard and the model are the real thing.
//
//   1. npm run dev:storage        (or leave Azurite running)
//   2. npm run stubs
//   3. start the API with the stub settings listed in the README
//   4. npm run test:e2e
//
// The run is repeatable: it clears whatever the previous run left behind first.
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import Stripe from "stripe";
import { createEmailVerification, deleteCredentials, digest } from "../src/lib/passwordAuth.js";
import { deleteUserByEmail } from "../src/lib/userStore.js";
import { accountKey, deleteSubscription, updateSubscriptionByAccountKey } from "../src/lib/subscriptionStore.js";
import { deleteProfile } from "../src/lib/signupStore.js";
import { deleteProgress } from "../src/lib/progressStore.js";
import { deleteFlags } from "../src/lib/safeguardingStore.js";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const base = process.env.E2E_BASE ?? "http://127.0.0.1:7075/api";
const email = process.env.E2E_EMAIL ?? "e2e@example.test";
const username = `e2e_${randomBytes(3).toString("hex")}`;
const password = "a-long-enough-test-password";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_stub_secret";
const now = new Date();
const academicStart = now.getUTCMonth() >= 8 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
const year10DateOfBirth = `${academicStart - 14}-03-02`;
const year9DateOfBirth = `${academicStart - 13}-03-02`;

let cookie = "";
let failures = 0;
const results = [];

function record(ok, label, detail) {
  results.push({ ok, label, detail });
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
}

async function call(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  if (cookie) headers.Cookie = cookie;
  const response = await fetch(`${base}${path}`, { ...options, headers });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie?.startsWith("education_session=")) {
    const value = setCookie.split(";")[0];
    if (value !== "education_session=") cookie = value;
  }
  const text = await response.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text.slice(0, 200) }; }
  return { status: response.status, body: json };
}

const json = (payload) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

console.log(`\n=== Education Hub end-to-end ===\nlearner: ${email}\nusername: ${username}\napi: ${base}\n`);

// 0. Reset ---------------------------------------------------------------------
// An account can only be registered once against an email, so the run starts by
// removing whatever a previous run left behind.
for (const [what, run] of [
  ["credentials", () => deleteCredentials(email)],
  ["roster entry", () => deleteUserByEmail(email)],
  ["subscription", () => deleteSubscription(email)],
  ["profile", () => deleteProfile(email)],
  ["progress", () => deleteProgress(email)],
  ["safeguarding flags", () => deleteFlags(email)],
]) {
  await run().catch((error) => console.log(`  (reset ${what}: ${error.message})`));
}
console.log("reset: any previous account for this email removed\n");

// 1. Registration -------------------------------------------------------------
console.log("--- 1. Register ---");
const registered = await call("/auth/register", json({ username, email, password }));
record(registered.status === 202, "register creates the account", `HTTP ${registered.status}`);
record(!cookie, "registration issues no session until the address is confirmed", cookie ? "cookie issued" : "no cookie");

// Standing in for the emailed confirmation link.
const verifyToken = await createEmailVerification(`user-${digest(username)}`);
const confirmed = await call("/auth/verify", json({ token: verifyToken }));
record(confirmed.status === 200, "confirming the address signs the account in", `HTTP ${confirmed.status}`);
record(Boolean(cookie), "a session cookie is issued on confirmation", cookie ? "education_session set" : "no cookie");

const session = await call("/session");
record(session.status === 200, "session is recognised", `HTTP ${session.status}`);
record(session.body?.user?.email === email, "session reports the registered email", session.body?.user?.email);
record(session.body?.hasAccess === true, "registration puts the account on the access roster", `hasAccess=${session.body?.hasAccess}`);
record(session.body?.isAdmin === false, "the learner account is not an administrator", `isAdmin=${session.body?.isAdmin}`);

// 2. Learner setup, before paying ----------------------------------------------
console.log("--- 2. Learner setup, before paying ---");
const beforeBilling = await call("/billing/status");
record(beforeBilling.body?.subscription?.status !== "active", "no active subscription before paying",
  `status=${beforeBilling.body?.subscription?.status ?? "none"}`);

const blockedTutor = await call("/tutor", json({
  year: 7, subject: "Maths", mode: "learn", question: "Explain place value",
  topic: { id: "y7-maths-number", title: "Integers and Place Value", unit: "Number", outcomes: [] },
}));
record(blockedTutor.status === 403, "the tutor is refused before learner setup", `HTTP ${blockedTutor.status}`);

const details = {
  guardianName: "Test Guardian", guardianRelationship: "parent", guardianPhone: "07700 900321",
  studentFirstName: "Aria", dateOfBirth: year10DateOfBirth,
  year: 10, examBoards: { Maths: "AQA", Science: "Edexcel", English: "AQA" },
  examBoard: "AQA", tier: "Higher", parentalConsent: true,
};
const noConsent = await call("/onboarding", json({ ...details, parentalConsent: false }));
record(noConsent.status === 400, "setup without consent is refused", `HTTP ${noConsent.status}`);

const setup = await call("/onboarding", json(details));
record(setup.status === 201, "learner setup completes in the app", `HTTP ${setup.status}`);
record(setup.body?.profile?.year === 10, "the year is stored", `year=${setup.body?.profile?.year}`);
record(setup.body?.profile?.examBoards?.Science === "Edexcel", "per-subject boards are stored",
  JSON.stringify(setup.body?.profile?.examBoards));

const lockedYear = await call("/onboarding", json({ ...details, dateOfBirth: year9DateOfBirth, year: 9 }));
record(lockedYear.status === 409, "the registered year cannot be changed", `HTTP ${lockedYear.status}`);

const afterSetup = await call("/billing/status");
record(afterSetup.body?.subscription?.onboardingComplete === true, "setup is marked complete",
  `onboardingComplete=${afterSetup.body?.subscription?.onboardingComplete}`);
record(!afterSetup.body?.subscription?.status, "setup writes no Stripe status, which only Stripe sets",
  `status=${afterSetup.body?.subscription?.status ?? "none"}`);
record(afterSetup.body?.subscription?.trialAvailable === true, "a new account is offered the free trial",
  `trialAvailable=${afterSetup.body?.subscription?.trialAvailable}`);

const { curriculum: catalogue } = await import("../../src/data/curriculumCatalog.js");
const asTopic = (id) => {
  const entry = catalogue.find((item) => item.id === id);
  return { id: entry.id, title: entry.title, unit: entry.unit, goal: entry.goal, outcomes: entry.outcomes };
};
const freeTopic = asTopic("y10-maths-algebra");
const lockedTopic = asTopic("y10-maths-number");

const noSubscription = await call("/content", json({ type: "explanation", subject: "Maths", topic: freeTopic }));
record(noSubscription.status === 403, "nothing is served before a trial or a subscription", `HTTP ${noSubscription.status}`);
const tooEarly = await call("/billing/free-topic", json({ topicId: freeTopic.id }));
record(tooEarly.status === 409, "a free topic cannot be chosen before the trial starts", `HTTP ${tooEarly.status}`);

// Stripe, standing in: a signed event, as Stripe would send it.
const sendStripe = async (type, object) => {
  const payload = JSON.stringify({ id: `evt_${randomBytes(6).toString("hex")}`, type, data: { object } });
  const signature = new Stripe("sk_test_stub").webhooks.generateTestHeaderString({ payload, secret: webhookSecret });
  return fetch(`${base}/billing/webhook`, { method: "POST", headers: { "Content-Type": "application/json", "stripe-signature": signature }, body: payload });
};
const waitForStatus = async (wanted) => {
  for (let i = 0; i < 30; i += 1) {
    const status = (await call("/billing/status")).body?.subscription?.status;
    if (status === wanted) return status;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return (await call("/billing/status")).body?.subscription?.status;
};

// 3. The card trial ------------------------------------------------------------
// The card is taken, nothing is charged, and Stripe holds the subscription in
// "trialing" until it takes the first payment. The stub stands in for Stripe:
// it answers checkout and sends the events Stripe would.
console.log("\n--- 3. The card trial ---");
const trialCheckout = await call("/billing/checkout", json({ trial: true }));
record(trialCheckout.status === 200 && trialCheckout.body?.trial === true, "checkout asks Stripe for the 7-day trial",
  `HTTP ${trialCheckout.status} trial=${trialCheckout.body?.trial}`);
record(await waitForStatus("trialing") === "trialing", "Stripe's events put the account in its trial", "status=trialing");
const inTrial = (await call("/billing/status")).body?.subscription;
const firstCharge = Date.parse(inTrial?.trialEndsAt ?? "") - Date.now();
record(Math.abs(firstCharge - 7 * 24 * 3600000) < 5 * 60000, "the first charge is due in 7 days", `trialEndsAt=${inTrial?.trialEndsAt}`);
const secondCheckout = await call("/billing/checkout", json({ trial: true }));
record(secondCheckout.status === 409, "a trial cannot be started twice", `HTTP ${secondCheckout.status}`);

const unchosen = await call("/content", json({ type: "explanation", subject: "Maths", topic: freeTopic }));
record(unchosen.status === 403 && unchosen.body?.code === "trial-topic-unchosen",
  "no topic is served until the trial's topic is chosen", `HTTP ${unchosen.status} ${unchosen.body?.code}`);
const otherYear = await call("/billing/free-topic", json({ topicId: "y7-maths-number" }));
record(otherYear.status === 400, "a topic from another year cannot be the free one", `HTTP ${otherYear.status}`);
const chosen = await call("/billing/free-topic", json({ topicId: freeTopic.id }));
record(chosen.status === 200 && chosen.body?.freeTopicId === freeTopic.id, "the trial's topic is chosen",
  `HTTP ${chosen.status} ${chosen.body?.freeTopicId}`);
const secondChoice = await call("/billing/free-topic", json({ topicId: lockedTopic.id }));
record(secondChoice.status === 409 && secondChoice.body?.freeTopicId === freeTopic.id,
  "the choice cannot be changed", `HTTP ${secondChoice.status} ${secondChoice.body?.freeTopicId}`);

const freeLesson = await call("/content", json({ type: "explanation", subject: "Maths", topic: freeTopic }));
record(freeLesson.status === 200, "the free topic's lesson is served", `HTTP ${freeLesson.status}`);
const lockedLesson = await call("/content", json({ type: "explanation", subject: "Maths", topic: lockedTopic }));
record(lockedLesson.status === 403 && lockedLesson.body?.code === "trial-topic-locked",
  "any other topic is refused", `HTTP ${lockedLesson.status} ${lockedLesson.body?.code}`);
const lockedByKey = await call("/content", json({ type: "practice", subject: "Maths", topic: lockedTopic, rowKey: "explanation" }));
record(lockedByKey.status === 403, "a locked topic cannot be reached by asking for a stored row directly", `HTTP ${lockedByKey.status}`);
const freeActivity = await call("/progress", json({
  kind: "activity", year: 10, subject: "Maths", topicId: freeTopic.id, mode: "learn", durationSeconds: 60,
}));
record(freeActivity.status === 201, "study in the free topic is recorded", `HTTP ${freeActivity.status}`);
const lockedActivity = await call("/progress", json({
  kind: "activity", year: 10, subject: "Maths", topicId: lockedTopic.id, mode: "learn", durationSeconds: 60,
}));
record(lockedActivity.status === 403, "nothing can be recorded against a locked topic", `HTTP ${lockedActivity.status}`);
const lockedTutor = await call("/tutor", json({ year: 10, subject: "Maths", mode: "learn", topic: lockedTopic, question: "Explain bounds" }));
record(lockedTutor.status === 403, "the tutor is refused in a locked topic", `HTTP ${lockedTutor.status}`);
const trialDiagnostic = await call("/diagnostic", json({ year: 10, subject: "Maths", responses: [] }));
record(trialDiagnostic.status === 403, "the placement check is part of the paid plan", `HTTP ${trialDiagnostic.status}`);

// The emails. The schedule calls this route with a shared key; the email stub
// records what would have been sent.
const reminderKey = process.env.TRIAL_REMINDER_KEY ?? "e2e-trial-reminder-key-0123456789abcdef";
const stubLog = new URL("./.stub-log.json", import.meta.url);
const mailsTo = (subject) => {
  try {
    return JSON.parse(readFileSync(stubLog, "utf8")).emails
      .filter((mail) => JSON.stringify(mail).includes(email) && JSON.stringify(mail).includes(subject)).length;
  } catch { return 0; }
};
const remind = async () => {
  await fetch(`${base}/billing/trial-reminders`, { method: "POST", headers: { "x-trial-reminder-key": reminderKey } });
  await new Promise((resolve) => setTimeout(resolve, 500));
};
const unkeyed = await call("/billing/trial-reminders", json({}));
record(unkeyed.status === 403, "a learner cannot trigger the trial emails", `HTTP ${unkeyed.status}`);

const { getSubscriptionEntity } = await import("../src/lib/subscriptionStore.js");
const stripeIds = await getSubscriptionEntity(email);
const subscriptionObject = (fields) => ({
  id: stripeIds.stripeSubscriptionId, object: "subscription", customer: stripeIds.stripeCustomerId,
  metadata: { accountKey: accountKey(email), plan: "learner", billingPeriod: "monthly" },
  cancel_at_period_end: false, ...fields,
});

await updateSubscriptionByAccountKey(accountKey(email), { trialEndsAt: new Date(Date.now() + 12 * 3600000).toISOString() });
const endingBefore = mailsTo("Your free trial ends tomorrow");
await remind();
record(mailsTo("Your free trial ends tomorrow") === endingBefore + 1, "the day before the first charge, the parent is told",
  `${mailsTo("Your free trial ends tomorrow") - endingBefore} sent`);
await remind();
record(mailsTo("Your free trial ends tomorrow") === endingBefore + 1, "and told only once", `${mailsTo("Your free trial ends tomorrow") - endingBefore} in all`);

// Cancelled in the billing portal: Stripe keeps the trial running to its end,
// marked to cancel, then ends it without charging.
await sendStripe("customer.subscription.updated", subscriptionObject({ status: "trialing", cancel_at_period_end: true }));
record((await call("/billing/status")).body?.subscription?.cancelAtPeriodEnd === true, "cancelling in the trial is recorded");
const stillOpen = await call("/content", json({ type: "explanation", subject: "Maths", topic: freeTopic }));
record(stillOpen.status === 200, "a cancelled trial keeps its topic to the end of the week", `HTTP ${stillOpen.status}`);

const trialEnd = Math.floor(Date.now() / 1000) - 60;
await sendStripe("customer.subscription.deleted", subscriptionObject({ status: "canceled", cancel_at_period_end: true, trial_end: trialEnd }));
const ended = await call("/content", json({ type: "explanation", subject: "Maths", topic: freeTopic }));
record(ended.status === 403 && ended.body?.code === "trial-ended", "when the cancelled trial ends, its topic locks too",
  `HTTP ${ended.status} ${ended.body?.code}`);
const endedBefore = mailsTo("Your free trial has ended");
await remind();
await remind();
record(mailsTo("Your free trial has ended") === endedBefore + 1, "the parent is told once, with the way to subscribe",
  `${mailsTo("Your free trial has ended") - endedBefore} sent`);
const restartTopic = await call("/billing/free-topic", json({ topicId: lockedTopic.id }));
record(restartTopic.status === 409, "an ended trial cannot pick another topic", `HTTP ${restartTopic.status}`);

// 4. Subscribing ----------------------------------------------------------------
console.log("\n--- 4. Subscribing ---");
const afterTrial = (await call("/billing/status")).body?.subscription;
record(afterTrial?.trialAvailable === false, "an account that has had a trial is not offered another",
  `trialAvailable=${afterTrial?.trialAvailable}`);
const checkout = await call("/billing/checkout", json({ trial: true }));
record(checkout.status === 200 && checkout.body?.trial === false, "asking again gives a subscription paid from today",
  `HTTP ${checkout.status} trial=${checkout.body?.trial}`);
const checkoutDestination = checkout.body?.url ?? checkout.body?.client_secret;
record(typeof checkoutDestination === "string" && checkoutDestination.length > 0, "Stripe returns a checkout destination",
  checkout.body?.url ? "hosted checkout URL present" : "client_secret present");
record(await waitForStatus("active") === "active", "the paid subscription is active", "status=active");

const unsignedPayload = JSON.stringify({ id: "evt_unsigned", type: "checkout.session.completed", data: { object: {} } });
const unsigned = await fetch(`${base}/billing/webhook`, { method: "POST", headers: { "Content-Type": "application/json" }, body: unsignedPayload });
record(unsigned.status === 400, "an unsigned webhook is rejected", `HTTP ${unsigned.status}`);

const afterPay = (await call("/billing/status")).body?.subscription;
record(afterPay?.onboardingComplete === true, "learner setup carries over", `onboardingComplete=${afterPay?.onboardingComplete}`);
const unlocked = await call("/content", json({ type: "explanation", subject: "Maths", topic: lockedTopic }));
record(unlocked.status === 200, "paying opens every topic", `HTTP ${unlocked.status}`);
const reopened = await call("/content", json({ type: "explanation", subject: "Maths", topic: freeTopic }));
record(reopened.status === 200, "including the trial's topic", `HTTP ${reopened.status}`);

// 5. Ending a trial early ---------------------------------------------------------
// A second account starts a trial and then asks for full access now: Stripe
// charges at once and every topic opens.
console.log("\n--- 5. Ending a trial early ---");
const mainCookie = cookie;
cookie = "";
const earlyEmail = `early-${email}`;
const earlyName = `${username}_e`;
await deleteCredentials(earlyEmail).catch(() => {});
await deleteUserByEmail(earlyEmail).catch(() => {});
await deleteSubscription(earlyEmail).catch(() => {});
await deleteProfile(earlyEmail).catch(() => {});
await call("/auth/register", json({ username: earlyName, email: earlyEmail, password }));
await call("/auth/verify", json({ token: await createEmailVerification(`user-${digest(earlyName)}`) }));
await call("/onboarding", json({ ...details, studentFirstName: "Ben" }));
await call("/billing/checkout", json({ trial: true }));
record(await waitForStatus("trialing") === "trialing", "a second account starts its trial", "status=trialing");
const startNow = await call("/billing/start-now", json({}));
record(startNow.status === 200 && startNow.body?.status === "active", "ending the trial early charges and activates it",
  `HTTP ${startNow.status} status=${startNow.body?.status}`);
const earlyUnlocked = await call("/content", json({ type: "explanation", subject: "Maths", topic: lockedTopic }));
record(earlyUnlocked.status === 200, "and every topic opens at once", `HTTP ${earlyUnlocked.status}`);
const startAgain = await call("/billing/start-now", json({}));
record(startAgain.status === 409, "there is no trial left to end", `HTTP ${startAgain.status}`);
for (const run of [deleteCredentials, deleteUserByEmail, deleteSubscription, deleteProfile, deleteProgress]) await run(earlyEmail).catch(() => {});
cookie = mainCookie;

// 6. Learning -----------------------------------------------------------------
console.log("\n--- 6. Learning ---");
const topic = {
  id: "y10-maths-number", title: "Accuracy, Bounds and Standard Form", unit: "Number",
  goal: "Apply numerical methods accurately in GCSE contexts.",
  outcomes: ["Use standard form", "Calculate error intervals", "Apply bounds"],
};
const explanation = await call("/content", json({ type: "explanation", subject: "Maths", topic }));
const explained = explanation.body?.content?.explanation ?? "";
record(explanation.status === 200, "the explanation is served", `HTTP ${explanation.status}`);
record(explanation.body?.generated === false && explanation.body?.route === "stored",
  "it comes from storage, with no model call", `route=${explanation.body?.route} generated=${explanation.body?.generated}`);
record(explained.length > 200, "it is real teaching text, not the topic goal", `${explained.length} chars`);

const question = await call("/content", json({
  type: "practice", subject: "Maths", topic, index: 0, subtopic: { title: "Use standard form", index: 0 },
}));
record(question.status === 200, "a practice question is served", `HTTP ${question.status}`);
record((question.body?.content?.working ?? []).length >= 2, "the question carries worked steps",
  `${(question.body?.content?.working ?? []).length} steps`);

const attempt = await call("/progress", json({
  year: 10, subject: "Maths", topicId: topic.id, topicTitle: topic.title,
  mode: "practice", accuracy: 0.75, confidence: 4, durationSeconds: 180, score: 3, maxScore: 4,
}));
record(attempt.status === 201, "an attempt is recorded", `HTTP ${attempt.status}`);
record(attempt.body?.mastery?.masteryScore > 0, "mastery is updated", `mastery=${attempt.body?.mastery?.masteryScore}`);

// 7. Safeguarding -------------------------------------------------------------
console.log("\n--- 7. Safeguarding ---");
const unsafe = await call("/tutor", json({
  year: 10, subject: "Maths", mode: "learn", topic,
  question: "sometimes i want to hurt myself when revision goes badly",
}));
record(unsafe.body?.guard?.reason === "unsafe", "an unsafe message is blocked before the model",
  `verdict=${unsafe.body?.guard?.verdict} reason=${unsafe.body?.guard?.reason}`);
record(typeof unsafe.body?.answer === "string" && unsafe.body.answer.includes("trust"),
  "the learner is pointed to a trusted adult");

const flagsAsLearner = await call("/safeguarding");
record(flagsAsLearner.status === 403, "a learner cannot read safeguarding flags", `HTTP ${flagsAsLearner.status}`);


// 8. The lesson read aloud ----------------------------------------------------
// The narration is the paid explanation spoken, so it sits behind the same
// access check as the lesson itself.
console.log("\n--- 8. The lesson read aloud ---");
const { contentKey, getContent } = await import("../src/lib/contentStore.js");
const { beatSpeech, lessonBeats } = await import("../../src/lessonBeats.js");
const { toSpoken } = await import("../../src/speech.js");
const { curriculum } = await import("../../src/data/curriculumCatalog.js");

const voicedTopic = curriculum.find((entry) => entry.id === "y10-maths-number");
const voicedContent = await getContent(contentKey("explanation", voicedTopic.id));
const beats = lessonBeats(voicedTopic, voicedContent).map((beat) => beatSpeech(beat, toSpoken)).filter(Boolean);

const spoken = await call("/narration", json({ topicId: voicedTopic.id, text: beats[0] }));
record(spoken.status === 200, "the lesson narration is served", `HTTP ${spoken.status}`);

const everyBeat = await Promise.all(beats.map(async (text) => {
  const response = await call("/narration", json({ topicId: voicedTopic.id, text }));
  return response.status === 200;
}));
record(everyBeat.every(Boolean), "every beat of the lesson is voiced, so it never switches voice midway",
  `${everyBeat.filter(Boolean).length} of ${beats.length}`);

const unvoiced = await call("/narration", json({ topicId: voicedTopic.id, text: "a line nobody recorded" }));
record(unvoiced.status === 404, "an unrecorded line is a 404, so the player falls back rather than failing",
  `HTTP ${unvoiced.status}`);

// 9. The daily goal -----------------------------------------------------------
console.log("\n--- 9. The daily goal ---");
const habit = await call("/progress/habit");
record(habit.status === 200, "the daily goal is served", `HTTP ${habit.status}`);
record(habit.body?.today >= 1, "the attempt just recorded counts towards today", `today=${habit.body?.today}`);
record(habit.body?.goal >= 4 && habit.body?.goal <= 25, "the goal is sized from the learner's own pace",
  `${habit.body?.goal} questions for ${habit.body?.targetMinutes} minutes at ${habit.body?.secondsPerQuestion}s each`);
record(Array.isArray(habit.body?.days) && habit.body.days.length === 14, "a fortnight of days is returned",
  `${habit.body?.days?.length} days`);

// 10. Model spend -------------------------------------------------------------
// Every model call is money. Stored content must not spend any, and a runaway
// caller must be stopped.
console.log("\n--- 10. Model spend ---");
const { modelUsage } = await import("../src/lib/modelBudget.js");
const before = await modelUsage(email);
for (let i = 0; i < 3; i += 1) {
  await call("/content", json({ type: "explanation", subject: "Maths", topic }));
}
const after = await modelUsage(email);
record(after.daily.used === before.daily.used,
  "reading stored content spends nothing from the budget",
  `${before.daily.used} -> ${after.daily.used} of ${after.daily.limit}`);
record(after.daily.limit > 0, "a per-day cap is configured", `${after.daily.limit} calls a day`);

// 11. Account -----------------------------------------------------------------
console.log("\n--- 11. Account ---");
const portal = await call("/billing/portal", json({}));
record(portal.status === 200 && typeof portal.body?.url === "string", "the billing portal opens", `HTTP ${portal.status}`);

const loggedOut = await call("/auth/logout", json({}));
record(loggedOut.status === 200, "logout succeeds", `HTTP ${loggedOut.status}`);
cookie = "";
const afterLogout = await call("/session");
record(afterLogout.status === 401 || afterLogout.body?.user == null, "the session no longer authenticates",
  `HTTP ${afterLogout.status}`);

console.log(`\n${failures ? `${failures} of ${results.length} checks FAILED` : `PASS: all ${results.length} checks`}`);
if (failures) {
  console.log("\nFailures:");
  for (const item of results.filter((entry) => !entry.ok)) console.log(`  - ${item.label} (${item.detail})`);
}
process.exit(failures ? 1 : 0);
