// Voices the curriculum once, so every learner hears the same neural voice
// instead of whatever their device happens to have installed.
//
//   node api/scripts/synthesise-narration.mjs --dry-run
//   node api/scripts/synthesise-narration.mjs --topic y10-maths-number
//   node api/scripts/synthesise-narration.mjs --year 10 --subject Maths
//   node api/scripts/synthesise-narration.mjs                 (everything)
//
// Beats already stored are skipped, so a re-run after editing one sentence
// synthesises that sentence and nothing else. The whole curriculum is around
// 209,000 characters; run narration-cost.mjs for what that costs today.
import { readFileSync } from "node:fs";
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { getTopicGuide } from "../../src/topicGuides.js";
import { beatSpeech, lessonBeats } from "../../src/lessonBeats.js";
import { toSpoken } from "../../src/speech.js";
import { contentKey, getContent } from "../src/lib/contentStore.js";
import { hasNarration, narrationKey, saveNarration } from "../src/lib/narrationStore.js";

if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    // A deployed run relies on real environment settings instead.
  }
}

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const current = process.argv[i];
  if (!current.startsWith("--")) continue;
  const next = process.argv[i + 1];
  args.set(current.slice(2), !next || next.startsWith("--") ? "true" : next);
}

const dryRun = args.has("dry-run");
const force = args.has("force");
const onlyTopic = args.get("topic");
const onlyYear = args.has("year") ? Number(args.get("year")) : null;
const onlySubject = args.get("subject");
const limit = Number(args.get("limit") ?? Infinity);
const concurrency = Math.max(1, Math.min(8, Number(args.get("concurrency") ?? 4)));

const region = process.env.AZURE_SPEECH_REGION ?? "uksouth";
const voice = process.env.AZURE_SPEECH_VOICE ?? "en-GB-SoniaNeural";
const endpoint = process.env.AZURE_SPEECH_ENDPOINT
  ?? `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
// 48 kbps mono is the point where speech stops improving to the ear but the
// files keep growing: the whole curriculum is about 87 MB at this rate.
const format = process.env.AZURE_SPEECH_FORMAT ?? "audio-24khz-48kbitrate-mono-mp3";

const escapeXml = (value) => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// A shade under normal pace, matching the browser voice this replaces.
function ssml(text) {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-GB">`
    + `<voice name="${voice}"><prosody rate="-5%">${escapeXml(text)}</prosody></voice></speak>`;
}

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

// Voicing the whole curriculum is a few thousand calls, so being throttled is
// expected rather than exceptional: the service answers 429 and names how long
// to wait. Retrying that, and transient 5xx, is the difference between a run
// that finishes and one that leaves the curriculum half voiced.
async function synthesise(text, attempt = 0) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": format,
      "User-Agent": "EducationHub",
    },
    body: ssml(text),
  });
  if (response.ok) return Buffer.from(await response.arrayBuffer());

  const retryable = response.status === 429 || response.status >= 500;
  if (retryable && attempt < 5) {
    const suggested = Number(response.headers.get("retry-after")) * 1000;
    // Back off exponentially where the service does not say, and always honour
    // it where it does.
    await wait(Number.isFinite(suggested) && suggested > 0 ? suggested : 2 ** attempt * 1000);
    return synthesise(text, attempt + 1);
  }
  const detail = await response.text().catch(() => "");
  throw new Error(`speech service returned ${response.status} ${detail.slice(0, 160)}`);
}

// Runs jobs with a fixed number in flight. Kept small by default: the point is
// to stop waiting on one round trip at a time, not to race the rate limit.
async function inParallel(items, limit, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index]);
    }
  });
  await Promise.all(runners);
}

const topics = curriculum.filter((topic) => {
  if (onlyTopic) return topic.id === onlyTopic;
  if (onlyYear !== null && topic.year !== onlyYear) return false;
  if (onlySubject && topic.subject !== onlySubject) return false;
  return true;
});

if (!topics.length) {
  console.error("No topic matches those filters.");
  process.exit(1);
}
if (!dryRun && !process.env.AZURE_SPEECH_KEY) {
  console.error("AZURE_SPEECH_KEY is not set. Add it to api/local.settings.json, or pass --dry-run.");
  process.exit(1);
}

console.log(`voice ${voice} via ${region}${dryRun ? "   (dry run: nothing is called or stored)" : ""}`);
console.log(`${topics.length} topic(s)\n`);

const counts = { beats: 0, skipped: 0, made: 0, failed: 0, characters: 0, bytes: 0, stale: 0, unseeded: 0 };
let done = 0;

for (const topic of topics) {
  // Read the stored content, not the authored file. The player builds its beats
  // from what the API serves, which is the stored row - so synthesising from
  // the source file voiced sentences the player would never ask for. Where the
  // two had drifted the digests did not match, every beat came back 404, and
  // the lesson silently fell back to the browser voice.
  const content = await getContent(contentKey("explanation", topic.id));
  if (!content) {
    console.log(`  ${topic.id}: nothing stored, run "npm run seed:content -- --explanations-only" first`);
    counts.unseeded += 1;
    continue;
  }
  // Compared against what the seeder would write now, not against the authored
  // file directly: the guide fills in a fallback where a topic has no authored
  // formulae, so comparing with the raw file reports drift that is not drift.
  const guide = getTopicGuide(topic.subject, topic);
  const stale = ["explanation", "keyIdeas", "formulae"].some(
    (field) => JSON.stringify(content[field] ?? null) !== JSON.stringify(guide[field] ?? null));
  if (stale) {
    // Voicing this would record content the authored source has already moved
    // past, and it would have to be paid for again after the next seeding run.
    console.log(`  ${topic.id}: stored content differs from the authored source, skipped - re-seed first`);
    counts.stale += 1;
    continue;
  }
  if (done >= limit) break;
  done += 1;

  const beats = lessonBeats(topic, content);
  let made = 0;
  let skipped = 0;

  // Beats within a topic are independent, so they are voiced together. Topics
  // stay sequential, which keeps the progress line meaningful and the load on
  // the service steady rather than spiky.
  await inParallel(beats, concurrency, async (beat) => {
    const text = beatSpeech(beat, toSpoken);
    if (!text) return;
    counts.beats += 1;
    const key = narrationKey(topic.id, text, voice);

    if (!force && !dryRun && await hasNarration(key)) {
      counts.skipped += 1;
      skipped += 1;
      return;
    }
    counts.characters += text.length;
    if (dryRun) {
      counts.made += 1;
      made += 1;
      return;
    }
    try {
      const audio = await synthesise(text);
      await saveNarration(key, audio);
      counts.bytes += audio.length;
      counts.made += 1;
      made += 1;
    } catch (error) {
      counts.failed += 1;
      console.log(`  FAILED ${topic.id} "${text.slice(0, 48)}..." - ${error.message}`);
    }
  });
  console.log(`  ${topic.id.padEnd(40)} ${String(made).padStart(3)} new, ${String(skipped).padStart(3)} cached`);
}

const mb = counts.bytes / 1024 / 1024;
console.log(`\n${counts.beats} beat(s): ${counts.made} synthesised, ${counts.skipped} already cached, ${counts.failed} failed`);
console.log(`${counts.characters.toLocaleString()} characters billed${mb ? `, ${mb.toFixed(1)} MB stored` : ""}`);
if (counts.stale || counts.unseeded) {
  console.log(`${counts.stale} topic(s) skipped as stale and ${counts.unseeded} as unseeded. Run "npm run seed:content -- --explanations-only", then this again.`);
}
if (dryRun) console.log("\nDry run: pass no --dry-run to synthesise for real.");
process.exit(counts.failed ? 1 : 0);
