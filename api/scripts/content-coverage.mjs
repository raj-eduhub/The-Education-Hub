// Reports how much of the curriculum is stored, so a seeding run can be checked
// and gaps found without opening the table.
//
// Every content type the routing policy knows about is counted, not only the
// two that are authored. Practice and exam were previously left out of this
// report, which made coverage look far better than it was: explanations at 100%
// said nothing about whether a learner pressing Practice would reach the model.
//
//   node api/scripts/content-coverage.mjs
//   node api/scripts/content-coverage.mjs --by-subject
//   node api/scripts/content-coverage.mjs --gaps          what is missing, by subject
//   node api/scripts/content-coverage.mjs --per-topic 10  question-bank target
import { readFileSync } from "node:fs";
import { curriculumByYear } from "../../src/data/curriculumCatalog.js";
import { listContent } from "../src/lib/contentStore.js";
import { contentTypes, supportsQuestionBank, variesByBoard, variesByTier } from "../src/lib/contentPolicy.js";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const current = process.argv[i];
  if (!current.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args.set(current.slice(2), !next || next.startsWith("--") ? "true" : next);
}
const detail = args.has("detail");
const bySubject = args.has("by-subject");
const showGaps = args.has("gaps");
// How many questions a topic should hold for one board and tier. The seeding
// script defaults to the same number, so the two agree on what "covered" means.
const perTopic = Number(args.get("per-topic") ?? 10);

// Paged so a large table is read completely rather than a first page only.
const rows = [];
let cursor = "";
do {
  const page = await listContent({ cursor });
  rows.push(...page.rows);
  cursor = page.cursor;
} while (cursor);
const stored = new Set(rows.map((row) => `${row.topicId}/${row.rowKey}`));
const reviewed = rows.filter((row) => row.reviewed).length;

// The slot space is derived from the same policy functions the request handler
// uses, so this report cannot drift from what the application actually looks up.
function slotsFor(topic, subject, year) {
  const slots = [];
  slots.push({ type: contentTypes.EXPLANATION, key: "explanation" });

  const tiers = year >= 10 && variesByTier(subject) ? ["Foundation", "Higher"] : [null];
  const tierPart = (tier) => tier ?? "core";

  for (const tier of tiers) {
    for (let index = 0; index < topic.outcomes.length; index += 1) {
      slots.push({ type: contentTypes.EXAMPLE, key: `example-${index}-${tierPart(tier)}` });
    }
  }

  // A topic that cannot be assessed by a typed answer has no question-bank
  // slots at all, so it must not count against coverage.
  if (!supportsQuestionBank(topic.id)) return slots;

  // KS3 carries no exam boards, so its question rows are stored once under the
  // "any" board rather than duplicated per board that does not apply yet.
  const boards = variesByBoard(contentTypes.PRACTICE) && topic.examBoards?.length
    ? topic.examBoards
    : ["any"];
  for (const type of [contentTypes.PRACTICE, contentTypes.EXAM]) {
    for (const board of boards) {
      for (const tier of tiers) {
        for (let index = 0; index < perTopic; index += 1) {
          slots.push({ type, key: `${type}-${index}-${board}-${tierPart(tier)}` });
        }
      }
    }
  }
  return slots;
}

const types = [contentTypes.EXPLANATION, contentTypes.EXAMPLE, contentTypes.PRACTICE, contentTypes.EXAM];
const blank = () => Object.fromEntries(types.map((type) => [type, { have: 0, slots: 0 }]));
const add = (into, type, hit) => { into[type].slots += 1; if (hit) into[type].have += 1; };

const byYear = new Map();
const bySubjectYear = new Map();
const totals = blank();
let topicCount = 0;
const gaps = [];

for (const [year, entry] of Object.entries(curriculumByYear)) {
  const yearCounts = byYear.get(year) ?? blank();
  byYear.set(year, yearCounts);
  for (const [subject, topics] of Object.entries(entry.subjects)) {
    const subjectKey = `${subject}`;
    const subjectCounts = bySubjectYear.get(subjectKey) ?? blank();
    bySubjectYear.set(subjectKey, subjectCounts);
    for (const topic of topics) {
      topicCount += 1;
      const missing = blank();
      for (const slot of slotsFor(topic, subject, Number(year))) {
        const hit = stored.has(`${topic.id}/${slot.key}`);
        add(yearCounts, slot.type, hit);
        add(subjectCounts, slot.type, hit);
        add(totals, slot.type, hit);
        add(missing, slot.type, hit);
      }
      const short = types.filter((type) => missing[type].slots && missing[type].have < missing[type].slots);
      if (short.length) {
        gaps.push({
          year, subject, id: topic.id, title: topic.title,
          detail: short.map((type) => `${type} ${missing[type].have}/${missing[type].slots}`).join("  "),
        });
      }
    }
  }
}

const pct = (have, slots) => (slots ? `${((have / slots) * 100).toFixed(1)}%` : "n/a");
const cell = (counts, type) => `${String(counts[type].have).padStart(5)}/${String(counts[type].slots).padEnd(5)}`;
const header = "                explanation      example         practice        exam";

console.log(`curriculum: ${topicCount} topics, question-bank target ${perTopic} per topic, board and tier\n`);
console.log(header);
for (const [year, counts] of byYear) {
  console.log(`  Year ${String(year).padEnd(4)}  ${types.map((type) => cell(counts, type)).join("  ")}`);
}

if (bySubject || showGaps) {
  console.log(`\nby subject (all years)\n${header}`);
  for (const [subject, counts] of [...bySubjectYear].sort()) {
    console.log(`  ${subject.padEnd(18).slice(0, 18)} ${types.map((type) => cell(counts, type)).join("  ")}`);
  }
}

console.log("\ntotals");
for (const type of types) {
  const { have, slots } = totals[type];
  console.log(`  ${type.padEnd(12)} ${String(have).padStart(6)} / ${String(slots).padEnd(6)}  ${pct(have, slots)}`);
}
const allHave = types.reduce((sum, type) => sum + totals[type].have, 0);
const allSlots = types.reduce((sum, type) => sum + totals[type].slots, 0);
console.log(`  ${"ALL".padEnd(12)} ${String(allHave).padStart(6)} / ${String(allSlots).padEnd(6)}  ${pct(allHave, allSlots)}`);
console.log(`\nreviewed by a teacher: ${reviewed} / ${rows.length} stored rows`);

// A slot that is empty is a slot where the request reaches the model, except for
// explanations, which are stored-only and therefore simply fail.
const modelSlots = totals[contentTypes.EXAMPLE].slots - totals[contentTypes.EXAMPLE].have
  + totals[contentTypes.PRACTICE].slots - totals[contentTypes.PRACTICE].have
  + totals[contentTypes.EXAM].slots - totals[contentTypes.EXAM].have;
const explanationGap = totals[contentTypes.EXPLANATION].slots - totals[contentTypes.EXPLANATION].have;
console.log(`\n${modelSlots} slot(s) would reach the model on first request.`);
if (explanationGap) console.log(`${explanationGap} explanation slot(s) would fail: the route is stored-only.`);

if (showGaps) {
  console.log(`\ntopics with an incomplete slot (${gaps.length}):`);
  for (const gap of gaps) {
    console.log(`  Y${String(gap.year).padEnd(3)} ${gap.subject.padEnd(18).slice(0, 18)} ${gap.id.padEnd(46).slice(0, 46)} ${gap.detail}`);
  }
}

if (detail) {
  console.log("\nstored rows:");
  for (const row of rows.sort((a, b) => `${a.topicId}${a.rowKey}`.localeCompare(`${b.topicId}${b.rowKey}`))) {
    console.log(`  ${row.topicId.padEnd(24)} ${row.rowKey.padEnd(28)} ${String(row.origin).padEnd(9)} ${row.reviewed ? "reviewed" : "unreviewed"}  ${row.subtopicTitle || row.topicTitle}`);
  }
}
