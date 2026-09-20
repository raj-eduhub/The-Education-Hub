import y10MathsNumber from "./y10-maths-number.jsx";
import y7MathsNumber from "./y7-maths-number.jsx";
import y7ScienceParticles from "./y7-science-particles.jsx";
import y8MathsPercentages from "./y8-maths-percentages.jsx";
import y9MathsPythagoras from "./y9-maths-pythagoras.jsx";

// Authored visuals, by topic id.
//
// A visual is the part of a video that cannot be replaced by narration: it
// carries information the sentence cannot. They are authored per topic, which
// is the real cost of video and the reason this is not simply switched on for
// all 210 topics at once.
//
// A topic with no entry plays as narration alone, so this can be filled in
// topic by topic without the lesson player needing to know which have visuals.
const visuals = {
  "y7-maths-number": y7MathsNumber,
  "y7-science-particles": y7ScienceParticles,
  "y8-maths-percentages": y8MathsPercentages,
  "y9-maths-pythagoras": y9MathsPythagoras,
  "y10-maths-number": y10MathsNumber,
};

export function visualsFor(topicId) {
  return visuals[topicId] ?? [];
}

export function hasVisuals(topicId) {
  return visualsFor(topicId).length > 0;
}
