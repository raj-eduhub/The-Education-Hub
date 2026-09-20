// The support desk.
//
// Runs against the storage emulator with no server and no mail service: the
// store is exercised directly, the way the billing suite exercises its events.
//
//   node api/scripts/test-support.mjs
import { readFileSync } from "node:fs";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  try {
    const local = JSON.parse(readFileSync(new URL("../local.settings.json", import.meta.url), "utf8").replace(/^﻿/, ""));
    for (const [key, value] of Object.entries(local.Values ?? {})) process.env[key] ??= value;
  } catch {
    process.env.AZURE_STORAGE_CONNECTION_STRING ??= "UseDevelopmentStorage=true";
  }
}

const {
  createTicket, deleteTickets, getTicket, listAllTickets, listTickets,
  priorityFor, replyToTicket, validateTicket,
} = await import("../src/lib/supportStore.js");

const email = `support-${Date.now()}@example.test`;
const other = `other-${Date.now()}@example.test`;
const contact = { name: "Jo Taylor", learnerName: "Rhea", phone: "07700 900123", plan: "learner", subscriptionStatus: "past_due" };

let failures = 0;
const check = (ok, label, detail) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
};

await deleteTickets(email).catch(() => {});
await deleteTickets(other).catch(() => {});

// --- what a ticket must contain to be actionable -----------------------------
check(validateTicket({ category: "nope", subject: "Hi", message: "x".repeat(20) }).valid === false,
  "an unknown category is refused");
check(validateTicket({ category: "billing", subject: "Hi", message: "too short" }).valid === false,
  "a message too short to act on is refused");
check(validateTicket({ category: "billing", subject: "Charged twice", message: "I have been charged twice this month." }).valid === true,
  "a complete ticket is accepted");

// --- raising one -------------------------------------------------------------
const raised = await createTicket(email, {
  category: "billing",
  subject: "Charged twice this month",
  message: "My card was charged twice in September and I would like one refunded.",
}, contact);
check(raised.ok === true, "the ticket is raised", raised.error ?? "");

const ticket = raised.ticket;
check(/^EH-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/.test(ticket.reference),
  "the reference is readable down a telephone", ticket.reference);
check(!/[01OIL]/.test(ticket.reference.slice(3)), "and avoids the characters people mishear");

// --- the details the customer did not have to type ---------------------------
check(ticket.name === "Jo Taylor" && ticket.phone === "07700 900123" && ticket.email === email,
  "the ticket carries the name, phone and email from the account",
  `${ticket.name} / ${ticket.phone}`);
check(ticket.plan === "learner" && ticket.subscriptionStatus === "past_due",
  "and the subscription it was raised against", `${ticket.plan} / ${ticket.subscriptionStatus}`);
check(ticket.learnerName === "Rhea",
  "and the child it concerns, named apart from the parent", `${ticket.name} (${ticket.learnerName})`);

// A subscription that has failed is exactly when somebody needs the desk, so
// the state is recorded rather than used to turn them away.
check(ticket.status === "open", "it starts open");
check(ticket.priority === "high" && priorityFor("content") === "normal",
  "billing is prioritised over a content query", `${ticket.priority} vs ${priorityFor("content")}`);

// --- only the person who raised it can read it -------------------------------
check((await getTicket(ticket.reference, { email })) !== null, "the owner can open it");
check((await getTicket(ticket.reference, { email: other })) === null,
  "somebody else with the reference cannot");
check((await getTicket(ticket.reference, {})) !== null, "an administrator can, with no email to match");

// --- the conversation --------------------------------------------------------
const answered = await replyToTicket(ticket.reference, { from: "support", body: "We can see the duplicate and have refunded it." });
check(answered.ok && answered.ticket.messages.length === 2, "support can reply");
check(answered.ticket.status === "waiting-on-customer", "which puts the ball in the customer's court", answered.ticket.status);

const resolved = await replyToTicket(ticket.reference, { from: "support", body: "Refund sent.", status: "resolved" });
check(resolved.ticket.status === "resolved", "and can resolve it");

const reopened = await replyToTicket(ticket.reference, { from: "customer", body: "The refund has not arrived." });
check(reopened.ticket.status === "open",
  "a customer writing back on a resolved ticket reopens it", reopened.ticket.status);

// --- the queue ---------------------------------------------------------------
await createTicket(other, {
  category: "content", subject: "A question looks wrong",
  message: "The answer to the standard form question does not look right to me.",
}, { name: "Sam Patel", phone: "", plan: "learner", subscriptionStatus: "active" });

const queue = await listAllTickets({ status: "live" });
const mine = queue.filter((row) => row.email === email || row.email === other);
check(mine.length === 2, "both tickets are in the queue", `${mine.length}`);
check(mine[0].priority === "high", "the urgent one is first", `${mine[0].category} before ${mine[1].category}`);

const own = await listTickets(email);
check(own.length === 1 && own[0].reference === ticket.reference,
  "a customer sees only their own", `${own.length} ticket(s)`);

// --- deletion with the account ----------------------------------------------
await deleteTickets(email);
check((await listTickets(email)).length === 0, "tickets are deleted with the account");
await deleteTickets(other);

console.log(failures ? `\n${failures} check(s) FAILED` : "\nPASS: tickets are raised with the account's own details, private to their owner, and queued by urgency");
process.exit(failures ? 1 : 0);
