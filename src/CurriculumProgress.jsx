import React, { useMemo } from "react";
import { progressFor, stateLabels, topicStates } from "./mastery.js";

// How much of the curriculum has actually been started.
//
// Scoped to the subject the learner is actually on. The bar is drawn to that
// whole subject, not to what has been touched: an empty bar is the honest
// picture at the start, and one that filled as soon as a single topic was
// touched would flatter the learner into stopping.
//
// Segments are ordered by how settled the work is - secure, then due for
// review, then started - so the bar reads left to right as progress.
export function CurriculumProgress({ topics, mastery, subject, year }) {
  const byTopic = useMemo(
    () => new Map((mastery ?? []).map((item) => [item.topicId, item])),
    [mastery]
  );

  const subjectProgress = useMemo(() => progressFor(topics ?? [], byTopic), [topics, byTopic]);

  if (!subjectProgress.total) return null;

  const filled = topicStates.filter((state) => state !== "not-started");
  const percent = (count) => (count / subjectProgress.total) * 100;

  return <section className="curriculum-progress" aria-label={`${subject} coverage`}>
    <div className="progress-heading">
      <span className="progress-title">
        <strong>{subjectProgress.started}</strong> of {subjectProgress.total} topics started
      </span>
      {/* Names what the bar counts, rather than offering a second number to
          compare it against: the learner is working on one subject. */}
      <span className="progress-aside">Year {year} {subject}</span>
    </div>

    <div aria-hidden="true" className="progress-track">
      {filled.map((state) => subjectProgress[state] > 0 && (
        <span className={`progress-fill ${state}`} key={state}
          style={{ width: `${percent(subjectProgress[state])}%` }} />
      ))}
    </div>

    {/* The track is decorative; this list is what a screen reader and a
        colour-blind reader actually get the numbers from. */}
    <ul className="progress-key">
      {topicStates.map((state) => (
        // A state nobody is in is still worth listing - it shows the whole
        // scheme - but drawn at full strength it reads as though it is there.
        <li className={state} data-empty={subjectProgress[state] === 0} key={state}>
          <span className="progress-dot" />
          {stateLabels[state]}
          <strong>{subjectProgress[state]}</strong>
        </li>
      ))}
    </ul>
  </section>;
}
