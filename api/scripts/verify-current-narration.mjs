// Read-only validation of the completed synthesis against the current manifest,
// plus authenticated delivery samples from every subtopic and tier extension.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {lessonBeats,exampleBeats,beatSpeech} from '../../src/lessonBeats.js';
import {toSpoken} from '../../src/speech.js';
import {selectExplanation} from '../../src/data/selectExplanation.js';
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values;
for(const [key,value] of Object.entries(settings))process.env[key]??=value;
const {listNarration,narrationKey}=await import('../src/lib/narrationStore.js');
const {getContent,contentKey}=await import('../src/lib/contentStore.js');
const root='output/curriculum-review';
const report=JSON.parse(readFileSync(`${root}/narration-dry-run.json`));
assert(report.dryRun&&report.includeExamples);
assert.equal(report.counts.topics,curriculum.length);
for(const k of ['made','failed','stale','unseeded'])assert.equal(report.counts[k],0,`${k} must be zero after synthesis`);
assert.equal(report.counts.skipped,report.counts.beats);
assert.equal(new Set(report.manifest.map(r=>r.key)).size,report.counts.beats);
const blobs=new Map((await listNarration()).map(b=>[b.name,b]));
for(const row of report.manifest){
 assert.equal(row.status,'cached');
 assert(blobs.get(row.key)?.bytes>100,`Missing or empty audio: ${row.key}`);
}
const cases=new Map(),voice=report.voice;
const add=(topic,beats,label)=>{
 for(const beat of beats){
  const text=beatSpeech(beat,toSpoken);if(!text)continue;
  const key=narrationKey(topic.id,text,voice);
  assert(blobs.has(key),`Required player beat absent: ${key}`);
  cases.set(key,{topicId:topic.id,text,label,kind:beat.kind});
 }
};
let dedicatedSubtopics=0,allLessonBeatsVerified=0;
for(const topic of curriculum){
 const stored=await getContent(contentKey('explanation',topic.id));
 assert.equal(stored.subtopics?.length,topic.outcomes.length,`Incomplete subtopic narration: ${topic.id}`);
 assert(report.updatedAt>=stored.storedAt,'Content changed after the final speech inventory');
 for(const [index,title] of topic.outcomes.entries()){
  dedicatedSubtopics++;
  for(const tier of ['Foundation','Higher']){
   const selected=selectExplanation(stored,index,tier),beats=lessonBeats(topic,selected);
   for(const beat of beats){const text=beatSpeech(beat,toSpoken);assert(text.length<2000);assert(blobs.get(narrationKey(topic.id,text,voice))?.bytes>100,`Missing current lesson beat: ${topic.id}/${index}/${tier}`);allLessonBeatsVerified++;}
   // Actual authenticated delivery/decoding samples include narration from
   // every outcome, plus any distinct Higher extension and all genetics beats.
   const sample=topic.id==='y9-science-genetics'?beats:[beats.find(b=>b.kind==='prose'),...(tier==='Higher'&&stored.subtopics[index].higher?[beats.filter(b=>b.kind==='prose').at(-1)]:[])].filter(Boolean);
   add(topic,sample,`${title} (${tier})`);
  }
 }
}
const base=process.env.TEST_API_BASE??'http://127.0.0.1:7071/api';
const login=await fetch(`${base}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:process.env.TEST_USERNAME??'demo.parent',password:process.env.TEST_PASSWORD??'EducationHub2026!'})});
assert.equal(login.status,200,'Demo sign-in failed');
const cookie=login.headers.get('set-cookie')?.split(';')[0];assert(cookie);
const requests=[...cases.values()],results=[];let cursor=0;
await Promise.all(Array.from({length:6},async()=>{
 while(cursor<requests.length){
  const c=requests[cursor++];
  const response=await fetch(`${base}/narration`,{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({topicId:c.topicId,text:c.text}),signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,200,`${c.label}/${c.kind}`);
  assert(response.headers.get('content-type')?.includes('audio/mpeg'));
  const audio=Buffer.from(await response.arrayBuffer());assert(audio.length>100);
  assert(audio.subarray(0,3).toString()==='ID3'||(audio[0]===255&&(audio[1]&224)===224),'Response lacks an MP3 header');
  results.push({topicId:c.topicId,label:c.label,kind:c.kind,bytes:audio.length});
 }
}));
const output={checkedAt:new Date().toISOString(),environment:'Configured local storage and local authenticated API',voice,
 clipsRequired:report.counts.beats,clipsPresent:report.counts.skipped,missing:0,empty:0,topics:report.counts.topics,examples:report.counts.examples,
 dedicatedSubtopics,allLessonBeatsVerified,apiResponses:results.length,apiResults:results};
writeFileSync(`${root}/speech-verification.json`,JSON.stringify(output,null,2));
writeFileSync(`${root}/speech-browser-cases.json`,JSON.stringify(requests,null,2));
console.log(JSON.stringify({...output,apiResults:undefined}));
