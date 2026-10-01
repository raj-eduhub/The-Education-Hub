// Independent editorial decisions for the reviewed correction batch.
// A model flag is not automatically accepted or dismissed by severity.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='output/curriculum-review';
const plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
assert.equal((9.5*1.12*1.03).toFixed(4),'10.9592');
assert.equal(((1.12*1.03-1)*100).toFixed(2),'15.36');
assert.equal((180*1.10*.94*1.04).toFixed(2),'193.56');
assert.equal(Math.round((95000/3.5+60000-9000)*.28),21880);
assert.equal(Math.round((95000/3.5+60000-9000)*.233),18207);
const decisions={
 adjudicatedAt:new Date().toISOString(),
 method:'Editorial examination of revised questions, answers and outcome mappings; direct arithmetic calculation; checks against official AQA subject content. This is not teacher approval or full board-coverage certification.',
 sources:[
  'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content',
  'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content',
 ],
 payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),
 flagDecisions:{
  'y10-maths-ratio/practice-5-AQA-Higher':'Retain formatting: dollar delimiters are consumed by the app’s maths renderer; £ is ordinary text immediately before the inline mathematical number. They are not stray visible dollar characters. The corrected arithmetic independently gives £193.56.',
  'y11-science-quantitative/practice-2-AQA-Higher':'Retain: the final working explicitly includes the escaped gas in the conserved total; the previous point explicitly excludes that gas from the flask weighing. The proposed clarification is already present across the adjacent sentences.',
  'y11-science-rates/explanation':'Retain: AQA 8464 section 5.6.1.1 explicitly marks calculating a tangent gradient HT only, while drawing/comparing tangents is common content. The revised sentence explicitly says AQA rather than asserting an Edexcel boundary. The final sentence describes the application’s Higher-topic organisation. Reject Nano’s replacement: it would remove a verified distinction and reintroduce calculation to the shared core.',
 },
 changesFollowingReview:[
  'Clarified historical scenarios to refer to their own supplied details; the original missing-stimulus flags were false positives.',
  'Made the tangent-gradient tier statement explicitly AQA-specific after Nano raised board variability.',
  'Corrected cinema intermediate price to 10.9592 after Nano identified the multiplication error; independently confirmed final price £10.96 and increase 15.36%.',
  'Independently corrected another percentage task to £193.56 and the DT solar running cost to £21,880.',
 ],
};
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify(decisions,null,2));
console.log(`Recorded independent adjudication for ${plan.changes.length} exact payloads.`);
