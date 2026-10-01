// Checks the curriculum catalogue and its authored content against the rules
// that a validation pass against the published specifications established.
// Runs with no storage, no model and no network, so it belongs in CI.
//
//   npm run validate:curriculum
import { readFileSync } from "node:fs";
import { curriculum, curriculumByYear, examBoards, qualifications } from "../../src/data/curriculumCatalog.js";
import { topicContent } from "../../src/data/topicContent/index.js";
import { authoredWorkedExamples } from "../../src/data/authoredWorkedExamples.js";
import { supportsQuestionBank, variesByTier, warrantsWorkedExample } from "../src/lib/contentPolicy.js";
import { classifiedOutcomes } from "../../src/data/workedExampleOutcomes.js";

const failures = [];
const warnings = [];
const fail = (rule, detail) => failures.push(`${rule}: ${detail}`);
const warn = (rule, detail) => warnings.push(`${rule}: ${detail}`);

// --- Catalogue structure ---------------------------------------------------
const ids = new Map();
for (const topic of curriculum) {
  const classification = classifiedOutcomes(topic.id);
  if (!classification) fail("missing example/formula classification", topic.id);
  else for (const kind of ["examples", "formulae"]) {
    const positions = classification[kind];
    if (!Array.isArray(positions) || new Set(positions).size !== positions.length
      || positions.some(i => !Number.isInteger(i) || i < 0 || i >= topic.outcomes.length)) {
      fail("invalid example/formula classification", `${topic.id} ${kind}`);
    }
  }
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
  // Three was the shape every topic was written to, not a number any
  // specification produces. A GCSE topic covers more ground than three lines,
  // and the sub-topic cards and the worked-example slots are both built from
  // this list, so a templated outcome list caps the depth of the whole topic.
  if (topic.outcomes?.length < 3) fail("topic has fewer than three outcomes", topic.id);
  if (topic.year >= 10 && topic.outcomes?.length < 5) {
    warn("GCSE topic still on the templated three outcomes", `${topic.id} has ${topic.outcomes.length}`);
  }
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

// --- Boards -----------------------------------------------------------------
// A board has to be agreed on by four layers that cannot import from each
// other: the catalogue, the API's onboarding validation, the storage key, and
// the row-key grammar the content route accepts. When they disagreed, OCR was
// selectable on the profile screen and accepted by the API while having no
// content and no signup path, so an OCR learner reached an empty product.
const offered = [...examBoards];

// A board is chosen from Year 9, and contentKey() carries the board into the
// row key from Year 9 too. A Year 9 topic with no boards means the catalogue
// claims a single shared bank while the API writes one bank per board.
for (const topic of curriculum.filter((entry) => entry.year >= 9)) {
  if (!topic.examBoards.length) {
    fail("board is keyed from Year 9 but the topic declares none", `${topic.id} (Year ${topic.year})`);
  }
  for (const board of topic.examBoards) {
    if (!offered.includes(board)) fail("topic declares a board that is not offered", `${topic.id} declares ${board}`);
  }
}

// Years 7 and 8 are before a board is chosen, so declaring one there would key
// content by a board the learner has not been asked for yet.
for (const topic of curriculum.filter((entry) => entry.year < 9)) {
  if (topic.examBoards.length) {
    fail("board declared before Year 9", `${topic.id} declares ${topic.examBoards.join("/")}`);
  }
}

// The API repeats the board list because only api/ is deployed. This is the
// check that keeps the copy honest.
const apiBoards = readFileSync(new URL("../src/lib/learnerDetails.js", import.meta.url), "utf8")
  .match(/const boards = \[([^\]]*)\]/)?.[1]
  ?.match(/"([^"]+)"/g)?.map((value) => value.replaceAll('"', "")) ?? [];
if (apiBoards.join(",") !== offered.join(",")) {
  fail("the API board list does not match the catalogue", `api=[${apiBoards}] catalogue=[${offered}]`);
}

// The content route only accepts row keys it can itself produce, so its
// grammar has to name exactly the offered boards.
const routeGrammar = readFileSync(new URL("../src/functions/content.js", import.meta.url), "utf8");
for (const board of offered) {
  if (!routeGrammar.includes(`${board}|`) && !routeGrammar.includes(`|${board}`)) {
    fail("offered board missing from the content row-key grammar", board);
  }
}

// Every qualification code must name the offered boards and no others, so the
// catalogue cannot advertise a syllabus for a board the product does not sell.
for (const [subject, codes] of Object.entries(qualifications)) {
  const listed = Object.keys(codes).sort();
  if (listed.join(",") !== [...offered].sort().join(",")) {
    fail("qualification codes do not match the offered boards", `${subject}: ${listed.join("/")}`);
  }
}


// --- Nothing above the tier -------------------------------------------------
// AQA 8300 marks some content "Higher content only". A Foundation learner
// cannot be assessed on it, so a topic visible at Foundation must not claim it
// as an outcome: the question bank is seeded per tier from these outcomes, and
// a Foundation paper would be set on material the learner has never been
// taught. Each phrase below was checked against the published subject content.
const higherOnly = [
  [/quadratic formula/i, "A18 quadratic formula"],
  [/completing the square|complete the square/i, "A18 completing the square"],
  [/algebraic fraction/i, "A4 algebraic fractions"],
  [/simultaneous equations? with a quadratic|linear\/quadratic/i, "A19 linear-quadratic simultaneous"],
  [/quadratic sequence/i, "A25 quadratic sequences"],
  [/circle theorem/i, "G10 circle theorems"],
  [/sine rule|cosine rule|ab ?sin ?c|half ab sin/i, "G22/G23 sine and cosine rules"],
  [/vectors? to (construct|prove)|geometric (arguments|proofs)/i, "G25 vector proofs"],
  [/construct.*equations?.*inverse proportion/i, "R13 constructing inverse-proportion equations"],
  [/general iterative processes/i, "R16 general iterative processes"],
  [/rationalise/i, "N8 rationalising a denominator"],
  [/conditional probability/i, "P9 conditional probability"],
  [/histogram/i, "S3 histograms with unequal widths"],
  [/cumulative frequency|box plot|interquartile range/i, "S3 cumulative frequency"],
  [/negative scale factor|fractional or negative/i, "G7 negative scale factors"],
  [/(area|volume) scale factor|(area|volume) ratio|area and volume scale/i, "G19 areas and volumes of similar shapes"],
  [/composite (of two )?functions?|composite of|inverse of a function/i, "A7 composite and inverse functions"],
  [/equation of a circle|tangent to a circle/i, "A16 equation of a circle and its tangent"],
  [/exponential graph|graphs of sine/i, "A12 exponential and trigonometric graphs"],
  [/gradient of a curve|area under a (graph|curve)/i, "A15 gradients and areas under graphs"],
];

for (const topic of curriculum.filter((entry) => entry.subject === "Maths" && entry.tiers.includes("Foundation"))) {
  for (const outcome of topic.outcomes) {
    for (const [pattern, label] of higherOnly) {
      if (pattern.test(outcome)) {
        fail("Higher-only content in a Foundation topic", `${topic.id}: "${outcome}" is ${label}`);
      }
    }
  }
}


// Combined Science: Trilogy is tiered too, and marks content HT only in the
// same way. Verified against the 8464 subject content.
const scienceHigherOnly = [
  [/\bmoles?\b/i, "4.3.2 moles (HT only in Combined Science)"],
  [/limiting reactant/i, "4.3.2.4 limiting reactants (HT only)"],
  [/concentration of solutions/i, "4.3.2.5 concentration of solutions (HT only)"],
  [/le chatelier/i, "4.6.2.5 Le Chatelier's principle (HT only)"],
  [/equilibrium (changes|position)|predict equilibrium/i, "4.6.2 effect of conditions on equilibrium (HT only)"],
  [/half equation/i, "4.4.3 half equations (HT only)"],
  [/tangent to (the |a )?curve/i, "4.6.1.2 rate from a tangent (HT only)"],
  [/avogadro/i, "Avogadro's constant (HT only)"],
  [/in terms of electrons/i, "oxidation and reduction in terms of electrons (HT only)"],
  [/\bmomentum\b/i, "momentum (HT only)"],
  [/fleming|F ?= ?BIl|flux density|force on a current-carrying wire/i, "Fleming's rule and F = BIl (HT only)"],
  [/wave ?fronts?/i, "refraction by wave fronts (HT only)"],
];

// Content that is not in Combined Science at all: it belongs to the separate
// Chemistry, Biology and Physics GCSEs. A Combined learner would be taught
// something their paper cannot ask about.
const notInCombinedScience = [
  [/atom economy/i, "atom economy is separate Chemistry (8462) only"],
  [/percentage yield/i, "percentage yield is separate Chemistry (8462) only"],
  [/kidney|osmoregulation|\bADH\b/i, "the kidney is separate Biology (8461) only"],
  [/structure of the (brain|eye)|the human eye\b/i, "the brain and the eye are separate Biology (8461) only"],
  [/electromagnetic induction|generator effect|transformers?\b/i,
    "induced potential and transformers are separate Physics (8463) only"],
  [/\bfission\b|\bfusion\b/i, "nuclear fission and fusion are separate Physics (8463) only"],
  [/radiation uses|uses of (nuclear )?radiation/i, "the uses of radiation are separate Physics (8463) only"],
];

for (const topic of curriculum.filter((entry) => entry.subject === "Science" && entry.year >= 10)) {
  for (const outcome of topic.outcomes) {
    if (topic.tiers.includes("Foundation")) {
      for (const [pattern, label] of scienceHigherOnly) {
        if (pattern.test(outcome)) {
          fail("Higher-only content in a Foundation topic", `${topic.id}: "${outcome}" is ${label}`);
        }
      }
    }
    for (const [pattern, label] of notInCombinedScience) {
      if (pattern.test(outcome)) fail("content outside Combined Science", `${topic.id}: "${outcome}" - ${label}`);
    }
  }
}

// The outcome check above never read the teaching text, and that is where
// separate-science content had survived: the Quantitative Chemistry explanation
// taught percentage yield and atom economy, and the forces topic taught
// induction. Transformers are left out here because Combined Science names them
// in the National Grid (6.2.4.3), and that explanation rightly mentions them.
const notInCombinedTeaching = [
  [/atom economy|percentage yield/i, "separate Chemistry (8462) only"],
  [/\bfission\b|\bfusion\b/i, "separate Physics (8463) only"],
  [/electromagnetic induction|generator effect|induces? a potential/i, "separate Physics (8463) only"],
  [/\bkidney|osmoregulation/i, "separate Biology (8461) only"],
];
for (const topic of curriculum.filter((entry) => entry.subject === "Science" && entry.year >= 10)) {
  const authored = topicContent[topic.id];
  if (!authored) continue;
  const text = [authored.explanation, ...(authored.keyIdeas ?? []), ...(authored.formulae ?? [])].join("\n");
  for (const [pattern, label] of notInCombinedTeaching) {
    if (pattern.test(text)) fail("authored content outside Combined Science", `${topic.id}: ${label}`);
  }
}

// --- Required content is taught somewhere -----------------------------------
// The rules above stop content that should not be there; this stops content
// that should be. Each entry is a statement a coverage audit found taught
// nowhere, and it must stay in some topic's outcomes, for the tier named, in
// the years named. Searching the explanation is not enough: an outcome is what
// becomes a sub-topic card, a worked example and a question-bank target.
const requiredContent = [
  // Maths (DfE GCSE subject content). Higher-only content must reach Higher.
  ["Maths", "Higher", /exponential/i, "A12 exponential graphs"],
  ["Maths", "Higher", /graphs of sine/i, "A12 trigonometric graphs"],
  ["Maths", "Higher", /equation of a circle/i, "A16 equation of a circle"],
  ["Maths", "Higher", /tangent to a circle/i, "A16 tangent to a circle"],
  ["Maths", "Higher", /gradient of a curve/i, "A15 gradient at a point"],
  ["Maths", "Higher", /area under a graph/i, "A15 area under a graph"],
  ["Maths", "Higher", /composite of two functions/i, "A7 composite functions"],
  ["Maths", "Higher", /inverse of a function/i, "A7 inverse functions"],
  ["Maths", "Higher", /(area|volume) scale factor|area and volume scale/i, "G19 similar areas and volumes"],
  ["Maths", "Higher", /negative scale factor|fractional or negative/i, "G7 negative enlargement"],
  ["Maths", "Foundation", /fractional scale factor/i, "G7 fractional enlargement"],
  ["Maths", "Foundation", /time series/i, "S2 time series"],
  ["Maths", "Higher", /time series/i, "S2 time series"],
  ["Maths", "Foundation", /product rule/i, "N5 product rule for counting"],
  ["Maths", "Higher", /product rule/i, "N5 product rule for counting"],
  ["Maths", "Foundation", /best buys?|unit prices?/i, "best buys"],
  // Combined Science: Trilogy (8464).
  ["Science", "Foundation", /stem cells?/i, "stem cells"],
  ["Science", "Foundation", /xylem|phloem/i, "plant tissues"],
  ["Science", "Foundation", /transpiration/i, "transpiration"],
  ["Science", "Foundation", /metabolism/i, "metabolism"],
  ["Science", "Foundation", /linnaean|three-domain/i, "classification"],
  ["Science", "Foundation", /isotopes?/i, "isotopes"],
  ["Science", "Foundation", /I-V characteristic/i, "I-V characteristics (required practical)"],
  ["Science", "Foundation", /work done/i, "work done"],
  ["Science", "Foundation", /hooke/i, "forces and elasticity (required practical)"],
  ["Science", "Foundation", /contamination/i, "contamination and irradiation"],
  ["Science", "Higher", /\bmoles?\b/i, "moles (HT)"],
  ["Science", "Higher", /limiting reactant/i, "limiting reactants (HT)"],
  ["Science", "Higher", /le chatelier/i, "Le Chatelier's principle (HT)"],
  ["Science", "Higher", /half equation/i, "half equations (HT)"],
  ["Science", "Higher", /\bmomentum\b/i, "momentum (HT)"],
  ["Science", "Higher", /force on a current-carrying wire/i, "the force on a current-carrying wire, F = BIl (HT)"],
  // Untiered subjects.
  ["Computing", null, /random numbers?/i, "random number generation"],
  ["Computing", null, /units of data|bits to terabytes/i, "units of information"],
  ["Geography", null, /UK economy/i, "the changing UK economy"],
  ["Design & Technology", null, /papers and boards/i, "papers and boards"],
  ["Design & Technology", null, /one-off, batch/i, "scales of production"],
];
for (const [subject, tier, pattern, label] of requiredContent) {
  const taught = curriculum.some((topic) => topic.subject === subject && topic.year >= 10
    && (!tier || topic.tiers.includes(tier)) && topic.outcomes.some((outcome) => pattern.test(outcome)));
  if (!taught) fail("required content taught nowhere", `${subject}${tier ? ` ${tier}` : ""}: ${label}`);
}

// Two outcomes that say nearly the same thing waste a sub-topic card and a
// worked-example slot on ground already covered. Compared on stemmed
// significant words: whole-word comparison missed "index"/"indices",
// "quadratic"/"quadratics" and "justified"/"justify", which is most of them.
const irregular = { indices: "index", analyses: "analysis", data: "datum" };
const stem = (word) => irregular[word]
  ?? (word.length > 4 ? word.replace(/(ations|ising|ised|ation|ally|ing|ies|ied|ive|ion|als|es|ed|ly|s)$/, "") : word);
const significant = (outcome) => new Set(
  outcome.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/)
    .filter((word) => word.length > 3 && !["with", "from", "that", "this", "their", "using", "into", "appropriate", "suitable"].includes(word))
    .map(stem)
);
for (const topic of curriculum) {
  for (let left = 0; left < topic.outcomes.length; left += 1) {
    for (let right = left + 1; right < topic.outcomes.length; right += 1) {
      const a = significant(topic.outcomes[left]);
      const b = significant(topic.outcomes[right]);
      if (!a.size || !b.size) continue;
      const shared = [...a].filter((word) => b.has(word)).length;
      // One outcome's significant words entirely contained in the other's, or a
      // heavy overlap either way, means the same ground twice.
      const subset = shared >= 2 && (shared === a.size || shared === b.size);
      if (subset || shared >= 3) {
        warn("near-duplicate outcomes", `${topic.id}: "${topic.outcomes[left]}" / "${topic.outcomes[right]}"`);
      }
    }
  }
}

// Key stage 3 is set by the DfE programmes of study, not an exam board, and it
// is easy to drift GCSE content down into Year 7 because it looks related.
// Each of these was checked against the published programme of study.
const aboveKeyStage3 = [
  [/midpoint of a (line )?segment/i, "midpoints are KS4 geometry"],
  [/file size from|calculate .*file size/i, "file size calculation is GCSE 8525 3.3"],
  [/atom economy|percentage yield/i, "GCSE chemistry, not KS3"],
  [/quadratic formula|completing the square/i, "GCSE algebra, not KS3"],
  [/circle theorem|sine rule|cosine rule/i, "GCSE geometry, not KS3"],
  [/moles?\b/i, "moles are GCSE chemistry"],
  [/compound interest/i, "KS3 names simple interest only; compound interest is KS4"],
  [/normalis/i, "database normalisation is GCSE 8525 3.7"],
  [/electromagnetic spectrum/i, "the EM spectrum is GCSE physics"],
];
for (const topic of curriculum.filter((entry) => entry.year <= 9)) {
  for (const outcome of topic.outcomes) {
    for (const [pattern, label] of aboveKeyStage3) {
      if (pattern.test(outcome)) fail("content above key stage 3", `${topic.id}: "${outcome}" - ${label}`);
    }
  }
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

// --- Authored worked examples ------------------------------------------------
// Keyed by outcome position, like the stored rows, so an outcome that moved or
// was reclassified would silently seed a worked example against the wrong
// sub-topic, or one the classification says should have none.
for (const [key, entry] of Object.entries(authoredWorkedExamples)) {
  const [id, position] = key.split("#");
  const topic = ids.get(id);
  const index = Number(position);
  if (!topic || !Number.isInteger(index) || index >= topic.outcomes.length) {
    fail("authored worked example for no outcome", key);
    continue;
  }
  if (!warrantsWorkedExample(id, index)) fail("authored worked example for an outcome classified as needing none", key);
  const byTier = Boolean(entry.Foundation || entry.Higher);
  if (byTier) {
    for (const tier of topic.tiers) if (!entry[tier]) fail("authored worked example missing a tier the topic offers", `${key} ${tier}`);
    if (!topic.tiers.length) fail("tiered authored worked example on an untiered topic", key);
  }
  for (const example of byTier ? Object.values(entry) : [entry]) {
    if (!example.question || !example.steps?.length || !example.answer) fail("authored worked example incomplete", key);
    const text = [example.question, ...(example.steps ?? []), example.answer, ...(example.formulae ?? [])].join("\n");
    if ((text.match(/\$/g) ?? []).length % 2 !== 0) fail("authored worked example has unbalanced $", key);
  }
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
    : `\nPASS: catalogue structure, configured tier/scope checks, board metadata and authored-content presence${warnings.length ? `, ${warnings.length} warning(s)` : ""}. This is not full specification sign-off.`
);
process.exit(failures.length ? 1 : 0);
