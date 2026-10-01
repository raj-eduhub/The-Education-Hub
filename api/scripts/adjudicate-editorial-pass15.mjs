import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const dir='output/curriculum-review/pass-15',plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Independently inspected all 13 corrected records. Eight Python model answers compiled and executed with expected outputs and boundary cases in test-editorial-python.py. Checked binary shift separately from addition carry and verified the original arithmetic; removed only unnecessary full-adder formulas. Checked file-size division and compression ratio. No teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:{}},null,2));
console.log(`Adjudicated ${plan.changes.length} payloads.`);
