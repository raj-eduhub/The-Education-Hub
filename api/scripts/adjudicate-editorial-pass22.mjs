import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='output/curriculum-review/pass-22',plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
const expected=[679,675,594,334,230,208,571];plan.changes.forEach((c,i)=>assert.equal(c.payload.answer.trim().split(/\s+/).length,expected[i]));
const shaped=plan.changes.find(c=>c.ref.endsWith('practice-9-AQA-core')).payload.answer.split('\n\n');
assert.deepEqual(shaped.map(p=>[...new Intl.Segmenter('en',{granularity:'sentence'}).segment(p)].length),[1,2,2,2,1]);
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Read revised models against their briefs, counted words deterministically and checked paragraph/sentence structure. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:{
'y10-english-lang-writing/practice-4-AQA-core':'Actual revised count is 675 words, within 600–700. Nano estimated instead of counting.',
'y10-english-lang-writing/practice-6-Edexcel-core':'Actual revised count is 594 words, within 500–600. The ending returns to the bench and coin with a changed intention.',
'y11-english-creative/exam-6-AQA-core':'The plan itself is 230 words, within 220–250. Five planned story scenes of roughly 200 words each yield the separate requested 1000-word story. Nano conflated plan length with eventual story length.',
'y9-english-transactional/exam-8-AQA-core':'The answer is 571 words and exactly five paragraphs, within the brief. Paragraph four answers the cost objection with reuse, a small trial and conditional expansion; refusing to claim causation from attendance alone is appropriate.'
}},null,2));console.log(`Adjudicated ${plan.changes.length} payloads.`);
