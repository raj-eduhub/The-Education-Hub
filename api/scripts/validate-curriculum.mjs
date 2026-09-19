// Checks the curriculum catalogue and its authored content against the rules
// that a validation pass against the published specifications established.
// Runs with no storage, no model and no network, so it belongs in CI.
//
//   npm run validate:curriculum
import { curriculum, curriculumByYear } from "../../src/data/curriculumCatalog.js";
import { topicContent } from "../../src/data/topicContent/index.js";
import { supportsQuestionBank, variesByTier } from "../src/lib/contentPolicy.js";

const failures = [];
const warnings = [];
const fail = (rule, detail) => failures.push(`${rule}: ${detail}`);
const warn = (rule, detail) => warnings.push(`${rule}: ${detail}`);

// --- Catalogue structure ---------------------------------------------------
const ids = new Map();
for (const topic of curriculum) {
  if (ids.has(topic.id)) fail("duplicate topic id", topic.id);
  ids.set(topic.id, topic);
}

const titles = new Map();
for (const topic of curriculum) {
  const key = `${topic.subject}::${topic.title}`;
  if (titles.has(key)) {
    fail("duplicate title within a subject", `${key} in Years ${titles.get(key)} and ${topic.year}`);
  }
  titles.set(key, topic.year);
}

for (const topic of curriculum) {
  if (!topic.outcomes?.length) fail("topic has no outcomes", topic.id);
  if (topic.outcomes?.length < 3) warn("topic has fewer than three outcomes", topic.id);
  if (!topic.goal?.trim()) fail("topic has no goal", topic.id);
  if (!topic.unit?.trim()) fail("topic has no unit", topic.id);
  if (new Set(topic.outcomes).size !== topic.outcomes.length) fail("duplicate outcome", topic.id);
}

// --- Tiering matches the qualification -------------------------------------
// Only maths, the sciences and MFL are tiered at GCSE. Marking an untiered
// subject as Foundation/Higher splits its stored content in two for no reason.
for (const topic of curriculum.filter((entry) => entry.year >= 10)) {
  const tiered = variesByTier(topic.subject);
  if (tiered && !topic.tiers.length) fail("tiered subject with no tiers", `${topic.subject} ${topic.id}`);
  if (!tiered && topic.tiers.length) {
    fail("untiered subject carries tiers", `${topic.subject} ${topic.id} has ${topic.tiers.join("/")}`);
  }
  if (!topic.examBoards.length) fail("GCSE topic with no exam boards", topic.id);
}

// Every board a learner can choose at signup must be a board the catalogue
// declares, or that learner has no content path at all.
const offeredBoards = new Set(curriculum.flatMap((topic) => topic.examBoards));
for (const board of ["AQA", "Edexcel", "OCR"]) {
  if (!offeredBoards.has(board)) fail("board offered at signup but absent from the catalogue", board);
}

// --- Authored content ------------------------------------------------------
// The whole point of the stored-only explanation route is that this content
// exists. A missing entry silently falls back to restating the topic goal.
for (const topic of curriculum) {
  const authored = topicContent[topic.id];
  if (!authored) {
    fail("no authored content", `${topic.id} (${topic.subject} Year ${topic.year})`);
    continue;
  }
  const { explanation, keyIdeas, formulae } = authored;
  if (!explanation?.trim()) fail("authored entry has no explanation", topic.id);
  else if (explanation.trim() === topic.goal.trim()) fail("explanation only restates the goal", topic.id);
  else if (explanation.length < 200) fail("explanation too short to teach anything", `${topic.id} (${explanation.length} chars)`);
  if (!keyIdeas?.length) fail("authored entry has no key ideas", topic.id);
  else if (keyIdeas.length < 3) warn("fewer than three key ideas", topic.id);
  if (formulae && !Array.isArray(formulae)) fail("formulae is not a list", topic.id);
}

for (const id of Object.keys(topicContent)) {
  if (!ids.has(id)) fail("authored content for a topic not in the catalogue", id);
}

// --- Nothing authored above the specification ------------------------------
const aboveSpecification = [
  [/\bstandard error\b/i, "standard error"],
  [/\bconfidence interval\b/i, "confidence interval"],
  [/\b(stratified|systematic|cluster|quota)\s+sampl/i, "named sampling scheme"],
  [/\bnormal distribution\b|\bz-?score\b|\bt-?distribution\b/i, "distribution above GCSE"],
  [/\bradians\b/i, "radians"],
  // Narrow deliberately: "integrate evidence" is an essay instruction, not calculus.
  [/\bdifferentiate with respect to\b|\\frac\{dy\}\{dx\}|\\int\b|\bdefinite integral\b/i, "calculus"],
];
for (const [id, authored] of Object.entries(topicContent)) {
  const text = [authored.explanation, ...(authored.keyIdeas ?? []), ...(authored.formulae ?? [])].join("\n");
  for (const [pattern, label] of aboveSpecification) {
    if (pattern.test(text)) fail("authored content above the specification", `${id}: ${label}`);
  }
}

// --- Maths notation --------------------------------------------------------
// The typesetter only understands $...$, so anything else renders as raw LaTeX.
for (const [id, authored] of Object.entries(topicContent)) {
  const text = [authored.explanation, ...(authored.keyIdeas ?? []), ...(authored.formulae ?? [])].join("\n");
  if (/\\\(|\\\[/.test(text)) fail("uses \\( or \\[ delimiters the typesetter cannot render", id);
  const dollars = (text.match(/\$/g) ?? []).length;
  if (dollars % 2 !== 0) fail("unbalanced $ delimiters", id);
}

// --- Practical topics ------------------------------------------------------
// A topic excluded from the question bank must still be teachable, so it needs
// its explanation and worked example to carry the whole load.
for (const topic of curriculum) {
  if (supportsQuestionBank(topic.id)) continue;
  const authored = topicContent[topic.id];
  if (!authored?.explanation) fail("practical topic with no authored explanation", topic.id);
}

// --- Report ----------------------------------------------------------------
const yearCounts = Object.entries(curriculumByYear)
  .map(([year, plan]) => `Y${year}: ${Object.values(plan.subjects).flat().length}`)
  .join("  ");
console.log(`curriculum: ${curriculum.length} topics  (${yearCounts})`);
console.log(`authored content: ${Object.keys(topicContent).length} entries`);

for (const warning of warnings) console.log(`WARN  ${warning}`);
for (const failure of failures) console.log(`FAIL  ${failure}`);

console.log(
  failures.length
    ? `\n${failures.length} curriculum check(s) FAILED`
    : `\nPASS: structure, tiering, board coverage, authored content for every topic, nothing above the specification${warnings.length ? `, ${warnings.length} warning(s)` : ""}`
);
process.exit(failures.length ? 1 : 0);
