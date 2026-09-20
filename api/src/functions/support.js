import { app } from "@azure/functions";
import { developmentBypass, getPrincipal, isAdministrator, principalEmail } from "../lib/auth.js";
import { getProfile } from "../lib/signupStore.js";
import { getSubscription } from "../lib/subscriptionStore.js";
import { sendSupportReceiptEmail, sendSupportTicketEmail } from "../lib/email.js";
import {
  categories,
  createTicket,
  getTicket,
  listAllTickets,
  listTickets,
  replyToTicket,
  statuses,
} from "../lib/supportStore.js";

// The support desk.
//
// Signing in is required, and that is the point rather than an obstacle: the
// account already knows who the customer is, how to reach them and what they
// pay for, so a ticket carries all of it without anyone being asked to type it
// again while they are already annoyed.
//
// It deliberately does NOT use getLearningAccess(). That check guards the
// curriculum and refuses an inactive subscription - which would lock out
// precisely the person whose payment has just failed and who most needs to
// reach somebody.
async function identity(request) {
  const principal = await getPrincipal(request);
  const email = principalEmail(principal) || (developmentBypass() ? "local@example.com" : "");
  const admin = developmentBypass() || isAdministrator(principal);
  return { email, admin };
}

// The details a ticket is stamped with, gathered from the account rather than
// asked for. A missing profile is not a reason to refuse help.
async function contextFor(email) {
  const [profile, subscription] = await Promise.all([
    getProfile(email).catch(() => null),
    getSubscription(email).catch(() => null),
  ]);
  return {
    name: profile?.guardianName ?? "",
    learnerName: profile?.studentFirstName ?? "",
    phone: profile?.guardianPhone ?? "",
    plan: subscription?.plan ?? "",
    subscriptionStatus: subscription?.status ?? "none",
  };
}

app.http("support", {
  methods: ["GET", "POST", "PATCH"],
  authLevel: "anonymous",
  route: "support/{reference?}",
  handler: async (request, context) => {
    try {
      const { email, admin } = await identity(request);
      if (!email) {
        return { status: 401, jsonBody: { error: "Sign in to raise or read a support ticket." } };
      }

      const reference = request.params.reference ?? "";

      // What the form needs to render, and who it is rendering for.
      if (request.method === "GET" && reference === "meta") {
        return { jsonBody: { categories, statuses, contact: await contextFor(email), admin } };
      }

      if (request.method === "GET" && reference === "all") {
        if (!admin) return { status: 403, jsonBody: { error: "An administrator account is required." } };
        return { jsonBody: { tickets: await listAllTickets({ status: request.query.get("status") ?? "live" }) } };
      }

      if (request.method === "GET" && reference) {
        // An administrator may open any ticket; everybody else only their own.
        const ticket = await getTicket(reference, admin ? {} : { email });
        if (!ticket) return { status: 404, jsonBody: { error: "That ticket reference was not found." } };
        return { jsonBody: { ticket } };
      }

      if (request.method === "GET") {
        return { jsonBody: { tickets: await listTickets(email), contact: await contextFor(email) } };
      }

      if (request.method === "POST") {
        const body = await request.json();
        const contact = await contextFor(email);
        const result = await createTicket(email, body, contact);
        if (!result.ok) return { status: 400, jsonBody: { error: result.error } };

        const appUrl = process.env.APP_BASE_URL ?? new URL(request.url).origin;
        // Told, then acknowledged. Neither email decides whether the ticket
        // exists - it is already stored - so a mail outage costs a notification
        // rather than somebody's request for help.
        let acknowledged = false;
        try {
          await sendSupportTicketEmail({
            reference: result.ticket.reference,
            subject: result.ticket.subject,
            category: result.ticket.category,
            priority: result.ticket.priority,
            name: contact.learnerName ? `${contact.name} (${contact.learnerName})` : contact.name,
            email,
            dashboardUrl: `${appUrl}/#support`,
          });
        } catch (failure) {
          context.error(`Support alert could not be sent: ${failure.message}`);
        }
        try {
          await sendSupportReceiptEmail({ email, reference: result.ticket.reference, subject: result.ticket.subject, appUrl });
          acknowledged = true;
        } catch (failure) {
          context.warn(`Support receipt could not be sent: ${failure.message}`);
        }
        return { status: 201, jsonBody: { ticket: result.ticket, acknowledged } };
      }

      // PATCH: a reply, from either side of the desk.
      if (!reference) return { status: 400, jsonBody: { error: "A ticket reference is required." } };
      const body = await request.json();

      if (!admin) {
        // Ownership first: a reference is short enough to guess at.
        const own = await getTicket(reference, { email });
        if (!own) return { status: 404, jsonBody: { error: "That ticket reference was not found." } };
        // A customer may add to their ticket, never set its status.
        const replied = await replyToTicket(reference, { from: "customer", body: body.message });
        if (!replied.ok) return { status: 400, jsonBody: { error: replied.error } };
        return { jsonBody: { ticket: replied.ticket } };
      }

      const replied = await replyToTicket(reference, {
        from: "support",
        body: body.message,
        status: statuses.includes(body.status) ? body.status : undefined,
      });
      if (!replied.ok) return { status: 400, jsonBody: { error: replied.error } };
      return { jsonBody: { ticket: replied.ticket } };
    } catch (error) {
      context.error("Support desk failure", error.message);
      return { status: 503, jsonBody: { error: "The support desk is unavailable. Please try again." } };
    }
  },
});
