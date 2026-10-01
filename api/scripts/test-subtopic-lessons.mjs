import assert from 'node:assert/strict';
import katex from 'katex';
import { curriculum } from '../../src/data/curriculumCatalog.js';
import { getTopicGuide, getAuthoredExample } from '../../src/topicGuides.js';
import { selectExplanation } from '../../src/data/selectExplanation.js';
import { lessonBeats, beatSpeech } from '../../src/lessonBeats.js';
import { toSpoken } from '../../src/speech.js';
import { warrantsFormulae } from '../../src/data/workedExampleOutcomes.js';

const topic = curriculum.find(t => t.id === 'y9-maths-powers');
const stored = {...getTopicGuide(topic.subject, topic), reviewStatus: 'pending', reviewed: false};
const before = JSON.stringify(stored);
const explanations = [], questions = [];
for (const [index, title] of topic.outcomes.entries()) {
  const lesson = selectExplanation(stored, index, 'Foundation');
  assert.equal(lesson.scope, 'subtopic');
  assert.equal(lesson.subtopicTitle, title);
  assert.equal(lesson.subtopicIndex, index);
  assert.equal(lesson.reviewStatus, 'pending');
  assert(!('subtopics' in lesson), 'Unselected lessons leaked to response');
  assert(!('question' in lesson), 'Topic example leaked into subtopic explanation');
  assert(lesson.explanation.length > 100);
  assert(!lesson.formulae.length || warrantsFormulae(topic.id, index));
  explanations.push(lesson.explanation);
  const example = getAuthoredExample(topic.subject, topic, index);
  assert(example?.question && example.steps.length >= 2 && example.answer, title);
  questions.push(example.question);
  for (const text of [lesson.explanation, ...lesson.keyIdeas, ...lesson.formulae, example.question, ...example.steps, example.answer]) {
    for (const [, expression] of text.matchAll(/\$([^$]+)\$/g)) katex.renderToString(expression, {throwOnError: true});
  }
  const beats = lessonBeats(topic, lesson);
  assert.equal(beats[0].text, title);
  assert(!beats.some(b => b.kind === 'visual'), 'Unrelated topic visual leaked into focused lesson');
  assert(beats.at(-1).text.includes('subtopic'));
  for (const beat of beats) assert(!/[\\${}]/.test(beatSpeech(beat, toSpoken)), `Unspoken markup: ${beat.text}`);
}
assert.equal(new Set(explanations).size, 6);
assert.equal(new Set(questions).size, 6);
assert.equal(selectExplanation(stored, 1).formulae.length, 0, 'Root estimation needs no formula panel');
assert.equal(JSON.stringify(stored), before, 'Selecting a lesson mutated stored content');
for (const index of [undefined, null, -1, 6, '0', NaN]) assert.equal(selectExplanation(stored, index).scope, 'topic');
const empty = selectExplanation({explanation: 'Overview', keyIdeas: [], formulae: []}, 2);
assert.equal(empty.scope, 'topic');
const tiered = {explanation: 'Overview', subtopics: [{title: 'Specific', explanation: 'Core', keyIdeas: [], formulae: [], higher: {explanation: 'Extension', keyIdeas: ['Higher idea'], formulae: []}}]};
assert.equal(selectExplanation(tiered, 0, 'Foundation').explanation, 'Core');
assert.equal(selectExplanation(tiered, 0, 'Higher').explanation, 'Core Extension');
// Independent arithmetic checks for the authored answers and rounding midpoint.
assert.equal((3 ** 5 * 3 ** 2) / 3 ** 3, 3 ** 4);
assert.equal(Math.round(Math.sqrt(50) * 10) / 10, 7.1);
assert(7.05 ** 2 < 50 && 7.1 ** 2 > 50);
assert.equal(4e5 * 3e-2, 1.2e4);
assert(Math.abs(4.56 * 1e3 - 4560) < 1e-10);
assert(Math.abs(4.56 * 1e-2 - 0.0456) < 1e-10);
assert.equal(7.2e-4, 0.00072);
assert.equal(5.3e4, 53000);
assert.equal(3 ** 2 + Math.sqrt(16 + 9) * 2, 19);
console.log('PASS: six distinct lessons/examples, arithmetic, formula relevance, KaTeX, tier/overview fallbacks and focused narration.');
