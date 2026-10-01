import { many, parseLabelledSections, single } from "./labelledText.js";
import { usesFormulae } from "./contentPolicy.js";

// Shared by the content endpoint and the offline seeding script so a stored
// example and a freshly generated one always have the same shape.
export function workedExamplePrompt(topic, subtopic, { notation = false } = {}) {
  return [
    `Write one fully worked example for the sub-topic "${subtopic.title}" within the topic "${topic.title}".`,
    "Reply using only the labelled lines below. Do not add a heading, an introduction, or a closing comment.",
    "FORMULA: a formula this sub-topic uses, on its own line for each formula, omitted when none applies",
    "QUESTION: the question the example works through",
    "STEP: one step of the solution, on its own line for each step, in order",
    "ANSWER: the final answer",
    "Preserve prose paragraphs and use fenced code blocks with correct indentation for code. Do not flatten a program onto one line.",
    // Maths is typeset in the browser, so its expressions are requested as LaTeX.
    notation
      ? [
          "Write every mathematical expression as LaTeX between single dollar signs.",
          String.raw`For example: $3.45 \times 10^{-3}$, $\frac{a+b}{2}$, $x^2 - 5x + 6 = 0$, $\sqrt{49} = 7$.`,
          "Keep ordinary words outside the dollar signs so each line still reads as a sentence.",
        ].join("\n")
      : "",
  ].filter(Boolean).join("\n");
}

// A question that names material it does not carry. The learner is shown only
// the question text, so "compare Text A and Text B" with no texts in it is
// unanswerable however good the steps are.
// Narrow on purpose. An earlier, looser version matched "The source provides
// 120 J of electrical energy" and "each item A to D", which are an energy
// source and an enumerated list, not missing material. Only a phrase that can
// solely mean "look at the thing you were handed" belongs here.
const NAMES_MATERIAL = new RegExp([
  String.raw`\b(?:Text|Source|Extract|Passage)\s+[AB]\b`,
  String.raw`\bthe\s+source\s+extracts?\b`,
  String.raw`\bthe\s+(?:following|above)\s+(?:extract|passage|source)\b`,
  String.raw`\bfrom\s+the\s+(?:graph|chart|map|diagram|table)\b`,
  String.raw`\bshown\s+(?:on|in)\s+the\s+(?:map|graph|chart|diagram|photograph)\b`,
  String.raw`\bthe\s+(?:diagram|graph|map|photograph|extract|passage)\s+(?:below|above|opposite|shown|provided|accompanying)\b`,
  String.raw`\bthe\s+accompanying\s+(?:photograph|diagram|map|graph|image)\b`,
].join("|"), "i");
// Its own content, quoted or laid out, makes it self-contained.
const CARRIES_ITS_MATERIAL = /["“”][^"“”]{60,}|\n\s*\w+\s*[::]/;
function pointsAtAbsentMaterial(question) {
  return NAMES_MATERIAL.test(question) && !CARRIES_ITS_MATERIAL.test(question);
}

// "It shows how a Year 10 student can use context..." is commentary on the
// method, not the answer the question asked for.
const ABOUT_THE_LEARNER = /\b(?:a|the)\s+(?:year\s*\d+\s*)?(?:student|learner|pupil|candidate)s?\s+(?:can|could|should|would|must|will)\b/i;
function describesTheLearnerInsteadOfAnswering(answer) {
  return ABOUT_THE_LEARNER.test(answer.slice(0, 200))
    || /^(?:it|this)\s+(?:shows|demonstrates|illustrates)\s+how\b/i.test(answer.trim());
}

// A step that promises its content is somewhere else.
const DEFERS_CONTENT = /\b(?:will be (?:provided|given|shown)|see (?:the )?(?:ANSWER|answer below)|as (?:shown|described) (?:below|in the answer))\b/i;

// `formulae` says whether this sub-topic may carry one. It defaults to the
// subject rule so existing callers behave as before; a caller that knows which
// outcome it is generating passes allowsFormulae() instead, which lets the
// three argued outcomes that genuinely have a formula keep it.
export function parseWorkedExample(text, subject = "", formulaeAllowed = null) {
  const sections = parseLabelledSections(text, ["FORMULA", "QUESTION", "STEP", "ANSWER"]);
  const question = single(sections, "QUESTION");
  const steps = many(sections, "STEP");
  if (!question || !steps.length) return null;
  const formulae = many(sections, "FORMULA");
  const answer = single(sections, "ANSWER");

  // Refused rather than stored, so a seeding run writes it again instead of a
  // learner being shown a formula for a subject that has none, or a mark out
  // of three for an argument about a character. The instruction above usually
  // holds; this is what catches it when it does not.
  const mayHaveFormula = formulaeAllowed === null ? usesFormulae(subject) : formulaeAllowed;
  if (subject && !mayHaveFormula && formulae.length) return null;
  // A bare number as the answer stays refused for every argued subject, whether
  // or not this outcome has a formula: "2.33 out of 3" for how Lady Macbeth
  // changes is the fault this catches, and a rate-of-change question is still
  // answered with which period changed faster, not with the rate alone.
  if (subject && !usesFormulae(subject)
      && answer && /^[^a-zA-Z]*\d+(\.\d+)?\s*(\/|out of)?\s*\d*[^a-zA-Z]*$/.test(answer.trim())) {
    return null;
  }

  // An example nobody can follow. Each of these was found in stored content:
  // a question about "Text A and Text B" with no texts, an answer explaining
  // what a Year 10 student can do instead of answering, and a step promising
  // its content would appear in an ANSWER that was empty.
  if (!answer || !answer.trim()) return null;
  if (pointsAtAbsentMaterial(question)) return null;
  if (describesTheLearnerInsteadOfAnswering(answer)) return null;
  if (steps.some((step) => DEFERS_CONTENT.test(step))) return null;

  return { formulae, question, steps, answer };
}

export function exampleSystemPrompt(stage, year, examBoard, tier, subject, formulaeAllowed = null) {
  return [
    "You are a patient UK education tutor for KS3, KS4, and GCSE learners.",
    "Use British English and keep the example age-appropriate.",
    "Show every calculation or reasoning step and include units where they apply.",
    "Stay strictly within the demand of the stated school year. Never use methods from a later key stage or from post-16 study.",
    "For school-level machine learning, explain labelled data, training, testing and bias qualitatively; do not introduce gradient-descent derivatives. Use calculations only when they directly serve the stated outcome. In History, compare the pace and extent of historical change using evidence, not unrelated speed or growth calculations.",
    "Do not reproduce copyrighted exam-paper questions. Write an original example.",
    `Current stage: ${stage}.`,
    `Current school year: Year ${year}. Only use content appropriate to this year group.`,
    `GCSE exam board: ${examBoard ?? "Not applicable"}.`,
    `GCSE tier: ${tier ?? "Not applicable"}.`,
    `Current subject: ${subject}.`,
    subject === 'Science' ? 'Stay within GCSE Combined Science. No acid dissociation constants, logarithmic pH, ideal gas law, Faraday calculations, reaction orders, helper-T-cell signalling, GLUT transporters or gluconeogenesis.' : '',
    subject === 'Science' && tier === 'Foundation' ? 'Use Foundation methods: no moles, molar gas volumes, mole-based rates, half-equations, glucagon mechanisms, inverse-square light calculations or Le Chatelier predictions.' : '',
    formulaeAllowed === false ? "Give no FORMULA line: this outcome does not need a separate formula. Keep any necessary calculation in the solution steps." : "",
    // Said outright, because "omitted when none applies" was not enough: the
    // model reached for a formula anyway and then scored a literary answer out
    // of three.
    usesFormulae(subject)
      ? ""
      : [
          `${subject} is argued from evidence, not calculated.`,
          formulaeAllowed
            // The handful of argued outcomes that do have a real relationship
            // behind them, such as comparing rates of change from dated
            // figures. The warning against inventing one still stands.
            ? "This sub-topic does use one real, standard relationship. Give that FORMULA and no other, and invent no scoring system: no marks, no points out of a total, no weighted average of qualities."
            : "Give no FORMULA line at all, invent no scoring system, and do not award marks or points out of a total.",
          "The ANSWER must be a sentence making the judgement the question asks for, never a number on its own.",
        ].join("\n"),
    // Each of these is a fault found by reading the stored examples. Steps that
    // read perfectly well one at a time still did not answer the question, and
    // the model does not catch it when asked to check its own work, so the rules
    // name the failure rather than asking for quality in general.
    [
      "The QUESTION must contain everything needed to answer it.",
      "Never write 'Text A and Text B', 'the source extracts', 'the extract', 'from the graph', 'shown on the map' or 'the accompanying photograph' unless the full content is written out inside the QUESTION itself. The learner sees only the words you write.",
      "Every number in a STEP must be given in the QUESTION or worked out in an earlier STEP. Never introduce a density, rate, GDP, constant or measurement the learner was not given: an example that subtracts an evapotranspiration nobody stated teaches a method that cannot be repeated.",
      "Every STEP must be needed for the question asked. Do not insert a calculation the question does not call for, and do not repeat a calculation that changes nothing.",
      "The ANSWER must be the answer. Never write about what a student can do, should do or would do, and never describe the method instead of giving its result.",
      "The QUESTION must be one a learner can finish on paper in a few minutes. Never ask them to build a model, run software, carry out a survey or produce a design.",
      "The QUESTION must be about the stated sub-topic itself. Do not write a question on a different skill and add a step at the end to connect it back.",
    ].join("\n"),
  ].filter(Boolean).join("\n");
}
