import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Lightbulb, ListChecks, Send, Timer } from "lucide-react";
import { MathsText } from "./MathsText.jsx";

// Practice and Exam are question-led rather than explanation-led, which is what
// separates them from Learn. Practice offers a hint and shows the working after
// an attempt; Exam states the marks, hides everything until the answer is in,
// and then reveals the mark scheme.
export function QuestionPanel({
  mode, topic, item, status, error, index, maths, marking, result,
  onNext, onSubmit, onRetry, examSeconds, examRunning,
}) {
  const [answer, setAnswer] = useState("");
  const [hintShown, setHintShown] = useState(false);
  const isExam = mode === "exam";

  function submit(event) {
    event.preventDefault();
    if (!answer.trim() || marking) return;
    onSubmit(answer.trim());
  }

  function next() {
    setAnswer("");
    setHintShown(false);
    onNext();
  }

  return <article className="lesson-panel question-panel">
    <div className="panel-heading">
      {isExam ? <Timer size={20} /> : <ListChecks size={20} />}
      <div>
        <p className="eyebrow">{isExam ? "Exam question" : "Practice question"} {index + 1} / {topic.unit}</p>
        <h3>{topic.title}</h3>
      </div>
      {isExam && <div className={`exam-timer ${examRunning ? "running" : ""}`}>
        <Timer size={16} />
        <strong>{String(Math.floor(examSeconds / 60)).padStart(2, "0")}:{String(examSeconds % 60).padStart(2, "0")}</strong>
      </div>}
    </div>

    {status === "loading" && <p className="example-status" role="status">Preparing a question...</p>}
    {status === "error" && <div className="example-status error">
      <p role="alert">{error}</p>
      <button onClick={onRetry} type="button">Try again</button>
    </div>}

    {status === "ready" && <>
      <div className="question-body">
        {isExam && <span className="question-marks">{item.marks} {item.marks === 1 ? "mark" : "marks"}</span>}
        <p className="question-text"><MathsText enabled={maths}>{item.question}</MathsText></p>
      </div>

      {!isExam && item.hint && (hintShown
        ? <p className="question-hint"><Lightbulb size={15} /> <MathsText enabled={maths}>{item.hint}</MathsText></p>
        : <button className="hint-button" onClick={() => setHintShown(true)} type="button"><Lightbulb size={15} /> Show a hint</button>)}

      <form className="question-form" onSubmit={submit}>
        <label>
          <span>Your answer</span>
          <textarea
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={isExam ? "Set out your working and your final answer" : "Type your answer"}
            rows={isExam ? 5 : 3}
            value={answer}
          />
        </label>
        <div className="question-actions">
          <button disabled={marking || !answer.trim()} type="submit">
            <Send size={16} /> {marking ? "Marking..." : isExam ? "Submit for marking" : "Check my answer"}
          </button>
          <button className="secondary-button" onClick={next} type="button">
            Next question <ChevronRight size={16} />
          </button>
        </div>
      </form>

      {result && <div className="question-result">
        <div className="question-result-heading">
          <CheckCircle2 size={17} />
          <strong>{result.mark ? `${result.mark.earned} out of ${result.mark.available}` : "Feedback"}</strong>
          {result.mark && <span className="message-source">Recorded automatically</span>}
        </div>
        <p><MathsText enabled={maths}>{result.feedback}</MathsText></p>
      </div>}

      {result && <details className="question-reveal">
        <summary>{isExam ? "Mark scheme and answer" : "Worked answer"}</summary>
        {isExam
          ? <ol>{(item.markScheme ?? []).map((point, position) => <li key={position}><MathsText enabled={maths}>{point}</MathsText></li>)}</ol>
          : <ol>{(item.working ?? []).map((step, position) => <li key={position}><MathsText enabled={maths}>{step}</MathsText></li>)}</ol>}
        <p className="worked-answer"><strong>Answer:</strong> <MathsText enabled={maths}>{item.answer}</MathsText></p>
      </details>}
    </>}
  </article>;
}
