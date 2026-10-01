// Check every requested outcome against the real local DB and source, not title-only UI text.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {TableClient} from '@azure/data-tables';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide} from '../../src/topicGuides.js';
import {selectExplanation} from '../../src/data/selectExplanation.js';
import {warrantsFormulae} from '../../src/data/workedExampleOutcomes.js';
import {lessonBeats,beatSpeech} from '../../src/lessonBeats.js';
import {toSpoken} from '../../src/speech.js';
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values;
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent');
const base='http://127.0.0.1:7071/api';
const login=await fetch(`${base}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'demo.parent',password:'EducationHub2026!'})});
assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')?.split(';')[0];assert(cookie);
const profileResponse=await fetch(`${base}/profile`,{headers:{Cookie:cookie}});assert.equal(profileResponse.status,200);
const effectiveTier=(await profileResponse.json()).profile?.tier??'Foundation';
const requested=process.argv.find(a=>a.startsWith('--topic='))?.slice(8);
const topics=requested?curriculum.filter(t=>t.id===requested):curriculum;
const results=[],errors=[];let next=0;
async function check(topic){
 const e=await client.getEntity(topic.id,'explanation'),stored=JSON.parse(e.payload),guide=getTopicGuide(topic.subject,topic),seen=new Set();
 for(const [index,title] of topic.outcomes.entries()){
  if(process.argv.includes('--dedicated-only')&&!stored.subtopics?.[index])continue;
  try{
   const response=await fetch(`${base}/content`,{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({type:'explanation',year:topic.year,subject:topic.subject,topic,subtopic:{index,title}})}),body=await response.json();
   assert.equal(response.status,200,JSON.stringify(body));assert.equal(body.generated,false);assert.equal(body.content.source,'stored');
   const expected=selectExplanation(stored,index,effectiveTier),source=selectExplanation(guide,index,effectiveTier);
   assert.equal(expected.scope,'subtopic');assert.equal(expected.subtopicTitle,title);
   for(const field of ['scope','subtopicIndex','subtopicTitle','explanation','keyIdeas','formulae']){assert.deepEqual(body.content[field],expected[field],`API ${field}`);assert.deepEqual(source[field],expected[field],`source ${field}`);}
   const normalized=expected.explanation.toLowerCase().replace(/[^a-z0-9]+/g,' ');assert(!seen.has(normalized),'Repeated explanation');seen.add(normalized);
   for(const tier of ['Foundation','Higher']){
    const selected=selectExplanation(stored,index,tier);assert(!selected.formulae.length||warrantsFormulae(topic.id,index),'Inapplicable formula panel');
    const beats=lessonBeats(topic,selected);assert.equal(beats[0].text,title);assert(!beats.some(b=>b.kind==='visual'));
    for(const b of beats){const spoken=beatSpeech(b,toSpoken);assert(spoken.trim().length&&spoken.length<2000,'Invalid narration beat');assert(!/[\\${}]/.test(spoken),`Unspoken notation: ${spoken}`);}
   }
   results.push({topicId:topic.id,year:topic.year,subject:topic.subject,index,title,scope:'subtopic',source:'stored',formulaCount:expected.formulae.length});
  }catch(error){errors.push({topicId:topic.id,index,title,error:error.message});}
 }
}
await Promise.all(Array.from({length:8},async()=>{while(next<topics.length)await check(topics[next++]);}));
writeFileSync(`output/curriculum-review/${requested??'all-subtopics'}-routing-verification.json`,JSON.stringify({checkedAt:new Date().toISOString(),effectiveTier,topics:topics.length,checked:results.length+errors.length,passed:results.length,errors,results},null,2));
console.log(JSON.stringify({topics:topics.length,passed:results.length,errors:errors.length,firstErrors:errors.slice(0,8)}));if(errors.length)process.exitCode=1;
