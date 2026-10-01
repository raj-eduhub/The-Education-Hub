// Checks that every authored topic can be read aloud, and that the narrated
// lesson splits into sensible beats.
//
// Two failures this guards against, both of which reached a learner before:
//   - LaTeX punctuation surviving into the spoken text, so the voice reads
//     "dollar a backslash times ten caret open brace n close brace dollar"
//   - a sentence split inside a decimal, so "4.55 cm" is read as two fragments
//     with a pause in the middle of the number
//
// Pure functions only: no browser, no network, no storage.
//   node api/scripts/test-speech.mjs
import { topicContent } from "../../src/data/topicContent/index.js";
import { splitSentences, toSpoken } from "../../src/speech.js";
import { explanationForTier } from '../../src/data/explanationTier.js';

let failures = 0;
const fail = (label, detail) => { failures += 1; console.log(`FAIL ${label}  ${detail}`); };

const topics = Object.entries(topicContent).flatMap(([id, content]) => [
  [id, explanationForTier(content, 'Foundation')],
  ...(content.higher ? [[`${id}/Higher`, explanationForTier(content, 'Higher')]] : []),
]);
const lines = topics.flatMap(([id, content]) => [
  [id, "explanation", content.explanation],
  ...(content.keyIdeas ?? []).map((idea, index) => [id, `keyIdea ${index}`, idea]),
  ...(content.formulae ?? []).map((formula, index) => [id, `formula ${index}`, formula]),
]);

// --- nothing LaTeX survives into the spoken form ----------------------------
// A brace, a backslash or a dollar sign in the spoken text means a command was
// not converted, and the voice will read the markup out loud.
const leftovers = [];
for (const [id, where, text] of lines) {
  const spoken = toSpoken(text);
  if (/[\\${}]/.test(spoken)) leftovers.push(`${id} ${where}: ${spoken.slice(0, 90)}`);
  if (/\b(frac|sqrt|text|mathrm|le|ge|times|div)\b/.test(spoken) && /\\/.test(text)) {
    // "times" is a real word, so only flag it where it sits next to markup.
    if (/\\(frac|sqrt|text|mathrm)/.test(spoken)) leftovers.push(`${id} ${where}: unconverted command`);
  }
}
if (leftovers.length) {
  fail("LaTeX survives into the spoken text", `${leftovers.length} line(s)`);
  for (const line of leftovers.slice(0, 10)) console.log(`     ${line}`);
} else {
  console.log(`OK   ${lines.length} authored lines are all speakable, across ${topics.length} topics`);
}

// --- operators are spoken, not swallowed ------------------------------------
const operators = [
  ['$(f\\circ g)(x)$', 'composed with'], ['$45^{\\circ}$', 'degrees'],
  ['$0.\\overline{3}$', '3 recurring'],
  ['$x \\ne 0$', 'does not equal'], ['$x \\neq 0$', 'does not equal'],
  ['$\\sum x$', 'sum of'], ['$\\prod x$', 'product of'],
  ['$\\sin x$', 'sine'], ['$\\cos x$', 'cosine'], ['$\\tan x$', 'tangent'],
  ["$a - b$", "minus"], ["$a + b$", "plus"], ["$a \\times b$", "times"],
  ["$a \\div b$", "divided by"], ["$x = 5$", "equals"], ["$1 \\le a$", "less than or equal"],
  ["$10^{-3}$", "power"], ["$\\frac{u}{2}$", "over"],
  ['9 × 0.25 = 2.25', '9 times 0.25 equals 2.25'],
  ['25 °C', '25 degrees Celsius'], ['10 cm²', 'squared'],
  ['A = pi r^2', 'r squared'],
  ['T ≥ 25', 'greater than or equal'], ['A → B', 'gives'],
  ['```python\nif x == 2:\n    print(x)\n```', 'is equal to'],
];
for (const [input, expected] of operators) {
  const spoken = toSpoken(input);
  if (!spoken.includes(expected)) fail(`"${input}" should say "${expected}"`, `got "${spoken}"`);
}
if (!failures) console.log(`OK   ${operators.length} operator forms read as words`);

// --- a hyphen inside prose stays a hyphen -----------------------------------
// The minus rule runs only inside the maths delimiters, so ordinary prose must
// be untouched by it.
const prose = "A well-known, three-part method.";
if (toSpoken(prose) !== prose) fail("a hyphen in prose was changed", toSpoken(prose));
else console.log("OK   hyphens in ordinary prose are left alone");

// --- sentence splitting does not break numbers ------------------------------
let beatTotal = 0;
const broken = [];
for (const [id, content] of topics) {
  const beats = splitSentences(content.explanation);
  beatTotal += beats.length;
  if (!beats.length) broken.push(`${id}: no beats`);
  for (const beat of beats) {
    // A beat that starts with a digit or a lower-case letter is the tell-tale
    // of a split inside a number or mid-sentence.
    if (/^[0-9]/.test(beat)) broken.push(`${id}: beat starts mid-number "${beat.slice(0, 40)}"`);
    if (/^[a-z]/.test(beat) && !beat.startsWith("$")) broken.push(`${id}: beat starts mid-sentence "${beat.slice(0, 40)}"`);
  }
  // Rejoining the beats must give back the original, or content was lost.
  if (beats.join(" ").replace(/\s+/g, " ") !== content.explanation.replace(/\s+/g, " ").trim()) {
    broken.push(`${id}: beats do not rejoin to the original`);
  }
}
if (broken.length) {
  fail("sentence splitting is wrong", `${broken.length} case(s)`);
  for (const line of broken.slice(0, 10)) console.log(`     ${line}`);
} else {
  console.log(`OK   ${beatTotal} beats across ${topics.length} topics, none split inside a number, all rejoin exactly`);
}

// --- every topic makes a lesson worth playing -------------------------------
const thin = topics.filter(([, content]) =>
  splitSentences(content.explanation).length + (content.keyIdeas?.length ?? 0) < 4);
if (thin.length) fail("topics too thin to narrate", thin.map(([id]) => id).slice(0, 5).join(", "));
else {
  const perTopic = topics.map(([, c]) =>
    1 + splitSentences(c.explanation).length + (c.keyIdeas?.length ?? 0) + (c.formulae?.length ?? 0) + 1);
  const sorted = [...perTopic].sort((a, b) => a - b);
  console.log(`OK   every topic makes a lesson: ${sorted[0]}-${sorted.at(-1)} beats, median ${sorted[Math.floor(sorted.length / 2)]}`);
}

console.log(failures ? `\n${failures} speech check(s) FAILED` : "\nPASS: narration and beat splitting");
process.exit(failures ? 1 : 0);
