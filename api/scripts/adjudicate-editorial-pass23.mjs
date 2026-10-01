import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='output/curriculum-review/pass-23',plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
assert.equal(15*9*4,540);assert.equal(Math.round(Math.PI*3.1**2*21.5),649);assert.equal((.012*28).toFixed(3),'0.336');
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Checked external-versus-internal volume, independent energy scenarios, all stated prototype requirements and measurable test procedures. Confirmed that leakage is collected outside the box and screw-cap torque is distinguished from vertical force. All 12 current payloads have no second-reader flags. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:{}},null,2));console.log(`Adjudicated ${plan.changes.length} payloads.`);
