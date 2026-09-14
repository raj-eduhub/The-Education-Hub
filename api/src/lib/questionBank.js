// Practice and exam questions, generated once per topic, board, and tier, then
// stored. Practice is for building fluency with a hint and a full answer; exam
// is mark-based with a mark scheme, in the style and demand of the board.
import { contentTypes } from "./contentPolicy.js";

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
  const item = { question: "", hint: "", answer: "", marks: 0, markScheme: [], working: [] };
  for (const line of String(text ?? "").split("\n")) {
    const match = line.trim().match(/^[*#\-\s]*(QUESTION|HINT|ANSWER|MARKS|MARKSCHEME|WORKING)S?[*\s]*:\s*(.+)$/i);
    if (!match) continue;
    const label = match[1].toUpperCase();
    const content = match[2].replace(/\*\*/g, "").trim();
    if (!content) continue;
    if (label === "QUESTION" && !item.question) item.question = content;
    else if (label === "HINT" && !item.hint) item.hint = content;
    else if (label === "ANSWER" && !item.answer) item.answer = content;
    else if (label === "MARKS" && !item.marks) item.marks = Math.max(1, Math.min(6, parseInt(content, 10) || 0));
    else if (label === "MARKSCHEME") item.markScheme.push(content);
    else if (label === "WORKING") item.working.push(content);
  }
  if (!item.question || !item.answer) return null;
  if (type === contentTypes.EXAM) {
    // A mark-based question is unusable without marks, so fall back to the
    // number of creditworthy points rather than discarding a good question.
    if (!item.marks) item.marks = Math.max(1, Math.min(6, item.markScheme.length));
    return { question: item.question, marks: item.marks, markScheme: item.markScheme, answer: item.answer };
  }
  return { question: item.question, hint: item.hint, working: item.working, answer: item.answer };
}
