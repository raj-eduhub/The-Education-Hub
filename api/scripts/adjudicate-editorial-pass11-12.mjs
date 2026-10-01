import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const decisions={11:{
'y10-design-technology-energy-systems-and-mechanisms/exam-4-AQA-core':'Reject: no PP3 battery format is specified. Normal and stall currents are supplied operating-point values, not claims of current constant at all speeds. The answer says approximately and explicitly separates running output from stall heating.',
'y11-design-technology-design-decisions-and-exam-practice/exam-3-Edexcel-core':'Reject: the revised prompt expressly asks for a design proposal. It does not prohibit proposing dimensions. The answer labels the size and layout as a prototype requiring fit and stability tests.'},12:{
'y11-geography-decision-making-exercise/practice-9-AQA-core':'Retain: the corrected working and answer explicitly identify incomparable metrics and missing costs, and make only a conditional recommendation. Evaluating incomplete sources is the learning objective; inventing cost data would defeat it. This is practice, not a marked exam question.',
'y10-geography-urban-issues-and-challenges/exam-1-AQA-core':'Corrected: question now asks for one reason, consistent with the rubric. Numerical values recalculated: 902.50/2080 × 100 = 43.3894%, rounded 43.4%.'}};
for(const n of [11,12]){
 const dir=`output/curriculum-review/pass-${n}`,plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
 writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Independent review of every revised prompt, answer, working and rubric; arithmetic recomputed and unsupported performance claims qualified. Nano suggestions adjudicated against actual text. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:decisions[n]},null,2));
 console.log(`Adjudicated ${n}: ${plan.changes.length} payloads.`);
}
