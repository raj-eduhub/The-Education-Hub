import { splitSentences } from "./speech.js";
import { visualNarrationFor } from "./lessonVisuals/narration.js";

// The beat sequence for a narrated lesson.
//
// One definition, used by three things that must agree exactly: the player that
// shows the beats, the synthesis script that voices them ahead of time, and the
// API that looks the audio up. The audio is keyed by a digest of the spoken
// text, so a player asking for a beat the script never produced gets silence -
// which is why this is not duplicated in each of them.
//
// No JSX here: the synthesis script runs in plain Node. The player attaches the
// drawing for a visual beat afterwards, by its id.
export const closingBeat = "That is the whole topic. Try a practice question next.";

// The formula beats, on their own.
//
// Shared rather than repeated, because the same formulae are voiced inside the
// lesson and can be played on their own from the Key formulas section. Both
// have to produce the identical string or the second one asks for clips that
// were never recorded: the formula is shown as written and spoken as words, so
// "\frac{u}{2}" reads as "u over 2" while the learner sees the fraction.
export function formulaBeats(formulae) {
  return (formulae ?? []).map((formula, position) => ({ kind: "formula", text: formula, position }));
}

export function lessonBeats(topic, content) {
  const beats = [
    {
      kind: "title",
      text: topic.title,
      aside: topic.goal,
      speech: `${topic.title}. ${topic.goal}`,
    },
  ];

  for (const sentence of splitSentences(content.explanation ?? "")) {
    beats.push({ kind: "prose", text: sentence });
  }

  // Authored visuals follow the prose they illustrate. A topic with none plays
  // as narration alone rather than showing an empty stage.
  for (const visual of visualNarrationFor(topic.id)) {
    beats.push({ kind: "visual", id: visual.id, text: visual.speech, speech: visual.speech });
  }

  (content.keyIdeas ?? []).forEach((idea, position) => {
    beats.push({ kind: "idea", text: idea, position });
  });

  beats.push(...formulaBeats(content.formulae));

  beats.push({ kind: "end", text: "That is the whole topic.", speech: closingBeat });
  return beats;
}

// The beat sequence for a narrated worked example, and the same contract as
// lessonBeats: whatever plays these must build them from here, because the
// audio is keyed by a digest of the spoken text and a player asking for a beat
// the script never produced gets silence rather than an error.
//
// The example is the stored row, not a regenerated one. Steps are voiced one
// at a time so a learner can follow the working at their own pace, and so a
// corrected step costs one beat to re-record rather than the whole example.
export function exampleBeats(example, subtopic = "") {
  const beats = [];
  if (subtopic) beats.push({ kind: "title", text: subtopic, speech: `Worked example. ${subtopic}` });

  // Formulae first, matching where they sit on the page and how the work is
  // actually done: you are told the rule before you are asked to apply it.
  beats.push(...formulaBeats(example.formulae));
  for (const sentence of splitSentences(example.question ?? "")) {
    beats.push({ kind: "question", text: sentence });
  }
  (example.steps ?? []).forEach((step, position) => {
    for (const sentence of splitSentences(step)) {
      beats.push({ kind: "step", text: sentence, position });
    }
  });
  if (example.answer) {
    beats.push({ kind: "answer", text: example.answer, speech: `The answer is ${example.answer}` });
  }
  return beats;
}

// The authored string a beat is built from.
export function beatSource(beat) {
  return beat.speech ?? beat.text;
}

// The text that is actually voiced, and the text the cache key is taken over.
//
// Deliberately the spoken form rather than the authored one. The two differ
// wherever there is LaTeX, and the LaTeX-to-words rules get corrected: today
// "$a - b$" started saying "minus" and the decay equations stopped reading out
// a backslash. Keying on the authored text would have left every one of those
// beats serving the old, wrong audio for ever, because the source never changed.
export function beatSpeech(beat, toSpoken) {
  return toSpoken(beatSource(beat));
}
