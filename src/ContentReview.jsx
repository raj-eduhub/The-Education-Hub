import React, { useCallback, useEffect, useState } from "react";
import { BadgeCheck, ChevronDown, ChevronRight, CircleSlash, ClipboardCheck, RefreshCw } from "lucide-react";
import { readJson } from "./auth.js";
import { subjects } from "./curriculum.js";
import { MathsText } from "./MathsText.jsx";

const years = [7, 8, 9, 10, 11];
const types = [
  { value: "", label: "All content" },
  { value: "explanation", label: "Explanations" },
  { value: "example", label: "Worked examples" },
  { value: "practice", label: "Practice questions" },
  { value: "exam", label: "Exam questions" },
];
const statuses = [
  { value: "pending", label: "Awaiting review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// Renders whatever shape the stored row has, so one screen covers explanations,
// worked examples, and both question banks.
function ContentBody({ payload, maths }) {
  if (!payload) return <p className="review-empty">This row could not be read.</p>;
  return <div className="review-body">
    {payload.explanation && <p><MathsText enabled={maths}>{payload.explanation}</MathsText></p>}
    {payload.keyIdeas?.length > 0 && <ul>{payload.keyIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul>}
    {payload.question && <p><strong>Question:</strong> <MathsText enabled={maths}>{payload.question}</MathsText></p>}
    {payload.marks ? <p className="review-marks">{payload.marks} {payload.marks === 1 ? "mark" : "marks"}</p> : null}
    {payload.hint && <p><strong>Hint:</strong> <MathsText enabled={maths}>{payload.hint}</MathsText></p>}
    {payload.formulae?.length > 0 && <div className="review-formulae">{payload.formulae.map((f) => <code key={f}><MathsText enabled={maths}>{f}</MathsText></code>)}</div>}
    {(payload.steps ?? payload.working ?? payload.markScheme ?? []).length > 0 && <ol>
      {(payload.steps ?? payload.working ?? payload.markScheme).map((step, index) => <li key={index}><MathsText enabled={maths}>{step}</MathsText></li>)}
    </ol>}
    {payload.answer && <p className="worked-answer"><strong>Answer:</strong> <MathsText enabled={maths}>{payload.answer}</MathsText></p>}
    {payload.raw && <p className="example-raw">{payload.raw}</p>}
  </div>;
}

export function ContentReview({ request }) {
  const [filters, setFilters] = useState({ year: "", subject: "", type: "", status: "pending" });
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [busyRow, setBusyRow] = useState("");
  const [cursor, setCursor] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [bulk, setBulk] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) if (value) query.set(key, value);
      query.set("limit", "25");
      const [listResponse, summaryResponse] = await Promise.all([
        request(`/api/review?${query.toString()}`),
        request("/api/review/summary"),
      ]);
      const data = await readJson(listResponse);
      if (!listResponse.ok) throw new Error(data.error ?? "Content could not be loaded.");
      setRows(data.rows ?? []);
      setCursor(data.cursor ?? "");
      setSummary(await readJson(summaryResponse));
      setStatus("ready");
    } catch (failure) {
      setError(failure.message);
      setStatus("error");
    }
  }, [filters, request]);

  useEffect(() => { load(); }, [load]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) if (value) query.set(key, value);
      query.set("limit", "25");
      query.set("cursor", cursor);
      const response = await request(`/api/review?${query.toString()}`);
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "More content could not be loaded.");
      setRows((items) => [...items, ...(data.rows ?? [])]);
      setCursor(data.cursor ?? "");
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoadingMore(false);
    }
  }

  // Applies one decision to everything matching the current filters, not just
  // the rows on screen, so a reviewed batch can be cleared in one action.
  async function applyBulk(decision) {
    setBulkBusy(true);
    setError("");
    try {
      const response = await request("/api/review/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, ...filters }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "That decision could not be applied.");
      setBulk(null);
      await load();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBulkBusy(false);
    }
  }

  async function decide(row, decision) {
    setBusyRow(row.rowKey + row.topicId);
    try {
      const response = await request("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: row.topicId, rowKey: row.rowKey, status: decision }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "That decision could not be saved.");
      // Reviewed rows leave the current list, which is filtered by status.
      setRows((items) => items.filter((item) => !(item.topicId === row.topicId && item.rowKey === row.rowKey)));
      setSummary((current) => current && {
        ...current,
        totals: {
          ...current.totals,
          [row.reviewStatus]: Math.max(0, (current.totals[row.reviewStatus] ?? 0) - 1),
          [decision]: (current.totals[decision] ?? 0) + 1,
        },
      });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusyRow("");
    }
  }

  // The API refuses an unfiltered bulk decision, so the control reflects that
  // rather than offering an action that will be rejected.
  const narrowed = Boolean(filters.type || filters.year || filters.subject);

  function update(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return <section className="content-review">
    <header className="review-heading">
      <ClipboardCheck size={22} />
      <div>
        <h2>Content review</h2>
        <p>Curriculum content is written by the model. Approve it before learners see it.</p>
      </div>
      <button className="secondary-button" onClick={load} type="button"><RefreshCw size={15} /> Refresh</button>
    </header>

    {summary && <div className="review-summary">
      <article className="pending"><span>Awaiting review</span><strong>{summary.totals.pending ?? 0}</strong></article>
      <article className="approved"><span>Approved</span><strong>{summary.totals.approved ?? 0}</strong></article>
      <article className="rejected"><span>Rejected</span><strong>{summary.totals.rejected ?? 0}</strong></article>
    </div>}

    <div className="review-filters">
      <label>Status<select onChange={(event) => update("status", event.target.value)} value={filters.status}>
        {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select></label>
      <label>Type<select onChange={(event) => update("type", event.target.value)} value={filters.type}>
        {types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select></label>
      <label>Year<select onChange={(event) => update("year", event.target.value)} value={filters.year}>
        <option value="">All years</option>
        {years.map((year) => <option key={year} value={year}>Year {year}</option>)}
      </select></label>
      <label>Subject<select onChange={(event) => update("subject", event.target.value)} value={filters.subject}>
        <option value="">All subjects</option>
        {subjects.map((subject) => <option key={subject}>{subject}</option>)}
      </select></label>
    </div>

    {status === "ready" && rows.length > 0 && <div className="review-bulk">
      <span>
        {filters.status === "pending" ? "Reviewing" : "Showing"} {rows.length}{cursor ? "+" : ""} matching {filters.type || "item"}
        {rows.length === 1 ? "" : "s"}
        {filters.year ? ` in Year ${filters.year}` : ""}{filters.subject ? ` ${filters.subject}` : ""}.
      </span>
      {bulk ? <span className="review-bulk-confirm">
        <strong>{bulk === "approved" ? "Approve" : "Reject"} everything matching these filters?</strong>
        <button className={bulk === "approved" ? "approve" : "reject"} disabled={bulkBusy} onClick={() => applyBulk(bulk)} type="button">
          {bulkBusy ? "Applying..." : "Yes, apply to all"}
        </button>
        <button className="secondary-button" disabled={bulkBusy} onClick={() => setBulk(null)} type="button">Cancel</button>
      </span> : <span className="review-bulk-actions">
        {narrowed ? <>
          <button className="approve" onClick={() => setBulk("approved")} type="button"><BadgeCheck size={15} /> Approve all matching</button>
          <button className="reject" onClick={() => setBulk("rejected")} type="button"><CircleSlash size={15} /> Reject all matching</button>
        </> : <em>Choose a type, year or subject to act on a batch.</em>}
      </span>}
    </div>}

    {status === "loading" && <p className="example-status" role="status">Loading content...</p>}
    {error && <p className="login-error" role="alert">{error}</p>}
    {status === "ready" && rows.length === 0 && <p className="review-empty">Nothing matches these filters. {filters.status === "pending" && "Everything here has been reviewed."}</p>}

    <div className="review-list">
      {rows.map((row) => {
        const key = row.topicId + row.rowKey;
        return <article className="review-card" key={key}>
          <div className="review-card-meta">
            <span className={`review-type ${row.type}`}>{row.type}</span>
            <span>Year {row.year} {row.subject}</span>
            <span>{row.topicTitle}{row.subtopicTitle ? ` / ${row.subtopicTitle}` : ""}</span>
            <code>{row.rowKey}</code>
          </div>
          <ContentBody maths={row.subject === "Maths"} payload={row.payload} />
          <div className="review-actions">
            <button
              className="approve"
              disabled={busyRow === key}
              onClick={() => decide(row, "approved")}
              type="button"
            ><BadgeCheck size={16} /> Approve</button>
            <button
              className="reject"
              disabled={busyRow === key}
              onClick={() => decide(row, "rejected")}
              type="button"
            ><CircleSlash size={16} /> Reject</button>
            {row.reviewedBy && <span className="review-by">Last decided by {row.reviewedBy}</span>}
            {row.origin === "model" && <span className="review-by">Written by {row.model || "the model"} <ChevronRight size={12} /></span>}
          </div>
        </article>;
      })}
    </div>

    {cursor && status === "ready" && <button className="review-more" disabled={loadingMore} onClick={loadMore} type="button">
      <ChevronDown size={16} /> {loadingMore ? "Loading..." : "Load more"}
    </button>}
  </section>;
}
