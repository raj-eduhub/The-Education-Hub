// Repair JSON over-escaping in maths; every changed payload needs a new review.
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
const dir='output/curriculum-review/pass-35/drafts',changedTopics=[];
for(const f of readdirSync(dir).filter(f=>!f.includes('-attempt-'))){
 const path=`${dir}/${f}`,d=JSON.parse(readFileSync(path));let changed=false;
 function visit(v){if(typeof v==='string'){const fixed=v.replace(/\${2,}/g,'$').replace(/\$([^$]+)\$/g,(_,m)=>'$'+m.replace(/\\{2,}(?=[A-Za-z])/g,'\\').replace(/(?<!\\)%/g,'\\%')+'$');if(fixed!==v)changed=true;return fixed;}if(Array.isArray(v))return v.map(visit);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,visit(x)]));return v;}
 d.payload.subtopics=visit(d.payload.subtopics);if(changed){d.state='needs_recheck';d.feedback=['Corrected LaTeX escaping; independent exact-payload recheck required.'];writeFileSync(path,JSON.stringify(d,null,2));changedTopics.push(d.topicId);}
}
console.log(JSON.stringify({changedTopics}));
