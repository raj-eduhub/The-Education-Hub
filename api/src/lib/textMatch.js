// Lexical matching shared by tutor retrieval and the tutor guard. Deliberately
// dependency-free and deterministic: the same question always scores the same,
// the decision can be explained to a parent, and it costs no model tokens.
const stopWords = new Set([
  "a", "about", "am", "an", "and", "answer", "any", "are", "as", "at", "be", "because", "been", "but", "by",
  "can", "could", "did", "do", "does", "explain", "for", "from", "get", "give", "had", "has", "have", "help",
  "how", "i", "if", "in", "is", "it", "its", "just", "know", "like", "me", "mean", "means", "more", "my",
  "need", "not", "of", "on", "one", "or", "please", "question", "show", "so", "some", "tell", "that", "the",
  "their", "them", "then", "there", "these", "they", "this", "to", "understand", "up", "use", "used", "using",
  "very", "was", "we", "what", "when", "where", "which", "why", "will", "with", "would", "you", "your",
]);

export function tokenise(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .map(stem);
}

// A deliberately small stemmer. It only has to make "fractions" match "fraction"
// and "solving" match "solve"; anything cleverer would be harder to reason about.
function stem(word) {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

export function vocabularyOf(...texts) {
  const vocabulary = new Set();
  for (const text of texts.flat()) for (const token of tokenise(text)) vocabulary.add(token);
  return vocabulary;
}

// Share of the question's meaningful words that the curriculum text also uses.
export function overlapScore(question, vocabulary) {
  const tokens = tokenise(question);
  if (!tokens.length) return { score: 0, matched: [], tokens };
  const matched = tokens.filter((token) => vocabulary.has(token));
  return { score: matched.length / tokens.length, matched: [...new Set(matched)], tokens };
}

// Symmetric similarity, used when ranking stored content against a question.
export function similarity(question, text) {
  const left = new Set(tokenise(question));
  const right = new Set(tokenise(text));
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared / Math.sqrt(left.size * right.size);
}
