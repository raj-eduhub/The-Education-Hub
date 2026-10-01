// Apply an explicitly adjudicated plan with preflight checks, backup and ETags.
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {TableClient} from '@azure/data-tables';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {warrantsFormulae,warrantsWorkedExample} from '../../src/data/workedExampleOutcomes.js';
const dir=process.argv.find(a=>a.startsWith('--batch='))?.slice(8)??'output/curriculum-review';
const plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/, '')).Values;
assert.equal(plan.table,settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent');
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,plan.table);
const hash=p=>createHash('sha256').update(JSON.stringify(p)).digest('hex');
const decisions=JSON.parse(readFileSync(`${dir}/correction-adjudication.json`));
const reviews=new Map();
for(const f of readdirSync(`${dir}/nano-corrections`).filter(f=>f.endsWith('.json')&&f!=='run-summary.json')){
 const r=JSON.parse(readFileSync(`${dir}/nano-corrections/${f}`));
 for(const row of r.result.rows){
  const key=`${r.topicId}/${row.id}/${r.rowHashes?.[row.id]}`;
  const previous=reviews.get(key);
  if(!previous||r.reviewedAt>previous.reviewedAt)reviews.set(key,{...row,reviewedAt:r.reviewedAt});
 }
}
assert.equal(new Set(plan.changes.map(c=>c.ref)).size,plan.changes.length,'Duplicate correction');
const pending=[];
for(const c of plan.changes){
 const [partitionKey,rowKey]=c.ref.split('/'), t=curriculum.find(t=>t.id===partitionKey), p=c.payload;
 assert(t,'Unknown topic'); assert(t.outcomes.includes(c.subtopicTitle)||c.type==='explanation','Unknown outcome');
 const review=reviews.get(`${c.ref}/${hash(p)}`); assert(review,`Missing Nano review of this exact payload: ${c.ref}`);
 assert.equal(decisions.payloadHashes[c.ref],hash(p),`Missing independent adjudication: ${c.ref}`);
 if(review.status==='flag')assert(decisions.flagDecisions[c.ref]?.length,`Unresolved model flag: ${c.ref}`);
 if(c.type!=='explanation')assert(p.question?.trim()&&p.answer?.trim(),'Incomplete question');
 if(c.type==='exam'){assert(p.marks>0&&p.marks<=6);assert.equal(p.marks,p.markScheme.length);}
 if(c.type==='practice')assert(p.hint&&p.working.length>=2);
 if(c.type==='example'){
  const index=Number(rowKey.split('-')[1]);assert(warrantsWorkedExample(partitionKey,index));
  assert(!p.formulae?.length||warrantsFormulae(partitionKey,index));assert(p.steps.length);
 }
 const current=await client.getEntity(partitionKey,rowKey).catch(error=>{if(error.statusCode===404&&c.beforeHash===null)return null;throw error;});
 if(!current){pending.push({c,current:null});continue;}
 if(current.payload===JSON.stringify(p)&&current.subtopicTitle===c.subtopicTitle)continue;
 assert.equal(hash([current.payload,current.subtopicTitle]),c.beforeHash,`Record changed after plan preparation: ${c.ref}`);
 pending.push({c,current});
}
const backup=`${dir}/correction-backup-${Date.now()}.json`;
writeFileSync(backup,JSON.stringify({table:plan.table,entities:pending.map(x=>x.current).filter(Boolean),newRecords:pending.filter(x=>!x.current).map(x=>x.c.ref)},null,2));
const applied=[];
for(const {c,current} of pending){
 const [partitionKey,rowKey]=c.ref.split('/');
 const entity={partitionKey,rowKey,payload:JSON.stringify(c.payload),subtopicTitle:c.subtopicTitle,origin:'editorial',model:'',reviewed:false,reviewStatus:'pending',reviewedBy:'',reviewedAt:'',storedAt:new Date().toISOString()};
 if(current)await client.updateEntity(entity,'Merge',{etag:current.etag});
 else {const topic=curriculum.find(t=>t.id===partitionKey);await client.createEntity({...entity,type:c.type,subject:topic.subject,year:topic.year,topicTitle:topic.title});}
 const saved=await client.getEntity(partitionKey,rowKey);
 assert.equal(saved.payload,JSON.stringify(c.payload));assert.equal(saved.subtopicTitle,c.subtopicTitle);assert.equal(saved.reviewStatus,'pending');
 applied.push({ref:c.ref,reason:c.reason,payloadHash:hash(c.payload)});
 writeFileSync(`${dir}/applied-corrections.json`,JSON.stringify({appliedAt:new Date().toISOString(),backup,applied},null,2));
}
console.log(`Applied and read back ${applied.length} backed-up corrections; no teacher approvals assigned.`);
