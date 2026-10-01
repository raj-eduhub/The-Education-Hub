import { explanationForTier } from './explanationTier.js';

// A missing dedicated lesson remains explicitly a topic overview. Never pick
// outcome zero as a fallback for a different selected outcome.
export function selectExplanation(content, index, tier) {
  const { subtopics, ...overview } = content;
  const lesson = Number.isInteger(index) && index >= 0 ? subtopics?.[index] : null;
  const selected = explanationForTier(lesson ?? overview, tier);
  return {
    ...selected,
    scope: lesson ? 'subtopic' : 'topic',
    ...(lesson ? { subtopicIndex: index, subtopicTitle: lesson.title } : {}),
    ...Object.fromEntries(['storedAt', 'reviewStatus', 'reviewed'].filter(k => k in content).map(k => [k, content[k]])),
  };
}
