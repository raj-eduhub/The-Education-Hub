import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
const root='output/curriculum-review/pass-3';
const snapshot=JSON.parse(readFileSync(`${root}/before-snapshot.json`));
const entities=new Map(snapshot.entities.map(e=>[`${e.partitionKey}/${e.rowKey}`,e]));
const flags=[];let rows=0,files=0;
for(const f of readdirSync(`${root}/nano-deep`).filter(f=>f.endsWith('.json')&&f!=='run-summary.json')){
 const review=JSON.parse(readFileSync(`${root}/nano-deep/${f}`));files++;rows+=review.result.rows.length;
 for(const r of review.result.rows.filter(r=>r.status==='flag'))flags.push({ref:`${review.topicId}/${r.id}`,hash:review.rowHashes[r.id],issues:r.issues});
}
writeFileSync(`${root}/deep-flags-current.json`,JSON.stringify({files,rows,flags},null,2));
const prefix=process.argv[2]??'',detail=process.argv.includes('--detail'),pattern=process.argv.find(a=>a.startsWith('--match='))?.slice(8);
console.log(JSON.stringify({files,rows,flagged:flags.length}));
for(const f of flags.filter(f=>f.ref.startsWith(prefix)&&(!pattern||new RegExp(pattern).test(f.ref)))){const e=entities.get(f.ref);console.log(JSON.stringify(detail?{ref:f.ref,outcome:e?.subtopicTitle,payload:JSON.parse(e.payload)}:f));}
