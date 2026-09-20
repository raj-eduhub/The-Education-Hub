// Answers a tutor question from stored curriculum content when the stored text
// clearly covers it, so a repeat question costs no model tokens.
import { tokenise } from "./textMatch.js";
import { listTopicContent } from "./contentStore.js";
import { contentTypes } from "./contentPolicy.js";

// Matching is asymmetric on purpose. Cosine-style similarity punishes a short
// question scored against a long worked example, so "use standard form to write
// 0.0027" missed a stored example that covered every word of it. What matters is
// how much of the QUESTION the stored text covers, not how alike they are.
const coverageThreshold = 0.75;
// Below this, a question is too thin to match on safely: "explain bounds" would
// match almost anything stored under that topic.
const minimumTokens = 2;

export async function loadStudyMaterial(topicId) {
  if (!topicId) return [];
  return listTopicContent(topicId);
}

// Every stored row flattened to plain text, used both for matching and to widen
// the guard's idea of what counts as on-topic vocabulary.
export function materialText(material) {
  const text = [];
  for (const row of material) {
    const payload = row.payload ?? {};
    if (payload.explanation) text.push(payload.explanation);
    if (payload.keyIdeas) text.push(...payload.keyIdeas);
    if (payload.formulae) text.push(...payload.formulae);
    if (payload.question) text.push(payload.question);
    if (payload.steps) text.push(...payload.steps);
    if (row.subtopicTitle) text.push(row.subtopicTitle);
  }
  return text;
}

function renderExplanation(payload) {
  return [
    payload.explanation,
    payload.keyIdeas?.length ? `\nKey ideas:\n${payload.keyIdeas.map((idea) => `- ${idea}`).join("\n")}` : "",
    payload.formulae?.length ? `\nKey formulas:\n${payload.formulae.map((formula) => `- ${formula}`).join("\n")}` : "",
    "\nWould you like me to work through an example, or try a question yourself?",
  ].filter(Boolean).join("\n");
}

function renderExample(payload, title) {
  return [
    `Here is a worked example for ${title}.`,
    `\nQuestion: ${payload.question}`,
    payload.steps.map((step, index) => `${index + 1}. ${step}`).join("\n"),
    payload.answer ? `\nAnswer: ${payload.answer}` : "",
    "\nWould you like to try a similar one?",
  ].filter(Boolean).join("\n");
}

// The review gate applies wherever stored content reaches a learner, and this is
// one of those places: a matched row is rendered to them verbatim. The content
// endpoint already honours it; without this the tutor was a way round it, which
// is the one thing the gate exists to prevent.
//
// It is applied here rather than in loadStudyMaterial because that material is
// also used to widen the guard's sense of on-topic vocabulary, and that never
// reaches the learner. Narrowing it there would only make the guard redirect
// more legitimate questions as off-topic.
function servableToLearner(row) {
  if (process.env.REQUIRE_REVIEWED_CONTENT !== "true") return true;
  return row.reviewed === true;
}

export function findStoredAnswer(question, material) {
  const tokens = tokenise(question);
  if (tokens.length < minimumTokens) return null;
  let best = null;
  for (const row of material.filter(servableToLearner)) {
    const payload = row.payload ?? {};
    const candidate = row.type === contentTypes.EXPLANATION
      ? [payload.explanation, ...(payload.keyIdeas ?? []), ...(payload.formulae ?? [])].join(" ")
      : [row.subtopicTitle, payload.question, ...(payload.steps ?? []), payload.answer].join(" ");
    const candidateTokens = new Set(tokenise(candidate));
    const covered = tokens.filter((token) => candidateTokens.has(token)).length;
    const coverage = covered / tokens.length;
    if (!best || coverage > best.coverage) best = { coverage, row, payload };
  }
  if (!best || best.coverage < coverageThreshold) return null;
  const answer = best.row.type === contentTypes.EXPLANATION
    ? renderExplanation(best.payload)
    : renderExample(best.payload, best.row.subtopicTitle || best.row.topicTitle);
  if (!answer.trim()) return null;
  return { answer, score: best.coverage, type: best.row.type, rowKey: best.row.rowKey };
}
