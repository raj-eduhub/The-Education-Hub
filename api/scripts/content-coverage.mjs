// Reports how much of the curriculum is stored, so a seeding run can be checked
// and gaps found without opening the table.
import { readFileSync } from "node:fs";
import { curriculumByYear } from "../../src/data/curriculumCatalog.js";
import { listContent } from "../src/lib/contentStore.js";
import { contentTypes } from "../src/lib/contentPolicy.js";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const detail = process.argv.includes("--detail");
const rows = await listContent();
const stored = new Set(rows.map((row) => `${row.topicId}/${row.rowKey}`));
const reviewed = rows.filter((row) => row.reviewed).length;

console.log("year  topics  explanations      examples");
let totals = { topics: 0, expSlots: 0, expHave: 0, exSlots: 0, exHave: 0 };
for (const [year, entry] of Object.entries(curriculumByYear)) {
  const tiers = Number(year) >= 10 ? ["Foundation", "Higher"] : ["core"];
  const counts = { topics: 0, expSlots: 0, expHave: 0, exSlots: 0, exHave: 0 };
  for (const topics of Object.values(entry.subjects)) {
    for (const topic of topics) {
      counts.topics += 1;
      counts.expSlots += 1;
      if (stored.has(`${topic.id}/explanation`)) counts.expHave += 1;
      for (let i = 0; i < topic.outcomes.length; i += 1) {
        for (const tier of tiers) {
          counts.exSlots += 1;
          if (stored.has(`${topic.id}/example-${i}-${tier}`)) counts.exHave += 1;
        }
      }
    }
  }
  for (const key of Object.keys(totals)) totals[key] += counts[key];
  console.log(`  ${year}   ${String(counts.topics).padStart(5)}   ${String(counts.expHave).padStart(4)} / ${String(counts.expSlots).padEnd(4)}   ${String(counts.exHave).padStart(5)} / ${String(counts.exSlots).padEnd(5)}`);
}
const pct = (have, slots) => slots ? `${(have / slots * 100).toFixed(1)}%` : "n/a";
console.log(`\nexplanations: ${totals.expHave} / ${totals.expSlots}  (${pct(totals.expHave, totals.expSlots)})`);
console.log(`examples:     ${totals.exHave} / ${totals.exSlots}  (${pct(totals.exHave, totals.exSlots)})`);
console.log(`reviewed by a teacher: ${reviewed} / ${rows.length} stored rows`);

if (detail) {
  console.log("\nstored rows:");
  for (const row of rows.sort((a, b) => `${a.topicId}${a.rowKey}`.localeCompare(`${b.topicId}${b.rowKey}`))) {
    console.log(`  ${row.topicId.padEnd(24)} ${row.rowKey.padEnd(18)} ${String(row.origin).padEnd(9)} ${row.reviewed ? "reviewed" : "unreviewed"}  ${row.subtopicTitle || row.topicTitle}`);
  }
}
