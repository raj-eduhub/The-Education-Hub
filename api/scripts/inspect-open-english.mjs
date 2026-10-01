import {readFileSync} from 'node:fs';
const root='output/curriculum-review',snapshot=JSON.parse(readFileSync(`${root}/current-snapshot.json`)),flags=JSON.parse(readFileSync(`${root}/outstanding-model-flags.json`)).rows;
for(const f of flags.filter(f=>f.ref.includes('-english-'))){
 const e=snapshot.entities.find(e=>`${e.partitionKey}/${e.rowKey}`===f.ref),p=JSON.parse(e.payload);
 const reason=f.issues.map(i=>i.reason).join(' ');
 if(!/word|length|paragraph/i.test(reason))continue;
 console.log(JSON.stringify({ref:f.ref,words:p.answer.trim().split(/\s+/).length,paragraphs:p.answer.split(/\n\s*\n/).length,task:p.question.slice(0,550),reason}));
}
