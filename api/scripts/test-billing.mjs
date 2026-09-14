// Covers the money path: what a Stripe event does to a learner's access.
// Runs against Azurite with no live Stripe account and no running server, using
// synthetic events and Stripe's own test signature helper.
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import Stripe from "stripe";
import { handleStripeEvent } from "../src/lib/billingEvents.js";
import {
  accountKey, deleteSubscription, getSubscription, getSubscriptionEntityByAccountKey, savePendingSubscription,
} from "../src/lib/subscriptionStore.js";
import { getSignupInvite } from "../src/lib/signupStore.js";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const email = `billing_${randomBytes(6).toString("hex")}@example.com`;
const key = accountKey(email);
const appUrl = "https://example.test";
const sent = [];
const sendEmail = async (message) => { sent.push(message); };
const failingEmail = async () => { throw new Error("Email delivery is not configured."); };

function checkoutEvent(id, overrides = {}) {
  return {
    id,
    type: "checkout.session.completed",
    data: { object: {
      payment_status: "paid",
      customer: "cus_test_1",
      subscription: "sub_test_1",
      customer_details: { email },
      metadata: { accountKey: key, plan: "learner", billingPeriod: "monthly" },
      ...overrides,
    } },
  };
}

function subscriptionEvent(type, status, overrides = {}) {
  return {
    id: `evt_${randomBytes(4).toString("hex")}`,
    type,
    data: { object: {
      id: "sub_test_1",
      status,
      customer: "cus_test_1",
      current_period_end: Math.floor(Date.now() / 1000) + 86400,
      cancel_at_period_end: false,
      metadata: { accountKey: key, plan: "learner", billingPeriod: "monthly" },
      ...overrides,
    } },
  };
}

let failures = 0;
const check = (label, run) => {
  try {
    const result = run();
    // An async function here would swallow its assertions into a rejected
    // promise and report a pass, so it is refused outright.
    if (result && typeof result.then === "function") {
      throw new Error("check() takes a synchronous function; await before calling it");
    }
    console.log(`OK   ${label}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL ${label}: ${error.message}`);
  }
};

try {
  await savePendingSubscription(email, { plan: "learner", billingPeriod: "monthly" });
  const pending = await getSubscription(email);
  check("checkout leaves the subscription pending until payment", () => {
    assert.equal(pending.status, "checkout_pending");
    assert.notEqual(pending.status, "active");
  });

  // A paid checkout must grant access and issue a usable signup invitation.
  const paid = await handleStripeEvent(checkoutEvent("evt_paid_1"), { appUrl, sendEmail });
  const afterPaid = await getSubscription(email);
  check("a paid checkout activates the subscription", () => {
    assert.equal(paid.handled, true);
    assert.equal(afterPaid.status, "active");
    assert.equal(afterPaid.onboardingComplete, false);
  });
  check("the signup invitation is emailed to the payer", () => {
    assert.equal(sent.length, 1);
    assert.equal(sent[0].email, email);
    assert.match(sent[0].signupUrl, /^https:\/\/example\.test\/\?signup=/);
  });
  const token = decodeURIComponent(sent[0].signupUrl.split("signup=")[1]);
  check("the emailed token opens a real invitation", () => {
    assert.ok(token.length > 20);
  });
  const invite = await getSignupInvite(token);
  check("the invitation resolves to this account", () => {
    assert.ok(invite, "invite should exist");
    assert.equal(invite.email, email);
  });

  // Stripe retries. A replayed event must not issue a second invitation.
  const replay = await handleStripeEvent(checkoutEvent("evt_paid_1"), { appUrl, sendEmail });
  check("a replayed checkout event is ignored", () => {
    assert.equal(replay.duplicate, true);
    assert.equal(sent.length, 1, "no second invitation should be sent");
  });

  // An unpaid session must never grant access.
  await deleteSubscription(email);
  await savePendingSubscription(email, { plan: "learner", billingPeriod: "monthly" });
  const unpaid = await handleStripeEvent(checkoutEvent("evt_unpaid", { payment_status: "unpaid" }), { appUrl, sendEmail });
  const afterUnpaid = await getSubscription(email);
  check("an unpaid checkout grants nothing", () => {
    assert.equal(unpaid.handled, false);
    assert.equal(afterUnpaid.status, "checkout_pending");
  });

  // A mail outage must not cost a paying customer their access.
  await deleteSubscription(email);
  await savePendingSubscription(email, { plan: "learner", billingPeriod: "monthly" });
  // Caught here so that a regression reports a failure instead of crashing the
  // run and skipping every check after it.
  let mailDown = null;
  let mailDownError = null;
  try {
    mailDown = await handleStripeEvent(checkoutEvent("evt_paid_2"), { appUrl, sendEmail: failingEmail });
  } catch (failure) {
    mailDownError = failure;
  }
  check("a mail outage does not abort a paid event", () => {
    assert.equal(mailDownError, null, `event threw: ${mailDownError?.message}`);
  });
  const afterMailDown = await getSubscription(email);
  const entity = await getSubscriptionEntityByAccountKey(key);
  check("access is still granted when the invitation email fails", () => {
    assert.equal(mailDown?.handled, true);
    assert.equal(mailDown?.invitationSent, false);
    assert.equal(afterMailDown.status, "active");
  });
  check("the failed delivery is recorded so it can be resent", () => {
    assert.equal(entity.signupInviteDelivery, "failed");
    assert.match(entity.signupInviteError, /not configured/i);
  });

  // Lifecycle events must move the status.
  await handleStripeEvent(subscriptionEvent("customer.subscription.updated", "past_due"), { appUrl, sendEmail });
  const pastDue = await getSubscription(email);
  check("a past-due subscription is reflected", () => {
    assert.equal(pastDue.status, "past_due");
  });
  await handleStripeEvent(subscriptionEvent("customer.subscription.deleted", "canceled"), { appUrl, sendEmail });
  const cancelled = await getSubscription(email);
  check("a cancelled subscription is no longer active", () => {
    assert.equal(cancelled.status, "canceled");
    assert.notEqual(cancelled.status, "active");
  });

  // An event carrying no account reference must be refused, not guessed at.
  const orphan = await handleStripeEvent(checkoutEvent("evt_orphan", { metadata: {} }), { appUrl, sendEmail });
  check("an event with no account key is refused", () => {
    assert.equal(orphan.handled, false);
    assert.equal(orphan.reason, "missing-account-key");
  });

  // Signature verification, using Stripe's own test helper.
  const stripe = new Stripe("sk_test_not_a_real_key");
  const secret = "whsec_test_secret";
  const payload = JSON.stringify(checkoutEvent("evt_signed"));
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  check("a correctly signed payload verifies", () => {
    const verified = stripe.webhooks.constructEvent(payload, header, secret);
    assert.equal(verified.id, "evt_signed");
  });
  check("a tampered payload is rejected", () => {
    assert.throws(() => stripe.webhooks.constructEvent(`${payload} `, header, secret));
  });
  check("a payload signed with the wrong secret is rejected", () => {
    assert.throws(() => stripe.webhooks.constructEvent(payload, header, "whsec_wrong"));
  });
} finally {
  await deleteSubscription(email);
}

console.log(failures ? `\n${failures} billing check(s) FAILED` : "\nPASS: checkout activation, invitation delivery, replay protection, unpaid and orphan events refused, mail-outage resilience, lifecycle status changes, signature verification");
process.exit(failures ? 1 : 0);
