// Routing policy for curriculum content. Each subject and content type resolves
// to one of three modes, so the decision is explicit and auditable rather than
// scattered through the request handler.
//
//   stored       serve from Table Storage only, never call the model
//   stored-first serve from storage, call the model on a miss, then persist
//   model        always call the model
export const routes = { STORED: "stored", STORED_FIRST: "stored-first", MODEL: "model" };

export const contentTypes = { EXPLANATION: "explanation", EXAMPLE: "example", PRACTICE: "practice", EXAM: "exam" };

// Explanations are hand-authored curriculum text for every subject, so they are
// never generated. Worked examples are seeded ahead of time, which leaves the
// model as the fallback for anything not authored yet. Maths is the subject that
// genuinely needs it, because its examples carry original calculations.
const policy = {
  [contentTypes.EXPLANATION]: { default: routes.STORED },
  [contentTypes.EXAMPLE]: { default: routes.STORED_FIRST },
  // Question banks are seeded per year, board, and tier. The model is the
  // fallback for a topic the bank has not reached yet.
  [contentTypes.PRACTICE]: { default: routes.STORED_FIRST },
  [contentTypes.EXAM]: { default: routes.STORED_FIRST },
};

export function routeFor(type, subject) {
  const forType = policy[type];
  if (!forType) return null;
  return forType[subject] ?? forType.default;
}

export function mayUseModel(route) {
  return route === routes.STORED_FIRST || route === routes.MODEL;
}

export function mustUseModel(route) {
  return route === routes.MODEL;
}

// Maths examples are rendered with a maths typesetter, so the model is asked for
// LaTeX. Every other subject stays plain prose.
export function usesMathsNotation(subject) {
  return subject === "Maths";
}

// English and History are argued, not calculated. Asking for a formula in them
// invites the model to invent one, and it does: it has produced "Critical
// evaluation score = (C + L + S) - B" and scored Lady Macbeth 2.33 out of 3 as
// the answer to a question about how her character changes. A learner shown
// that is being taught something that does not exist, so a worked example in
// these subjects carries no formula and does not end in a number.
//
// Every other subject is left alone: density, binary, gear ratios and Pythagoras
// are all real formulae that belong in their worked examples.
const argued = ["English", "History"];
export function usesFormulae(subject) {
  return !argued.includes(subject);
}

// Practice and exam questions are stored per board because exam style and demand
// differ between boards. Worked examples and explanations do not vary by board.
export function variesByBoard(type) {
  return type === contentTypes.PRACTICE || type === contentTypes.EXAM;
}

export function isQuestionBank(type) {
  return type === contentTypes.PRACTICE || type === contentTypes.EXAM;
}

// Only maths and the sciences are tiered at GCSE. English, history, geography,
// computing and design technology are single-tier, so storing their content once
// per tier would double the rows and split a learner's content in half for no
// reason. Tiering is a property of the qualification, not of the learner.
export function variesByTier(subject) {
  return subject === "Maths" || subject === "Science";
}

// Some topics cannot be assessed by a typed question and a typed answer. A
// ruler-and-compass construction cannot be drawn in a text box, and a workshop
// prototype cannot be made in one. Generating questions for them produced
// material no learner could answer and no marker could mark, so the question
// bank leaves them to the explanation and worked-example routes.
const practicalTopics = new Set([
  "y10-maths-constructions",
  "y8-maths-measures",
  "y11-design-technology-prototype-manufacture",
  "y7-design-technology-materials-tools-and-safety",
]);

export function supportsQuestionBank(topicId) {
  return !practicalTopics.has(topicId);
}

// Not every sub-topic warrants a worked example. Where there is no method to
// show, asking for one produces a question with no right answer and steps that
// restate the outcome, so the decision is held per outcome alongside the rest
// of the routing policy and consulted before any example is generated, served
// or voiced. Without it a seeding run recreates every example ever deleted.
export { warrantsFormulae, warrantsWorkedExample } from "../../../src/data/workedExampleOutcomes.js";
import { classifiedOutcomes } from "../../../src/data/workedExampleOutcomes.js";

// Whether this particular sub-topic may carry a formula.
//
// usesFormulae() is a rule about subjects, and it exists because asking for a
// formula in English produced "Character development = (Actions + Language +
// Relationships) / 3". But a blanket rule is wrong at the edges: "Compare rates
// of change" is a History outcome with a real formula behind it, and refusing
// it left that sub-topic with no worked example at all. Where an outcome has
// been judged on its own wording, that judgement wins over the subject rule.
//
// Calculated subjects are unaffected: the classification says which outcomes
// warrant a formula, not which are allowed one, so it must not be used to
// forbid formulae in maths.
export function allowsFormulae(subject, topicId, index) {
  if (usesFormulae(subject)) return true;
  const entry = classifiedOutcomes(topicId);
  if (!entry) return false;
  return entry.formulae.includes(Number(index));
}
