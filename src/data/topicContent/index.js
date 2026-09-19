// Authored curriculum content, keyed by catalogue topic id.
//
// This is the whole point of the routing policy: explanations and key ideas are
// written, not generated, so the model is never asked to invent the core
// teaching text and a learner never waits on a model call to read it.
// `npm run validate:curriculum` fails if a catalogue topic has no entry here.
import { mathsContent } from "./maths.js";
import { scienceContent } from "./science.js";
import { englishContent } from "./english.js";
import { humanitiesContent } from "./humanities.js";
import { technicalContent } from "./technical.js";

export const topicContent = {
  ...mathsContent,
  ...scienceContent,
  ...englishContent,
  ...humanitiesContent,
  ...technicalContent,
};

export function contentFor(topicId) {
  return topicContent[topicId] ?? null;
}
