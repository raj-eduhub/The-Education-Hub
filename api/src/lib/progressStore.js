import { createHash, randomUUID } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const attemptsTableName = process.env.AZURE_STORAGE_ATTEMPTS_TABLE ?? "EducationHubAttempts";
const masteryTableName = process.env.AZURE_STORAGE_MASTERY_TABLE ?? "EducationHubMastery";
const clients = new Map();
const ready = new Map();

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function table(name) {
  if (clients.has(name)) return clients.get(name);
  let current;
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    current = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, name);
  } else if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    current = new TableClient(process.env.AZURE_STORAGE_ACCOUNT_URL, name, new DefaultAzureCredential());
  } else {
    throw new Error("Progress storage is not configured.");
  }
  clients.set(name, current);
  return current;
}

async function readyTable(name) {
  const current = table(name);
  if (!ready.has(name)) {
    ready.set(name, current.createTable().catch((error) => {
      if (error.statusCode !== 409) throw error;
    }));
  }
  await ready.get(name);
  return current;
}

function learnerPartition(email) {
  return hash(email.trim().toLowerCase());
}

function masteryRowKey(year, subject, topicId) {
  return hash(`${year}|${subject}|${topicId}`);
}

// Automatically recorded attempts carry no confidence, because only the learner
// knows it. When it is missing the interval is decided on accuracy alone rather
// than on an invented number.
function nextInterval(previousDays, accuracy, confidence) {
  const confident = confidence === null ? accuracy >= 0.85 : confidence >= 4;
  if (accuracy >= 0.85 && confident) return Math.min(Math.max(previousDays || 1, 1) * 2, 60);
  if (accuracy >= 0.65) return Math.min(Math.max(previousDays || 1, 1) + 2, 21);
  return 1;
}

function publicAttempt(entity) {
  return {
    id: entity.rowKey,
    year: entity.year,
    subject: entity.subject,
    topicId: entity.topicId,
    topicTitle: entity.topicTitle,
    kind: entity.kind ?? "attempt",
    mode: entity.mode,
    accuracy: entity.accuracy,
    confidence: entity.confidence,
    durationSeconds: entity.durationSeconds,
    score: entity.score,
    maxScore: entity.maxScore,
    completedAt: entity.completedAt,
  };
}

function publicMastery(entity) {
  return {
    id: entity.rowKey,
    year: entity.year,
    subject: entity.subject,
    topicId: entity.topicId,
    topicTitle: entity.topicTitle,
    attempts: entity.attempts,
    accuracy: entity.accuracy,
    confidence: entity.confidence,
    confidenceSamples: entity.confidenceSamples ?? 0,
    totalTimeSeconds: entity.totalTimeSeconds,
    masteryScore: entity.masteryScore,
    lastPractised: entity.lastPractised,
    nextReviewAt: entity.nextReviewAt,
    reviewIntervalDays: entity.reviewIntervalDays,
  };
}

export async function recordAttempt(email, input) {
  const attempts = await readyTable(attemptsTableName);
  const mastery = await readyTable(masteryTableName);
  const partitionKey = learnerPartition(email);
  const now = new Date();
  const completedAt = now.toISOString();
  const accuracy = Math.max(0, Math.min(1, Number(input.accuracy)));
  // Confidence is self-reported, so an automatic attempt simply has none.
  // Number(null) is 0 and Number("") is 0, so absence is checked before coercion
  // rather than after it, otherwise a missing value silently became 1.
  const given = input.confidence;
  const hasConfidence = given !== null && given !== undefined && given !== "" && Number.isFinite(Number(given));
  const confidence = hasConfidence ? Math.max(1, Math.min(5, Math.round(Number(given)))) : null;
  const durationSeconds = Math.max(1, Math.min(14400, Math.round(Number(input.durationSeconds))));
  const attempt = {
    partitionKey,
    rowKey: `${Date.now()}-${randomUUID()}`,
    year: input.year,
    subject: input.subject,
    topicId: input.topicId,
    topicTitle: input.topicTitle,
    mode: input.mode,
    kind: input.kind === "auto" ? "auto" : "attempt",
    accuracy,
    // The property is omitted rather than stored as a placeholder value.
    ...(confidence === null ? {} : { confidence }),
    durationSeconds,
    score: input.score ?? Math.round(accuracy * 100),
    maxScore: input.maxScore ?? 100,
    completedAt,
  };
  await attempts.createEntity(attempt);

  const rowKey = masteryRowKey(input.year, input.subject, input.topicId);
  const existing = await mastery.getEntity(partitionKey, rowKey).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  const attemptCount = (existing?.attempts ?? 0) + 1;
  const averageAccuracy = (((existing?.accuracy ?? 0) * (attemptCount - 1)) + accuracy) / attemptCount;
  // The confidence average is kept over the attempts that actually reported one.
  const previousSamples = existing?.confidenceSamples ?? (existing?.confidence ? existing.attempts ?? 0 : 0);
  const confidenceSamples = previousSamples + (confidence === null ? 0 : 1);
  const averageConfidence = confidence === null
    ? existing?.confidence ?? null
    : (((existing?.confidence ?? 0) * previousSamples) + confidence) / confidenceSamples;
  const masteryScore = existing
    ? (existing.masteryScore * 0.65) + (accuracy * 100 * 0.35)
    : accuracy * 100;
  const reviewIntervalDays = nextInterval(existing?.reviewIntervalDays, accuracy, confidence);
  const nextReview = new Date(now);
  nextReview.setUTCDate(nextReview.getUTCDate() + reviewIntervalDays);
  const masteryEntity = {
    partitionKey,
    rowKey,
    year: input.year,
    subject: input.subject,
    topicId: input.topicId,
    topicTitle: input.topicTitle,
    attempts: attemptCount,
    accuracy: Math.round(averageAccuracy * 1000) / 1000,
    ...(averageConfidence === null ? {} : { confidence: Math.round(averageConfidence * 10) / 10 }),
    confidenceSamples,
    totalTimeSeconds: (existing?.totalTimeSeconds ?? 0) + durationSeconds,
    masteryScore: Math.round(masteryScore),
    lastPractised: completedAt,
    nextReviewAt: nextReview.toISOString(),
    reviewIntervalDays,
  };
  await mastery.upsertEntity(masteryEntity, "Replace");
  return { attempt: publicAttempt(attempt), mastery: publicMastery(masteryEntity) };
}

// Engagement, kept separate from attainment. Activity never touches accuracy,
// mastery, or the review schedule; it only records that the learner was working.
export async function recordActivity(email, input) {
  const attempts = await readyTable(attemptsTableName);
  const durationSeconds = Math.max(1, Math.min(14400, Math.round(Number(input.durationSeconds))));
  const entity = {
    partitionKey: learnerPartition(email),
    rowKey: `${Date.now()}-${randomUUID()}`,
    kind: "activity",
    year: input.year,
    subject: input.subject,
    topicId: input.topicId,
    topicTitle: input.topicTitle,
    mode: input.mode,
    durationSeconds,
    questionsAsked: Math.max(0, Math.min(500, Math.round(Number(input.questionsAsked) || 0))),
    examplesOpened: Math.max(0, Math.min(500, Math.round(Number(input.examplesOpened) || 0))),
    completedAt: new Date().toISOString(),
  };
  await attempts.createEntity(entity);
  return { activity: publicAttempt(entity) };
}

export async function getProgress(email, year) {
  const partitionKey = learnerPartition(email);
  const attemptsClient = await readyTable(attemptsTableName);
  const masteryClient = await readyTable(masteryTableName);
  const attempts = [];
  const mastery = [];
  for await (const entity of attemptsClient.listEntities({
    queryOptions: { filter: `PartitionKey eq '${partitionKey}'` },
  })) {
    if (!year || entity.year === year) attempts.push(publicAttempt(entity));
  }
  for await (const entity of masteryClient.listEntities({
    queryOptions: { filter: `PartitionKey eq '${partitionKey}'` },
  })) {
    if (!year || entity.year === year) mastery.push(publicMastery(entity));
  }
  attempts.sort((left, right) => right.completedAt.localeCompare(left.completedAt));
  mastery.sort((left, right) => (left.nextReviewAt ?? "").localeCompare(right.nextReviewAt ?? ""));
  return { attempts: attempts.slice(0, 100), mastery };
}

async function deletePartition(client, partitionKey) {
  for await (const entity of client.listEntities({
    queryOptions: { filter: `PartitionKey eq '${partitionKey}'` },
  })) {
    await client.deleteEntity(partitionKey, entity.rowKey);
  }
}

export async function deleteProgress(email) {
  const partitionKey = learnerPartition(email);
  const attemptsClient = await readyTable(attemptsTableName);
  const masteryClient = await readyTable(masteryTableName);
  await Promise.all([
    deletePartition(attemptsClient, partitionKey),
    deletePartition(masteryClient, partitionKey),
  ]);
}
