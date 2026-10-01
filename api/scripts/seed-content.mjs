// Seeds curriculum content into Table Storage so the running app serves stored
// content and calls the model only for what has not been authored yet.
//
//   node api/scripts/seed-content.mjs --year 10 --subject Maths --tier Higher
//   node api/scripts/seed-content.mjs --explanations-only
//   node api/scripts/seed-content.mjs --year 7 --dry-run --concurrency 4
import { readFileSync } from "node:fs";
import { curriculumByYear } from "../../src/data/curriculumCatalog.js";
import { getAuthoredExample, getTopicGuide } from "../../src/topicGuides.js";
import { callFoundry, deployment } from "../src/lib/foundry.js";
import { contentKey, getContent, saveContent } from "../src/lib/contentStore.js";
import { allowsFormulae, contentTypes, mayUseModel, routeFor, supportsQuestionBank, usesMathsNotation, variesByBoard, variesByTier, warrantsWorkedExample } from "../src/lib/contentPolicy.js";
import { parseQuestion, questionPrompt } from "../src/lib/questionBank.js";
import { exampleSystemPrompt, parseWorkedExample, workedExamplePrompt } from "../src/lib/workedExample.js";
import { getEditorialContent } from '../src/lib/editorialContent.js';

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
// Raised from 8: the deployment tolerates more, and callFoundry now backs off
// and retries rather than losing a row when it does not.
const concurrency = Math.max(1, Math.min(16, Number(args.get("concurrency") ?? 4)));
const dryRun = args.get("dry-run") === "true";
const explanationsOnly = args.get("explanations-only") === "true";
// example | practice | exam. Question banks are seeded per board and per tier.
const contentType = args.get("type") ?? contentTypes.EXAMPLE;
const perTopic = Math.max(1, Math.min(20, Number(args.get("per-topic") ?? 10)));
const boards = (args.get("board") ?? "AQA,Edexcel").split(",").map((b) => b.trim()).filter(Boolean);
if (![contentTypes.EXAMPLE, contentTypes.PRACTICE, contentTypes.EXAM].includes(contentType)) {
  throw new Error(`--type must be example, practice, or exam. Received: ${contentType}`);
}

const counts = { explanations: 0, authored: 0, skipped: 0, generated: 0, failed: 0, wouldGenerate: 0, notWarranted: 0, otherTier: 0 };
let claimed = 0;
const jobs = [];

for (const year of years) {
  const entry = curriculumByYear[year];
  if (!entry) throw new Error(`Year ${year} is not in the catalogue.`);
  // Untiered subjects store one copy, not one per tier.
  //
  // A tiered topic is seeded only for the tiers it actually offers. Year 11
  // maths splits into Foundation-only and Higher-only topics, and seeding a
  // Foundation-only topic with --tier Higher filed its content under a tier no
  // learner on that topic ever asks for: 34 worked examples were stored where
  // nothing could reach them, and the learner got a miss and a fresh
  // generation instead. undefined means "not this run's tier", and the topic
  // is left for the run that matches it.
  const tierFor = (topic) => {
    if (!(year >= 10 && variesByTier(topic.subject))) return null;
    const offered = topic.tiers?.length ? topic.tiers : ["Foundation", "Higher"];
    return offered.includes(tier) ? tier : undefined;
  };
  for (const [subject, topics] of Object.entries(entry.subjects)) {
    if (onlySubject && subject !== onlySubject) continue;
    for (const topic of topics) {
      // Explanations are authored curriculum text. They are written every run
      // rather than only on a miss, so an edit to the authored content reaches
      // storage; saveContent keeps the review decision when the text is
      // unchanged and returns the row to pending when it is not.
      const explanationKey = contentKey(contentTypes.EXPLANATION, topic.id);
      if (explanationKey) {
        const guide = getTopicGuide(subject, topic);
        if (!dryRun) {
          await saveContent(explanationKey, { explanation: guide.explanation, keyIdeas: guide.keyIdeas, formulae: guide.formulae, ...(guide.higher ? {higher: guide.higher} : {}), ...(guide.subtopics ? {subtopics: guide.subtopics} : {}) }, {
            type: contentTypes.EXPLANATION, subject, year, topicTitle: topic.title, origin: "catalogue",
          });
        }
        counts.explanations += 1;
      }
      if (explanationsOnly) continue;
      const variantTier = tierFor(topic);
      if (variantTier === undefined) { counts.otherTier += 1; continue; }
      if (contentType === contentTypes.EXAMPLE) {
        for (const [index, outcome] of topic.outcomes.entries()) {
          // An outcome with no method to show gets no example. Skipped here
          // rather than generated and discarded, because generating it is the
          // cost, and because a run that regenerates them undoes the pruning.
          if (!warrantsWorkedExample(topic.id, index)) { counts.notWarranted += 1; continue; }
          jobs.push({ year, subject, topic, index, outcome, variantTier, board: null });
        }
        continue;
      }
      // Practical topics are taught through explanation and worked example; a
      // typed question cannot set or mark a ruler-and-compass construction.
      if (!supportsQuestionBank(topic.id)) continue;
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
  const label = `Year ${year} ${subject} / ${topic.title} / ${board ?? "core"} / ${contentType} ${index + 1}`;
  const editorial = getEditorialContent(key);
  if (editorial) {
    if (dryRun) { console.log(`WOULD STORE EDITORIAL ${label}`); return; }
    await saveContent(key, editorial, {
      type: contentType, subject, year, topicTitle: topic.title, subtopicTitle: outcome, origin: 'editorial',
    });
    counts.authored += 1;
    console.log(`WROTE ${label} (editorial correction, no model call)`);
    return;
  }

  // An authored worked example is stored as it is. It costs no tokens, it is
  // already correct, and until now these sat unused in the codebase while the
  // model was paid to write replacements for them. Checked before --limit,
  // because that budget exists to cap model calls.
  if (contentType === contentTypes.EXAMPLE) {
    const authored = getAuthoredExample(subject, topic, index, variantTier);
    if (authored) {
      if (dryRun) { console.log(`WOULD STORE AUTHORED ${label}`); return; }
      await saveContent(key, { ...authored, notation: usesMathsNotation(subject) }, {
        type: contentType, subject, year, topicTitle: topic.title, subtopicTitle: outcome,
        origin: "catalogue",
      });
      counts.authored += 1;
      console.log(`WROTE ${label} (authored, no model call)`);
      return;
    }
  }

  // Claimed before the await so concurrent workers cannot overshoot --limit.
  if (claimed >= limit) return;
  claimed += 1;

  if (dryRun) { counts.wouldGenerate += 1; console.log(`WOULD ${label}`); return; }
  try {
    const notation = usesMathsNotation(subject);
    // Whether this sub-topic may carry a formula is decided per outcome rather
    // than per subject. Three argued outcomes genuinely have one, and the
    // blanket rule left them with no worked example at all.
    const formulaeAllowed = contentType === contentTypes.EXAMPLE
      ? allowsFormulae(subject, topic.id, index)
      : null;
    const userPrompt = contentType === contentTypes.EXAMPLE
      ? workedExamplePrompt(topic, { title: outcome, index }, { notation })
      : questionPrompt(contentType, topic, { title: outcome, index }, { board, tier: variantTier, year, notation, index });
    const answer = await callFoundry({
      model: deployment,
      input: [
        { role: "system", content: exampleSystemPrompt(year <= 9 ? "KS3" : "KS4", year, board, variantTier, subject, formulaeAllowed) },
        { role: "user", content: userPrompt },
      ],
    });
    const parsed = contentType === contentTypes.EXAMPLE ? parseWorkedExample(answer, subject, formulaeAllowed) : parseQuestion(contentType, answer);
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
  // The loop does not stop at --limit, because authored content is stored with
  // no model call and must still be reached. runJob applies the budget to the
  // jobs that would actually call the model.
  while (cursor < jobs.length) {
    const job = jobs[cursor];
    cursor += 1;
    await runJob(job);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

console.log(`\nexplanations stored: ${counts.explanations}   authored examples stored: ${counts.authored}   ${dryRun ? "to generate" : "generated"}: ${dryRun ? counts.wouldGenerate : counts.generated}   already stored: ${counts.skipped}   failed: ${counts.failed}`);
if (counts.notWarranted) {
  console.log(`${counts.notWarranted} outcome(s) skipped: no method to work through, so no worked example. See src/data/workedExampleOutcomes.js.`);
}
if (counts.otherTier) {
  console.log(`${counts.otherTier} topic(s) skipped: they are not offered at the ${tier} tier. Run again with the other tier to cover them.`);
}
