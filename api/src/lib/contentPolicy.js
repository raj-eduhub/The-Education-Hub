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

// Practice and exam questions are stored per board because exam style and demand
// differ between boards. Worked examples and explanations do not vary by board.
export function variesByBoard(type) {
  return type === contentTypes.PRACTICE || type === contentTypes.EXAM;
}

export function isQuestionBank(type) {
  return type === contentTypes.PRACTICE || type === contentTypes.EXAM;
}
