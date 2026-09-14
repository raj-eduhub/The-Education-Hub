// Spot-check a slice of stored content, then approve or reject the whole slice.
// Reviewing hundreds of rows one at a time in the browser is not practical, and
// the realistic workflow is to read a sample from a batch and judge the batch.
//
//   node api/scripts/review-content.mjs --year 10 --subject Maths --type practice
//   node api/scripts/review-content.mjs --year 10 --type practice --sample 5
//   node api/scripts/review-content.mjs --year 10 --type practice --approve
//   node api/scripts/review-content.mjs --topic y10-maths-number --reject
import { readFileSync } from "node:fs";
import { bulkReview, listContent, reviewSummary } from "../src/lib/contentStore.js";

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

const filters = {
  type: args.get("type"),
  year: args.get("year"),
  subject: args.get("subject"),
  topicId: args.get("topic"),
  status: args.get("status") ?? "pending",
};
const sampleSize = Math.max(1, Math.min(25, Number(args.get("sample") ?? 3)));
const approve = args.get("approve") === "true";
const reject = args.get("reject") === "true";

if (approve && reject) {
  console.error("Choose either --approve or --reject, not both.");
  process.exit(1);
}

function describe(row) {
  const payload = row.payload ?? {};
  const lines = [`  [${row.type}] ${row.topicId} ${row.rowKey}`];
  lines.push(`    Year ${row.year} ${row.subject} / ${row.topicTitle}${row.subtopicTitle ? ` / ${row.subtopicTitle}` : ""}`);
  if (payload.explanation) lines.push(`    ${payload.explanation.slice(0, 160)}`);
  if (payload.question) lines.push(`    Q: ${payload.question.slice(0, 160)}`);
  if (payload.marks) lines.push(`    marks: ${payload.marks}, mark scheme points: ${(payload.markScheme ?? []).length}`);
  if (payload.answer) lines.push(`    A: ${payload.answer.slice(0, 120)}`);
  return lines.join("\n");
}

const summary = await reviewSummary();
console.log(`stored: ${JSON.stringify(summary.totals)}`);
console.log(`filter: ${JSON.stringify(filters)}\n`);

// Count the slice by paging through it, so the number shown is the real one.
let matched = 0;
let cursor = "";
const sample = [];
do {
  const page = await listContent({ ...filters, withPayload: true, cursor });
  matched += page.rows.length;
  for (const row of page.rows) if (sample.length < sampleSize) sample.push(row);
  cursor = page.cursor;
} while (cursor);

console.log(`${matched} row(s) match.`);
if (!matched) process.exit(0);

console.log(`\nSample of ${sample.length}:\n`);
for (const row of sample) console.log(`${describe(row)}\n`);

if (!approve && !reject) {
  console.log("Nothing changed. Re-run with --approve or --reject to apply a decision to all matching rows.");
  process.exit(0);
}

const decision = approve ? "approved" : "rejected";
const reviewer = args.get("reviewer") ?? "cli";
const result = await bulkReview({ decision, filters, reviewer, max: 1000 });
if (result?.refused === "unfiltered") {
  console.error("Refused: narrow the selection with --year, --subject, --type or --topic first.");
  process.exit(1);
}
console.log(`${decision}: ${result.changed} row(s)${result.capped ? " (capped at 1000, run again for the rest)" : ""}`);
const after = await reviewSummary();
console.log(`stored now: ${JSON.stringify(after.totals)}`);
