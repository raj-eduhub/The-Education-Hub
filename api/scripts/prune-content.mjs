// Removes stored content that no longer meets the quality bar, so a seeding run
// regenerates it. Written because a parser flaw stored 93% of exam questions
// with no mark scheme: they parsed, but a learner opening the reveal found
// nothing there. It now also removes content written against an older version of
// the curriculum, and content pitched above the specification.
//
//   node api/scripts/prune-content.mjs --type exam            (dry run)
//   node api/scripts/prune-content.mjs --type exam --delete
import { readFileSync } from "node:fs";
import { deleteContent, listContent } from "../src/lib/contentStore.js";
import { contentTypes, isQuestionBank, supportsQuestionBank } from "../src/lib/contentPolicy.js";
import { curriculum } from "../../src/data/curriculumCatalog.js";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const current = process.argv[i];
  if (!current.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args.set(current.slice(2), !next || next.startsWith("--") ? "true" : next);
}

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

// The catalogue is the authority. A stored row whose topic or sub-topic no
// longer exists was written against an older version of the curriculum.
const topicsById = new Map(curriculum.map((topic) => [topic.id, topic]));

// Material above GCSE that the model produced anyway. Matched against the whole
// stored payload, so a mark scheme quietly using a z-score is caught as well as
// a question that names one.
const aboveSpecification = [
  [/\bstandard error\b|\bSE\s*=|\\hat\{p\}/i, "standard error"],
  [/\bconfidence interval\b|\b95%\s*CI\b|\bz\s*=\s*1\.96\b/i, "confidence interval"],
  [/\bnormal distribution\b|\bz-?score\b|\bt-?distribution\b/i, "distribution above GCSE"],
  [/\bstandard deviation\b|\bfinite population correction\b/i, "statistic above GCSE"],
  [/\bradians?\b|\\frac\{\\pi\}\{180\}/i, "radians"],
  // Narrow deliberately: "integrate evidence" is an essay instruction, not calculus.
  [/\bdifferentiate with respect to\b|\\frac\{dy\}\{dx\}|\\int\b|\bdefinite integral\b/i, "calculus"],
];

// Field descriptions from the prompt, stored as though they were content.
const promptEchoes = [
  "the practice question",
  "the exam-style question",
  "the final answer",
  "one short nudge",
  "one step of the solution",
  "one creditworthy point",
];

// A question that points at a picture the learner is never shown.
const figureReference = /\b(in|from|on) the (diagram|figure|graph|sketch|grid|net|scale drawing)\b|\bthe (diagram|figure) (shows|below|above)\b|\bshown (below|above)\b/i;

function payloadText(payload) {
  return [
    payload.question, payload.hint, payload.answer, payload.explanation,
    ...(payload.steps ?? []), ...(payload.working ?? []), ...(payload.markScheme ?? []), payload.raw,
  ].filter(Boolean).join("\n");
}

// What each content type must contain to be worth serving.
function defect(row) {
  const payload = row.payload ?? {};
  if (!payload.question && !payload.explanation) return "no question or explanation";
  if (row.type === contentTypes.EXAM) {
    if (!(payload.markScheme ?? []).length) return "no mark scheme";
    if (!payload.marks) return "no marks";
  }
  if (row.type === contentTypes.PRACTICE && !payload.answer) return "no answer";
  // A practice row with no working leaves the worked-answer reveal empty.
  if (row.type === contentTypes.PRACTICE && (payload.working ?? []).length < 2) return "no working";
  if (row.type === contentTypes.EXAMPLE && !(payload.steps ?? []).length) return "no worked steps";
  if (payload.raw) return "stored as unparsed prose";

  // Written against a curriculum that has since been corrected.
  const topic = topicsById.get(row.topicId);
  if (!topic) return "topic no longer in the catalogue";
  if (isQuestionBank(row.type) && !supportsQuestionBank(row.topicId)) return "practical topic, not a written question";
  if (row.subtopicTitle && !topic.outcomes.includes(row.subtopicTitle)) return "sub-topic no longer in the catalogue";

  const text = payloadText(payload);
  for (const [pattern, label] of aboveSpecification) {
    if (pattern.test(text)) return `above specification: ${label}`;
  }

  const question = String(payload.question ?? "").trim().toLowerCase();
  if (promptEchoes.some((echo) => question === echo || question.startsWith(echo))) return "prompt echoed as content";
  if (figureReference.test(payload.question ?? "")) return "refers to a figure the learner cannot see";
  return null;
}

const apply = args.get("delete") === "true";
const filters = { type: args.get("type"), year: args.get("year"), subject: args.get("subject"), status: "" };

let scanned = 0;
const defective = [];
let cursor = "";
do {
  const page = await listContent({ ...filters, withPayload: true, cursor });
  for (const row of page.rows) {
    scanned += 1;
    const reason = defect(row);
    if (reason) defective.push({ row, reason });
  }
  cursor = page.cursor;
} while (cursor);

const byReason = {};
for (const item of defective) byReason[item.reason] = (byReason[item.reason] ?? 0) + 1;
console.log(`scanned ${scanned}, defective ${defective.length}`);
for (const [reason, count] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${reason}: ${count}`);
}

if (!defective.length) process.exit(0);
if (!apply) {
  console.log("\nSample:");
  for (const item of defective.slice(0, 5)) console.log(`  ${item.row.topicId}/${item.row.rowKey} (${item.reason})`);
  console.log("\nNothing deleted. Re-run with --delete, then seed to regenerate.");
  process.exit(0);
}

for (const item of defective) await deleteContent(item.row.topicId, item.row.rowKey);
console.log(`\ndeleted ${defective.length} row(s). Run the seeding script to regenerate them.`);
