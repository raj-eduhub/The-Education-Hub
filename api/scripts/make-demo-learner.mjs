// A demo account, set up the way a real one ends up.
//
// Creates the credentials already confirmed, puts the account on the roster,
// marks the subscription active and writes the learner profile, so the app can
// be walked end to end without going through checkout and an inbox.
//
//   node api/scripts/make-demo-learner.mjs
//   node api/scripts/make-demo-learner.mjs --name Rhea --dob 2013-03-15
//
// Local only. It writes directly to the stores and bypasses payment, which is
// exactly why it must never be pointed at anything but the emulator.
import { readFileSync } from "node:fs";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const connection = process.env.AZURE_STORAGE_CONNECTION_STRING ?? "";
if (!/UseDevelopmentStorage|127\.0\.0\.1|localhost/.test(connection)) {
  console.error("Refusing to run: this writes a paid account without payment, so it is for the local emulator only.");
  process.exit(1);
}

const arg = (flag, fallback) => {
  const at = process.argv.indexOf(flag);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};

const { authTable, digest, hashPassword, deleteCredentials } = await import("../src/lib/passwordAuth.js");
const { saveUser, deleteUserByEmail } = await import("../src/lib/userStore.js");
const { accountKey, deleteSubscription, updateSubscriptionByAccountKey } = await import("../src/lib/subscriptionStore.js");
const { deleteProfile, saveLearnerProfile } = await import("../src/lib/signupStore.js");
const { yearFromDateOfBirth } = await import("../src/lib/learnerDetails.js");
const { subjects } = await import("../../src/curriculum.js");

const firstName = arg("--name", "Rhea");
const dateOfBirth = arg("--dob", "2013-03-15");
const username = arg("--username", `demo.${firstName.toLowerCase()}`);
const email = arg("--email", `${username}@example.test`);
const password = arg("--password", "demo-password-for-testing");
const board = arg("--board", "AQA");
const guardian = arg("--guardian", "Raj Narsapuram");

const year = yearFromDateOfBirth(dateOfBirth);
if (!Number.isFinite(year) || year < 7 || year > 11) {
  console.error(`That date of birth works out as Year ${year}, which is outside Years 7 to 11.`);
  process.exit(1);
}

// Start clean, so running it twice gives the same account rather than a mess.
await Promise.all([
  deleteCredentials(email).catch(() => {}),
  deleteUserByEmail(email).catch(() => {}),
  deleteSubscription(email).catch(() => {}),
  deleteProfile(email).catch(() => {}),
]);

// Credentials, already confirmed: the confirmation step is proven by its own
// suite, and making someone open an inbox to try a demo helps nobody.
const accountId = `user-${digest(username)}`;
const table = await authTable();
await table.upsertEntity({
  partitionKey: "auth",
  rowKey: accountId,
  username,
  email,
  name: firstName,
  emailVerified: true,
  ...await hashPassword(password),
}, "Replace");

await saveUser({ name: guardian, email, role: "parent" });

await updateSubscriptionByAccountKey(accountKey(email), {
  email,
  plan: "learner",
  billingPeriod: "monthly",
  status: "active",
  onboardingComplete: true,
  stripeCustomerId: "cus_demo_local",
  stripeSubscriptionId: "sub_demo_local",
  currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
  cancelAtPeriodEnd: false,
});

// Boards are needed from Year 9, and a tier from Year 10.
await saveLearnerProfile(email, {
  guardianName: guardian,
  guardianRelationship: "parent",
  guardianPhone: "07700 900123",
  studentFirstName: firstName,
  dateOfBirth,
  examBoards: Object.fromEntries(subjects.map((subject) => [subject, board])),
  examBoard: board,
  tier: "Higher",
  parentalConsent: true,
});

console.log(`
  Demo account ready

    Sign in at   http://127.0.0.1:5173
    Username     ${username}
    Password     ${password}

    Parent       ${guardian}
    Learner      ${firstName}, born ${dateOfBirth}
    School year  Year ${year}   (worked out from the date of birth)
    Exam board   ${board} for every subject
    Subscription active, learner setup complete
`);
