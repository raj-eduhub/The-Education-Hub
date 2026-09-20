// What happens when a renewal payment fails.
//
// Stripe owns the retry schedule and the decision to cancel at the end of it.
// These checks cover the half this application owns: recording the failure,
// telling the parent, keeping access while Stripe retries, and - the part that
// was broken - making sure the eventual cancellation actually lands even when
// the subscription started at a Payment Link and carries no metadata.
//
//   node api/scripts/test-failed-payments.mjs
import { readFileSync } from "node:fs";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const { handleStripeEvent } = await import("../src/lib/billingEvents.js");
const { accountKey, deleteSubscription, getSubscription, grantsAccess } = await import("../src/lib/subscriptionStore.js");

const email = `failed-payments-${Date.now()}@example.test`;
const key = accountKey(email);
const customer = `cus_test_${Date.now()}`;
const appUrl = "https://example.test";

let failures = 0;
const check = (ok, label, detail) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
};

const sent = [];
const notifyPaymentFailed = async (payload) => { sent.push(payload); };
const sendEmail = async () => {};
const run = (event) => handleStripeEvent(event, { appUrl, sendEmail, notifyPaymentFailed, log: () => {} });

await deleteSubscription(email).catch(() => {});

// --- a Payment Link purchase, which carries no metadata at all --------------
// The whole point: metadata.accountKey is absent, so the account has to be
// found another way or the payment grants nothing.
const paid = await run({
  id: `evt_${Date.now()}_a`,
  type: "checkout.session.completed",
  data: { object: {
    payment_status: "paid",
    customer,
    subscription: "sub_test_1",
    customer_details: { email },
    // No metadata and no client_reference_id, exactly as a Payment Link arrives.
  } },
});
check(paid.handled === true, "a Payment Link purchase is matched to an account", `reason=${paid.reason ?? "none"}`);
check(paid.accountKey === key, "it resolves to the hash of the payer's email");
check((await getSubscription(email))?.status === "active", "access is granted");

// --- the renewal fails -------------------------------------------------------
const nextAttempt = Math.floor(Date.now() / 1000) + 3 * 86400;
const failed = await run({
  id: `evt_${Date.now()}_b`,
  type: "invoice.payment_failed",
  data: { object: { customer, customer_email: email, subscription: "sub_test_1", attempt_count: 1, next_payment_attempt: nextAttempt } },
});
check(failed.handled === true && failed.paymentFailed === true, "the failed payment is recorded");
check(failed.notified === true && sent.length === 1, "the parent is emailed", `${sent.length} email(s)`);
check(sent[0]?.email === email && sent[0]?.attemptCount === 1, "the email names the right account and attempt");

const afterFailure = await getSubscription(email);
check(Boolean(afterFailure?.paymentFailedAt), "the failure is visible to the app", `failedAt=${afterFailure?.paymentFailedAt}`);
check(afterFailure?.nextPaymentAttempt !== null, "so is the next retry date", afterFailure?.nextPaymentAttempt);

// --- Stripe marks it past due, and access continues --------------------------
await run({
  id: `evt_${Date.now()}_c`,
  type: "customer.subscription.updated",
  data: { object: { id: "sub_test_1", customer, status: "past_due", cancel_at_period_end: false } },
});
const pastDue = await getSubscription(email);
check(pastDue?.status === "past_due", "the subscription is past due", `status=${pastDue?.status}`);
check(grantsAccess(pastDue?.status) === true, "access continues while Stripe retries");

// --- the retry succeeds ------------------------------------------------------
await run({
  id: `evt_${Date.now()}_d`,
  type: "invoice.paid",
  data: { object: { customer, customer_email: email, subscription: "sub_test_1" } },
});
const recovered = await getSubscription(email);
check(recovered?.paymentFailedAt === null, "a successful retry clears the warning");
check(recovered?.paymentAttemptCount === 0, "and the attempt count");

// --- Stripe gives up and cancels ---------------------------------------------
// This event also carries no accountKey. Before the customer lookup existed it
// was dropped, and a customer who had stopped paying kept access indefinitely.
const cancelled = await run({
  id: `evt_${Date.now()}_e`,
  type: "customer.subscription.deleted",
  data: { object: { id: "sub_test_1", customer, status: "canceled", cancel_at_period_end: false } },
});
check(cancelled.handled === true, "the cancellation is matched by Stripe customer", `reason=${cancelled.reason ?? "none"}`);

const ended = await getSubscription(email);
check(ended?.status === "canceled", "the subscription is cancelled", `status=${ended?.status}`);
check(grantsAccess(ended?.status) === false, "access is revoked");

// --- an unrelated customer is never touched ----------------------------------
const stranger = await run({
  id: `evt_${Date.now()}_f`,
  type: "customer.subscription.deleted",
  data: { object: { id: "sub_other", customer: "cus_nobody_here", status: "canceled" } },
});
check(stranger.handled === false, "an unknown customer cancels nothing", `reason=${stranger.reason}`);

await deleteSubscription(email).catch(() => {});

console.log(failures ? `\n${failures} check(s) FAILED` : "\nPASS: failed payments are recorded, notified, and cancel cleanly");
process.exit(failures ? 1 : 0);
