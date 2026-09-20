// How a topic's progress is classified, in one place.
//
// The progress dashboard and the curriculum progress bar both answer "has this
// been started", and they have to answer it the same way: a learner seeing
// "5 of 9 started" on the lesson page and a different count on their progress
// page would trust neither.
export const topicStates = ["completed", "review", "in-progress", "not-started"];

export const stateLabels = {
  completed: "Secure",
  review: "Due for review",
  "in-progress": "In progress",
  "not-started": "Not started",
};

// Secure at 80%: high enough that it means something, low enough to be
// reachable. A topic falls back to "due for review" once its review date has
// passed, because mastery decays and the score alone stops being the truth.
export const secureAt = 80;

// ...and on more than one answer. A first attempt sets the mastery score to the
// accuracy of that single answer, so one diagnostic question marked 3 out of 3
// scored 100 and the topic was reported Secure before any lesson was taken.
// Three attempts is the point where one generous mark cannot carry a topic on
// its own.
export const secureAfterAttempts = 3;

export function topicState(mastery) {
  if (!mastery) return "not-started";
  if (mastery.masteryScore >= secureAt && (mastery.attempts ?? 0) >= secureAfterAttempts) return "completed";
  if (mastery.nextReviewAt && new Date(mastery.nextReviewAt).getTime() <= Date.now()) return "review";
  return "in-progress";
}

// Counts every topic in a list by its state, given mastery records keyed by
// topic id. "started" is everything that is not untouched - deliberately not
// "studied", which claims more than a recorded attempt shows.
export function progressFor(topics, masteryByTopic) {
  const counts = { completed: 0, review: 0, "in-progress": 0, "not-started": 0 };
  for (const topic of topics) counts[topicState(masteryByTopic.get(topic.id))] += 1;
  const total = topics.length;
  return { ...counts, total, started: total - counts["not-started"] };
}
