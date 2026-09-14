import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, ClipboardCheck, LockKeyhole } from "lucide-react";
import { topicsFor } from "./curriculum.js";
import { diagnosticQuestions } from "./diagnostic.js";
import { readJson } from "./auth.js";

export function DiagnosticAssessment({ learner, request, onComplete }) {
  const topics = useMemo(
    () => topicsFor({
      year: learner.year,
      subject: learner.subject,
      examBoard: learner.examBoard,
      tier: learner.tier,
    }),
    [learner.examBoard, learner.subject, learner.tier, learner.year]
  );
  const questions = useMemo(() => diagnosticQuestions(topics), [topics]);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(Date.now());
  const question = questions[questionIndex];
  const answered = Object.values(answers).filter((answer) => answer.trim()).length;
  const isLast = questionIndex === questions.length - 1;

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const response = await request("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: learner.year,
          subject: learner.subject,
          examBoard: learner.examBoard,
          tier: learner.tier,
          durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
          responses: questions.map((item) => ({
            topicId: item.topicId,
            topic: item.topic,
            outcome: item.outcome,
            answer: answers[item.topicId],
          })),
        }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "The diagnostic could not be marked.");
      onComplete(data);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function advance() {
    if (isLast) submit();
    else setQuestionIndex((current) => current + 1);
  }

  return (
    <main className="diagnostic-page">
      <header className="diagnostic-header">
        <div className="diagnostic-mark"><ClipboardCheck size={25} /></div>
        <div>
          <p className="eyebrow">Initial diagnostic</p>
          <h1>Let's find the right place to begin</h1>
          <p>This short {learner.subject} check helps order {learner.firstName}'s Year {learner.year} learning path.</p>
        </div>
        <div className="evidence-lock"><LockKeyhole size={17} /><span>No predicted grade is produced from this assessment.</span></div>
      </header>

      <section className="diagnostic-panel">
        <div className="diagnostic-progress">
          <div><span>Question {questionIndex + 1} of {questions.length}</span><strong>{answered} answered</strong></div>
          <progress max={questions.length} value={questionIndex + 1} />
        </div>

        <div className="diagnostic-question">
          <span>{question.unit}</span>
          <h2>{question.topic}</h2>
          <p>{question.prompt}</p>
          <label htmlFor="diagnostic-answer">Your answer</label>
          <textarea
            autoFocus
            id="diagnostic-answer"
            maxLength={2500}
            onChange={(event) => setAnswers({ ...answers, [question.topicId]: event.target.value })}
            placeholder="Write what you know. It is fine to be unsure; this is here to help plan your learning."
            value={answers[question.topicId] ?? ""}
          />
        </div>

        {error && <p className="diagnostic-error" role="alert">{error}</p>}

        <div className="diagnostic-actions">
          <button
            className="secondary-button"
            disabled={questionIndex === 0 || submitting}
            onClick={() => setQuestionIndex((current) => current - 1)}
            type="button"
          ><ArrowLeft size={17} /> Back</button>
          <div className="question-dots" aria-label="Assessment progress">
            {questions.map((item, index) => (
              <span className={answers[item.topicId]?.trim() ? "answered" : index === questionIndex ? "current" : ""} key={item.topicId} />
            ))}
          </div>
          <button
            className="diagnostic-next"
            disabled={!answers[question.topicId]?.trim() || submitting}
            onClick={advance}
            type="button"
          >{submitting ? "Analysing..." : isLast ? "Create my learning path" : "Next"} {isLast ? <Brain size={17} /> : <ArrowRight size={17} />}</button>
        </div>

        <footer><CheckCircle2 size={16} /> Answers are used only to identify strengths and next steps.</footer>
      </section>
    </main>
  );
}
