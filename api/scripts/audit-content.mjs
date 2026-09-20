// Checks stored content against the catalogue it was generated from.
//
// A worked example is stored at example-{index}-{tier} and records the outcome
// it was written for. Nothing re-checks that pairing afterwards, so editing an
// outcome silently leaves an example teaching a sub-topic the learner is no
// longer shown - correct-looking content against the wrong heading, which is
// harder to spot than content that is simply missing.
//
// Passing --delete removes what it finds, so the seeding run regenerates it.
//
//   node api/scripts/audit-content.mjs
//   node api/scripts/audit-content.mjs --delete
import { readFileSync } from "node:fs";
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { deleteContent, listContent } from "../src/lib/contentStore.js";
import { supportsQuestionBank } from "../src/lib/contentPolicy.js";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const remove = process.argv.includes("--delete");
const byId = new Map(curriculum.map((topic) => [topic.id, topic]));

const rows = [];
let cursor = "";
do {
  const page = await listContent({ cursor });
  rows.push(...page.rows);
  cursor = page.cursor;
} while (cursor);

const problems = [];
let examples = 0;

for (const row of rows) {
  const topic = byId.get(row.topicId);
  if (!topic) {
    problems.push([row, "the topic is no longer in the catalogue"]);
    continue;
  }

  const example = /^example-(\d{1,2})-/.exec(row.rowKey);
  if (example) {
    examples += 1;
    const index = Number(example[1]);
    const current = topic.outcomes[index];
    if (current === undefined) {
      problems.push([row, `outcome ${index} no longer exists (the topic has ${topic.outcomes.length})`]);
      continue;
    }
    const recorded = (row.subtopicTitle ?? "").trim();
    if (recorded && recorded !== current) {
      problems.push([row, `outcome changed: was "${recorded}", now "${current}"`]);
    }
    continue;
  }

  // A practical topic has no question bank, so a stored question for one can
  // never be served and should not sit in the table looking like content.
  if (/^(practice|exam)-/.test(row.rowKey) && !supportsQuestionBank(row.topicId)) {
    problems.push([row, "the topic no longer supports a question bank"]);
  }
}

console.log(`${rows.length} stored rows, ${examples} worked examples`);
if (!problems.length) {
  console.log("\nPASS: every stored row still matches the catalogue it was generated from");
  process.exit(0);
}

console.log(`\n${problems.length} row(s) no longer match the catalogue:`);
for (const [row, why] of problems) console.log(`  ${row.topicId} ${row.rowKey}\n     ${why}`);

if (!remove) {
  console.log("\nPass --delete to remove them so seeding regenerates them.");
  process.exit(1);
}
for (const [row] of problems) await deleteContent(row.topicId, row.rowKey);
console.log(`\ndeleted ${problems.length} row(s); re-run the seeding script to replace them`);
