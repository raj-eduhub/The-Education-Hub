// Safeguarding flags: what the tutor guard refused, kept so there is a per-learner
// history and something an administrator can act on. Until now a refusal produced
// a reply to the child and a log line, which nobody reads.
//
// Two decisions here differ from the rest of the app, deliberately.
//
// Learner rows elsewhere are partitioned by a hash of the email and store no
// address. A safeguarding record that cannot name the child cannot be acted on,
// so this table stores the address in the row as well.
//
// The message itself is stored. A flag no one can read is not a flag, only a
// count, and "a Year 8 learner triggered the self-harm rule" is not something a
// responsible adult can judge without the words that triggered it.
import { createHash, randomUUID } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";
import { sendSafeguardingAlertEmail } from "./email.js";

const tableName = process.env.AZURE_STORAGE_SAFEGUARDING_TABLE ?? "EducationHubSafeguarding";
let tableClient;
let tableReady;

function client() {
  if (tableClient) return tableClient;
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    tableClient = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, tableName);
  } else if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    tableClient = new TableClient(process.env.AZURE_STORAGE_ACCOUNT_URL, tableName, new DefaultAzureCredential());
  } else {
    throw new Error("Safeguarding storage is not configured.");
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

export const severities = ["high", "medium", "low"];
export const flagStatuses = ["open", "acknowledged", "escalated", "closed"];

// What the guard refused, ranked by what an adult needs to see first. Structural
// refusals - an empty box, a message over the length limit - are not recorded at
// all: they carry no safeguarding signal and would bury the ones that do.
const severityByReason = {
  unsafe: "high",
  injection: "medium",
  leak: "medium",
  integrity: "low",
  "off-topic": "low",
};

export function severityFor(reason) {
  return severityByReason[reason] ?? null;
}

export function learnerId(email) {
  return createHash("sha256").update(String(email).trim().toLowerCase()).digest("hex");
}

// Table Storage orders row keys lexically ascending, so the key counts down and
// a learner's newest flags come back first without sorting a whole partition.
function descendingKey(now) {
  return `${(9999999999999 - now).toString().padStart(13, "0")}-${randomUUID()}`;
}

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function publicFlag(entity) {
  return {
    id: `${entity.partitionKey}/${entity.rowKey}`,
    learnerId: entity.partitionKey,
    rowKey: entity.rowKey,
    email: entity.email ?? "",
    studentName: entity.studentName ?? "",
    year: entity.year ?? 0,
    subject: entity.subject ?? "",
    topicId: entity.topicId ?? "",
    topicTitle: entity.topicTitle ?? "",
    mode: entity.mode ?? "",
    verdict: entity.verdict ?? "",
    reason: entity.reason ?? "",
    severity: entity.severity ?? "low",
    message: entity.message ?? "",
    createdAt: entity.createdAt ?? "",
    status: entity.status ?? "open",
    reviewedBy: entity.reviewedBy ?? "",
    reviewedAt: entity.reviewedAt ?? "",
    note: entity.note ?? "",
    alerted: entity.alerted === true,
    alertError: entity.alertError ?? "",
  };
}

function alertRecipients() {
  const configured = process.env.SAFEGUARDING_ALERT_EMAILS ?? process.env.ADMIN_EMAILS ?? "";
  return configured.split(",").map((address) => address.trim()).filter(Boolean);
}

function cooldownMs() {
  const minutes = Number(process.env.SAFEGUARDING_ALERT_COOLDOWN_MINUTES);
  return (Number.isFinite(minutes) && minutes >= 0 ? minutes : 60) * 60000;
}

// One alert per learner per cooldown window. A child repeating a distressing
// message should not decide how many emails an administrator receives, and every
// flag is in the dashboard either way. Checked before the new row is written, so
// the row being recorded cannot answer the question about itself.
async function alertedRecently(current, partitionKey, within) {
  if (!within) return false;
  const cutoff = new Date(Date.now() - within).toISOString();
  const pages = current
    .listEntities({ queryOptions: { filter: `PartitionKey eq '${partitionKey}' and severity eq 'high' and alerted eq true` } })
    .byPage({ maxPageSize: 20 });
  for await (const page of pages) {
    // Newest first inside the partition, so the first page settles it.
    for (const entity of page) if ((entity.createdAt ?? "") >= cutoff) return true;
    return false;
  }
  return false;
}

// Records one refused message. Returns null for the reasons that are not worth
// recording, so the caller does not have to know which those are.
export async function recordFlag(email, input, { sendAlert = sendSafeguardingAlertEmail, log = () => {} } = {}) {
  const severity = severityFor(input.reason);
  if (!severity) return null;

  const current = await readyClient();
  const partitionKey = learnerId(email);
  const now = Date.now();
  const recipients = alertRecipients();
  const shouldAlert =
    severity === "high" && recipients.length > 0 && !(await alertedRecently(current, partitionKey, cooldownMs()));

  let alerted = false;
  let alertError = "";
  if (shouldAlert) {
    try {
      // The message is deliberately not in the email. It is a disclosure by a
      // child, and email is the least controlled place it could end up; the
      // alert says who and what kind, and the dashboard holds the words.
      await sendAlert({
        recipients,
        studentName: text(input.studentName, 120) || email,
        email,
        reason: input.reason,
        subject: text(input.subject, 60),
        topicTitle: text(input.topicTitle, 180),
        occurredAt: new Date(now).toISOString(),
        dashboardUrl: `${process.env.APP_BASE_URL ?? ""}/#safeguarding`,
      });
      alerted = true;
    } catch (failure) {
      // Recorded on the row rather than thrown. A mail outage must not decide
      // whether the flag is stored, and the learner is still waiting for a reply.
      alertError = failure.message ?? "Alert delivery failed.";
      log(`Safeguarding alert delivery failed: ${alertError}`);
    }
  }

  const entity = {
    partitionKey,
    rowKey: descendingKey(now),
    email: String(email).trim().toLowerCase(),
    studentName: text(input.studentName, 120),
    year: Number(input.year) || 0,
    subject: text(input.subject, 60),
    topicId: text(input.topicId, 140),
    topicTitle: text(input.topicTitle, 180),
    mode: text(input.mode, 20),
    verdict: text(input.verdict, 20),
    reason: text(input.reason, 40),
    severity,
    message: text(input.message, 500),
    createdAt: new Date(now).toISOString(),
    status: "open",
    reviewedBy: "",
    reviewedAt: "",
    note: "",
    alerted,
    alertError: alertError.slice(0, 300),
  };
  await current.createEntity(entity);
  return { flag: publicFlag(entity), alerted, alertSkipped: severity === "high" && !shouldAlert, alertError };
}

// Every status, spelled out. Passing `undefined` cannot mean this: a default
// parameter fires on an explicit undefined too, so an unfiltered read would
// silently come back filtered to open flags.
export const everyStatus = "all";

// Only values validated here reach the filter string.
function serverFilter({ severity, status, email, since }) {
  const clauses = [];
  if (email) clauses.push(`PartitionKey eq '${learnerId(email)}'`);
  if (severities.includes(severity)) clauses.push(`severity eq '${severity}'`);
  if (flagStatuses.includes(status)) clauses.push(`status eq '${status}'`);
  if (typeof since === "string" && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(since)) clauses.push(`createdAt ge '${since}'`);
  return clauses.length ? clauses.join(" and ") : undefined;
}

export async function listFlags({ severity, status = "open", email, since, limit = 25, cursor } = {}) {
  const current = await readyClient();
  const filter = serverFilter({ severity, status, email, since });
  const rows = [];
  let nextCursor;
  // Pages are consumed whole and the cursor only advances past a completed page,
  // so no row is skipped or returned twice.
  const pages = current.listEntities(filter ? { queryOptions: { filter } } : {}).byPage({
    maxPageSize: 200,
    continuationToken: cursor || undefined,
  });
  for await (const page of pages) {
    for (const entity of page) rows.push(publicFlag(entity));
    nextCursor = page.continuationToken;
    if (limit && rows.length >= limit) break;
  }
  // One learner's flags arrive newest-first from their partition, but a query
  // across learners does not, so the page is ordered before it is returned.
  rows.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  return { rows: limit ? rows.slice(0, limit) : rows, cursor: nextCursor ?? "" };
}

export async function getLearnerFlags(email, { limit = 50 } = {}) {
  // Everything, decided or not: the question this answers is whether there is a
  // pattern, and a flag someone already closed is part of the pattern.
  const { rows } = await listFlags({ email, status: everyStatus, limit });
  return rows;
}

export async function setFlagStatus(learner, rowKey, status, reviewer, note) {
  if (!flagStatuses.includes(status)) return null;
  const current = await readyClient();
  const entity = await current.getEntity(learner, rowKey).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  if (!entity) return null;
  const reviewedAt = new Date().toISOString();
  // An existing note survives a decision that carries none, so acknowledging a
  // flag after someone wrote on it does not erase what they wrote.
  const note_ = note === undefined || note === null || note === "" ? entity.note ?? "" : text(note, 600);
  await current.updateEntity({ partitionKey: learner, rowKey, status, reviewedBy: reviewer ?? "", reviewedAt, note: note_ }, "Merge");
  return publicFlag({ ...entity, status, reviewedBy: reviewer ?? "", reviewedAt, note: note_ });
}

export async function flagSummary() {
  const current = await readyClient();
  const open = { high: 0, medium: 0, low: 0 };
  const totals = { open: 0, acknowledged: 0, escalated: 0, closed: 0 };
  const learners = new Set();
  for await (const entity of current.listEntities()) {
    const status = entity.status ?? "open";
    totals[status] = (totals[status] ?? 0) + 1;
    if (status === "open") {
      const severity = entity.severity ?? "low";
      open[severity] = (open[severity] ?? 0) + 1;
      learners.add(entity.partitionKey);
    }
  }
  return { open, totals, learnersWithOpenFlags: learners.size };
}

export async function deleteFlags(email) {
  const current = await readyClient();
  const partitionKey = learnerId(email);
  for await (const entity of current.listEntities({ queryOptions: { filter: `PartitionKey eq '${partitionKey}'` } })) {
    await current.deleteEntity(partitionKey, entity.rowKey);
  }
}
