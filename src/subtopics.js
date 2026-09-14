// Sub-topics are the curriculum outcomes already recorded against each topic, so
// the catalogue stays the single source of truth for what a year group covers.
// Their worked examples live in Table Storage and are served by /api/examples.
export function subtopicsFor(topic) {
  if (!topic) return [];
  return topic.outcomes.map((outcome, index) => ({
    id: `${topic.id}::${index}`,
    topicId: topic.id,
    index,
    title: outcome,
  }));
}
