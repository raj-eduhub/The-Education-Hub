import React, { useMemo, useState } from "react";
import { BookMarked, Check, ChevronRight, Layers, RotateCcw, Shuffle, Undo2 } from "lucide-react";
import { MathsText } from "./MathsText.jsx";
import { flashcardsFor } from "./flashcards.js";

// Flash cards are quick recall of what the lesson has already taught: the
// front is a cue, the back the authored key idea or formula. The learner marks
// themselves, so nothing here is recorded as attainment - a card turned over
// and called "got it" is not evidence the way a marked answer is. A card that
// was not known goes to the back of the deck and comes round again, which is
// the whole of the method: keep going until every card has been recalled.
function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

export function FlashcardPanel({ topic, subtopic, lesson, typeset, onLearn, onNextSubtopic }) {
  const cards = useMemo(
    () => lesson.status === "ready" ? flashcardsFor(lesson, subtopic?.title) : [],
    [lesson, subtopic?.title],
  );
  const byId = useMemo(() => new Map(cards.map((card) => [card.id, card])), [cards]);
  const [queue, setQueue] = useState(null);
  const [position, setPosition] = useState(0);
  const [turned, setTurned] = useState(false);
  const [missed, setMissed] = useState(() => new Set());

  // The deck starts in lesson order once the lesson has loaded.
  const deck = queue ?? cards.map((card) => card.id);
  const card = byId.get(deck[position]);
  const finished = cards.length > 0 && position >= deck.length;

  function start(ids) {
    setQueue(ids);
    setPosition(0);
    setTurned(false);
    setMissed(new Set());
  }

  function answer(knew) {
    if (!card) return;
    if (!knew) {
      setMissed((current) => new Set(current).add(card.id));
      setQueue([...deck, card.id]);
    }
    setPosition((current) => current + 1);
    setTurned(false);
  }

  const heading = <div className="panel-heading">
    <Layers size={20} />
    <div>
      <p className="eyebrow">Flash cards / {topic.unit}</p>
      <h3>{subtopic?.title ?? topic.title}</h3>
    </div>
  </div>;

  if (lesson.status === "loading" || lesson.status === "idle") {
    return <article className="lesson-panel flashcard-panel">
      {heading}
      <p className="example-status" role="status">Shuffling the cards...</p>
    </article>;
  }

  if (lesson.status === "error") {
    return <article className="lesson-panel flashcard-panel">
      {heading}
      <p className="login-error" role="alert">{lesson.error}</p>
    </article>;
  }

  if (!cards.length) {
    return <article className="lesson-panel flashcard-panel">
      {heading}
      <p className="lesson-goal">This sub-topic has no key ideas or formulas to make cards from yet.</p>
    </article>;
  }

  if (finished) {
    const total = cards.length;
    const firstTime = total - missed.size;
    return <article className="lesson-panel flashcard-panel">
      {heading}
      <div className="flashcard-done" role="status">
        <strong>{firstTime === total ? "Every card, first time." : `${firstTime} of ${total} first time.`}</strong>
        <p>{missed.size
          ? `You went back round for ${missed.size === 1 ? "one card" : `${missed.size} cards`} and finished with all ${total}.`
          : "Nothing needed a second look. Try the practice questions to use these ideas."}</p>
      </div>
      <div className="question-actions flashcard-actions">
        {missed.size > 0 && <button onClick={() => start(cards.map((entry) => entry.id).filter((id) => missed.has(id)))} type="button">
          <RotateCcw size={16} /> Just the ones I missed
        </button>}
        <button className="secondary-button" onClick={() => start(shuffled(cards.map((entry) => entry.id)))} type="button">
          <Shuffle size={16} /> Shuffle and go again
        </button>
        {onNextSubtopic && <button className="secondary-button" onClick={onNextSubtopic} type="button">
          Next sub-topic <ChevronRight size={16} />
        </button>}
      </div>
    </article>;
  }

  const face = turned ? card.answer : card.cue;
  return <article className="lesson-panel flashcard-panel">
    {heading}
    {lesson.scope === "topic" && <p className="example-status">These cards come from the topic overview, because this sub-topic has no lesson of its own yet.</p>}
    <div className="flashcard-bar">
      <span>Card {Math.min(position + 1, deck.length)} of {deck.length}</span>
      <progress max={deck.length} value={position} aria-label="Cards done" />
      <button
        className="flashcard-shuffle"
        disabled={turned}
        onClick={() => setQueue([...deck.slice(0, position), ...shuffled(deck.slice(position))])}
        title="Shuffle the cards still to come"
        type="button"
      >
        <Shuffle size={15} /> Shuffle
      </button>
    </div>

    <button
      aria-label={turned ? "Card turned over. Select to see the front again." : "Select to turn the card over."}
      className={`flashcard ${card.kind}${turned ? " turned" : ""}`}
      key={`${card.id}-${position}-${turned}`}
      onClick={() => setTurned((current) => !current)}
      type="button"
    >
      <span className="flashcard-label">{card.label}{turned ? " · answer" : ""}</span>
      {!turned && <span className="flashcard-prompt">{card.prompt}</span>}
      {face && <span className="flashcard-face" aria-live="polite">
        {/* Typeset by the answer, so the cue "$W = ?$" renders as the maths
            it was cut from even though the cut left nothing to detect. */}
        <MathsText enabled={typeset(card.answer)}>{face}</MathsText>
      </span>}
      {!turned && <span className="flashcard-hint">Say it or write it down, then turn the card over</span>}
    </button>

    <div className="question-actions flashcard-actions">
      {turned ? <>
        <button onClick={() => answer(true)} type="button"><Check size={16} /> I knew it</button>
        <button className="secondary-button" onClick={() => answer(false)} type="button"><Undo2 size={16} /> Not yet: show me again later</button>
      </> : <>
        <button onClick={() => setTurned(true)} type="button">Turn over</button>
        <button className="secondary-button" onClick={onLearn} type="button"><BookMarked size={16} /> Back to the lesson</button>
      </>}
    </div>
  </article>;
}
