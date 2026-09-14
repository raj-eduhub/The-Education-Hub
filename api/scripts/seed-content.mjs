// Seeds curriculum content into Table Storage so the running app serves stored
// content and calls the model only for what has not been authored yet.
//
//   node api/scripts/seed-content.mjs --year 10 --subject Maths --tier Higher
//   node api/scripts/seed-content.mjs --explanations-only
//   node api/scripts/seed-content.mjs --year 7 --dry-run --concurrency 4
import { readFileSync } from "node:fs";
import { curriculumByYear } from "../../src/data/curriculumCatalog.js";
import { getTopicGuide } from "../../src/topicGuides.js";
import { callFoundry, deployment } from "../src/lib/foundry.js";
import { contentKey, getContent, saveContent } from "../src/lib/contentStore.js";
import { contentTypes, mayUseModel, routeFor, usesMathsNotation, variesByBoard } from "../src/lib/contentPolicy.js";
import { parseQuestion, questionPrompt } from "../src/lib/questionBank.js";
import { exampleSystemPrompt, parseWorkedExample, workedExamplePrompt } from "../src/lib/workedExample.js";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const current = process.argv[i];
  if (!current.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args.set(current.slice(2), !next || next.startsWith("--") ? "true" : next);
}

// Local runs read the same ignored settings file the Functions host uses.
if (!process.env.AZURE_AI_API_KEY || !process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    // Deployed runs rely on real environment settings instead.
  }
}

const years = args.has("year") ? [Number(args.get("year"))] : [7, 8, 9, 10, 11];
const onlySubject = args.get("subject");
const tier = args.get("tier") ?? "Higher";
const limit = Number(args.get("limit") ?? Infinity);
const concurrency = Math.max(1, Math.min(8, Number(args.get("concurrency") ?? 4)));
const dryRun = args.get("dry-run") === "true";
const explanationsOnly = args.get("explanations-only") === "true";
// example | practice | exam. Question banks are seeded per board and per tier.
const contentType = args.get("type") ?? contentTypes.EXAMPLE;
const perTopic = Math.max(1, Math.min(20, Number(args.get("per-topic") ?? 10)));
const boards = (args.get("board") ?? "AQA,Edexcel").split(",").map((b) => b.trim()).filter(Boolean);
if (![contentTypes.EXAMPLE, contentTypes.PRACTICE, contentTypes.EXAM].includes(contentType)) {
  throw new Error(`--type must be example, practice, or exam. Received: ${contentType}`);
}

const counts = { explanations: 0, skipped: 0, generated: 0, failed: 0, wouldGenerate: 0 };
let claimed = 0;
const jobs = [];

for (const year of years) {
  const entry = curriculumByYear[year];
  if (!entry) throw new Error(`Year ${year} is not in the catalogue.`);
  const variantTier = year >= 10 ? tier : null;
  for (const [subject, topics] of Object.entries(entry.subjects)) {
    if (onlySubject && subject !== onlySubject) continue;
    for (const topic of topics) {
      // Explanations are authored curriculum text, copied straight from the catalogue.
      const explanationKey = contentKey(contentTypes.EXPLANATION, topic.id);
      if (explanationKey && !(await getContent(explanationKey))) {
        const guide = getTopicGuide(subject, topic);
        if (!dryRun) {
          await saveContent(explanationKey, { explanation: guide.explanation, keyIdeas: guide.keyIdeas, formulae: guide.formulae }, {
            type: contentTypes.EXPLANATION, subject, year, topicTitle: topic.title, origin: "catalogue",
          });
        }
        counts.explanations += 1;
      }
      if (explanationsOnly) continue;
      if (contentType === contentTypes.EXAMPLE) {
        for (const [index, outcome] of topic.outcomes.entries()) {
          jobs.push({ year, subject, topic, index, outcome, variantTier, board: null });
        }
        continue;
      }
      // Question banks: several questions per topic, for each board the year uses.
      const variantBoards = variesByBoard(contentType) && year >= 9 ? boards : [null];
      for (const board of variantBoards) {
        for (let index = 0; index < perTopic; index += 1) {
          const outcome = topic.outcomes[index % topic.outcomes.length];
          jobs.push({ year, subject, topic, index, outcome, variantTier, board });
        }
      }
    }
  }
}

async function runJob(job) {
  const { year, subject, topic, index, outcome, variantTier, board } = job;
  const key = contentKey(contentType, topic.id, { index, board, tier: variantTier });
  if (!key) { counts.failed += 1; return; }
  if (await getContent(key)) { counts.skipped += 1; return; }
  const route = routeFor(contentType, subject);
  if (!mayUseModel(route)) { counts.skipped += 1; return; }
  // Claimed before the await so concurrent workers cannot overshoot --limit.
  if (claimed >= limit) return;
  claimed += 1;
  const label = `Year ${year} ${subject} / ${topic.title} / ${board ?? "core"} / ${contentType} ${index + 1}`;
  if (dryRun) { counts.wouldGenerate += 1; console.log(`WOULD ${label}`); return; }
  try {
    const notation = usesMathsNotation(subject);
    const userPrompt = contentType === contentTypes.EXAMPLE
      ? workedExamplePrompt(topic, { title: outcome, index }, { notation })
      : questionPrompt(contentType, topic, { title: outcome, index }, { board, tier: variantTier, year, notation, index });
    const answer = await callFoundry({
      model: deployment,
      input: [
        { role: "system", content: exampleSystemPrompt(year <= 9 ? "KS3" : "KS4", year, board, variantTier, subject) },
        { role: "user", content: userPrompt },
      ],
    });
    const parsed = contentType === contentTypes.EXAMPLE ? parseWorkedExample(answer) : parseQuestion(contentType, answer);
    if (!parsed) { counts.failed += 1; console.log(`WARN  unparsed response for ${label}`); return; }
    await saveContent(key, { ...parsed, notation }, {
      type: contentType, subject, year, topicTitle: topic.title, subtopicTitle: outcome,
      origin: "model", model: deployment,
    });
    counts.generated += 1;
    console.log(`WROTE ${label}`);
  } catch (error) {
    counts.failed += 1;
    console.log(`ERROR ${label}: ${error.message}`);
  }
}

// A small worker pool keeps a full-year run to minutes rather than hours.
let cursor = 0;
async function worker() {
  while (cursor < jobs.length && claimed < limit) {
    const job = jobs[cursor];
    cursor += 1;
    await runJob(job);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

console.log(`\nexplanations stored: ${counts.explanations}   examples ${dryRun ? "to generate" : "generated"}: ${dryRun ? counts.wouldGenerate : counts.generated}   already stored: ${counts.skipped}   failed: ${counts.failed}`);
