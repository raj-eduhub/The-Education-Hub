// The per-learner cap on model calls.
//
// Every model call is money, and until this existed an authenticated learner
// could make them without limit. These checks run against the store directly,
// so they cost nothing and need no running host.
//
//   node api/scripts/test-model-budget.mjs
import { readFileSync } from "node:fs";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

// Small limits so the test is quick; the product's own values come from the
// application settings.
process.env.MODEL_CALLS_PER_MINUTE = "4";
process.env.MODEL_CALLS_PER_DAY = "6";

const { checkModelBudget, modelUsage } = await import("../src/lib/modelBudget.js");
const { authTable, digest } = await import("../src/lib/passwordAuth.js");

const learner = `budget-test-${Date.now()}@example.test`;
const other = `budget-other-${Date.now()}@example.test`;
let failures = 0;
const check = (ok, label, detail) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
};

async function cleanup(email) {
  const client = await authTable();
  const id = digest(email).slice(0, 32);
  for (const window of ["burst", "daily"]) {
    await client.deleteEntity("auth", `model-${window}-${id}`).catch((error) => {
      if (error.statusCode !== 404) throw error;
    });
  }
}

// --- the cap holds -----------------------------------------------------------
const results = [];
for (let call = 0; call < 6; call += 1) results.push(await checkModelBudget(learner));
const allowed = results.filter((result) => result === null).length;
check(allowed === 4, "the first four calls pass and the fifth is refused", `${allowed} allowed of 6`);

const refused = results.find((result) => result !== null);
check(refused?.status === 429, "a refused call returns 429", `HTTP ${refused?.status}`);
check(Boolean(refused?.headers?.["Retry-After"]), "it says when to retry", `Retry-After: ${refused?.headers?.["Retry-After"]}`);
check(typeof refused?.jsonBody?.error === "string" && !/limit|quota|budget/i.test(refused.jsonBody.error.split(".")[0]),
  "the learner is told plainly, without jargon", `"${refused?.jsonBody?.error?.slice(0, 54)}..."`);

// --- one learner cannot spend another's --------------------------------------
check((await checkModelBudget(other)) === null, "a different learner is unaffected");

// --- usage is readable --------------------------------------------------------
const usage = await modelUsage(learner);
check(usage?.burst?.used === 4, "usage reports what was spent", `${usage?.burst?.used} of ${usage?.burst?.limit}`);
check(usage?.burst?.resetAt > Date.now(), "and when the window resets");

// --- no email, no charge ------------------------------------------------------
check((await checkModelBudget("")) === null, "an unidentified caller is not counted");

// --- a broken store must not break the lesson --------------------------------
// The limiter protects a budget, not data: if it cannot count, the learner
// should still get their lesson rather than a failure they cannot act on.
const connection = process.env.AZURE_STORAGE_CONNECTION_STRING;
process.env.AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=missing;AccountKey=bm9wZQ==;TableEndpoint=http://127.0.0.1:1/;";
const { checkModelBudget: isolated } = await import(`../src/lib/modelBudget.js?fail=${Date.now()}`);
check((await isolated(`unreachable-${Date.now()}@example.test`)) === null, "it fails open when the store is unreachable");
process.env.AZURE_STORAGE_CONNECTION_STRING = connection;

await cleanup(learner);
await cleanup(other);

console.log(failures ? `\n${failures} check(s) FAILED` : "\nPASS: model calls are capped per learner, per minute and per day");
process.exit(failures ? 1 : 0);
