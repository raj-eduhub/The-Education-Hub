import React, { useCallback, useEffect, useState } from "react";
import { ChevronDown, Phone, RefreshCw, ShieldAlert, TriangleAlert } from "lucide-react";
import { readJson } from "./auth.js";

const severities = [
  { value: "", label: "All severities" },
  { value: "high", label: "High: safety" },
  { value: "medium", label: "Medium: injection and leaks" },
  { value: "low", label: "Low: off-topic and integrity" },
];
const statuses = [
  { value: "open", label: "Open" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "escalated", label: "Escalated" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "Every flag" },
];
const reasonLabels = {
  unsafe: "Safety rule",
  injection: "Prompt injection",
  leak: "Instructions leaked into a reply",
  integrity: "Academic integrity",
  "off-topic": "Off topic",
};

function when(value) {
  if (!value) return "";
  const date = new Date(value);
  return `${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function SafeguardingReview({ request }) {
  const [filters, setFilters] = useState({ severity: "", status: "open" });
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [busyRow, setBusyRow] = useState("");
  const [notes, setNotes] = useState({});
  const [cursor, setCursor] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [history, setHistory] = useState({ email: "", rows: [], loading: false });

  const query = useCallback((extra = {}) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, ...extra })) if (value) search.set(key, value);
    search.set("limit", "25");
    return search.toString();
  }, [filters]);

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const [listResponse, summaryResponse] = await Promise.all([
        request(`/api/safeguarding?${query()}`),
        request("/api/safeguarding/summary"),
      ]);
      const data = await readJson(listResponse);
      if (!listResponse.ok) throw new Error(data.error ?? "Flags could not be loaded.");
      setRows(data.rows ?? []);
      setCursor(data.cursor ?? "");
      setSummary(await readJson(summaryResponse));
      setStatus("ready");
    } catch (failure) {
      setError(failure.message);
      setStatus("error");
    }
  }, [query, request]);

  useEffect(() => { load(); }, [load]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const response = await request(`/api/safeguarding?${query({ cursor })}`);
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "More flags could not be loaded.");
      setRows((items) => [...items, ...(data.rows ?? [])]);
      setCursor(data.cursor ?? "");
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoadingMore(false);
    }
  }

  // "Has this happened before?" is the next question an adult asks, so a
  // learner's whole history is one click away from any flag.
  async function openHistory(email) {
    if (history.email === email) return setHistory({ email: "", rows: [], loading: false });
    setHistory({ email, rows: [], loading: true });
    try {
      const response = await request(`/api/safeguarding/learner?email=${encodeURIComponent(email)}`);
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "That history could not be loaded.");
      setHistory({ email, rows: data.rows ?? [], loading: false });
    } catch (failure) {
      setError(failure.message);
      setHistory({ email: "", rows: [], loading: false });
    }
  }

  async function decide(row, decision) {
    setBusyRow(row.id);
    setError("");
    try {
      const response = await request("/api/safeguarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerId: row.learnerId, rowKey: row.rowKey, status: decision, note: notes[row.id] ?? "" }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "That decision could not be saved.");
      // The list is filtered by status, so a decided flag leaves it unless every
      // flag is being shown.
      setRows((items) => filters.status === "all"
        ? items.map((item) => (item.id === row.id ? { ...item, ...data.flag } : item))
        : items.filter((item) => item.id !== row.id));
      setSummary((current) => current && {
        ...current,
        open: { ...current.open, [row.severity]: Math.max(0, (current.open[row.severity] ?? 0) - (row.status === "open" ? 1 : 0)) },
        totals: {
          ...current.totals,
          [row.status]: Math.max(0, (current.totals[row.status] ?? 0) - 1),
          [decision]: (current.totals[decision] ?? 0) + 1,
        },
      });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusyRow("");
    }
  }

  function update(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return <section className="content-review safeguarding">
    <header className="review-heading">
      <ShieldAlert size={22} />
      <div>
        <h2>Safeguarding</h2>
        <p>Messages the tutor refused. High-severity flags also email the administrators.</p>
      </div>
      <button className="secondary-button" onClick={load} type="button"><RefreshCw size={15} /> Refresh</button>
    </header>

    {summary && <div className="review-summary safeguarding-summary">
      <article className="high"><span>Open safety flags</span><strong>{summary.open?.high ?? 0}</strong></article>
      <article className="medium"><span>Open injection flags</span><strong>{summary.open?.medium ?? 0}</strong></article>
      <article className="low"><span>Open low-severity flags</span><strong>{summary.open?.low ?? 0}</strong></article>
      <article><span>Learners with open flags</span><strong>{summary.learnersWithOpenFlags ?? 0}</strong></article>
    </div>}

    <div className="review-filters">
      <label>Status<select onChange={(event) => update("status", event.target.value)} value={filters.status}>
        {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select></label>
      <label>Severity<select onChange={(event) => update("severity", event.target.value)} value={filters.severity}>
        {severities.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select></label>
    </div>

    {status === "loading" && <p className="example-status" role="status">Loading flags...</p>}
    {error && <p className="login-error" role="alert">{error}</p>}
    {status === "ready" && rows.length === 0 && <p className="review-empty">
      No {filters.status === "all" ? "" : filters.status} flags match these filters.
    </p>}

    <div className="review-list">
      {rows.map((row) => <article className={`review-card flag-${row.severity}`} key={row.id}>
        <div className="review-card-meta">
          <span className={`flag-severity ${row.severity}`}>
            {row.severity === "high" && <TriangleAlert size={13} />} {reasonLabels[row.reason] ?? row.reason}
          </span>
          <strong>{row.studentName || row.email}</strong>
          <span>{row.year ? `Year ${row.year}` : ""} {row.subject}{row.topicTitle ? ` / ${row.topicTitle}` : ""}</span>
          <span>{when(row.createdAt)}</span>
          {row.status !== "open" && <span className={`flag-status ${row.status}`}>{row.status}</span>}
        </div>

        <blockquote className="flag-message">{row.message || "The message was empty."}</blockquote>

        <div className="flag-contact">
          {row.guardian?.name
            ? <span><Phone size={13} /> {row.guardian.name}{row.guardian.relationship ? ` (${row.guardian.relationship})` : ""} {row.guardian.phone}</span>
            : <span>No guardian contact is on file for {row.email}.</span>}
          <button className="link-button" onClick={() => openHistory(row.email)} type="button">
            {history.email === row.email ? "Hide" : "Show"} this learner's history
          </button>
          {row.severity === "high" && <span className={row.alerted ? "flag-alerted" : "flag-not-alerted"}>
            {row.alerted ? "Administrators were emailed" : row.alertError ? `Alert not delivered: ${row.alertError}` : "No alert sent"}
          </span>}
        </div>

        {history.email === row.email && <div className="flag-history">
          {history.loading ? <p>Loading history...</p> : <ul>
            {history.rows.map((item) => <li key={item.id}>
              <span className={`flag-severity ${item.severity}`}>{reasonLabels[item.reason] ?? item.reason}</span>
              <span>{when(item.createdAt)}</span>
              <span>{item.status}</span>
            </li>)}
            {history.rows.length === 0 && <li>No other flags for this learner.</li>}
          </ul>}
        </div>}

        <label className="flag-note">
          What was done
          <input
            onChange={(event) => setNotes((current) => ({ ...current, [row.id]: event.target.value }))}
            placeholder="Spoke to the parent, referred to the school safeguarding lead..."
            value={notes[row.id] ?? row.note ?? ""}
          />
        </label>

        <div className="review-actions">
          <button className="approve" disabled={busyRow === row.id} onClick={() => decide(row, "acknowledged")} type="button">Acknowledge</button>
          <button className="escalate" disabled={busyRow === row.id} onClick={() => decide(row, "escalated")} type="button">Escalate</button>
          <button className="reject" disabled={busyRow === row.id} onClick={() => decide(row, "closed")} type="button">Close</button>
          {row.reviewedBy && <span className="review-by">Last decided by {row.reviewedBy}</span>}
        </div>
      </article>)}
    </div>

    {cursor && status === "ready" && <button className="review-more" disabled={loadingMore} onClick={loadMore} type="button">
      <ChevronDown size={16} /> {loadingMore ? "Loading..." : "Load more"}
    </button>}
  </section>;
}
