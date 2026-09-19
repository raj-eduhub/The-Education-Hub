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
  { name: "billing", script: "test-billing.mjs", needsApi: false },
  { name: "safeguarding", script: "test-safeguarding.mjs", needsApi: false },
  { name: "billing routes", script: "test-billing-routes.mjs", needsApi: true },
  { name: "password login", script: "test-password-login.mjs", needsApi: true },
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
