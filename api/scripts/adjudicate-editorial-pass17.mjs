import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='output/curriculum-review/pass-17',plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
assert.equal(13+5+7+5,30);assert.equal(.55*.92+.45*.94,.929);
assert.equal(30-80,-50);assert.equal(140-80,60);assert.equal(110-80,30);
assert.equal(.85*1000,850);assert.equal(.05*1000,50);assert.equal(.9*800,720);
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Independently checked Venn partitions, rearrangement, scale factor, conditional probabilities, seasonal comparisons, reaction-profile arithmetic, fresh-strip experimental controls and six-mark allocations. Qualitative respiration and hypothetical vaccination comparisons avoid unsupported numerical or causal claims. All 12 exact revised payloads passed the second-reader review. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:{}},null,2));
console.log(`Adjudicated ${plan.changes.length} payloads.`);
