import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const decisions={
9:{
'y10-english-poetry/practice-5-Edexcel-core':'Reject: the text explicitly says it is NOT an Edexcel anthology poem and is an original teaching stimulus. Optional interpretive scaffolding is appropriate for this practice task.',
'y10-history-international-period-study/practice-7-Edexcel-core':'Reject the proposed 1928 date: UN Peacemaker confirms the League decision in June 1921. Absence of major powers includes the United States; the statement does not say all major powers were absent.',
'y11-english-creative/practice-1-AQA-core':'Reject estimated length: programmatically counted 915 words, within 800–1000.',
'y11-english-creative/exam-1-Edexcel-core':'Reject estimated length: programmatically counted 915 words, within 900–1000. A shared original narrative can demonstrate structure for both boards without being an official specimen.',
'y11-english-creative/exam-8-Edexcel-core':'Reject: the actual answer has no newline and is one paragraph. Smelled is acceptable British English.'},
10:{
'y10-computing-algorithms-and-efficiency/exam-5-Edexcel-core':'Retain: there are five inspections of non-empty intervals; zero is termination, not a sixth inspection. The suggested 25 to 13 sequence is incorrect after removing the middle item.',
'y10-computing-networks-protocols-and-security/explanation':'Retain: TCP/IP denotes the suite and both roles are correctly attributed to the suite collectively. Further separation of IP and TCP is optional detail.',
'y11-computing-ethical-legal-and-environmental-impacts/practice-8-AQA-core':'Retain: these are proposals to evaluate in the question, not endorsed policy. The revised working and answer explicitly require checking retention, lawful processing and whether data are genuinely anonymised.',
'y11-science-ecology/exam-8-AQA-Higher':'Retain: the stated eight-species outcome is explicitly a forecast in the corrected answer, with monitoring and uncertainty required.'}};
for(const n of [9,10]){
 const dir=`output/curriculum-review/pass-${n}`,plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
 if(n===9)for(const c of plan.changes){if(/creative\/(practice-1-AQA|exam-1-Edexcel)/.test(c.ref))assert.equal(c.payload.answer.trim().split(/\s+/).length,915);if(c.ref.endsWith('creative/exam-8-Edexcel-core'))assert(!c.payload.answer.includes('\n'));}
 writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Independent reading of exact corrected stimuli, answers and rubrics; computed word counts and arithmetic; checked source provenance. Model flags assessed individually. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:decisions[n],sources:['https://peacemaker.un.org/en/node/9375','https://www.folger.edu/explore/shakespeares-works/macbeth/read/1/7/']},null,2));
 console.log(`Adjudicated pass ${n}: ${plan.changes.length} payloads.`);
}
