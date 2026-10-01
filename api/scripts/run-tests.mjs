// Runs every test suite. Storage settings are resolved here so no test needs an
// env var set by hand; suites that need the API running say so and are skipped.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5173/api";
async function apiIsUp() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    await fetch(`${base}/session`, { signal: controller.signal });
    clearTimeout(timer);
    return true;
  } catch {
    return false;
  }
}

const running = await apiIsUp();
const suites = [
  { name: "curriculum", script: "validate-curriculum.mjs", needsApi: false },
  { name: "curriculum policy", script: "test-curriculum-policy.mjs", needsApi: false },
  { name: "explanation tiers", script: "test-explanation-tiers.mjs", needsApi: false },
  { name: "subtopic lessons", script: "test-subtopic-lessons.mjs", needsApi: false },
  { name: "all subtopic coverage", script: "test-subtopic-coverage.mjs", needsApi: false },
  { name: "content formatting", script: "test-content-formatting.mjs", needsApi: false },
  // The narrated lesson is built from the authored content at render time, so
  // the content has to survive being turned into speech and into beats.
  { name: "speech", script: "test-speech.mjs", needsApi: false },
  { name: "playback", script: "test-playback.mjs", needsApi: false },
  // Stored content against the catalogue it was generated from: an edited
  // outcome leaves a worked example teaching the wrong sub-topic silently.
  { name: "content audit", script: "audit-content.mjs", needsApi: false },
  { name: "billing", script: "test-billing.mjs", needsApi: false },
  { name: "failed payments", script: "test-failed-payments.mjs", needsApi: false },
  { name: "support", script: "test-support.mjs", needsApi: false },
  { name: "safeguarding", script: "test-safeguarding.mjs", needsApi: false },
  // Every model call is money; this is the cap that keeps one learner from
  // spending more than they pay.
  { name: "model budget", script: "test-model-budget.mjs", needsApi: false },
  { name: "billing routes", script: "test-billing-routes.mjs", needsApi: true },
  { name: "password login", script: "test-password-login.mjs", needsApi: true },
  // Proves the stored-first contract against the running API: every explanation
  // comes from storage, and the model is reached only where nothing is stored.
  { name: "content routing", script: "test-content-routing.mjs", needsApi: true },
  { name: "subtopic routing", script: "test-subtopic-routing.mjs", needsApi: true },
  // The narration cache: keyed, access-gated, and absent without failing.
  { name: "narration", script: "test-narration.mjs", needsApi: true },
];

let failed = 0;
let skipped = 0;
for (const suite of suites) {
  if (suite.needsApi && !running) {
    skipped += 1;
    console.log(`\n--- ${suite.name}: SKIPPED, needs the API at ${base}. Start it with "npm run dev:all".`);
    continue;
  }
  console.log(`\n--- ${suite.name} ---`);
  const result = spawnSync(process.execPath, [new URL(suite.script, import.meta.url).pathname.slice(1)], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) failed += 1;
}

console.log(`\n${failed ? `${failed} suite(s) failed` : "all suites passed"}${skipped ? `, ${skipped} skipped` : ""}`);
process.exit(failed ? 1 : 0);
