import React, { useState } from "react";
import { Clock3, Save, X } from "lucide-react";

const outcomes = [
  { label: "Needs work", value: 0.25 },
  { label: "Partly secure", value: 0.6 },
  { label: "Secure", value: 0.9 },
];

export function AttemptRecorder({ mode, startedAt, topic, onCancel, onSave, saving }) {
  const [accuracy, setAccuracy] = useState(0.6);
  const [confidence, setConfidence] = useState(3);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(4);
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  const isExam = mode === "exam";
  const finalAccuracy = isExam && maxScore > 0 ? Math.min(1, score / maxScore) : accuracy;

  return (
    <div className="attempt-recorder">
      <div className="attempt-recorder-heading">
        <div><strong>Record this attempt</strong><span><Clock3 size={14} /> {Math.max(1, Math.round(durationSeconds / 60))} min tracked</span></div>
        <button aria-label="Close attempt recorder" onClick={onCancel} title="Close" type="button"><X size={17} /></button>
      </div>

      {isExam ? (
        <div className="mark-inputs">
          <label>Marks earned<input max={maxScore} min="0" onChange={(event) => setScore(Number(event.target.value))} type="number" value={score} /></label>
          <span>/</span>
          <label>Marks available<input min="1" onChange={(event) => setMaxScore(Number(event.target.value))} type="number" value={maxScore} /></label>
        </div>
      ) : (
        <fieldset><legend>How did it go?</legend><div className="attempt-outcomes">
          {outcomes.map((item) => <button className={accuracy === item.value ? "active" : ""} key={item.value} onClick={() => setAccuracy(item.value)} type="button">{item.label}</button>)}
        </div></fieldset>
      )}

      <label className="confidence-control">
        <span>Confidence <strong>{confidence} / 5</strong></span>
        <input max="5" min="1" onChange={(event) => setConfidence(Number(event.target.value))} type="range" value={confidence} />
      </label>

      <button className="save-attempt" disabled={saving} onClick={() => onSave({
        accuracy: finalAccuracy,
        confidence,
        durationSeconds,
        score: isExam ? score : undefined,
        maxScore: isExam ? maxScore : undefined,
        topicId: topic.id,
        topicTitle: topic.title,
      })} type="button"><Save size={17} /> {saving ? "Saving..." : "Save progress"}</button>
    </div>
  );
}
