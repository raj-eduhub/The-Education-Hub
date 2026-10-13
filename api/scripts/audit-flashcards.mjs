// Checks that every sub-topic in the catalogue deals a flash card deck from the
// lesson the app is actually served.
//
// The app builds its deck in the browser from the stored explanation row, as
// selected for the sub-topic and tier by the content API. test-flashcards.mjs
// checks the authored source; this checks the rows in storage, every year,
// every subject, and both tiers where the lesson differs by tier, so a topic
// whose stored row is missing, stale or overview-only is caught before a
// learner opens Flash cards on it and finds no cards.
//
// Reads local storage (Azurite) unless AZURE_STORAGE_CONNECTION_STRING says
// otherwise.
//   node api/scripts/audit-flashcards.mjs
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { selectExplanation } from "../../src/data/selectExplanation.js";
import { flashcardsFor } from "../../src/flashcards.js";

process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
const { contentKey, getContent } = await import("../src/lib/contentStore.js");
const { variesByTier } = await import("../src/lib/contentPolicy.js");

const balanced = (text) => (text.match(/\$/g) ?? []).length % 2 === 0 && (text.match(/`/g) ?? []).length % 2 === 0;
const problems = [];
const counts = new Map();
let decks = 0, cards = 0;

for (const topic of curriculum) {
  const stored = await getContent(contentKey("explanation", topic.id));
  if (!stored) {
    problems.push(`${topic.id}: no stored lesson row`);
    continue;
  }
  const tiers = topic.year >= 10 && variesByTier(topic.subject) ? ["Foundation", "Higher"] : [null];
  topic.outcomes.forEach((outcome, index) => {
    for (const tier of tiers) {
      const where = `${topic.id}[${index}]${tier ? ` ${tier}` : ""} "${outcome}"`;
      const lesson = selectExplanation(stored, index, tier);
      if (lesson.scope !== "subtopic") problems.push(`${where}: no sub-topic lesson stored, so the deck would come from the topic overview`);
      else if (lesson.subtopicTitle !== outcome) problems.push(`${where}: stored lesson is for "${lesson.subtopicTitle}"`);
      const deck = flashcardsFor(lesson, outcome);
      if (!deck.length) problems.push(`${where}: no cards`);
      for (const card of deck) {
        if (!card.answer) problems.push(`${where}: ${card.id} has no answer`);
        if (card.cue && !balanced(card.cue)) problems.push(`${where}: ${card.id} cue leaves a delimiter open: ${card.cue}`);
      }
      decks += 1;
      cards += deck.length;
      const row = `Year ${topic.year} ${topic.subject}`;
      const tally = counts.get(row) ?? { topics: new Set(), decks: 0, cards: 0 };
      tally.topics.add(topic.id);
      tally.decks += 1;
      tally.cards += deck.length;
      counts.set(row, tally);
    }
  });
}

for (const [row, tally] of [...counts].sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))) {
  console.log(`${row.padEnd(34)} ${String(tally.topics.size).padStart(3)} topics ${String(tally.decks).padStart(4)} decks ${String(tally.cards).padStart(5)} cards`);
}
console.log(`\n${curriculum.length} topics, ${decks} decks, ${cards} cards.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  ${problem}`);
  process.exit(1);
}
console.log("Flash cards: every sub-topic in every year and subject has a deck from its own stored lesson.");
