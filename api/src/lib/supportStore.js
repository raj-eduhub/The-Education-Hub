// Support tickets: what a customer asked for help with, and what was done.
//
// Raised from inside the account, so a ticket arrives already knowing who sent
// it and what they pay for. Nobody has to ask a worried parent for their
// subscription details before anyone can help them.
//
// Deliberately NOT behind the learning-access check that guards the curriculum.
// The person most likely to need support is the one whose subscription has just
// failed, and a support desk that locks out the people with billing problems is
// not a support desk.
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const tableName = process.env.AZURE_STORAGE_SUPPORT_TABLE ?? "EducationHubSupport";
let tableClient;
let tableReady;

function client() {
  if (tableClient) return tableClient;
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    tableClient = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, tableName);
  } else if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    tableClient = new TableClient(process.env.AZURE_STORAGE_ACCOUNT_URL, tableName, new DefaultAzureCredential());
  } else {
    throw new Error("Support storage is not configured.");
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

// What a ticket can be about. Kept short: a list nobody reads is a list
// everybody answers with "Other".
export const categories = ["billing", "account", "content", "technical", "other"];

export const statuses = ["open", "in-progress", "waiting-on-customer", "resolved", "closed"];

// Which statuses still need someone to act.
const liveStatuses = new Set(["open", "in-progress", "waiting-on-customer"]);
export const isLive = (status) => liveStatuses.has(status);

// Billing is money and account is somebody locked out; both stop a customer
// using what they paid for, so they are answered first.
const urgentCategories = new Set(["billing", "account"]);
export const priorityFor = (category) => (urgentCategories.has(category) ? "high" : "normal");

export function accountId(email) {
  return createHash("sha256").update(String(email).trim().toLowerCase()).digest("hex");
}

// A reference a person can read down a telephone.
//
// No 0/O and no 1/I/L, because those are the characters people get wrong when
// they are already annoyed enough to be ringing about something.
const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function reference() {
  const bytes = randomBytes(6);
  let out = "";
  for (let i = 0; i < 6; i += 1) out += alphabet[bytes[i] % alphabet.length];
  return `EH-${out}`;
}

// Table Storage sorts row keys as text ascending, so counting down means a
// customer's newest ticket comes back first without sorting the partition.
function descendingKey(now) {
  return `${(9999999999999 - now).toString().padStart(13, "0")}-${randomUUID()}`;
}

const trim = (value, max) => String(value ?? "").trim().slice(0, max);

export function validateTicket(body) {
  const subject = trim(body?.subject, 140);
  const message = trim(body?.message, 4000);
  const category = categories.includes(body?.category) ? body.category : "";

  if (!category) return { valid: false, error: "Choose what the problem is about." };
  if (subject.length < 3) return { valid: false, error: "Give the ticket a short subject line." };
  if (message.length < 15) return { valid: false, error: "Describe the problem, so somebody can act on it without writing back first." };
  return { valid: true, value: { subject, message, category } };
}

// How many unresolved tickets one account may hold at once.
//
// Not a rate limit on asking for help - it is a guard against one account
// filling the queue, which would bury everybody else's problem.
const openTicketCap = 10;

export async function openTicketCount(email) {
  const current = await readyClient();
  const id = accountId(email);
  let count = 0;
  for await (const row of current.listEntities({ queryOptions: { filter: `PartitionKey eq '${id}'` } })) {
    if (isLive(row.status)) count += 1;
  }
  return count;
}

export async function createTicket(email, input, context = {}) {
  const { valid, error, value } = validateTicket(input);
  if (!valid) return { ok: false, error };

  if ((await openTicketCount(email)) >= openTicketCap) {
    return {
      ok: false,
      error: "You already have several tickets open. Please add to one of those rather than starting another, and we will get to them.",
    };
  }

  const current = await readyClient();
  const now = Date.now();
  const entity = {
    partitionKey: accountId(email),
    rowKey: descendingKey(now),
    // The address is stored rather than only hashed: a ticket nobody can reply
    // to is not a ticket.
    email: String(email).trim().toLowerCase(),
    reference: reference(),
    subject: value.subject,
    category: value.category,
    priority: priorityFor(value.category),
    status: "open",
    // Who is asking and what they pay for, copied onto the ticket as it is
    // raised. Two reasons it is copied rather than looked up when the ticket is
    // read: nobody has to ask a worried parent for details the account already
    // holds, and the ticket still says who raised it after the subscription has
    // ended or the profile has changed.
    name: trim(context.name, 120),
    // The child is named separately rather than baked into one string, so
    // each place that shows a ticket can compose it as it likes.
    learnerName: trim(context.learnerName, 60),
    phone: trim(context.phone, 40),
    plan: trim(context.plan, 40),
    subscriptionStatus: trim(context.subscriptionStatus, 40),
    // The conversation, as JSON: Table Storage holds scalars, and a ticket is
    // small enough that a property is a reasonable home for it.
    messages: JSON.stringify([{ from: "customer", body: value.message, at: new Date(now).toISOString() }]),
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
  };
  await current.createEntity(entity);
  return { ok: true, ticket: publicTicket(entity) };
}

function parseMessages(raw) {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function publicTicket(entity) {
  return {
    reference: entity.reference,
    subject: entity.subject,
    category: entity.category,
    priority: entity.priority,
    status: entity.status,
    name: entity.name ?? "",
    learnerName: entity.learnerName ?? "",
    phone: entity.phone ?? "",
    email: entity.email ?? "",
    plan: entity.plan ?? "",
    subscriptionStatus: entity.subscriptionStatus ?? "",
    messages: parseMessages(entity.messages),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

// A customer's own tickets, newest first.
export async function listTickets(email, { limit = 25 } = {}) {
  const current = await readyClient();
  const id = accountId(email);
  const rows = [];
  for await (const row of current.listEntities({ queryOptions: { filter: `PartitionKey eq '${id}'` } })) {
    rows.push(publicTicket(row));
    if (rows.length >= limit) break;
  }
  return rows;
}

// Everything, for whoever is on the desk. Volume is low enough that a scan is
// honest; if it stops being, this becomes a query on status.
export async function listAllTickets({ status = "live", limit = 100 } = {}) {
  const current = await readyClient();
  const rows = [];
  for await (const row of current.listEntities()) {
    if (status === "live" && !isLive(row.status)) continue;
    if (status !== "live" && status !== "all" && row.status !== status) continue;
    rows.push({ ...publicTicket(row), accountId: row.partitionKey, rowKey: row.rowKey });
  }
  rows.sort((left, right) => {
    if (left.priority !== right.priority) return left.priority === "high" ? -1 : 1;
    return String(right.createdAt).localeCompare(String(left.createdAt));
  });
  return rows.slice(0, limit);
}

async function findByReference(reference) {
  const current = await readyClient();
  for await (const row of current.listEntities({ queryOptions: { filter: `reference eq '${String(reference).replace(/'/g, "''")}'` } })) {
    return row;
  }
  return null;
}

export async function getTicket(reference, { email } = {}) {
  const row = await findByReference(reference);
  if (!row) return null;
  // A reference is short enough to guess at, so ownership is checked rather
  // than assumed from knowing one.
  if (email && row.partitionKey !== accountId(email)) return null;
  return publicTicket(row);
}

const maxMessages = 60;

export async function replyToTicket(reference, { from, body, status }) {
  const row = await findByReference(reference);
  if (!row) return { ok: false, error: "That ticket reference was not found." };

  const text = trim(body, 4000);
  if (text.length < 2 && !status) return { ok: false, error: "Write a reply, or change the status." };

  const messages = parseMessages(row.messages);
  if (text) {
    if (messages.length >= maxMessages) {
      return { ok: false, error: "This ticket has run long. Please raise a new one referring to this reference." };
    }
    messages.push({ from, body: text, at: new Date().toISOString() });
  }

  const next = statuses.includes(status)
    ? status
    // A customer writing back on a resolved ticket reopens it: the problem
    // evidently was not solved.
    : from === "customer" && !isLive(row.status) ? "open"
    : from === "support" ? "waiting-on-customer"
    : row.status;

  const current = await readyClient();
  await current.updateEntity({
    partitionKey: row.partitionKey,
    rowKey: row.rowKey,
    messages: JSON.stringify(messages),
    status: next,
    updatedAt: new Date().toISOString(),
  }, "Merge");

  return { ok: true, ticket: { ...publicTicket(row), messages, status: next } };
}

// Deleted with the account, matching what the privacy notice promises.
export async function deleteTickets(email) {
  const current = await readyClient();
  const id = accountId(email);
  for await (const row of current.listEntities({ queryOptions: { filter: `PartitionKey eq '${id}'` } })) {
    await current.deleteEntity(row.partitionKey, row.rowKey).catch((error) => {
      if (error.statusCode !== 404) throw error;
    });
  }
}
