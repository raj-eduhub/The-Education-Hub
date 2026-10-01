// Practice and exam questions, generated once per topic, board, and tier, then
// stored. Practice is for building fluency with a hint and a full answer; exam
// is mark-based with a mark scheme, in the style and demand of the board.
import { contentTypes } from "./contentPolicy.js";
import { many, parseLabelledSections, single } from "./labelledText.js";

const labels = {
  [contentTypes.PRACTICE]: ["QUESTION", "HINT", "ANSWER", "WORKING"],
  [contentTypes.EXAM]: ["QUESTION", "MARKS", "MARKSCHEME", "ANSWER"],
};

// Content that sits above GCSE and kept appearing in generated questions.
// The statistics entries are the expensive ones: the subject content asks only
// that a learner can "infer properties of populations or distributions from a
// sample, whilst knowing the limitations of sampling", and the model answered
// that with standard errors, confidence intervals and named sampling schemes.
const outOfScope = [
  "standard error, confidence intervals, significance tests or p-values",
  "standard deviation, variance, the normal distribution or z-scores",
  "t-distributions, finite population corrections or regression equations",
  "radians, calculus, matrices, logarithms or the factor theorem",
];

// Repeated as the last line of the turn, where the model follows it far more
// reliably than from the middle of the prompt. Stating the rule once near the
// top still produced sample-proportion questions using standard-error notation.
const scopeReminder =
  "Reminder: stay within the stated subject, year and qualification. Do not use standard error, confidence intervals, p-hat notation, standard deviation, radians or calculus anywhere in the question, the working, the mark scheme or the answer. Geography fieldwork may use random, systematic and stratified sampling where relevant.";

export function questionPrompt(type, topic, subtopic, { board, tier, year, notation = false, index = 0 }) {
  const focus = subtopic?.title ? `the sub-topic "${subtopic.title}" within ` : "";
  const shared = [
    `Current school year: Year ${year}. Stay strictly within the demand of this year group.`,
    board ? `Exam board: ${board}. Match that board's question style and command words.` : "",
    tier ? `Tier: ${tier}. Pitch the demand for this tier.` : "",
    topic.subject === 'Science' ? 'GCSE Science does not require acid dissociation constants (Ka), logarithmic pH calculations, the ideal gas law PV=nRT, Faraday-law electrolysis calculations, reaction orders or rate laws. Use only the selected Combined Science content. Detailed helper-T-cell signalling, GLUT transporters and gluconeogenesis are unnecessary here.' : '',
    topic.subject === 'Science' && tier === 'Foundation' ? 'Foundation Science: do not require mole calculations, molar gas volumes, mole-based rates, half-equations, glucagon mechanisms, inverse-square light calculations or predictions using Le Chatelier’s principle. Use mass/volume rates, particle ratios in balanced equations and appropriate qualitative explanations.' : '',
    `Write question number ${index + 1} for ${focus}the topic "${topic.title}". Make it different from a question numbered differently.`,
    "Write an original question. Never reproduce a real exam paper question.",
    `Subject: ${topic.subject}. Assess the stated learning objective, not an unrelated skill suggested by a word in its title. In History, rates of change means the pace and extent of historical change, not speed, growth-rate calculations or invented importance scores. In English, organise and analyse language or presentations rather than turning the task into arithmetic.`,
    "Include calculations only when they directly teach or assess this outcome. Reasoning may be qualitative: do not force equations, numerical worked solutions or formula panels into non-quantitative tasks. Label invented historical teaching scenarios as fictional; do not invent quotations attributed to real sources.",
    // The learner answers in a text box and is shown no images, so a question
    // that points at a picture cannot be answered at all.
    "The question must be answerable from its own text. Do not refer to a diagram, figure, graph, grid or table unless you state every value it would contain inside the question itself.",
    "Do not ask the learner to draw, sketch, construct with a ruler and compasses, measure, or produce anything that cannot be typed as text.",
    "Every quantity must be realistic and internally consistent. A length given to the nearest 0.5 cm must be a multiple of 0.5 cm, and the context must make sense at the scale stated.",
    "Preserve paragraph breaks in prose. Put runnable code in fenced blocks with correct newlines and indentation. Deliberately faulty code belongs only in a clearly identified debugging stimulus; the model answer must be complete and runnable. Count words when the task specifies a range.",
    `Use only methods and vocabulary taught at or below Year ${year} in the English national curriculum. Do not use ${outOfScope.join("; ")}.`,
    // Maths is typeset in the browser, so its expressions are requested as LaTeX.
    notation
      ? String.raw`Write every mathematical expression as LaTeX between single dollar signs, for example $3.45 \times 10^{-3}$ or $\frac{a+b}{2}$. Never use \( \) delimiters, and keep ordinary words outside the dollar signs.`
      : "",
  ].filter(Boolean);

  if (type === contentTypes.EXAM) {
    return [
      ...shared,
      "Reply using only the labelled lines below, with no heading or commentary.",
      "Replace each description with real content. Never repeat the description itself.",
      "QUESTION: the exam-style question, including any context the learner needs",
      "MARKS: the number of marks available, as a plain integer between 1 and 6",
      "MARKSCHEME: one creditworthy point, on its own line for each mark available",
      "ANSWER: the full correct answer",
      scopeReminder,
    ].join("\n");
  }
  return [
    ...shared,
    "Reply using only the labelled lines below, with no heading or commentary.",
    "Replace each description with real content. Never repeat the description itself.",
    "QUESTION: the practice question",
    "HINT: one short nudge that does not give the answer away",
    "WORKING: explain the reasoning in at least two short points, each on its own line. Use textual analysis, evidence or planning where appropriate; numerical steps are needed only for a relevant calculation.",
    "ANSWER: the final answer",
    scopeReminder,
  ].join("\n");
}

// The model sometimes echoes a field description instead of writing content, and
// "the practice question" was stored and served to learners as a question.
const promptEchoes = [
  "the practice question",
  "the exam-style question",
  "the final answer",
  "the full correct answer",
  "one short nudge",
  "one step of the solution",
  "one creditworthy point",
  "the number of marks available",
];

function echoesPrompt(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return promptEchoes.some((echo) => text === echo || text.startsWith(echo));
}

export function parseQuestion(type, text) {
  const wanted = labels[type];
  if (!wanted) return null;
  const sections = parseLabelledSections(text, wanted);
  const question = single(sections, "QUESTION");
  const answer = single(sections, "ANSWER");
  if (!question || !answer) return null;
  if (echoesPrompt(question) || echoesPrompt(answer)) return null;

  if (type === contentTypes.EXAM) {
    const markScheme = many(sections, "MARKSCHEME");
    // A mark-based question with no creditworthy points is poor material, so it
    // is refused rather than stored; the seeding run picks it up again later.
    if (!markScheme.length) return null;
    const stated = parseInt(single(sections, "MARKS"), 10);
    const marks = Math.max(1, Math.min(6, Number.isFinite(stated) && stated > 0 ? stated : markScheme.length));
    return { question, marks, markScheme, answer };
  }
  // A practice question with no working is refused for the same reason an exam
  // question with no mark scheme is: a learner who gets it wrong opens the
  // worked answer and finds an empty list. This used to be optional, and 94% of
  // the practice rows already in storage arrived without any working at all.
  const working = many(sections, "WORKING");
  if (working.length < 2) return null;
  return { question, hint: single(sections, "HINT"), working, answer };
}
