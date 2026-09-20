import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3, BookOpen, CalendarClock, CheckCircle2, ChevronRight, CircleDashed,
  Clock3, Gauge, RefreshCw, RotateCcw, Search, Target,
} from "lucide-react";
import { subjects as curriculumSubjects, topicsFor } from "./curriculum.js";
import { boardFor } from "./learnerProfile.js";
import { readJson } from "./auth.js";
import { topicState } from "./mastery.js";

const trackerStates = {
  completed: { label: "Completed", icon: CheckCircle2 },
  review: { label: "Review due", icon: RotateCcw },
  "in-progress": { label: "In progress", icon: Target },
  "not-started": { label: "Not started", icon: CircleDashed },
};

function minutes(seconds) {
  if (!seconds) return "0m";
  const value = Math.round(seconds / 60);
  return value < 60 ? `${value}m` : `${Math.floor(value / 60)}h ${value % 60}m`;
}

function shortDate(value) {
  if (!value) return "Not started";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function ProgressDashboard({ learner, request, audience = "student", onOpenTopic }) {
  const [data, setData] = useState({ attempts: [], mastery: [] });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [stateFilter, setStateFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function load() {
    setStatus("loading");
    setError("");
    try {
      const response = await request(`/api/progress?year=${learner.year}`);
      const result = await readJson(response);
      if (!response.ok) throw new Error(result.error ?? "Progress could not be loaded.");
      setData(result);
      setStatus("ready");
    } catch (loadError) {
      setError(loadError.message);
      setStatus("error");
    }
  }

  useEffect(() => { load(); }, [learner.year]);

  const tracker = useMemo(() => {
    const masteryByTopic = new Map(data.mastery.map((item) => [item.topicId, item]));
    return curriculumSubjects.flatMap((subject) => topicsFor({
      year: Number(learner.year), subject, examBoard: boardFor(learner, subject), tier: learner.tier,
    }).map((topic) => {
      const mastery = masteryByTopic.get(topic.id);
      return { ...topic, subject, mastery, state: topicState(mastery) };
    }));
  }, [data.mastery, learner, learner.tier, learner.year]);

  const summary = useMemo(() => {
    const attempts = data.mastery.reduce((total, item) => total + item.attempts, 0);
    const weightedAccuracy = data.mastery.reduce((total, item) => total + item.accuracy * item.attempts, 0);
    const completed = tracker.filter((item) => item.state === "completed").length;
    const started = tracker.filter((item) => item.state !== "not-started").length;
    const review = tracker.filter((item) => item.state === "review").length;
    return {
      attempts,
      accuracy: attempts ? Math.round((weightedAccuracy / attempts) * 100) : 0,
      completed, started, review,
      pending: tracker.length - completed,
      total: tracker.length,
      percentage: tracker.length ? Math.round((completed / tracker.length) * 100) : 0,
      minutes: minutes(data.mastery.reduce((total, item) => total + item.totalTimeSeconds, 0)),
    };
  }, [data.mastery, tracker]);

  const subjectCoverage = useMemo(() => curriculumSubjects.map((subject) => {
    const topics = tracker.filter((item) => item.subject === subject);
    const started = topics.filter((item) => item.state !== "not-started").length;
    const completed = topics.filter((item) => item.state === "completed").length;
    return { subject, total: topics.length, started, completed, percentage: topics.length ? Math.round((completed / topics.length) * 100) : 0 };
  }), [tracker]);

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tracker.filter((item) =>
      (subjectFilter === "All subjects" || item.subject === subjectFilter) &&
      (stateFilter === "all" || item.state === stateFilter) &&
      (!query || `${item.title} ${item.unit} ${item.subject}`.toLowerCase().includes(query))
    );
  }, [search, stateFilter, subjectFilter, tracker]);

  const groupedTopics = useMemo(() => {
    const groups = new Map();
    for (const topic of filteredTopics) {
      const key = `${topic.subject}|${topic.unit}`;
      if (!groups.has(key)) groups.set(key, { subject: topic.subject, unit: topic.unit, topics: [] });
      groups.get(key).topics.push(topic);
    }
    return [...groups.values()];
  }, [filteredTopics]);

  return (
    <section className="progress-dashboard">
      <header className="progress-header">
        <div>
          <p className="eyebrow">{audience === "parent" ? "Parent curriculum view" : "My curriculum"}</p>
          <h2>{audience === "parent" ? `${learner.firstName}'s Year ${learner.year} Curriculum Tracker` : `Year ${learner.year} Curriculum Tracker`}</h2>
          <p>{summary.started} Started, {summary.pending} Still to complete</p>
        </div>
        <button className="icon-button" onClick={load} title="Refresh progress" type="button"><RefreshCw size={18} /></button>
      </header>

      {status === "error" && <p className="progress-error" role="alert">{error}</p>}
      {status === "loading" && <p className="progress-empty">Loading curriculum progress...</p>}
      {status === "ready" && <>
        <section className="curriculum-overview" aria-label="Curriculum completion">
          <div className="curriculum-overview-copy"><span>Overall completion</span><strong>{summary.percentage}%</strong><p>{summary.completed} of {summary.total} curriculum topics completed</p></div>
          <div className="curriculum-overview-progress"><span style={{ width: `${summary.percentage}%` }} /></div>
          <div className="curriculum-state-summary">
            <span className="completed"><CheckCircle2 size={15} />{summary.completed} Completed</span>
            <span className="studied"><BookOpen size={15} />{summary.started} Started</span>
            <span className="review"><RotateCcw size={15} />{summary.review} Review due</span>
            <span className="pending"><CircleDashed size={15} />{summary.pending} Pending</span>
          </div>
        </section>

        <section className="progress-metrics" aria-label="Learning evidence">
          <article><Target size={19} /><span>Recorded attempts</span><strong>{summary.attempts}</strong></article>
          <article><Gauge size={19} /><span>Average accuracy</span><strong>{summary.accuracy}%</strong></article>
          <article><BookOpen size={19} /><span>Topics started</span><strong>{summary.started}</strong></article>
          <article><Clock3 size={19} /><span>Learning time</span><strong>{summary.minutes}</strong></article>
          <article><CalendarClock size={19} /><span>Due for review</span><strong>{summary.review}</strong></article>
        </section>

        <div className="progress-sections">
          <section className="subject-progress">
            <div className="progress-section-heading"><h3>Subject coverage</h3><span>Completed topics across the full Year {learner.year} curriculum</span></div>
            {subjectCoverage.map((item) => (
              <button className={subjectFilter === item.subject ? "subject-mastery-row selected" : "subject-mastery-row"} key={item.subject} onClick={() => setSubjectFilter(item.subject)} type="button">
                <div><strong>{item.subject}</strong><span>{item.started} started / {item.total} total</span></div>
                <div className="mastery-bar"><span style={{ width: `${item.percentage}%` }} /></div>
                <strong>{item.percentage}%</strong>
              </button>
            ))}
          </section>

          <section className="curriculum-tracker-section">
            <div className="progress-section-heading"><h3>Curriculum topics</h3><span>{filteredTopics.length} of {tracker.length} topics shown</span></div>
            <div className="tracker-toolbar">
              <label><span>Subject</span><select onChange={(event) => setSubjectFilter(event.target.value)} value={subjectFilter}><option>All subjects</option>{curriculumSubjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
              <label><span>Status</span><select onChange={(event) => setStateFilter(event.target.value)} value={stateFilter}><option value="all">All statuses</option>{Object.entries(trackerStates).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label>
              <label className="tracker-search"><span>Search</span><div><Search size={16} /><input onChange={(event) => setSearch(event.target.value)} placeholder="Topic or unit" value={search} /></div></label>
            </div>

            {groupedTopics.length === 0 ? <div className="tracker-empty"><BarChart3 size={26} /><p>No curriculum topics match these filters.</p></div> : (
              <div className="tracker-groups">
                {groupedTopics.map((group) => <section className="tracker-group" key={`${group.subject}-${group.unit}`}>
                  <header><strong>{group.subject}</strong><span>{group.unit}</span></header>
                  {group.topics.map((topic) => {
                    const state = trackerStates[topic.state];
                    const StateIcon = state.icon;
                    return <article className="tracker-topic" key={topic.id}>
                      <div className={`tracker-state-icon ${topic.state}`}><StateIcon size={17} /></div>
                      <div className="tracker-topic-copy"><strong>{topic.title}</strong><p>{topic.goal}</p><span className={`tracker-status ${topic.state}`}>{state.label}</span></div>
                      <div className="tracker-evidence">
                        {topic.mastery ? <><strong>{topic.mastery.masteryScore}% mastery</strong><span>{topic.mastery.attempts} {topic.mastery.attempts === 1 ? "attempt" : "attempts"}</span><small>{shortDate(topic.mastery.lastPractised)}</small></> : <><strong>No evidence yet</strong><span>0 attempts</span><small>Not started</small></>}
                      </div>
                      <button aria-label={`Open ${topic.title}`} onClick={() => onOpenTopic?.(topic)} title="Open in learning hub" type="button"><ChevronRight size={18} /></button>
                    </article>;
                  })}
                </section>)}
              </div>
            )}
          </section>
        </div>
      </>}
    </section>
  );
}
