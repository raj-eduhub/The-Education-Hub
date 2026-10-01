// Integration check against a local Functions host and its real stored rows.
// Uses the existing demo login; no content generation or profile edits.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide,getAuthoredExample} from '../../src/topicGuides.js';
import {selectExplanation} from '../../src/data/selectExplanation.js';
const base=process.env.TEST_API_BASE??'http://127.0.0.1:7071/api';
const login=await fetch(`${base}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:process.env.TEST_USERNAME??'demo.parent',password:process.env.TEST_PASSWORD??'EducationHub2026!'})});
assert.equal(login.status,200,'Local demo sign-in failed');
const cookie=login.headers.get('set-cookie')?.split(';')[0];assert(cookie);
const topic=curriculum.find(t=>t.id==='y9-maths-powers');
async function request(type,index,title=topic.outcomes[index]){
 const response=await fetch(`${base}/content`,{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({type,year:9,subject:'Maths',topic,subtopic:index===undefined?undefined:{index,title}})});
 return {status:response.status,body:await response.json()};
}
const results=[];
for(const [index,title] of topic.outcomes.entries()){
 const lesson=await request('explanation',index),example=await request('example',index);
 assert.equal(lesson.status,200,JSON.stringify(lesson.body));assert.equal(example.status,200,JSON.stringify(example.body));
 const expected=selectExplanation(getTopicGuide('Maths',topic),index,'Foundation');
 for(const k of ['scope','subtopicIndex','subtopicTitle','explanation','keyIdeas','formulae'])assert.deepEqual(lesson.body.content[k],expected[k],`${title}/${k}`);
 const authored=getAuthoredExample('Maths',topic,index);
 for(const k of ['question','steps','answer','formulae'])assert.deepEqual(example.body.content[k],authored[k],`${title}/${k}`);
 assert.equal(lesson.body.generated,false);assert.equal(example.body.generated,false);
 assert.equal(lesson.body.content.source,'stored');assert.equal(example.body.content.source,'stored');
 results.push({index,title,scope:lesson.body.content.scope,formulaCount:expected.formulae.length,question:authored.question,source:'stored'});
}
for(const index of [-1,6,0.5,'1'])assert.equal((await request('explanation',index,'Invalid')).status,400);
assert.equal((await request('explanation',1,'Apply index laws')).status,400);
assert.equal((await request('explanation',undefined)).body.content.scope,'topic');
assert.equal(new Set(results.map(r=>r.question)).size,6);
writeFileSync('output/curriculum-review/subtopic-routing-verification.json',JSON.stringify({checkedAt:new Date().toISOString(),base,results,invalidReferencesRejected:5,overviewPreserved:true},null,2));
console.log('PASS: all six real stored lessons/examples served correctly, no model calls, invalid subtopic references rejected, topic overview preserved.');
