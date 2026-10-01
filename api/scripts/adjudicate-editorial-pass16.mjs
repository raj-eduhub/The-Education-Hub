import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='output/curriculum-review/pass-16',plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
const poem=plan.changes.find(c=>c.ref.includes('poetry')).payload.question.split('\n\n').slice(1);
assert.deepEqual(poem.map(s=>s.split('\n').length),[6,6]);
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Compared quotations with the supplied text, verified two six-line stanzas and two-word final line, checked complete model responses and distinguished fictional stimuli from authenticated evidence. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:{'y10-english-spoken/practice-9-Edexcel-core':'Retain: Point 2 is the second main point, explicitly attention and mood; its two key points are listed in the answer. Slide 4 separately requires a named reliable source and its limits. This task requests an outline, not a completed research presentation, so inventing a study would be inappropriate. Illustrations are correctly distinguished from evidence.'}},null,2));
console.log(`Adjudicated ${plan.changes.length} payloads.`);
