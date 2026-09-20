import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Lightbulb, ListChecks, PenLine, Send, Timer } from "lucide-react";
import { MathsText } from "./MathsText.jsx";

// Practice and Exam are question-led rather than explanation-led, which is what
// separates them from Learn. Practice offers a hint and shows the working after
// an attempt; Exam states the marks, hides everything until the answer is in,
// and then reveals the mark scheme.
//
// The working is asked for separately, and the mark scheme will not open until
// something has been written in it. A learner who can reveal the method without
// attempting it has been handed the answer, which is the complaint levelled at
// every AI homework tool. Unlike a bookwork check this does not punish or
// verify - it only insists the attempt comes first, then hands over the mark
// scheme and asks the learner to mark their own method against it. Marking your
// own working against a real mark scheme is the exam skill nobody practises.
export function QuestionPanel({
  mode, topic, item, status, error, index, maths, marking, result,
  onNext, onSubmit, onRetry, examSeconds, examRunning,
}) {
  const [answer, setAnswer] = useState("");
  const [working, setWorking] = useState("");
  const [hintShown, setHintShown] = useState(false);
  const [selfMarked, setSelfMarked] = useState([]);
  const isExam = mode === "exam";
  const hasWorking = working.trim().length > 0;

  function submit(event) {
    event.preventDefault();
    if (!answer.trim() || marking) return;
    onSubmit(answer.trim(), working.trim());
  }

  function next() {
    setAnswer("");
    setWorking("");
    setHintShown(false);
    setSelfMarked([]);
    onNext();
  }

  const scheme = isExam ? (item.markScheme ?? []) : (item.working ?? []);
  const toggleMark = (position) => setSelfMarked((marked) => (
    marked.includes(position) ? marked.filter((entry) => entry !== position) : [...marked, position]
  ));

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
          <span><PenLine size={14} /> Your working</span>
          <textarea
            onChange={(event) => setWorking(event.target.value)}
            placeholder="Set out your method, a line at a time. This is what earns most of the marks."
            rows={isExam ? 5 : 4}
            value={working}
          />
        </label>
        <label>
          <span>Your answer</span>
          <textarea
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Your final answer"
            rows={2}
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

      {result && !hasWorking && <p className="reveal-locked">
        <PenLine size={15} /> Write your working above to open the {isExam ? "mark scheme" : "worked answer"}.
        It is still worth doing after a wrong answer - that is where the marks are.
      </p>}

      {result && hasWorking && <details className="question-reveal">
        <summary>{isExam ? "Mark scheme and answer" : "Worked answer"}</summary>
        <p className="self-mark-prompt">Tick every line you had. Be honest - this is your own record.</p>
        <ol className="self-mark">
          {scheme.map((point, position) => (
            <li key={position}>
              <label>
                <input checked={selfMarked.includes(position)} onChange={() => toggleMark(position)} type="checkbox" />
                <MathsText enabled={maths}>{point}</MathsText>
              </label>
            </li>
          ))}
        </ol>
        {scheme.length > 0 && <p className="self-mark-total">
          You marked yourself <strong>{selfMarked.length} of {scheme.length}</strong>
          {isExam ? " mark scheme points" : " steps"}.
        </p>}
        <p className="worked-answer"><strong>Answer:</strong> <MathsText enabled={maths}>{item.answer}</MathsText></p>
      </details>}
    </>}
  </article>;
}
