import { createHash } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const partitionKey = "education-hub-users";
const tableName = process.env.AZURE_STORAGE_USERS_TABLE ?? "EducationHubUsers";
let tableClient;
let tableReady;

function client() {
  if (tableClient) return tableClient;

  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    tableClient = TableClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      tableName
    );
  } else if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    tableClient = new TableClient(
      process.env.AZURE_STORAGE_ACCOUNT_URL,
      tableName,
      new DefaultAzureCredential()
    );
  } else {
    throw new Error("User storage is not configured.");
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

function rowKeyFor(email) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function toUser(entity) {
  return {
    id: entity.rowKey,
    name: entity.name,
    email: entity.email,
    role: entity.role,
    status: entity.status,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export async function listUsers() {
  const current = await readyClient();
  const users = [];
  for await (const entity of current.listEntities({
    queryOptions: { filter: `PartitionKey eq '${partitionKey}'` },
  })) {
    users.push(toUser(entity));
  }
  return users.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function saveUser({ name, email, role }) {
  const current = await readyClient();
  const normalizedEmail = email.trim().toLowerCase();
  const rowKey = rowKeyFor(normalizedEmail);
  const now = new Date().toISOString();
  const existing = await current.getEntity(partitionKey, rowKey).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  const entity = {
    partitionKey,
    rowKey,
    name: name.trim(),
    email: normalizedEmail,
    role,
    status: "active",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await current.upsertEntity(entity, "Replace");
  return toUser(entity);
}

export async function updateUser(id, changes) {
  const current = await readyClient();
  const entity = await current.getEntity(partitionKey, id);
  const updated = {
    ...entity,
    ...(changes.status ? { status: changes.status } : {}),
    updatedAt: new Date().toISOString(),
  };
  await current.updateEntity(updated, "Replace");
  return toUser(updated);
}

export async function deleteUser(id) {
  const current = await readyClient();
  await current.deleteEntity(partitionKey, id);
}

export async function deleteUserByEmail(email) {
  const current = await readyClient();
  await current.deleteEntity(partitionKey, rowKeyFor(email)).catch((error) => {
    if (error.statusCode !== 404) throw error;
  });
}

export async function userCanAccess(email) {
  if (!email) return false;
  const current = await readyClient();
  const entity = await current.getEntity(partitionKey, rowKeyFor(email)).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  return entity?.status === "active";
}

export async function getUserByEmail(email) {
  if (!email) return null;
  const current = await readyClient();
  const entity = await current.getEntity(partitionKey, rowKeyFor(email)).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  return entity ? toUser(entity) : null;
}
