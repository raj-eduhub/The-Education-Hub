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
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from 'node:crypto';
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { getTopicGuide } from "../../src/topicGuides.js";
import { beatSpeech, lessonBeats, exampleBeats } from "../../src/lessonBeats.js";
import { explanationForTier } from '../../src/data/explanationTier.js';
import { selectExplanation } from '../../src/data/selectExplanation.js';
import { warrantsWorkedExample, warrantsFormulae } from '../../src/data/workedExampleOutcomes.js';
import { toSpoken } from "../../src/speech.js";
import { contentKey, getContent, listTopicContent } from "../src/lib/contentStore.js";
import { listNarration, narrationKey, saveNarration } from "../src/lib/narrationStore.js";

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
const includeExamples = args.has('examples');
const onlyTopic = args.get("topic");
const onlyYear = args.has("year") ? Number(args.get("year")) : null;
const onlySubject = args.get("subject");
const limit = Number(args.get("limit") ?? Infinity);
const concurrency = Math.max(1, Math.min(32, Number(args.get("concurrency") ?? 4)));

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
    signal: AbortSignal.timeout(30000),
  }).catch(error => {
    if (['EACCES','EPERM','ENOTFOUND'].includes(error.cause?.code)) error.fatal = true;
    throw error;
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
  const error = new Error(`speech service returned ${response.status} ${detail.slice(0, 160)}`);
  error.fatal = response.status === 401 || response.status === 403;
  throw error;
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

const counts = { topics: 0, examples: 0, beats: 0, skipped: 0, made: 0, failed: 0, characters: 0, bytes: 0, stale: 0, unseeded: 0 };
const manifest=[];
const reportDir='output/curriculum-review';mkdirSync(reportDir,{recursive:true});
const reportTag=args.get('report-tag');
if(reportTag&&!/^[a-z0-9-]+$/.test(reportTag))throw Error('Report tag must contain only lowercase letters, digits and hyphens');
const reportPath=`${reportDir}/narration-${reportTag??(dryRun?'dry-run':'run')}.json`;
const saveReport=()=>writeFileSync(reportPath,JSON.stringify({updatedAt:new Date().toISOString(),dryRun,voice,includeExamples,counts,manifest},null,2));
let done = 0;
let halted = false;
// One inventory avoids a storage round trip for every beat. This is a single
// writer; completed uploads extend the snapshot, and interrupted runs resume
// from a fresh inventory. Empty blobs are regenerated rather than skipped.
const cachedKeys = new Set((await listNarration()).filter(b=>b.bytes>100).map(b=>b.name));

for (const topic of topics) {
  if (halted) break;
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
  const stale = ["explanation", "keyIdeas", "formulae", "higher", "subtopics"].some(
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

  counts.topics += 1;
  const beats = lessonBeats(topic, explanationForTier(content, 'Foundation'));
  if (content.higher) beats.push(...lessonBeats(topic, explanationForTier(content, 'Higher')));
  for (const [index, lesson] of (content.subtopics ?? []).entries()) {
    if (!lesson) continue;
    beats.push(...lessonBeats(topic, selectExplanation(content, index, 'Foundation')));
    if (lesson.higher) beats.push(...lessonBeats(topic, selectExplanation(content, index, 'Higher')));
  }
  if (includeExamples) {
    for (const row of await listTopicContent(topic.id)) {
      if (row.type !== 'example') continue;
      const index=Number(/^example-(\d+)-/.exec(row.rowKey)?.[1]);
      if (!warrantsWorkedExample(topic.id,index)) continue;
      const payload={...row.payload,formulae:warrantsFormulae(topic.id,index)?row.payload.formulae??[]:[]};
      beats.push(...exampleBeats(payload,row.subtopicTitle));
      counts.examples += 1;
    }
  }
  // Deduplicate the identical core beats shared by both tiers before scheduling.
  const texts=[...new Set(beats.map(beat=>beatSpeech(beat,toSpoken)).filter(Boolean))];
  let made = 0;
  let skipped = 0;

  // Beats within a topic are independent, so they are voiced together. Topics
  // stay sequential, which keeps the progress line meaningful and the load on
  // the service steady rather than spiky.
  await inParallel(texts, concurrency, async (text) => {
    if (halted) return;
    counts.beats += 1;
    const key = narrationKey(topic.id, text, voice);
    const entry={topicId:topic.id,key,textHash:createHash('sha256').update(text).digest('hex'),characters:text.length,status:'pending'};
    manifest.push(entry);

    // The cache is checked on a dry run too. Skipping it made every beat look
    // new, so the estimate was of synthesising the curriculum from nothing
    // rather than of the run you were about to make.
    if (!force && cachedKeys.has(key)) {
      counts.skipped += 1;
      skipped += 1;
      entry.status='cached';
      return;
    }
    counts.characters += text.length;
    if (dryRun) {
      counts.made += 1;
      made += 1;
      entry.status='would-synthesise';
      return;
    }
    try {
      const audio = await synthesise(text);
      if(audio.length<100)throw new Error('Speech response is empty or too short to be audio');
      await saveNarration(key, audio);
      cachedKeys.add(key);
      counts.bytes += audio.length;
      counts.made += 1;
      made += 1;
      entry.status='synthesised';entry.bytes=audio.length;
    } catch (error) {
      counts.failed += 1;
      entry.status='failed';entry.error=error.message;
      if (error.fatal) halted = true;
      console.log(`  FAILED ${topic.id} "${text.slice(0, 48)}..." - ${error.message}`);
    }
  });
  console.log(`  ${topic.id.padEnd(40)} ${String(made).padStart(3)} ${dryRun ? 'missing' : 'new'}, ${String(skipped).padStart(3)} cached`);
  saveReport();
}

const mb = counts.bytes / 1024 / 1024;
console.log(`\n${counts.beats} beat(s): ${counts.made} ${dryRun ? 'need synthesis' : 'synthesised'}, ${counts.skipped} already cached, ${counts.failed} failed`);
console.log(`${counts.characters.toLocaleString()} ${dryRun ? 'uncached characters; no synthesis requests sent' : 'characters scheduled for synthesis'}${mb ? `, ${mb.toFixed(1)} MB stored` : ""}`);
if (counts.stale || counts.unseeded) {
  console.log(`${counts.stale} topic(s) skipped as stale and ${counts.unseeded} as unseeded. Run "npm run seed:content -- --explanations-only", then this again.`);
}
if (dryRun) console.log("\nDry run: pass no --dry-run to synthesise for real.");
if (halted) console.log('Stopped after a connection or authorization failure; unprocessed clips remain pending.');
saveReport();
process.exit(counts.failed ? 1 : 0);
