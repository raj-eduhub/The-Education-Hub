// Checks that every sub-topic lesson makes a usable flash card deck.
//
// The cards are cut from authored lines, so the failures to guard against are
// in the cutting: a cue split inside $...$ or `...` renders a stray dollar or
// swallows the rest of the card, and a cue that already holds the whole answer
// leaves nothing to recall.
//
// Pure functions only: no browser, no network, no storage.
//   node api/scripts/test-flashcards.mjs
import { subtopicLessons } from "../../src/data/subtopicLessons.js";
import { flashcardsFor, formulaCue, ideaCue } from "../../src/flashcards.js";

let failures = 0;
const fail = (label, detail) => { failures += 1; console.log(`FAIL ${label}  ${detail}`); };
const balanced = (text) => (text.match(/\$/g) ?? []).length % 2 === 0 && (text.match(/`/g) ?? []).length % 2 === 0;

// --- known cuts ---------------------------------------------------------------
const cases = [
  [formulaCue("$\sin \theta = \frac{\text{opposite}}{\text{hypotenuse}}$"), "$\sin \theta = ?$"],
  [formulaCue("Gradient $= \frac{\Delta y}{\Delta x}$"), "Gradient = ?"],
  [formulaCue("(a/b) × (c/d) = (ac)/(bd)"), "(a/b) × (c/d) = ?"],
  [formulaCue("Acceptance: L <= M <= U"), null],
  [formulaCue("`count == 3`"), null],
  [formulaCue("`total = total + 1`"), "`total = ?`"],
  [ideaCue("Factor trees break numbers into primes."), "Factor trees …"],
  [ideaCue("Short"), null],
];
for (const [got, want] of cases) if (got !== want) fail("cue", `expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`);

// --- every lesson -------------------------------------------------------------
let lessons = 0, cards = 0;
for (const [topicId, list] of Object.entries(subtopicLessons)) {
  list.forEach((lesson, index) => {
    if (!lesson) return;
    for (const variant of [lesson, ...(lesson.higher ? [{ ...lesson, ...lesson.higher }] : [])]) {
      lessons += 1;
      const deck = flashcardsFor(variant, variant.title);
      const where = `${topicId}[${index}]`;
      if (!deck.length) fail(where, "no cards");
      if (new Set(deck.map((card) => card.id)).size !== deck.length) fail(where, "duplicate card ids");
      for (const card of deck) {
        cards += 1;
        if (!card.answer) fail(where, `${card.id} has no answer`);
        if (!card.cue) continue;
        if (!balanced(card.cue)) fail(where, `${card.id} cue leaves a delimiter open: ${card.cue}`);
        if (card.cue.replace(/ …$/, "") === card.answer) fail(where, `${card.id} cue is the whole answer`);
      }
    }
  });
}

console.log(`${lessons} lessons, ${cards} cards.`);
if (failures) {
  console.log(`${failures} flash card check(s) failed.`);
  process.exit(1);
}
console.log("Flash cards: all checks passed.");
