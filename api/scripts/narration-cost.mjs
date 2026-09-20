// What it would cost to voice the whole curriculum with a neural TTS service.
//
// Bills are per character of text submitted, so the only number that matters is
// the size of the narration after LaTeX has been turned into words - which is
// larger than the authored text, because "$a \times 10^{n}$" becomes "a times
// ten to the power n".
//
//   node api/scripts/narration-cost.mjs
//   node api/scripts/narration-cost.mjs --rate 15 --free 500000
import { topicContent } from "../../src/data/topicContent/index.js";
import { splitSentences, toSpoken } from "../../src/speech.js";
import { curriculum } from "../../src/data/curriculumCatalog.js";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const current = process.argv[i];
  if (!current.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args.set(current.slice(2), !next || next.startsWith("--") ? "true" : next);
}
// Published Azure AI Speech rates move, so both are arguments rather than
// constants. Defaults are the standard neural pay-as-you-go tier.
const ratePerMillion = Number(args.get("rate") ?? 15);
const freeCharsPerMonth = Number(args.get("free") ?? 500000);

const titleOf = new Map(curriculum.map((topic) => [topic.id, topic]));

let characters = 0;
let beats = 0;
const perTopic = [];

for (const [id, content] of Object.entries(topicContent)) {
  const topic = titleOf.get(id);
  const lines = [
    `${topic?.title ?? id}. ${topic?.goal ?? ""}`,
    ...splitSentences(content.explanation),
    ...(content.keyIdeas ?? []),
    ...(content.formulae ?? []),
    "That is the whole topic. Try a practice question next.",
  ];
  const spoken = lines.map(toSpoken).filter(Boolean);
  const size = spoken.reduce((sum, line) => sum + line.length, 0);
  characters += size;
  beats += spoken.length;
  perTopic.push({ id, size, beats: spoken.length });
}

const topics = perTopic.length;
const money = (value) => `$${value.toFixed(2)}`;
const sorted = [...perTopic].sort((a, b) => a.size - b.size);

console.log(`narration corpus: ${topics} topics, ${beats} beats, ${characters.toLocaleString()} characters`);
console.log(`  per topic: smallest ${sorted[0].size}, median ${sorted[Math.floor(topics / 2)].size}, largest ${sorted.at(-1).size} characters`);
// About 14 characters a second at a normal reading pace.
const seconds = characters / 14;
console.log(`  roughly ${(seconds / 60).toFixed(0)} minutes of audio in total, ${(seconds / topics).toFixed(0)}s per topic average`);

const fullRun = (characters / 1_000_000) * ratePerMillion;
console.log(`\nat ${money(ratePerMillion)} per million characters`);
console.log(`  one full synthesis of every topic: ${money(fullRun)}`);
console.log(`  free tier covers ${freeCharsPerMonth.toLocaleString()} characters a month`);
if (characters <= freeCharsPerMonth) {
  console.log(`  the whole curriculum fits inside one month of the free tier, with ${(freeCharsPerMonth - characters).toLocaleString()} characters to spare`);
} else {
  const chargeable = characters - freeCharsPerMonth;
  console.log(`  chargeable after the free tier: ${chargeable.toLocaleString()} characters = ${money((chargeable / 1_000_000) * ratePerMillion)}`);
}

// The alternative is synthesising on every play, which is the same text over
// and over. This is the number that decides whether caching is worth building.
console.log(`\nif it were synthesised on every play instead of cached:`);
const averageTopic = characters / topics;
for (const lessonsPerMonth of [10, 20, 40]) {
  const perLearner = (averageTopic * lessonsPerMonth / 1_000_000) * ratePerMillion;
  console.log(`  a learner playing ${String(lessonsPerMonth).padStart(2)} lessons a month: ${money(perLearner)}/month each`
    + `  (${(perLearner / 12.5 * 100).toFixed(1)}% of a £9.99 subscription)`);
}

// Serving cached audio is a storage and egress question instead.
const kbps = 48;
const megabytes = (seconds * kbps / 8) / 1024;
console.log(`\ncached as ${kbps} kbps mono audio: ${megabytes.toFixed(0)} MB for the whole curriculum`);
console.log(`  storage at $0.02 per GB per month: ${money((megabytes / 1024) * 0.02)}/month`);
for (const learners of [100, 1000]) {
  const gb = (megabytes / topics) * 20 * learners / 1024;
  console.log(`  ${String(learners).padStart(4)} learners playing 20 lessons a month: ${gb.toFixed(1)} GB egress`
    + ` = ${money(gb * 0.08)}/month at $0.08 per GB`);
}
console.log(`\nRates are arguments, not facts: check the current Azure AI Speech pricing page before relying on these.`);
