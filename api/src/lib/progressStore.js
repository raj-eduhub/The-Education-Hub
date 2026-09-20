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
    contentType: entity.contentType ?? "",
    contentRowKey: entity.contentRowKey ?? "",
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
    // Which stored question was answered, so Review can re-ask the ones missed.
    contentType: input.contentType ?? "",
    contentRowKey: input.contentRowKey ?? "",
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

// The review queue: questions the learner did not get right, ordered so the
// most overdue and least secure come first. Spaced retrieval needs to re-ask
// the specific thing that was missed, not just revisit the topic.
export async function getReviewQueue(email, { year, subject, limit = 20 } = {}) {
  const { attempts, mastery } = await getProgress(email, year);
  const masteryByTopic = new Map(mastery.map((item) => [item.topicId, item]));

  // Latest outcome per stored question, so something since answered correctly
  // drops out of the queue.
  const latest = new Map();
  for (const attempt of attempts) {
    if (!attempt.contentRowKey || !attempt.topicId) continue;
    if (subject && attempt.subject !== subject) continue;
    const key = `${attempt.topicId}/${attempt.contentRowKey}`;
    const existing = latest.get(key);
    if (!existing || attempt.completedAt > existing.completedAt) latest.set(key, attempt);
  }

  const now = Date.now();
  const due = [];
  for (const [key, attempt] of latest) {
    if (Number(attempt.accuracy) >= 0.8) continue;
    const topic = masteryByTopic.get(attempt.topicId);
    const reviewAt = topic?.nextReviewAt ? new Date(topic.nextReviewAt).getTime() : 0;
    due.push({
      key,
      topicId: attempt.topicId,
      topicTitle: attempt.topicTitle,
      subject: attempt.subject,
      contentType: attempt.contentType || "practice",
      contentRowKey: attempt.contentRowKey,
      accuracy: Number(attempt.accuracy) || 0,
      lastSeen: attempt.completedAt,
      overdue: reviewAt > 0 && reviewAt <= now,
      masteryScore: topic?.masteryScore ?? 0,
    });
  }

  due.sort((left, right) =>
    Number(right.overdue) - Number(left.overdue) ||
    left.accuracy - right.accuracy ||
    left.masteryScore - right.masteryScore ||
    String(left.lastSeen).localeCompare(String(right.lastSeen)));

  const topicsDue = mastery
    .filter((item) => (!subject || item.subject === subject) && item.nextReviewAt && new Date(item.nextReviewAt).getTime() <= now)
    .map((item) => ({ topicId: item.topicId, topicTitle: item.topicTitle, masteryScore: item.masteryScore, nextReviewAt: item.nextReviewAt }));

  return { queue: due.slice(0, limit), topicsDue, totalDue: due.length };
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

// --- Daily habit -------------------------------------------------------------
// A small daily target, and the run of days it has been met.
//
// The goal is a length of time rather than a number of questions, converted
// using the learner's own pace. A fast learner is set more questions and a
// slower one fewer, for the same fifteen minutes: a fixed count punishes the
// learner who needs longer to think, which is the one it should not punish.
// This is also the only use made of the duration recorded on every attempt.
export const targetMinutes = 15;
const defaultSecondsPerQuestion = 90;
// Enough to be worth doing, few enough to stay finishable on a school night.
const goalFloor = 4;
const goalCeiling = 25;
// A fortnight is enough to draw a streak and show a pattern without reading
// the learner's whole history on every page load.
const habitDays = 14;

// Day boundaries are the learner's, not UTC's: work done at 9pm on Sunday in
// Britain is Sunday's work, and in UTC during summer it is already Monday.
const londonDay = (iso) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date(iso));

function medianOf(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

export async function getHabit(email, { now = new Date() } = {}) {
  const attemptsClient = await readyTable(attemptsTableName);
  const partitionKey = learnerPartition(email);

  const counts = new Map();
  const durations = [];
  let answered = 0;
  for await (const entity of attemptsClient.listEntities({
    queryOptions: { filter: `PartitionKey eq '${partitionKey}'` },
  })) {
    // Only answered questions count towards a day. Time spent reading a lesson
    // is recorded as activity, and a goal that could be met by opening pages
    // would measure nothing.
    if (entity.kind === "activity") continue;
    answered += 1;
    const day = londonDay(entity.completedAt);
    counts.set(day, (counts.get(day) ?? 0) + 1);
    if (Number.isFinite(entity.durationSeconds)) durations.push(entity.durationSeconds);
  }

  // Pace from the most recent answers, so a learner who has sped up is not held
  // to how long they took in September.
  const recent = durations.slice(-30);
  const secondsPerQuestion = medianOf(recent) ?? defaultSecondsPerQuestion;
  const goal = Math.max(goalFloor, Math.min(goalCeiling,
    Math.round((targetMinutes * 60) / Math.max(20, secondsPerQuestion))));

  const days = [];
  for (let back = habitDays - 1; back >= 0; back -= 1) {
    const date = londonDay(new Date(now.getTime() - back * 86400000));
    days.push({ date, count: counts.get(date) ?? 0, met: (counts.get(date) ?? 0) >= goal });
  }

  const today = days[days.length - 1];
  // A streak counts back from today where today is already done, and from
  // yesterday where it is not: a learner should not watch their streak read
  // zero all morning for work they have not had a chance to do yet.
  let streak = 0;
  for (let index = days.length - (today.met ? 1 : 2); index >= 0; index -= 1) {
    if (!days[index].met) break;
    streak += 1;
  }

  return {
    goal,
    targetMinutes,
    secondsPerQuestion: Math.round(secondsPerQuestion),
    today: today.count,
    metToday: today.met,
    remaining: Math.max(0, goal - today.count),
    streak,
    days,
    answeredEver: answered,
  };
}
