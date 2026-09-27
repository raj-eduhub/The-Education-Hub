// Voices the stored worked examples, the way synthesise-narration.mjs voices
// the lessons.
//
//   node api/scripts/synthesise-examples.mjs --dry-run
//   node api/scripts/synthesise-examples.mjs --year 10 --subject Maths --tier Higher
//   node api/scripts/synthesise-examples.mjs                 (everything stored)
//
// Two things are deliberate. Beats come from exampleBeats() in
// src/lessonBeats.js rather than being built here, because the audio is keyed
// by a digest of the spoken text and anything that plays it has to produce the
// same string or it gets silence. And only stored rows are voiced: an example
// that has not been seeded yet is skipped rather than generated, so a run never
// quietly turns into a model bill as well as a speech one.
//
// Examples are model-generated and barely reviewed, so a pruned and
// regenerated example leaves its audio orphaned. Run this after reviewing a
// batch, not before. narration-cost figures are in docs/curriculum-model.md.
import { readFileSync } from "node:fs";
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { beatSpeech, exampleBeats } from "../../src/lessonBeats.js";
import { toSpoken } from "../../src/speech.js";
import { contentKey, getContent } from "../src/lib/contentStore.js";
import { contentTypes, variesByTier, warrantsWorkedExample } from "../src/lib/contentPolicy.js";
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
const tier = args.get("tier") ?? null;
const limit = Number(args.get("limit") ?? Infinity);
const concurrency = Math.max(1, Math.min(8, Number(args.get("concurrency") ?? 4)));

const region = process.env.AZURE_SPEECH_REGION ?? "uksouth";
const voice = process.env.AZURE_SPEECH_VOICE ?? "en-GB-SoniaNeural";
const endpoint = process.env.AZURE_SPEECH_ENDPOINT
  ?? `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
const format = process.env.AZURE_SPEECH_FORMAT ?? "audio-24khz-48kbitrate-mono-mp3";

const escapeXml = (value) => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function ssml(text) {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-GB">`
    + `<voice name="${voice}"><prosody rate="-5%">${escapeXml(text)}</prosody></voice></speak>`;
}

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

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
    await wait(Number.isFinite(suggested) && suggested > 0 ? suggested : 2 ** attempt * 1000);
    return synthesise(text, attempt + 1);
  }
  const detail = await response.text().catch(() => "");
  throw new Error(`speech service returned ${response.status} ${detail.slice(0, 160)}`);
}

async function inParallel(items, parallel, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(parallel, items.length) }, async () => {
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

const counts = { examples: 0, missing: 0, beats: 0, skipped: 0, made: 0, failed: 0, characters: 0, bytes: 0 };
let done = 0;

for (const topic of topics) {
  if (done >= limit) break;

  // Years 10 and 11 store one example per tier, so both are voiced unless a
  // tier is named. Earlier years share a single copy.
  const tiers = topic.year >= 10 && variesByTier(topic.subject)
    ? (tier ? [tier] : topic.tiers.length ? topic.tiers : ["Higher"])
    : [null];

  let made = 0;
  let skipped = 0;
  let missing = 0;

  for (const currentTier of tiers) {
    for (let index = 0; index < topic.outcomes.length; index += 1) {
      // An outcome that warrants no worked example has nothing to voice, and
      // is not a gap to be filled by seeding. Counting it as missing told you
      // to run the seeder, which would put back the examples just pruned.
      if (!warrantsWorkedExample(topic.id, index)) continue;
      const stored = await getContent(contentKey(contentTypes.EXAMPLE, topic.id, { index, tier: currentTier }));
      if (!stored) { missing += 1; continue; }
      counts.examples += 1;

      const beats = exampleBeats(stored, topic.outcomes[index]);
      await inParallel(beats, concurrency, async (beat) => {
        const text = beatSpeech(beat, toSpoken);
        if (!text) return;
        counts.beats += 1;
        const key = narrationKey(topic.id, text, voice);

        if (!force && await hasNarration(key)) {
          counts.skipped += 1;
          skipped += 1;
          return;
        }
        counts.characters += text.length;
        if (dryRun) { counts.made += 1; made += 1; return; }
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
    }
  }

  counts.missing += missing;
  if (made || skipped || missing) {
    done += 1;
    console.log(`  ${topic.id.padEnd(48)} ${String(made).padStart(4)} new, ${String(skipped).padStart(4)} cached`
      + `${missing ? `, ${missing} example(s) not seeded` : ""}`);
  }
}

const mb = counts.bytes / 1024 / 1024;
console.log(`\n${counts.examples} example(s), ${counts.beats} beat(s): ${counts.made} synthesised, ${counts.skipped} already cached, ${counts.failed} failed`);
console.log(`${counts.characters.toLocaleString()} characters billed${mb ? `, ${mb.toFixed(1)} MB stored` : ""}`);
if (counts.missing) {
  console.log(`${counts.missing} example slot(s) are not seeded yet and were skipped. Run "npm run seed:content -- --type example" first.`);
}
if (dryRun) console.log("\nDry run: pass no --dry-run to synthesise for real.");
process.exit(counts.failed ? 1 : 0);
