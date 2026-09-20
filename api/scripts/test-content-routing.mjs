// Proves the contract the content routing policy promises, against a running
// API rather than by reading the code:
//
//   1. Every explanation in the catalogue is served from storage, for every
//      year and every subject, and never reaches the model.
//   2. The explanation route refuses to generate even when nothing is stored,
//      because it is stored-only.
//   3. A stored question is served from storage and reports generated: false.
//   4. A stored-first miss calls the model once, persists what it produced, and
//      serves the next identical request from storage.
//
// Needs the Functions host and the storage emulator running:
//   npm run stubs   (optional)   func start   node scripts/test-content-routing.mjs
import { readFileSync } from "node:fs";
import { curriculum } from "../../src/data/curriculumCatalog.js";
import { supportsQuestionBank } from "../src/lib/contentPolicy.js";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const base = process.env.TEST_API_BASE ?? "http://127.0.0.1:7071/api";
const username = process.env.TEST_USERNAME ?? "demo.parent";
const password = process.env.TEST_PASSWORD ?? "EducationHub2026!";
const generate = process.argv.includes("--generate");

let cookie = "";
let failures = 0;
const check = (ok, label, detail) => {
  if (!ok) failures += 1;
  if (!ok || !process.argv.includes("--quiet")) {
    console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
  }
};

async function call(path, options = {}) {
  const headers = { ...(options.headers ?? {}), ...(cookie ? { Cookie: cookie } : {}) };
  const response = await fetch(`${base}${path}`, { ...options, headers });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie?.startsWith("education_session=")) cookie = setCookie.split(";")[0];
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text.slice(0, 200) }; }
  return { status: response.status, body };
}

const post = (payload) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

const contentRequest = (type, topic, extra = {}) => post({
  type,
  subject: topic.subject,
  year: topic.year,
  topic: { id: topic.id, title: topic.title, unit: topic.unit, goal: topic.goal, outcomes: topic.outcomes },
  ...extra,
});

// ---- sign in ----------------------------------------------------------------
const login = await call("/auth/login", post({ username, password }));
if (login.status !== 200) {
  console.error(`Could not sign in as ${username} (HTTP ${login.status}). Is the host running and the demo account seeded?`);
  process.exit(1);
}
console.log(`signed in as ${username}\n`);

// ---- 1. every explanation, every year, every subject ------------------------
console.log(`--- explanations: all ${curriculum.length} topics must come from storage ---`);
const bySubject = new Map();
let servedStored = 0;
let missing = 0;
let generated = 0;

for (const topic of curriculum) {
  const response = await call("/content", contentRequest("explanation", topic));
  const key = `Y${topic.year} ${topic.subject}`;
  const tally = bySubject.get(key) ?? { stored: 0, missing: 0, generated: 0 };
  bySubject.set(key, tally);

  if (response.status === 200 && response.body?.content?.source === "stored" && response.body?.generated === false) {
    servedStored += 1;
    tally.stored += 1;
  } else if (response.status === 200 && response.body?.generated === true) {
    // Would mean the stored-only route called the model, which must never happen.
    generated += 1;
    tally.generated += 1;
    check(false, `${topic.id} explanation was GENERATED, not stored`);
  } else {
    missing += 1;
    tally.missing += 1;
    check(false, `${topic.id} explanation unavailable`, `HTTP ${response.status} ${response.body?.error ?? ""}`);
  }
}

for (const [key, tally] of [...bySubject].sort()) {
  const ok = tally.stored && !tally.missing && !tally.generated;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${key.padEnd(24)} ${tally.stored} stored${tally.missing ? `, ${tally.missing} MISSING` : ""}${tally.generated ? `, ${tally.generated} GENERATED` : ""}`);
}
check(servedStored === curriculum.length, `all ${curriculum.length} explanations served from storage`, `${servedStored} stored, ${missing} missing, ${generated} generated`);
check(generated === 0, "the model was never called for an explanation");

// ---- 2. the stored-only route refuses to generate on a miss ------------------
console.log("\n--- the explanation route is stored-only ---");
const absent = await call("/content", contentRequest("explanation", {
  id: "y7-maths-not-a-real-topic", subject: "Maths", year: 7,
  title: "Not A Real Topic", unit: "Number", goal: "Nothing", outcomes: ["Nothing"],
}));
check(absent.status === 404, "an unstored explanation is refused rather than generated", `HTTP ${absent.status}`);
check(absent.body?.route === "stored", "the route is reported as stored", String(absent.body?.route));

// ---- 3. a stored question comes from storage --------------------------------
console.log("\n--- stored questions are served without a model call ---");
const y10Maths = curriculum.find((topic) => topic.year === 10 && topic.subject === "Maths" && supportsQuestionBank(topic.id));
if (y10Maths) {
  for (const type of ["practice", "exam"]) {
    const response = await call("/content", contentRequest(type, y10Maths, {
      examBoard: y10Maths.examBoards[0], tier: "Higher", bankIndex: 0,
      subtopic: { title: y10Maths.outcomes[0] },
    }));
    const stored = response.status === 200 && response.body?.content?.source === "stored";
    check(stored, `${type} for ${y10Maths.id} came from storage`,
      `HTTP ${response.status} source=${response.body?.content?.source ?? "-"} generated=${response.body?.generated}`);
  }
}

// ---- 4. a miss generates once, then is stored -------------------------------
console.log("\n--- a stored-first miss is persisted, so it is generated at most once ---");
if (!generate) {
  console.log("  skipped: pass --generate to call the model for one uncovered slot");
} else {
  // The handler takes the year and tier from the signed-in learner's profile,
  // not from the request, so the slot has to be chosen for that learner.
  const profile = await call("/profile");
  const year = profile.body?.profile?.year;
  const { getContent } = await import("../src/lib/contentStore.js");
  const { contentKey } = await import("../src/lib/contentStore.js");

  let target = null;
  for (const topic of curriculum.filter((entry) => entry.year === year)) {
    for (const [index, outcome] of topic.outcomes.entries()) {
      const key = contentKey("example", topic.id, {
        index,
        tier: year >= 10 && ["Maths", "Science"].includes(topic.subject) ? profile.body?.profile?.tier : null,
      });
      if (key && !(await getContent(key))) {
        target = { topic, index, outcome };
        break;
      }
    }
    if (target) break;
  }

  if (!target) {
    console.log(`  skipped: every example slot for Year ${year} is already stored`);
  } else {
    const ask = () => call("/content", contentRequest("example", target.topic, {
      subtopic: { title: target.outcome, index: target.index },
    }));
    console.log(`  target: ${target.topic.id} outcome ${target.index} (${target.topic.subject} Year ${year})`);

    const first = await ask();
    check(first.status === 200, "the uncovered slot was answered", `HTTP ${first.status} ${first.body?.error ?? ""}`);
    check(first.body?.generated === true, "the first request reached the model", `generated=${first.body?.generated}`);

    const second = await ask();
    check(second.body?.content?.source === "stored", "the second request came from storage", `source=${second.body?.content?.source}`);
    check(second.body?.generated === false, "the model was not called twice", `generated=${second.body?.generated}`);
  }
}

console.log(failures ? `\n${failures} check(s) FAILED` : "\nPASS: content routing serves storage first and uses the model only on a miss");
process.exit(failures ? 1 : 0);
