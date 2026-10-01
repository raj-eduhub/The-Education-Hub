import { createHash } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const tableName = process.env.AZURE_STORAGE_SUBSCRIPTIONS_TABLE ?? "EducationHubSubscriptions";
const partitionKey = "subscriptions";
let tableClient;
let tableReady;

// Which Stripe statuses still open the app.
//
// "past_due" is deliberately included. A failed renewal is usually an expired
// or briefly declined card, and Stripe keeps retrying for about three weeks
// before giving up. Cutting a child off at the first failure would take the
// product away mid-revision for a payment that is probably about to succeed.
// When Stripe does give up, the status becomes "unpaid" or "canceled" and this
// returns false.
const accessStatuses = new Set(["active", "past_due"]);

export function grantsAccess(status) {
  return accessStatuses.has(status);
}

// Payment is late but access continues, so the app can say so.
export function inGracePeriod(subscription) {
  return subscription?.status === "past_due";
}

export function accountKey(email) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function client() {
  if (tableClient) return tableClient;
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    tableClient = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, tableName);
  } else if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    tableClient = new TableClient(process.env.AZURE_STORAGE_ACCOUNT_URL, tableName, new DefaultAzureCredential());
  } else {
    throw new Error("Subscription storage is not configured.");
  }
  return tableClient;
}

async function readyClient() {
  const current = client();
  tableReady ??= current.createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
  await tableReady;
  return current;
}

function toSubscription(entity) {
  if (!entity) return null;
  return {
    plan: entity.plan,
    billingPeriod: entity.billingPeriod,
    status: entity.status,
    currentPeriodEnd: entity.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: entity.cancelAtPeriodEnd ?? false,
    consentAcceptedAt: entity.consentAcceptedAt ?? null,
    onboardingComplete: entity.onboardingComplete ?? false,
    // The welcome email is a receipt, so its delivery time is reported for
    // support purposes only. Nothing in the app waits on it.
    welcomeSentAt: entity.welcomeSentAt ?? null,
    // A late payment is shown rather than hidden: access continues while Stripe
    // retries, and the parent can only fix it if they are told.
    paymentFailedAt: entity.paymentFailedAt || null,
    paymentAttemptCount: entity.paymentAttemptCount ?? 0,
    nextPaymentAttempt: entity.nextPaymentAttempt || null,
    // The one topic an unpaid account may study. Kept after payment, so it is
    // still known if the subscription later ends.
    freeTopicId: entity.freeTopicId || null,
    updatedAt: entity.updatedAt,
  };
}

export async function getSubscription(email) {
  const current = await readyClient();
  const entity = await current.getEntity(partitionKey, accountKey(email)).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  return toSubscription(entity);
}

export async function getSubscriptionEntity(email) {
  const current = await readyClient();
  return current.getEntity(partitionKey, accountKey(email)).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
}

export async function getSubscriptionEntityByAccountKey(key) {
  const current = await readyClient();
  return current.getEntity(partitionKey, key).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
}

// Find an account by the Stripe customer it belongs to.
//
// Needed because not every subscription starts at our own checkout. A Payment
// Link carries no per-customer metadata, so its customer.subscription.* events
// arrive with no accountKey - including the cancellation. Without this lookup
// those events are dropped and a customer who stopped paying keeps access.
//
// One row per account, so this is the same small scan listSubscriptions() does.
export async function findSubscriptionByCustomerId(customerId) {
  if (!customerId) return null;
  const current = await readyClient();
  for await (const entity of current.listEntities()) {
    if (entity.stripeCustomerId === customerId) return entity;
  }
  return null;
}

export async function savePendingSubscription(email, details) {
  const current = await readyClient();
  const now = new Date().toISOString();
  // Starting a checkout must not undo learner setup. A free trial sets up
  // before it pays, and someone resubscribing set up long ago; writing false
  // here sent both back through setup once the payment cleared.
  const existing = await getSubscriptionEntity(email);
  await current.upsertEntity({
    partitionKey,
    rowKey: accountKey(email),
    email: email.trim().toLowerCase(),
    plan: details.plan,
    billingPeriod: details.billingPeriod,
    status: "checkout_pending",
    onboardingComplete: existing?.onboardingComplete === true,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }, "Merge");
}

export async function updateSubscriptionByAccountKey(key, details) {
  const current = await readyClient();
  await current.upsertEntity({
    partitionKey,
    rowKey: key,
    ...details,
    updatedAt: new Date().toISOString(),
  }, "Merge");
}

// Learner setup done by an account that has not paid. The row is created here
// for a trial, so it is marked as one: without a status the payments view would
// list it as a subscription in no state at all. A row that already has a status
// - a cancelled subscriber setting up again, say - keeps it.
export async function completeOnboarding(email) {
  const existing = await getSubscriptionEntity(email);
  await updateSubscriptionByAccountKey(accountKey(email), {
    email: email.trim().toLowerCase(),
    onboardingComplete: true,
    ...(existing?.status ? {} : { status: "trial", createdAt: new Date().toISOString() }),
  });
}

// Fixes an unpaid account's one free topic. The first choice stands: the etag
// makes a second, simultaneous choice fail rather than overwrite it, so two
// tabs cannot claim two topics. Returns the topic that is actually free, which
// is the earlier one if a choice had already been made.
export async function claimFreeTopic(email, topicId) {
  const current = await readyClient();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const entity = await getSubscriptionEntity(email);
    if (!entity) return null;
    if (entity.freeTopicId) return entity.freeTopicId;
    try {
      await current.updateEntity({
        partitionKey,
        rowKey: entity.rowKey,
        freeTopicId: topicId,
        freeTopicChosenAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, "Merge", { etag: entity.etag });
      return topicId;
    } catch (error) {
      if (error.statusCode !== 412) throw error;
    }
  }
  return (await getSubscriptionEntity(email))?.freeTopicId ?? null;
}

// Every subscription, for the administrator's payments view. The table holds one
// row per account, so this is a small scan rather than a paged query.
export async function listSubscriptions() {
  const current = await readyClient();
  const rows = [];
  for await (const entity of current.listEntities()) {
    rows.push({
      accountKey: entity.rowKey,
      email: entity.email ?? "",
      plan: entity.plan ?? "",
      status: entity.status ?? "",
      currentPeriodEnd: entity.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: entity.cancelAtPeriodEnd === true,
      onboardingComplete: entity.onboardingComplete === true,
      stripeCustomerId: entity.stripeCustomerId ?? "",
      stripeSubscriptionId: entity.stripeSubscriptionId ?? "",
      welcomeDelivery: entity.welcomeDelivery ?? "",
      updatedAt: entity.updatedAt ?? "",
    });
  }
  return rows.sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)));
}

export async function deleteSubscription(email) {
  const current = await readyClient();
  await current.deleteEntity(partitionKey, accountKey(email)).catch((error) => {
    if (error.statusCode !== 404) throw error;
  });
}
