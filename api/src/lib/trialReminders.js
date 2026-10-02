import { curriculum } from "../../../src/data/curriculumCatalog.js";
import { sendTrialEndedEmail, sendTrialEndingEmail } from "./email.js";
import { grantsAccess, listTrialRows, updateSubscriptionByAccountKey } from "./subscriptionStore.js";

const day = 24 * 3600000;

// The two emails a Stripe free trial gets from us. Run once a day by a
// schedule, and safe to run more often: each is sent at most once per account,
// recorded on the row after it is delivered, so a failed send is retried on the
// next run.
//
//   ending  the day before Stripe takes the first payment, saying when and how
//           much, and how to cancel. Not sent once the trial has been cancelled.
//   ended   a trial that finished without becoming a subscription (cancelled,
//           or the first payment failed), with the way to subscribe. A trial
//           that converted gets nothing from us: Stripe's receipt says it.
//
// Nothing here changes access. Stripe ends the trial, and its events set the
// status that getLearningAccess() reads.
export async function sendTrialReminders({
  appUrl,
  now = Date.now(),
  sendEnding = sendTrialEndingEmail,
  sendEnded = sendTrialEndedEmail,
  log = () => {},
} = {}) {
  const base = appUrl.replace(/\/$/, "");
  const result = { checked: 0, ending: 0, ended: 0, failed: 0 };

  for (const row of await listTrialRows()) {
    if (!row.email || !row.trialEndsAt) continue;
    const endsAt = Date.parse(row.trialEndsAt);
    if (!Number.isFinite(endsAt)) continue;
    result.checked += 1;
    const topicTitle = curriculum.find((entry) => entry.id === row.freeTopicId)?.title ?? "your free topic";

    try {
      if (row.status === "trialing" && !row.cancelAtPeriodEnd && endsAt > now && endsAt - now <= day && !row.trialEndingEmailAt) {
        await sendEnding({
          email: row.email,
          topicTitle,
          chargeDate: new Date(endsAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/London" }),
          accountUrl: `${base}/#account`,
        });
        await updateSubscriptionByAccountKey(row.accountKey, { trialEndingEmailAt: new Date(now).toISOString() });
        result.ending += 1;
      } else if (row.status !== "trialing" && !grantsAccess(row.status) && endsAt <= now
        // Only a trial that has just ended. A subscription that converted and
        // was cancelled months later still carries its old trial dates.
        && now - endsAt <= 7 * day && !row.trialEndedEmailAt) {
        await sendEnded({ email: row.email, topicTitle, subscribeUrl: `${base}/#subscribe` });
        await updateSubscriptionByAccountKey(row.accountKey, { trialEndedEmailAt: new Date(now).toISOString() });
        result.ended += 1;
      }
    } catch (failure) {
      result.failed += 1;
      log(`Trial email failed for one account: ${failure.message}`);
    }
  }
  return result;
}
