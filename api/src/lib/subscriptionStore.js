import { createHash } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const tableName = process.env.AZURE_STORAGE_SUBSCRIPTIONS_TABLE ?? "EducationHubSubscriptions";
const partitionKey = "subscriptions";
let tableClient;
let tableReady;

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

export async function savePendingSubscription(email, details) {
  const current = await readyClient();
  const now = new Date().toISOString();
  await current.upsertEntity({
    partitionKey,
    rowKey: accountKey(email),
    email: email.trim().toLowerCase(),
    plan: details.plan,
    billingPeriod: details.billingPeriod,
    status: "checkout_pending",
    onboardingComplete: false,
    createdAt: now,
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

export async function deleteSubscription(email) {
  const current = await readyClient();
  await current.deleteEntity(partitionKey, accountKey(email)).catch((error) => {
    if (error.statusCode !== 404) throw error;
  });
}
