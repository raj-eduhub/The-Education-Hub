const diagnosticKey = "education-hub-diagnostics";

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(diagnosticKey)) ?? {};
  } catch {
    return {};
  }
}

function recordKey(ownerEmail, year, subject) {
  return `${ownerEmail.toLowerCase()}::${year}::${subject}`;
}

export function diagnosticQuestions(topics, limit = 5) {
  if (topics.length <= limit) return topics.map(toQuestion);
  const indexes = Array.from({ length: limit }, (_, index) =>
    Math.round((index * (topics.length - 1)) / (limit - 1))
  );
  return indexes.map((index) => toQuestion(topics[index]));
}

function toQuestion(topic) {
  const outcome = topic.outcomes[0];
  return {
    topicId: topic.id,
    topic: topic.title,
    unit: topic.unit,
    outcome,
    prompt: `Show what you know about ${topic.title}. ${outcome}. Explain your thinking and include an example where useful.`,
  };
}

export function loadDiagnostic(ownerEmail, year, subject) {
  if (!ownerEmail || !year || !subject) return null;
  return readAll()[recordKey(ownerEmail, year, subject)] ?? null;
}

export function saveDiagnostic(ownerEmail, result) {
  const all = readAll();
  const key = recordKey(ownerEmail, result.year, result.subject);
  const previous = all[key];
  const evidenceCount = (previous?.evidenceCount ?? 0) + result.results.length;
  const attempts = (previous?.attempts ?? 0) + 1;
  const stored = {
    ...result,
    evidenceCount,
    attempts,
    gradePrediction: {
      status: evidenceCount >= 15 ? "evidence-threshold-met" : "insufficient-evidence",
      minimumEvidence: 15,
    },
  };
  all[key] = stored;
  localStorage.setItem(diagnosticKey, JSON.stringify(all));
  return stored;
}

export function personaliseTopics(topics, diagnostic) {
  if (!diagnostic) return topics;
  const scores = new Map(diagnostic.results.map((item) => [item.topicId, item.score]));
  return topics
    .map((topic, index) => ({ topic, index, score: scores.get(topic.id) }))
    .sort((a, b) => {
      const aRank = a.score === undefined ? 2 : a.score === 3 ? 3 : a.score;
      const bRank = b.score === undefined ? 2 : b.score === 3 ? 3 : b.score;
      return aRank - bRank || a.index - b.index;
    })
    .map(({ topic }) => topic);
}
