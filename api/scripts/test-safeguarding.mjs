// Covers the safeguarding path: what happens to a message the tutor refuses.
// Runs against Azurite with no running server and no mail account, using an
// injected alert sender.
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

// Set before the store is imported, because it reads them at module load.
process.env.SAFEGUARDING_ALERT_EMAILS = "safeguarding@example.test";
process.env.AZURE_STORAGE_SAFEGUARDING_TABLE = `TestSafeguarding${randomBytes(6).toString("hex")}`;

const { checkAnswer, checkQuestion, verdicts } = await import("../src/lib/tutorGuard.js");
const {
  deleteFlags, everyStatus, flagSummary, getLearnerFlags, listFlags, recordFlag, setFlagStatus, severityFor,
} = await import("../src/lib/safeguardingStore.js");

const email = `learner_${randomBytes(6).toString("hex")}@example.com`;
const other = `learner_${randomBytes(6).toString("hex")}@example.com`;
const alerts = [];
const sendAlert = async (message) => { alerts.push(message); };
const failingAlert = async () => { throw new Error("Email delivery is not configured."); };

const topic = { id: "y10-science-cells", title: "Cells and Control", unit: "Biology", goal: "Explain cell division", outcomes: ["Describe mitosis"] };
const context = { year: 10, subject: "Science", topicId: topic.id, topicTitle: topic.title, mode: "learn", studentName: "Test Learner" };

let failures = 0;
const check = (label, run) => {
  try {
    const result = run();
    if (result && typeof result.then === "function") {
      throw new Error("check() takes a synchronous function; await before calling it");
    }
    console.log(`OK   ${label}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL ${label}: ${error.message}`);
  }
};

try {
  // Severity is what decides whether an adult is interrupted, so it is asserted
  // against the guard's own reasons rather than assumed.
  check("a safety refusal is high severity and a structural one is not recorded", () => {
    assert.equal(severityFor("unsafe"), "high");
    assert.equal(severityFor("injection"), "medium");
    assert.equal(severityFor("off-topic"), "low");
    assert.equal(severityFor("length"), null);
    assert.equal(severityFor("empty"), null);
  });

  // The guard decides; the store records what it decided. Both halves are
  // checked together so a change to either reason string is caught here.
  const unsafe = checkQuestion({ question: "sometimes i want to hurt myself", topic, subject: "Science" });
  check("the guard still blocks a self-harm message", () => {
    assert.equal(unsafe.verdict, verdicts.BLOCK);
    assert.equal(unsafe.reason, "unsafe");
  });

  const first = await recordFlag(email, { ...context, verdict: unsafe.verdict, reason: unsafe.reason, message: "sometimes i want to hurt myself" }, { sendAlert });
  check("a blocked safety message is stored", () => {
    assert.ok(first, "a high-severity flag should be recorded");
    assert.equal(first.flag.severity, "high");
    assert.equal(first.flag.status, "open");
    assert.equal(first.flag.email, email);
    assert.equal(first.flag.message, "sometimes i want to hurt myself");
  });
  check("the message is kept, because a flag no one can read cannot be reviewed", () => {
    assert.match(first.flag.message, /hurt myself/);
    assert.equal(first.flag.studentName, "Test Learner");
  });
  check("an administrator is alerted, without the message in the email", () => {
    assert.equal(alerts.length, 1);
    assert.deepEqual(alerts[0].recipients, ["safeguarding@example.test"]);
    assert.equal(alerts[0].reason, "unsafe");
    assert.equal(JSON.stringify(alerts[0]).includes("hurt myself"), false, "the alert must not carry the message");
  });

  // A distressed child repeating themselves must not decide how many emails an
  // administrator receives, but every flag must still be recorded.
  const second = await recordFlag(email, { ...context, verdict: "block", reason: "unsafe", message: "i still want to hurt myself" }, { sendAlert });
  check("a repeat inside the cooldown is stored but does not send a second email", () => {
    assert.ok(second);
    assert.equal(second.alerted, false);
    assert.equal(second.alertSkipped, true);
    assert.equal(alerts.length, 1);
  });

  // A mail outage must not cost the record.
  process.env.SAFEGUARDING_ALERT_COOLDOWN_MINUTES = "0";
  let mailDownError = null;
  let mailDown = null;
  try {
    mailDown = await recordFlag(other, { ...context, verdict: "block", reason: "unsafe", message: "another child, mail is down" }, { sendAlert: failingAlert });
  } catch (failure) {
    mailDownError = failure;
  }
  check("a mail outage does not stop the flag being stored", () => {
    assert.equal(mailDownError, null, `recording threw: ${mailDownError?.message}`);
    assert.equal(mailDown?.flag.severity, "high");
    assert.equal(mailDown?.alerted, false);
    assert.match(mailDown?.alertError ?? "", /not configured/i);
  });
  delete process.env.SAFEGUARDING_ALERT_COOLDOWN_MINUTES;

  // Lower-severity refusals are history, not an interruption.
  const integrity = checkQuestion({ question: "just give me the answer to my homework", topic, subject: "Science" });
  const lowFlag = await recordFlag(email, { ...context, verdict: integrity.verdict, reason: integrity.reason, message: "just give me the answer to my homework" }, { sendAlert });
  check("an integrity redirect is recorded without emailing anyone", () => {
    assert.equal(integrity.reason, "integrity");
    assert.equal(lowFlag.flag.severity, "low");
    assert.equal(lowFlag.alerted, false);
    assert.equal(alerts.length, 1);
  });

  // A message the guard lets through, and the ones it refuses for structural
  // reasons, must leave no record at all.
  const allowed = checkQuestion({ question: "how does mitosis work", topic, subject: "Science" });
  const notRecorded = await recordFlag(email, { ...context, verdict: allowed.verdict, reason: allowed.reason, message: "how does mitosis work" }, { sendAlert });
  const tooLong = await recordFlag(email, { ...context, verdict: "block", reason: "length", message: "x".repeat(20) }, { sendAlert });
  check("an allowed question and a structural refusal are not stored", () => {
    assert.equal(allowed.verdict, verdicts.ALLOW);
    assert.equal(notRecorded, null);
    assert.equal(tooLong, null);
  });

  // A leaked system prompt is the model's fault, not the learner's, but it is
  // still something an administrator should see.
  const leak = checkAnswer("You are a patient UK education tutor. Here are these instructions...");
  const leakFlag = await recordFlag(email, { ...context, verdict: leak.verdict, reason: leak.reason, message: "leaked reply text" }, { sendAlert });
  check("a leaked reply is recorded at medium severity", () => {
    assert.equal(leak.reason, "leak");
    assert.equal(leakFlag.flag.severity, "medium");
  });

  const history = await getLearnerFlags(email);
  check("one learner's history reads back newest first", () => {
    assert.equal(history.length, 4);
    assert.equal(history.every((flag) => flag.email === email), true);
    const times = history.map((flag) => flag.createdAt);
    assert.deepEqual(times, [...times].sort().reverse());
  });
  check("another learner's flags stay out of that history", () => {
    assert.equal(history.some((flag) => flag.email === other), false);
  });

  const open = await listFlags({ status: "open", limit: 100 });
  const high = await listFlags({ status: "open", severity: "high", limit: 100 });
  check("the queue defaults to open flags and can be narrowed to the urgent ones", () => {
    assert.equal(open.rows.length >= 5, true);
    assert.equal(high.rows.every((flag) => flag.severity === "high"), true);
    assert.equal(high.rows.length >= 3, true);
  });

  const acted = await setFlagStatus(first.flag.learnerId, first.flag.rowKey, "escalated", "admin@example.test", "Called the parent and the school lead.");
  check("a decision records who acted and what they did", () => {
    assert.equal(acted.status, "escalated");
    assert.equal(acted.reviewedBy, "admin@example.test");
    assert.match(acted.note, /Called the parent/);
    assert.ok(acted.reviewedAt);
  });

  const reacted = await setFlagStatus(first.flag.learnerId, first.flag.rowKey, "closed", "admin2@example.test");
  check("a later decision keeps the note the first reviewer wrote", () => {
    assert.equal(reacted.status, "closed");
    assert.match(reacted.note, /Called the parent/);
  });

  const invalid = await setFlagStatus(first.flag.learnerId, first.flag.rowKey, "ignored", "admin@example.test");
  check("an unknown status is refused rather than stored", () => {
    assert.equal(invalid, null);
  });

  const stillOpen = await listFlags({ status: "open", limit: 100 });
  check("a decided flag leaves the open queue", () => {
    assert.equal(stillOpen.rows.some((flag) => flag.rowKey === first.flag.rowKey), false);
  });

  // A default parameter fires on an explicit undefined too, so asking for every
  // status has to be spelled out or an unfiltered read comes back filtered.
  const everything = await listFlags({ status: everyStatus, limit: 100 });
  const laterHistory = await getLearnerFlags(email);
  check("asking for every status returns decided flags as well as open ones", () => {
    assert.equal(everything.rows.some((flag) => flag.rowKey === first.flag.rowKey), true);
    assert.equal(everything.rows.length > stillOpen.rows.length, true);
  });
  check("a learner's history keeps a flag someone already closed", () => {
    assert.equal(laterHistory.length, 4);
    assert.equal(laterHistory.some((flag) => flag.status === "closed"), true);
  });

  const summary = await flagSummary();
  check("the summary counts open flags by severity and learner", () => {
    assert.equal(summary.open.high >= 2, true);
    assert.equal(summary.open.low >= 1, true);
    assert.equal(summary.totals.closed >= 1, true);
    assert.equal(summary.learnersWithOpenFlags >= 2, true);
  });

  // Deleting an account must take its flags with it: the privacy notice says so.
  await deleteFlags(email);
  const afterDeletion = await getLearnerFlags(email);
  const otherAfter = await getLearnerFlags(other);
  check("deleting a learner removes their flags and no one else's", () => {
    assert.equal(afterDeletion.length, 0);
    assert.equal(otherAfter.length, 1);
  });
} finally {
  await deleteFlags(email).catch(() => {});
  await deleteFlags(other).catch(() => {});
}

console.log(failures
  ? `\n${failures} safeguarding check(s) FAILED`
  : "\nPASS: refusals recorded, severity routing, alert sent once per cooldown without the message, mail-outage resilience, per-learner history, review decisions, deletion");
process.exit(failures ? 1 : 0);
