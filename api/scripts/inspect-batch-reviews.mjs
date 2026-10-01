import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
for(const n of process.argv.slice(2)){
 const d=`output/curriculum-review/pass-${n}`,plan=JSON.parse(readFileSync(`${d}/correction-plan.json`)),reviews=readdirSync(`${d}/nano-corrections`).filter(f=>f.endsWith('.json')&&f!=='run-summary.json').map(f=>JSON.parse(readFileSync(`${d}/nano-corrections/${f}`)));
 let ok=0,flag=0,missing=0;
 for(const c of plan.changes){const [topic,id]=c.ref.split('/'),h=createHash('sha256').update(JSON.stringify(c.payload)).digest('hex'),r=reviews.filter(r=>r.topicId===topic&&r.rowHashes?.[id]===h).sort((a,b)=>b.reviewedAt.localeCompare(a.reviewedAt))[0]?.result.rows.find(r=>r.id===id);if(r?.status==='ok')ok++;else{r?flag++:missing++;console.log(JSON.stringify({pass:n,ref:c.ref,review:r??'missing'}));}}
 console.log(JSON.stringify({pass:n,ok,flag,missing}));
}
