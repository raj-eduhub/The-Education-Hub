// The narration cache, end to end, without a Speech resource.
//
// Synthesis itself is one HTTPS call to a paid service; everything that can go
// wrong around it is here: the key the script writes must be the key the API
// derives from what the player asks for, the audio must be behind the learner's
// access check, and a beat that was never recorded must 404 rather than fail so
// the player can fall back to the browser voice.
//
// Needs the storage emulator and the Functions host:
//   npm run stubs   func start   node scripts/test-narration.mjs
import { readFileSync } from "node:fs";
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { topicContent } from "../../src/data/topicContent/index.js";
import { beatSpeech, lessonBeats } from "../../src/lessonBeats.js";
import { toSpoken } from "../../src/speech.js";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const { deleteNarration, getNarration, narrationKey, saveNarration } = await import("../src/lib/narrationStore.js");

const base = process.env.TEST_API_BASE ?? "http://127.0.0.1:7071/api";
const voice = process.env.AZURE_SPEECH_VOICE ?? "en-GB-SoniaNeural";
let cookie = "";
let failures = 0;
const check = (ok, label, detail) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
};

async function call(path, options = {}) {
  const headers = { ...(options.headers ?? {}), ...(cookie ? { Cookie: cookie } : {}) };
  const response = await fetch(`${base}${path}`, { ...options, headers });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie?.startsWith("education_session=")) cookie = setCookie.split(";")[0];
  return response;
}
const post = (payload) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

const topic = curriculum.find((entry) => entry.id === "y10-maths-number");
const beats = lessonBeats(topic, topicContent[topic.id]);

// The gating and edge cases run against a scratch topic rather than a real one.
// A real topic may or may not have been voiced yet, so asserting against it
// would pass or fail depending on whether the synthesis script had been run -
// and the teardown would delete audio somebody had paid to produce.
const scratchTopic = "test-narration-scratch";
const first = "A line that exists only for this test.";
const key = narrationKey(scratchTopic, first, voice);

// A tiny but valid MP3 frame header, so nothing along the way has to pretend
// this is audio - it simply is not worth calling a paid service to test a blob.
const fakeAudio = Buffer.concat([Buffer.from([0xff, 0xfb, 0x90, 0x64]), Buffer.alloc(512)]);

console.log(`topic ${topic.id}, ${beats.length} beats, voice ${voice}\n`);

// ---- the store round-trips --------------------------------------------------
await saveNarration(key, fakeAudio);
const stored = await getNarration(key);
check(stored != null, "audio saved and read back");
check(stored?.body?.length === fakeAudio.length, "the bytes are unchanged", `${stored?.body?.length} bytes`);
check(stored?.contentType === "audio/mpeg", "served as audio/mpeg", String(stored?.contentType));

// ---- the key is stable, and specific ---------------------------------------
check(narrationKey(scratchTopic, first, voice) === key, "the same text and voice give the same key");
check(narrationKey(scratchTopic, first, "en-GB-LibbyNeural") !== key, "a different voice gives a different key");
check(narrationKey(scratchTopic, `${first} `, voice) !== key, "a changed sentence gives a different key");
check(key.startsWith(`${scratchTopic}/`), "audio is filed under its topic", key);

// ---- the API will not serve it to a stranger --------------------------------
cookie = "";
const anonymous = await call("/narration", post({ topicId: scratchTopic, text: first }));
check(anonymous.status === 403, "an unauthenticated request is refused", `HTTP ${anonymous.status}`);

// ---- a signed-in learner gets the audio -------------------------------------
const login = await call("/auth/login", post({
  username: process.env.TEST_USERNAME ?? "demo.parent",
  password: process.env.TEST_PASSWORD ?? "EducationHub2026!",
}));
if (login.status !== 200) {
  console.log(`\nCould not sign in (HTTP ${login.status}); the rest needs a signed-in learner.`);
  process.exit(1);
}

const served = await call("/narration", post({ topicId: scratchTopic, text: first }));
check(served.status === 200, "a signed-in learner is served the audio", `HTTP ${served.status}`);
check(served.headers.get("content-type")?.includes("audio"), "the response is audio",
  String(served.headers.get("content-type")));
const bytes = Buffer.from(await served.arrayBuffer());
check(bytes.length === fakeAudio.length, "the audio arrives intact", `${bytes.length} bytes`);
check(/immutable/.test(served.headers.get("cache-control") ?? ""), "it is marked cacheable for ever",
  String(served.headers.get("cache-control")));

// ---- an unrecorded beat is a 404, not a failure -----------------------------
const missing = await call("/narration", post({ topicId: scratchTopic, text: "a line nobody ever recorded" }));
check(missing.status === 404, "an unrecorded beat is a 404 so the player can fall back", `HTTP ${missing.status}`);

// ---- the route refuses what it should ---------------------------------------
const badTopic = await call("/narration", post({ topicId: "../../etc/passwd", text: first }));
check(badTopic.status === 400, "a topic id outside the catalogue shape is refused", `HTTP ${badTopic.status}`);
const huge = await call("/narration", post({ topicId: scratchTopic, text: "x".repeat(2001) }));
check(huge.status === 400, "an oversized text is refused", `HTTP ${huge.status}`);

// ---- the real topic is all voiced, or none of it is --------------------------
// The player asks for every beat and uses the recorded voice only if all of
// them answer, so a half-recorded topic is the state that must not exist. This
// reports whichever way round the topic actually is, and only fails on the
// in-between.
const answers = await Promise.all(beats.map(async (beat) => {
  const text = beatSpeech(beat, toSpoken);
  const response = await call("/narration", post({ topicId: topic.id, text }));
  return response.status === 200;
}));
const voiced = answers.filter(Boolean).length;
check(voiced === 0 || voiced === beats.length,
  `${topic.id} is wholly voiced or wholly unvoiced, never part-way`,
  `${voiced} of ${beats.length} beats`);
console.log(`     ${voiced === beats.length ? "recorded voice" : "browser fallback"} for ${topic.id}`);

await deleteNarration(key);
check((await getNarration(key)) === null, "audio can be deleted");

console.log(failures ? `\n${failures} check(s) FAILED` : "\nPASS: narration is cached, gated, and falls back when unrecorded");
process.exit(failures ? 1 : 0);
