import {readFileSync,writeFileSync} from 'node:fs';
const path='output/curriculum-review/pass-35/drafts/y9-geography-geographical-enquiry.json';
const d=JSON.parse(readFileSync(path));
// Evaluation of findings does not require an unrelated percentage-change panel.
d.payload.subtopics[5].formulae=[];
d.state='needs_recheck';d.feedback=['Removed an unnecessary percentage-change formula from presentation/evaluation of findings.'];
writeFileSync(path,JSON.stringify(d,null,2));
