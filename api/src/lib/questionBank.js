// Practice and exam questions, generated once per topic, board, and tier, then
// stored. Practice is for building fluency with a hint and a full answer; exam
// is mark-based with a mark scheme, in the style and demand of the board.
import { contentTypes } from "./contentPolicy.js";
import { many, parseLabelledSections, single } from "./labelledText.js";

const labels = {
  [contentTypes.PRACTICE]: ["QUESTION", "HINT", "ANSWER", "WORKING"],
  [contentTypes.EXAM]: ["QUESTION", "MARKS", "MARKSCHEME", "ANSWER"],
};

export function questionPrompt(type, topic, subtopic, { board, tier, year, notation = false, index = 0 }) {
  const focus = subtopic?.title ? `the sub-topic "${subtopic.title}" within ` : "";
  const shared = [
    `Current school year: Year ${year}. Stay strictly within the demand of this year group.`,
    board ? `Exam board: ${board}. Match that board's question style and command words.` : "",
    tier ? `Tier: ${tier}. Pitch the demand for this tier.` : "",
    `Write question number ${index + 1} for ${focus}the topic "${topic.title}". Make it different from a question numbered differently.`,
    "Write an original question. Never reproduce a real exam paper question.",
    notation
      ? String.raw`Write every mathematical expression as LaTeX between single dollar signs, for example $3.45 \times 10^{-3}$ or $\frac{a+b}{2}$.`
      : "",
  ].filter(Boolean);

  if (type === contentTypes.EXAM) {
    return [
      ...shared,
      "Reply using only the labelled lines below, with no heading or commentary.",
      "QUESTION: the exam-style question, including any context the learner needs",
      "MARKS: the number of marks available, as a plain integer between 1 and 6",
      "MARKSCHEME: one creditworthy point, on its own line for each mark available",
      "ANSWER: the full correct answer",
    ].join("\n");
  }
  return [
    ...shared,
    "Reply using only the labelled lines below, with no heading or commentary.",
    "QUESTION: the practice question",
    "HINT: one short nudge that does not give the answer away",
    "WORKING: one step of the solution, on its own line for each step, in order",
    "ANSWER: the final answer",
  ].join("\n");
}

export function parseQuestion(type, text) {
  const wanted = labels[type];
  if (!wanted) return null;
  const sections = parseLabelledSections(text, wanted);
  const question = single(sections, "QUESTION");
  const answer = single(sections, "ANSWER");
  if (!question || !answer) return null;

  if (type === contentTypes.EXAM) {
    const markScheme = many(sections, "MARKSCHEME");
    // A mark-based question with no creditworthy points is poor material, so it
    // is refused rather than stored; the seeding run picks it up again later.
    if (!markScheme.length) return null;
    const stated = parseInt(single(sections, "MARKS"), 10);
    const marks = Math.max(1, Math.min(6, Number.isFinite(stated) && stated > 0 ? stated : markScheme.length));
    return { question, marks, markScheme, answer };
  }
  return { question, hint: single(sections, "HINT"), working: many(sections, "WORKING"), answer };
}
