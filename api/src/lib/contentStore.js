import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";
import { contentTypes, isQuestionBank } from "./contentPolicy.js";

const tableName = process.env.AZURE_STORAGE_CONTENT_TABLE ?? "EducationHubContent";
let tableClient;
let tableReady;

function client() {
  if (tableClient) return tableClient;
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    tableClient = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, tableName);
  } else if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    tableClient = new TableClient(process.env.AZURE_STORAGE_ACCOUNT_URL, tableName, new DefaultAzureCredential());
  } else {
    throw new Error("Curriculum content storage is not configured.");
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

// All content for one topic shares a partition, so a topic can be read or
// reviewed in a single query. Table keys must avoid the reserved characters,
// so both parts are validated rather than escaped.
export function contentKey(type, topicId, { index, board, tier } = {}) {
  if (typeof topicId !== "string" || !/^[a-z0-9][a-z0-9-]{0,120}$/.test(topicId)) return null;
  if (type === contentTypes.EXPLANATION) return { partitionKey: topicId, rowKey: "explanation" };
  const position = Number(index);
  if (!Number.isInteger(position) || position < 0 || position > 50) return null;
  const tierPart = tier === "Foundation" || tier === "Higher" ? tier : "core";
  // Worked examples keep their original key shape so rows already stored stay readable.
  if (type === contentTypes.EXAMPLE) return { partitionKey: topicId, rowKey: `example-${position}-${tierPart}` };
  if (!isQuestionBank(type)) return null;
  const boardPart = board === "AQA" || board === "Edexcel" ? board : "core";
  return { partitionKey: topicId, rowKey: `${type}-${position}-${boardPart}-${tierPart}` };
}

export async function getContent(key) {
  const current = await readyClient();
  const entity = await current.getEntity(key.partitionKey, key.rowKey).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  if (!entity) return null;
  try {
    return {
      ...JSON.parse(entity.payload),
      storedAt: entity.storedAt,
      reviewStatus: entity.reviewStatus ?? (entity.reviewed === true ? "approved" : "pending"),
      reviewed: entity.reviewed === true,
    };
  } catch {
    return null;
  }
}

export async function saveContent(key, payload, context) {
  const current = await readyClient();
  const existing = await current.getEntity(key.partitionKey, key.rowKey).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  await current.upsertEntity({
    ...key,
    payload: JSON.stringify(payload),
    type: context.type,
    subject: context.subject ?? "",
    year: Number(context.year) || 0,
    topicTitle: context.topicTitle ?? "",
    subtopicTitle: context.subtopicTitle ?? "",
    origin: context.origin ?? "",
    model: context.model ?? "",
    // Review state survives a regeneration only when the content is unchanged.
    // Anything the model rewrote returns to pending and must be looked at again.
    reviewed: existing?.payload === JSON.stringify(payload) ? existing.reviewed === true : false,
    reviewStatus: existing?.payload === JSON.stringify(payload) ? existing.reviewStatus ?? "pending" : "pending",
    reviewedBy: existing?.payload === JSON.stringify(payload) ? existing.reviewedBy ?? "" : "",
    reviewedAt: existing?.payload === JSON.stringify(payload) ? existing.reviewedAt ?? "" : "",
    storedAt: new Date().toISOString(),
  }, "Replace");
}

// Everything stored for one topic, read from a single partition. Used by the
// tutor to answer from stored study material before reaching for the model.
export async function listTopicContent(topicId) {
  if (typeof topicId !== "string" || !/^[a-z0-9][a-z0-9-]{0,120}$/.test(topicId)) return [];
  const current = await readyClient();
  const rows = [];
  for await (const entity of current.listEntities({ queryOptions: { filter: `PartitionKey eq '${topicId}'` } })) {
    try {
      rows.push({
        type: entity.type,
        rowKey: entity.rowKey,
        topicTitle: entity.topicTitle,
        subtopicTitle: entity.subtopicTitle,
        reviewed: entity.reviewed === true,
        payload: JSON.parse(entity.payload),
      });
    } catch {
      // A row that will not parse is simply not offered as study material.
    }
  }
  return rows;
}

const reviewStatuses = ["pending", "approved", "rejected"];

function statusOf(entity) {
  return entity.reviewStatus ?? (entity.reviewed === true ? "approved" : "pending");
}

export async function listContent({ type, year, subject, status, limit = 0, withPayload = false } = {}) {
  const current = await readyClient();
  const clauses = [];
  // Only values validated here reach the filter string.
  if (type && Object.values(contentTypes).includes(type)) clauses.push(`type eq '${type}'`);
  if (Number.isInteger(Number(year)) && Number(year) >= 7 && Number(year) <= 11) clauses.push(`year eq ${Number(year)}`);
  if (typeof subject === "string" && /^[A-Za-z ]{1,40}$/.test(subject)) clauses.push(`subject eq '${subject}'`);
  const options = clauses.length ? { queryOptions: { filter: clauses.join(" and ") } } : {};
  const rows = [];
  for await (const entity of current.listEntities(options)) {
    const entityStatus = statusOf(entity);
    if (status && reviewStatuses.includes(status) && entityStatus !== status) continue;
    const row = {
      topicId: entity.partitionKey,
      rowKey: entity.rowKey,
      type: entity.type,
      subject: entity.subject,
      year: entity.year,
      topicTitle: entity.topicTitle,
      subtopicTitle: entity.subtopicTitle,
      origin: entity.origin,
      model: entity.model,
      reviewStatus: entityStatus,
      reviewed: entityStatus === "approved",
      reviewedBy: entity.reviewedBy ?? "",
      reviewedAt: entity.reviewedAt ?? "",
      storedAt: entity.storedAt,
    };
    if (withPayload) {
      try { row.payload = JSON.parse(entity.payload); } catch { row.payload = null; }
    }
    rows.push(row);
    if (limit && rows.length >= limit) break;
  }
  return rows;
}

export async function setReviewStatus(topicId, rowKey, status, reviewer) {
  if (!reviewStatuses.includes(status)) return null;
  const current = await readyClient();
  const entity = await current.getEntity(topicId, rowKey).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  if (!entity) return null;
  await current.updateEntity({
    partitionKey: topicId,
    rowKey,
    reviewStatus: status,
    reviewed: status === "approved",
    reviewedBy: reviewer ?? "",
    reviewedAt: new Date().toISOString(),
  }, "Merge");
  return { topicId, rowKey, reviewStatus: status };
}

export async function reviewSummary() {
  const current = await readyClient();
  const totals = { pending: 0, approved: 0, rejected: 0 };
  const byType = {};
  for await (const entity of current.listEntities()) {
    const status = statusOf(entity);
    totals[status] = (totals[status] ?? 0) + 1;
    byType[entity.type] ??= { pending: 0, approved: 0, rejected: 0 };
    byType[entity.type][status] += 1;
  }
  return { totals, byType };
}
