// Removes stored content that no longer meets the quality bar, so a seeding run
// regenerates it. Written because a parser flaw stored 93% of exam questions
// with no mark scheme: they parsed, but a learner opening the reveal found
// nothing there.
//
//   node api/scripts/prune-content.mjs --type exam            (dry run)
//   node api/scripts/prune-content.mjs --type exam --delete
import { readFileSync } from "node:fs";
import { deleteContent, listContent } from "../src/lib/contentStore.js";
import { contentTypes } from "../src/lib/contentPolicy.js";

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

// What each content type must contain to be worth serving.
function defect(row) {
  const payload = row.payload ?? {};
  if (!payload.question && !payload.explanation) return "no question or explanation";
  if (row.type === contentTypes.EXAM) {
    if (!(payload.markScheme ?? []).length) return "no mark scheme";
    if (!payload.marks) return "no marks";
  }
  if (row.type === contentTypes.PRACTICE && !payload.answer) return "no answer";
  if (row.type === contentTypes.EXAMPLE && !(payload.steps ?? []).length) return "no worked steps";
  if (payload.raw) return "stored as unparsed prose";
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
for (const [reason, count] of Object.entries(byReason)) console.log(`  ${reason}: ${count}`);

if (!defective.length) process.exit(0);
if (!apply) {
  console.log(`\nSample:`);
  for (const item of defective.slice(0, 5)) console.log(`  ${item.row.topicId}/${item.row.rowKey} (${item.reason})`);
  console.log(`\nNothing deleted. Re-run with --delete, then seed to regenerate.`);
  process.exit(0);
}

for (const item of defective) await deleteContent(item.row.topicId, item.row.rowKey);
console.log(`\ndeleted ${defective.length} row(s). Run the seeding script to regenerate them.`);
