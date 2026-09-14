import React from "react";
import { CalendarClock, CheckCircle2, Repeat2, Target } from "lucide-react";
import { QuestionPanel } from "./QuestionPanel.jsx";

// Review is spaced retrieval rather than another chat prompt: it re-asks the
// specific questions the learner did not get right, most overdue and least
// secure first, using the attempts already recorded automatically.
export function ReviewPanel({
  queue, topic, item, status, error, maths, marking, result,
  onNext, onSubmit, onRetry, onPractise,
}) {
  if (queue.status === "loading") {
    return <article className="lesson-panel">
      <p className="example-status" role="status">Working out what is due for review...</p>
    </article>;
  }

  if (queue.status === "error") {
    return <article className="lesson-panel">
      <div className="example-status error">
        <p role="alert">{queue.error}</p>
        <button onClick={queue.onRetry} type="button">Try again</button>
      </div>
    </article>;
  }

  if (!queue.items.length) {
    return <article className="lesson-panel review-empty-panel">
      <div className="panel-heading">
        <CheckCircle2 size={20} />
        <div>
          <p className="eyebrow">Review</p>
          <h3>Nothing is due yet</h3>
        </div>
      </div>
      <p className="lesson-goal">
        Review re-asks the questions you did not get right. Answer some questions in Practice or Exam
        mode and anything you miss will appear here, scheduled by how secure it looked.
      </p>
      {queue.topicsDue.length > 0 && <div className="review-due-list">
        <strong><CalendarClock size={16} /> Topics due for another look</strong>
        <ul>{queue.topicsDue.slice(0, 5).map((due) => (
          <li key={due.topicId}>{due.topicTitle} <span>{due.masteryScore}% mastery</span></li>
        ))}</ul>
      </div>}
      <div className="attempt-actions">
        <button onClick={onPractise} type="button"><Repeat2 size={17} /> Go to Practice</button>
      </div>
    </article>;
  }

  const current = queue.items[queue.position] ?? queue.items[0];
  return <>
    <div className="review-queue-bar">
      <span><Target size={15} /> Review {queue.position + 1} of {queue.items.length}</span>
      <span className="review-queue-meta">
        {current.topicTitle}
        {current.overdue ? <em className="overdue"> · overdue</em> : null}
        {` · last scored ${Math.round(current.accuracy * 100)}%`}
      </span>
      {queue.totalDue > queue.items.length && <span className="review-queue-meta">{queue.totalDue} due in total</span>}
    </div>
    <QuestionPanel
      error={error}
      examRunning={false}
      examSeconds={0}
      index={queue.position}
      item={item}
      marking={marking}
      maths={maths}
      mode={current.contentType === "exam" ? "exam" : "practice"}
      onNext={onNext}
      onRetry={onRetry}
      onSubmit={onSubmit}
      result={result}
      status={status}
      topic={topic}
    />
  </>;
}
