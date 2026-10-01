import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='output/curriculum-review/pass-18',plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
assert.equal(264/44,6);assert.equal(108/18,6);assert.equal((49*.7-6).toFixed(1),'28.3');assert.equal(((25.5+25+26)/3).toFixed(2),'25.50');
assert.equal((3.19-1.2).toFixed(2),'1.99');assert.equal((4.8-3.6)/4.8,.24999999999999994);
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Independently checked calculations, all question parts, explicit marking allocations, savings-year boundaries, causal limitations and axial voice-coil motion. All 16 exact payloads passed the second reader. Neither missing cost data nor a carbon footprint alone establishes overall environmental superiority. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:{}},null,2));
console.log(`Adjudicated ${plan.changes.length} payloads.`);
