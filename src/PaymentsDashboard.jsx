import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CreditCard, ExternalLink, RefreshCw, RotateCw } from "lucide-react";
import { readJson } from "./auth.js";

// Payments, for an administrator.
//
// Deliberately not a copy of Stripe's dashboard: refunds, invoices and card
// details stay in Stripe, which does them properly. What is here is the thing
// Stripe cannot answer - how its subscriptions line up with this application's
// own records, and which accounts need attention because of it.
const states = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Payment late" },
  { value: "cancelling", label: "Cancelling" },
  { value: "cancelled", label: "Cancelled" },
  { value: "trial", label: "Free trial" },
  { value: "trial_ended", label: "Trial ended" },
  { value: "checkout_pending", label: "Never paid" },
];

function money(amount, currency) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency || "GBP" }).format(amount);
}

function when(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function stateOf(row) {
  if (row.status === "active" && row.cancelAtPeriodEnd) return { key: "cancelling", label: "Cancelling", tone: "warn" };
  if (row.status === "active") return { key: "active", label: "Active", tone: "ok" };
  if (row.status === "past_due") return { key: "past_due", label: "Payment late", tone: "warn" };
  if (["canceled", "unpaid"].includes(row.status)) return { key: "cancelled", label: "Cancelled", tone: "off" };
  // The free week is the app's record, not a Stripe status, so it is read from
  // its own field. It comes before "Never paid" because a trial that opened
  // checkout and left it is still a trial.
  if (row.trialEndsAt) {
    return Date.parse(row.trialEndsAt) > Date.now()
      ? { key: "trial", label: `Free trial to ${when(row.trialEndsAt)}`, tone: "warn" }
      : { key: "trial_ended", label: "Trial ended", tone: "off" };
  }
  if (row.status === "checkout_pending") return { key: "checkout_pending", label: "Never paid", tone: "off" };
  if (!row.status) return { key: "checkout_pending", label: "Trial not started", tone: "off" };
  return { key: row.status, label: row.status, tone: "off" };
}

export function PaymentsDashboard({ request }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [busyRow, setBusyRow] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const response = await request("/api/billing/subscribers");
      const body = await readJson(response);
      if (!response.ok) throw new Error(body.error ?? "Subscriptions could not be loaded.");
      setData(body);
      setStatus("ready");
    } catch (failure) {
      setError(failure.message);
      setStatus("error");
    }
  }, [request]);

  useEffect(() => { load(); }, [load]);

  // Every local record comes from a webhook. This asks Stripe what is actually
  // true for one account and repairs the row, which is the only way to catch a
  // delivery that never arrived.
  async function reconcile(row) {
    setBusyRow(row.accountKey);
    setNotice("");
    setError("");
    try {
      const response = await request("/api/billing/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: row.email }),
      });
      const body = await readJson(response);
      if (!response.ok) throw new Error(body.error ?? "That account could not be reconciled.");
      setNotice(body.changed
        ? `${row.email} was out of date and is now ${body.status}.`
        : `${row.email} already matched Stripe.`);
      await load();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusyRow("");
    }
  }

  const rows = (data?.subscribers ?? []).filter((row) => !filter || stateOf(row).key === filter);
  const totals = data?.totals ?? {};
  const revenue = data?.monthlyPrice != null ? totals.active * data.monthlyPrice : null;

  return <section className="content-review payments">
    <header className="review-heading">
      <CreditCard size={22} />
      <div>
        <h2>Payments</h2>
        <p>Subscriptions as this application records them. Refunds and card details stay in Stripe.</p>
      </div>
      <button className="secondary-button" onClick={load} type="button"><RefreshCw size={15} /> Refresh</button>
    </header>

    {data && <div className="review-summary payments-summary">
      <article className="approved"><span>Active</span><strong>{totals.active ?? 0}</strong></article>
      <article><span>Monthly revenue</span><strong>{money(revenue, data.currency)}</strong></article>
      <article className="pending"><span>Payment late</span><strong>{totals.pastDue ?? 0}</strong></article>
      <article className="pending"><span>Cancelling</span><strong>{totals.cancelling ?? 0}</strong></article>
      <article className="rejected"><span>Cancelled</span><strong>{totals.cancelled ?? 0}</strong></article>
      <article className="pending"><span>Free trial</span><strong>{totals.trial ?? 0}</strong></article>
      <article><span>Setup unfinished</span><strong>{totals.setupIncomplete ?? 0}</strong></article>
    </div>}

    {data?.monthlyPrice == null && status === "ready" && <p className="note payments-note">
      <AlertTriangle size={15} /> The plan price could not be read from Stripe, so revenue is not shown. Check the Stripe key and price settings.
    </p>}

    {(totals.pastDue > 0) && <p className="note payments-note">
      <AlertTriangle size={15} /> {totals.pastDue} {totals.pastDue === 1 ? "account has" : "accounts have"} a late payment.
      Access continues while Stripe retries, and stops if it gives up.
    </p>}

    <div className="review-filters">
      <label>Show<select onChange={(event) => setFilter(event.target.value)} value={filter}>
        {states.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select></label>
    </div>

    {status === "loading" && <p className="example-status" role="status">Loading subscriptions...</p>}
    {error && <p className="login-error" role="alert">{error}</p>}
    {notice && <p className="example-status" role="status">{notice}</p>}
    {status === "ready" && !rows.length && <p className="review-empty">No subscription matches this filter.</p>}

    {rows.length > 0 && <div className="payments-scroll">
      <table className="payments-table">
        <thead><tr>
          <th scope="col">Account</th><th scope="col">State</th><th scope="col">Renews</th>
          <th scope="col">Learner setup</th><th scope="col">Welcome email</th><th scope="col"></th>
        </tr></thead>
        <tbody>
          {rows.map((row) => {
            const state = stateOf(row);
            return <tr key={row.accountKey}>
              <td><span className="payments-account"><strong>{row.email || "(no email recorded)"}</strong>
                <small>{row.plan || "learner"}</small></span></td>
              <td><span className={`state ${state.tone}`}>{state.label}</span></td>
              <td className="payments-date">{when(row.currentPeriodEnd)}</td>
              <td><span className={`state ${row.onboardingComplete ? "ok" : "warn"}`}>
                {row.onboardingComplete ? "Done" : "Unfinished"}</span></td>
              <td><span className={`state ${row.welcomeDelivery === "failed" ? "warn" : "muted"}`}>
                {row.welcomeDelivery || "—"}</span></td>
              <td className="payments-actions">
                <button disabled={busyRow === row.accountKey || !row.stripeSubscriptionId}
                  onClick={() => reconcile(row)} type="button" title="Check this account against Stripe and repair the record">
                  <RotateCw size={14} /> {busyRow === row.accountKey ? "Checking..." : "Reconcile"}
                </button>
                {row.stripeCustomerId && <a
                  href={`https://dashboard.stripe.com/customers/${row.stripeCustomerId}`}
                  rel="noreferrer noopener" target="_blank" title="Open this customer in Stripe">
                  <ExternalLink size={14} /> Stripe
                </a>}
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>}
  </section>;
}
