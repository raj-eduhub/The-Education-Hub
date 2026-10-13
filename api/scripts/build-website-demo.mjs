// Rebuilds the "Try it yourself" lessons on the website from the stored content.
//
// The website promises one real sub-topic from each subject "exactly as the
// application serves it", so the demo is taken from the same stored rows the
// content API serves - the subtopic lesson and its worked example - and the
// same recorded narration, rather than written by hand. Hand-copied text
// drifted: by October 2026 every demo still showed the topic overviews of late
// September while the app taught per subtopic from rewritten lessons.
//
// Reads local storage (Azurite) unless AZURE_STORAGE_CONNECTION_STRING says
// otherwise. Replaces the panels between the demo:start and demo:end markers in
// marketing/index.html and the clips in marketing/demo. Every clip must already
// be recorded: a beat with no audio stops the run rather than leaving a silent
// line on the website, and the fix is `npm run narration:synthesise`.
//
//   node api/scripts/build-website-demo.mjs            # write the website
//   node api/scripts/build-website-demo.mjs --check    # report only
import { readFileSync, writeFileSync, readdirSync, unlinkSync, mkdirSync } from "node:fs";
import katex from "katex";
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { lessonBeats, exampleBeats, beatSpeech } from "../../src/lessonBeats.js";
import { selectExplanation } from "../../src/data/selectExplanation.js";
import { warrantsWorkedExample } from "../../src/data/workedExampleOutcomes.js";
import { contentSegments, hasMaths } from "../../src/contentSegments.js";
import { flashcardsFor } from "../../src/flashcards.js";
import { splitSentences, toSpoken } from "../../src/speech.js";

process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
const { contentKey, getContent } = await import("../src/lib/contentStore.js");
const { getNarration, narrationKey } = await import("../src/lib/narrationStore.js");
const { variesByTier } = await import("../src/lib/contentPolicy.js");

const check = process.argv.includes("--check");
const voice = process.env.AZURE_SPEECH_VOICE ?? "en-GB-SoniaNeural";
const page = new URL("../../marketing/index.html", import.meta.url);
const audioDir = new URL("../../marketing/demo/", import.meta.url);

// One sub-topic per subject. Each has a worked example except English, whose
// Shakespeare sub-topics are learned through explanation and practice. Tiered
// topics show the tier named here, and the tab says which. Maths shows Higher
// because the stored Foundation example for "Use standard form" is an error
// interval question, which belongs to the next sub-topic (October 2026).
const demos = [
  { topicId: "y10-maths-number", index: 0, tier: "Higher" },
  { topicId: "y9-science-periodic", index: 4 },
  { topicId: "y8-english-shakespeare", index: 1 },
  { topicId: "y7-history-norman-conquest", index: 0 },
  { topicId: "y8-geography-rivers-and-coasts", index: 0 },
  { topicId: "y7-computing-binary-and-data-representation", index: 0 },
  { topicId: "y8-design-technology-motion-and-mechanisms", index: 4 },
];

const escape = (text) => String(text)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// MathML, as the page already uses: it needs no KaTeX stylesheet or fonts.
function rich(text, maths) {
  const typeset = maths || hasMaths(text);
  return contentSegments(text, typeset).map((segment) => {
    if (segment.code !== undefined) return `<code>${escape(segment.code)}</code>`;
    if (segment.math === undefined) return escape(segment.text);
    const expression = segment.math.replace(/\\{2,}(?=[a-zA-Z{])/g, "\\");
    return katex.renderToString(expression, { throwOnError: false, displayMode: false, output: "mathml" });
  }).join("");
}

const playIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
const playButton = (src, beats, label) =>
  `<button class="demo-play" data-src="${src}" data-beats="${beats.join(",")}" type="button" aria-pressed="false">\n                ${playIcon}\n                <span>${label}</span>\n              </button>`;
const panelHead = (title, button) =>
  `          <div class="demo-panel">\n            <div class="demo-head">\n              <h4>${escape(title)}</h4>\n              ${button}\n            </div>\n`;

const clips = new Map();
const problems = [];
const tabs = [];
const panels = [];

for (const [n, demo] of demos.entries()) {
  const topic = curriculum.find((entry) => entry.id === demo.topicId);
  const subtopic = topic?.outcomes[demo.index];
  if (!subtopic) throw new Error(`${demo.topicId} has no sub-topic ${demo.index}`);
  const maths = topic.subject === "Maths";
  const tiered = topic.year >= 10 && variesByTier(topic.subject);
  const tier = tiered ? demo.tier ?? "Foundation" : null;

  const stored = await getContent(contentKey("explanation", topic.id));
  if (!stored) throw new Error(`${topic.id}: no stored lesson. Seed the content first.`);
  const lesson = selectExplanation(stored, demo.index, tier);
  if (lesson.scope !== "subtopic") throw new Error(`${topic.id}: no lesson stored for "${subtopic}".`);

  let example = null;
  if (warrantsWorkedExample(topic.id, demo.index)) {
    example = await getContent(contentKey("example", topic.id, { index: demo.index, tier }));
    if (!example?.question) throw new Error(`${topic.id}: no worked example stored for "${subtopic}".`);
  }

  // Beat numbers are positions in the app's own beat lists, so each clip is
  // the one the app plays for that line.
  const lessonSrc = `l${n}`, exampleSrc = `x${n}`;
  const beats = lessonBeats(topic, lesson);
  const want = (src, beat, position) => {
    const key = narrationKey(topic.id, beatSpeech(beat, toSpoken), voice);
    clips.set(`${src}-${String(position).padStart(2, "0")}.mp3`, { key, text: beat.text });
    return position;
  };

  const prose = [], ideas = [], formulae = [];
  beats.forEach((beat, position) => {
    if (beat.kind === "prose") prose.push(want(lessonSrc, beat, position));
    if (beat.kind === "idea") ideas.push(want(lessonSrc, beat, position));
    if (beat.kind === "formula") formulae.push(want(lessonSrc, beat, position));
  });

  tabs.push(`          <button class="demo-tab" id="tab-${n}" role="tab" aria-selected="${n === 0}" aria-controls="sub-${n}" type="button">\n`
    + `            ${escape(topic.subject)}<span>Year ${topic.year}${tier ? ` ${tier}` : ""} &middot; ${escape(topic.title)}</span>\n          </button>`);

  let html = `        <div id="sub-${n}" role="tabpanel" aria-labelledby="tab-${n}"${n === 0 ? "" : " hidden"}>\n`;
  html += panelHead(`Clear explanation: ${subtopic}`, playButton(lessonSrc, [...prose, ...ideas], "Play the explanation"));
  html += `            <p class="demo-prose">\n`
    + prose.map((position) => `              <span data-beat="${lessonSrc}-${position}">${rich(beats[position].text, maths)}</span>`).join("\n")
    + `\n            </p>\n`;
  if (ideas.length) {
    html += `            <ul class="demo-ideas">\n`
      + ideas.map((position) => `              <li data-beat="${lessonSrc}-${position}">${rich(beats[position].text, maths)}</li>`).join("\n")
      + `\n            </ul>\n`;
  }
  html += `          </div>\n`;

  if (formulae.length) {
    html += panelHead("Key formulas", playButton(lessonSrc, formulae, "Play the key formulas"));
    html += formulae.map((position, i) =>
      `            <code class="demo-formula" data-beat="${lessonSrc}-${position}"${i ? ' style="margin-top:8px"' : ""}>${rich(beats[position].text, maths)}</code>`).join("\n");
    html += `\n          </div>\n`;
  }

  if (example) {
    const steps = exampleBeats(example, subtopic);
    steps.forEach((beat, position) => want(exampleSrc, beat, position));
    const at = (kind) => steps.map((beat, position) => ({ beat, position })).filter((entry) => entry.beat.kind === kind);
    const span = ({ beat, position }) => `<span data-beat="${exampleSrc}-${position}">${rich(beat.text, maths)}</span>`;

    html += panelHead(`Worked example: ${subtopic}`, playButton(exampleSrc, steps.map((_, position) => position), "Play the worked example"));
    const exampleFormulae = at("formula");
    if (exampleFormulae.length) {
      html += `            <div class="demo-ex-formulae">\n`
        + exampleFormulae.map(({ beat, position }) => `              <code class="demo-formula" data-beat="${exampleSrc}-${position}">${rich(beat.text, maths)}</code>`).join("\n")
        + `\n            </div>\n`;
    }
    html += `            <p class="demo-q"><strong>Question:</strong> ${at("question").map(span).join(" ")}</p>\n`;
    const byStep = new Map();
    for (const entry of at("step")) byStep.set(entry.beat.position, [...(byStep.get(entry.beat.position) ?? []), entry]);
    html += `            <ol class="demo-steps">\n`
      + [...byStep.values()].map((entries) => `              <li>${entries.map(span).join(" ")}</li>`).join("\n")
      + `\n            </ol>\n`;
    const answer = at("answer")[0];
    if (answer) html += `            <p class="demo-ans" data-beat="${exampleSrc}-${answer.position}"><strong>Answer:</strong> ${rich(answer.beat.text, maths)}</p>\n`;
    html += `          </div>\n`;
  }

  // The same deck the app's Flash cards mode deals for this sub-topic. Not
  // narrated: a card is for recalling in your own voice, not being read to.
  const cards = flashcardsFor(lesson, subtopic);
  if (cards.length) {
    html += panelHead(`Flash cards: ${subtopic}`, `<span class="demo-cards-note">Tap a card to turn it over</span>`);
    html += `            <div class="demo-cards">\n`
      + cards.map((card) => `              <button class="demo-card" type="button" aria-pressed="false">\n`
        + `                <span class="demo-card-label">${escape(card.label)}</span>\n`
        + `                <span class="demo-card-front">${card.cue ? rich(card.cue, maths || hasMaths(card.answer)) : escape(card.prompt)}</span>\n`
        + `                <span class="demo-card-back">${rich(card.answer, maths || hasMaths(card.answer))}</span>\n`
        + `              </button>`).join("\n")
      + `\n            </div>\n          </div>\n`;
  }
  html += `        </div>`;
  panels.push(html);

  console.log(`${topic.subject.padEnd(20)} Y${topic.year} ${topic.title} / ${subtopic}: ${prose.length} sentences, ${ideas.length} ideas, ${formulae.length} formulae${example ? `, worked example of ${exampleBeats(example, subtopic).length} beats` : ", no worked example"}, ${cards.length} flash cards`);
}

// Every clip has to exist before anything is written.
const audio = new Map();
for (const [file, clip] of clips) {
  const recorded = await getNarration(clip.key);
  if (!recorded || recorded.body.length < 100) problems.push(`${file}: not recorded - "${clip.text.slice(0, 70)}"`);
  else audio.set(file, recorded.body);
}
if (problems.length) {
  console.error(`\n${problems.length} line(s) have no recording. Run npm run narration:synthesise (with --examples for worked examples), then this again:`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

const html = readFileSync(page, "utf8");
const start = html.indexOf("<!-- demo:start -->"), end = html.indexOf("<!-- demo:end -->");
if (start < 0 || end < start) throw new Error("marketing/index.html has no demo:start / demo:end markers.");
const generated = `<!-- demo:start -->\n        <!-- Generated by api/scripts/build-website-demo.mjs from the stored lessons. Edit the content, not this. -->\n`
  + `        <div class="demo-tabs" role="tablist" aria-label="Subject">\n${tabs.join("\n")}\n        </div>\n\n${panels.join("\n")}\n        `;
const next = html.slice(0, start) + generated + html.slice(end);

if (check) {
  console.log(`\n${clips.size} clips, all recorded. The website ${next === html ? "already matches" : "is out of date"}.`);
  process.exit(0);
}

mkdirSync(audioDir, { recursive: true });
for (const file of readdirSync(audioDir)) if (/^[lx]\d+-\d+\.mp3$/.test(file)) unlinkSync(new URL(file, audioDir));
for (const [file, body] of audio) writeFileSync(new URL(file, audioDir), body);
writeFileSync(page, next);
console.log(`\nWrote ${audio.size} clips to marketing/demo and the lessons to marketing/index.html.`);
