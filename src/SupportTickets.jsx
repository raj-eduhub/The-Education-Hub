import React, { useEffect, useMemo, useState } from "react";
import { LifeBuoy, Send, ShieldAlert } from "lucide-react";
import { authFetch, readJson } from "./auth.js";

// Help and support, from inside the account.
//
// The point of it being here rather than an email address is that the account
// already knows who is asking, how to reach them and what they pay for. None of
// that is typed again: it is shown back so the customer can see what will be
// attached, and sent with the ticket.
const labels = {
  billing: "Billing, refunds and cancellations",
  account: "Signing in, or an email that never arrived",
  content: "Something in a lesson looks wrong",
  technical: "Anything technical",
  other: "Something else",
};

const statusWords = {
  "open": "Open",
  "in-progress": "Being looked at",
  "waiting-on-customer": "Waiting on you",
  "resolved": "Resolved",
  "closed": "Closed",
};

// The parent holds the account, so their name leads. The child is named in
// brackets after it, because a ticket about "Rhea" means nothing to whoever
// picks it up unless the account it belongs to is named too.
function raisedBy(contact) {
  const parent = contact?.name || "Your account";
  return contact?.learnerName ? `${parent} (${contact.learnerName})` : parent;
}

// The state is the part anybody acts on; naming the plan as well says nothing
// extra while there is only one. Statuses arrive as slugs, so "past_due" is
// shown as "Past due" rather than as it is stored.
function subscriptionLine(contact) {
  const status = String(contact?.subscriptionStatus ?? "").replace(/_/g, " ").trim();
  if (!status || status === "none") return "No subscription on record";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function when(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [contact, setContact] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [raised, setRaised] = useState(null);
  const [open, setOpen] = useState("");
  const [reply, setReply] = useState("");
  const [form, setForm] = useState({ category: "billing", subject: "", message: "" });

  async function load() {
    try {
      const response = await authFetch("/api/support");
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Support is unavailable.");
      setTickets(data.tickets ?? []);
      setContact(data.contact ?? null);
      setState("ready");
    } catch (failure) {
      setError(failure.message);
      setState("error");
    }
  }

  useEffect(() => { load(); }, []);

  const current = useMemo(() => tickets.find((t) => t.reference === open) ?? null, [tickets, open]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setState("sending");
    try {
      const response = await authFetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "The ticket could not be raised.");
      setRaised(data.ticket);
      setForm({ category: "billing", subject: "", message: "" });
      await load();
    } catch (failure) {
      setError(failure.message);
      setState("ready");
    }
  }

  async function addReply(event) {
    event.preventDefault();
    if (!current || reply.trim().length < 2) return;
    setError("");
    try {
      const response = await authFetch(`/api/support/${current.reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "That could not be added.");
      setReply("");
      await load();
    } catch (failure) {
      setError(failure.message);
    }
  }

  return <section className="support-page">
    <header className="support-header">
      <div><LifeBuoy size={22} /><div><h2>Help and support</h2><p>Raised from your account, so we already have your details.</p></div></div>
    </header>

    {error && <p className="login-error" role="alert">{error}</p>}

    {raised && <div className="ticket-raised" role="status">
      <strong>Your reference is {raised.reference}</strong>
      <p>We have your message and somebody will read it. Quote that reference in any email about it, or follow it below.</p>
      <button className="login-link" onClick={() => setRaised(null)} type="button">Close</button>
    </div>}

    <div className="support-layout">
      <form className="support-form" onSubmit={submit}>
        <h3>Raise a ticket</h3>

        {/* Shown rather than asked for: the customer can see exactly what will
            travel with the ticket, which is the whole reason for signing in. */}
        {contact && <div className="ticket-contact">
          <span>Sent with your ticket</span>
          <dl className="contact-rows">
            <div className="contact-row"><dt>Name</dt><dd><strong>{raisedBy(contact)}</strong></dd></div>
            {contact.phone && <div className="contact-row"><dt>Mobile</dt><dd>{contact.phone}</dd></div>}
            <div className="contact-row"><dt>Subscription</dt><dd>{subscriptionLine(contact)}</dd></div>
          </dl>
        </div>}

        <label>What is it about?
          <select onChange={(event) => setForm({ ...form, category: event.target.value })} value={form.category}>
            {Object.entries(labels).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
        </label>

        <label>Subject
          <input maxLength={140} onChange={(event) => setForm({ ...form, subject: event.target.value })}
                 placeholder="A few words about the problem" required value={form.subject} />
        </label>

        <label>What happened?
          <textarea maxLength={4000} onChange={(event) => setForm({ ...form, message: event.target.value })}
                    placeholder="What you expected, what happened instead, and anything you have already tried."
                    required rows={7} value={form.message} />
        </label>

        <button className="primary-button" disabled={state === "sending"} type="submit">
          <Send size={16} /> {state === "sending" ? "Sending..." : "Send it"}
        </button>

        <p className="support-emergency"><ShieldAlert size={16} /><span>
          If you are worried about a child&rsquo;s immediate safety, do not use a ticket.
          Contact the police on <strong>999</strong>, or the NSPCC on <strong>0808 800 5000</strong>.
        </span></p>
      </form>

      <div className="support-list">
        <h3>Your tickets</h3>
        {state === "loading" && <p className="review-empty">Loading.</p>}
        {state !== "loading" && !tickets.length && <p className="review-empty">You have not raised anything yet.</p>}

        {tickets.map((ticket) => <article className={`ticket-card${open === ticket.reference ? " open" : ""}`} key={ticket.reference}>
          <button className="ticket-summary" onClick={() => setOpen(open === ticket.reference ? "" : ticket.reference)} type="button">
            <span className="ticket-ref">{ticket.reference}</span>
            <span className="ticket-subject">{ticket.subject}</span>
            <span className={`ticket-state is-${ticket.status}`}>{statusWords[ticket.status] ?? ticket.status}</span>
          </button>

          {open === ticket.reference && <div className="ticket-thread">
            {ticket.messages.map((entry, index) => <div className={`ticket-message from-${entry.from}`} key={index}>
              <span className="ticket-who">{entry.from === "customer" ? "You" : "Support"} · {when(entry.at)}</span>
              <p>{entry.body}</p>
            </div>)}

            {ticket.status !== "closed" && <form className="ticket-reply" onSubmit={addReply}>
              <textarea onChange={(event) => setReply(event.target.value)} placeholder="Add anything else" rows={3} value={reply} />
              <button className="secondary-button" type="submit">Add to this ticket</button>
            </form>}
          </div>}
        </article>)}
      </div>
    </div>
  </section>;
}
