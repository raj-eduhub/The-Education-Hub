import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const dir='output/curriculum-review/pass-33';
const plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({
  adjudicatedAt:new Date().toISOString(),
  method:'Independently checked all six outcome explanations and examples, non-zero domain restrictions, root-rounding midpoint 7.05 squared = 49.7025, index arithmetic, powers-of-ten conversions, standard-form normalisation and order of operations. Compared demand with DfE KS3 Number guidance. All seven exact-payload nano reviews reported no issue; this is not teacher approval.',
  sources:['https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study'],
  payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),
  flagDecisions:{},
},null,2));
