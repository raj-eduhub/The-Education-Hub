import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TableClient} from '@azure/data-tables';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {topicContent} from '../../src/data/topicContent/index.js';
import {reviewedWorkedExamples} from '../../src/data/reviewedWorkedExamples.js';
import {getAuthoredExample} from '../../src/topicGuides.js';
const dir='output/curriculum-review/pass-3';mkdirSync(dir,{recursive:true});
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values;
const table=settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent';
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,table);
const entities=[];for await(const e of client.listEntities())entities.push(e);
writeFileSync(`${dir}/before-snapshot.json`,JSON.stringify({table,entities},null,2));
const changes=new Map();
function add(e,payload,reason,label=e.subtopicTitle){changes.set(`${e.partitionKey}/${e.rowKey}`,{ref:`${e.partitionKey}/${e.rowKey}`,type:e.type,subtopicTitle:label,beforeHash:e.payload?createHash('sha256').update(JSON.stringify([e.payload,e.subtopicTitle])).digest('hex'):null,payload,reason});}
for(const [key] of Object.entries(reviewedWorkedExamples)){
 const [id,indexText]=key.split('#'), index=Number(indexText),topic=curriculum.find(t=>t.id===id);
 for(const tier of topic.tiers.length?topic.tiers:['core']){
  const rowKey=`example-${index}-${tier}`,e=entities.find(e=>e.partitionKey===id&&e.rowKey===rowKey)??{partitionKey:id,rowKey,type:'example',subtopicTitle:topic.outcomes[index]};
  const example=getAuthoredExample(topic.subject,topic,index,tier);
  if(!example)throw new Error(`No authored example ${key} ${tier}`);
  add(e,{...example,notation:topic.subject==='Maths'},'Replace inappropriate demand or missing teaching with an independently authored example for this outcome and tier.',topic.outcomes[index]);
 }
}
for(const e of entities){
 const p=JSON.parse(e.payload),t=curriculum.find(t=>t.id===e.partitionKey),slot=Number(e.rowKey.split('-')[1])||0;
 if(e.type==='explanation'){
  const source=topicContent[e.partitionKey];
  if(source&&['explanation','keyIdeas','formulae','higher'].some(k=>JSON.stringify(p[k])!==JSON.stringify(source[k])))add(e,{...p,...source},'Sync reviewed source; separate Higher extension from common teaching where applicable.');
 }
 if(e.partitionKey==='y11-science-analysis'&&e.subtopicTitle==='Carry out tests for gases and ions'&&e.type!=='example'){
  const variants=[
   ['Sample P contains only sodium chloride. Sample Q contains sodium chloride and sand. Explain which is pure and which is a mixture, and explain whether containing two different elements prevents P being pure.',['P is pure because it contains a single compound.','Q is a mixture because it contains two substances that are not chemically combined.','Sodium chloride contains sodium and chlorine chemically combined; a single compound can still be a pure substance.']],
   ['A paint is made with fixed proportions of pigment, solvent and binder. Explain why it is a formulation and why changing the proportions could alter its usefulness.',['Paint is a mixture deliberately designed for a purpose, so it is a formulation.','Its components provide different properties, such as colour, ease of spreading and binding to a surface.','Changing proportions can change those properties, so a useful formulation needs controlled amounts.']],
   ['At the same pressure, pure substance X melts sharply at 80 °C. A sample believed to be X melts over 73–78 °C. Explain what this suggests about purity and give one limit of the conclusion.',['A pure substance normally has a characteristic sharp melting point under fixed conditions.','A lower, broader melting range suggests the sample contains impurities.','The result does not identify the impurity or prove the substance is X; measurement uncertainty or a different substance must also be considered.']],
   ['A bottle of drinking water is advertised as “pure”, but its label lists dissolved minerals. Explain the difference between potable water and a chemically pure substance.',['Potable water is water that is safe to drink.','Dissolved minerals mean the sample contains more than one substance, so it is a mixture.','Chemically pure water contains only water; ordinary use of “pure” on a label does not establish chemical purity.']],
  ];
  const index=(slot===3?0:2)+(e.rowKey.includes('Edexcel')?1:0);const [question,points]=variants[index];
  const payload=e.type==='exam'?{question,marks:3,markScheme:points,answer:points.join(' '),notation:false}:{question,hint:'Use the chemical meaning of pure, mixture or formulation and apply it to the information given.',working:points,answer:points.join(' '),notation:false};
  add(e,payload,'Replace separate-Chemistry ion tests with the current Combined Science purity/mixture outcome.',t.outcomes[3]);
 }
 if(e.subtopicTitle==='Use the pH scale and describe strong and weak acids'&&!changes.has(`${e.partitionKey}/${e.rowKey}`))add(e,p,'Align the acid outcome label with tier-appropriate content.',t.outcomes[7]);
 const ref=`${e.partitionKey}/${e.rowKey}`;
 if(['y10-maths-geometry/exam-6-AQA-Higher','y10-maths-number/exam-3-Edexcel-Higher'].includes(ref)){
  const clean=v=>typeof v==='string'?v.replace(/\\\\(?=[A-Za-z])/g,'\\'):Array.isArray(v)?v.map(clean):v;
  add(e,Object.fromEntries(Object.entries(p).map(([k,v])=>[k,clean(v)])),'Repair double-escaped mathematical commands so display and narration receive valid notation.');
 }
}
writeFileSync(`${dir}/correction-plan.json`,JSON.stringify({table,createdAt:new Date().toISOString(),changes:[...changes.values()]},null,2));
const foundationFlags=entities.filter(e=>e.subject==='Science'&&e.rowKey.endsWith('Foundation')&&/\bmol(?:es|ar)?\b|glucagon|glycogenolysis|gluconeogenesis|GLUT[24]|helper T|\bKa\b|log10|inverse.square|Le Chatelier|fully ionis|partially ionis/i.test(e.payload)).map(e=>({ref:`${e.partitionKey}/${e.rowKey}`,outcome:e.subtopicTitle,payload:JSON.parse(e.payload)}));
writeFileSync(`${dir}/foundation-candidates.json`,JSON.stringify(foundationFlags,null,2));
console.log(`Prepared ${changes.size} corrections; ${foundationFlags.length} Foundation scope candidates retained for contextual review.`);
