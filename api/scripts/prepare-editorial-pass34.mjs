import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TableClient} from '@azure/data-tables';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide} from '../../src/topicGuides.js';
const dir='output/curriculum-review/pass-34';mkdirSync(dir,{recursive:true});
if(existsSync(`${dir}/applied-corrections.json`))throw Error('Do not replace an applied batch.');
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values;
const table=settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent',client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,table);
const topic=curriculum.find(t=>t.id==='y9-science-genetics'),guide=getTopicGuide(topic.subject,topic),changes=[];
for(const rowKey of ['explanation','example-4-core']){
 const e=await client.getEntity(topic.id,rowKey);
 const payload=rowKey==='explanation'?Object.fromEntries(['explanation','keyIdeas','formulae','higher','subtopics'].filter(k=>guide[k]!==undefined).map(k=>[k,guide[k]])):JSON.parse(e.payload);
 if(rowKey!=='explanation')payload.steps=payload.steps.map(s=>s.replace('Count genotypes: RR = 1, Rr = 2, rr = 1; total offspring = 4.','Count the four equally likely allele combinations: RR appears once, Rr twice and rr once. These are possible outcomes, not four guaranteed offspring.'));
 changes.push({ref:`${topic.id}/${rowKey}`,type:e.type,subtopicTitle:e.subtopicTitle,beforeHash:createHash('sha256').update(JSON.stringify([e.payload,e.subtopicTitle])).digest('hex'),payload,reason:rowKey==='explanation'?'Add six distinct genetics lessons; qualify chromosome counts and distinguish variation, selection and speciation.':'Clarify that Punnett-square cells represent possible combinations, not guaranteed offspring.'});
}
writeFileSync(`${dir}/correction-plan.json`,JSON.stringify({table,createdAt:new Date().toISOString(),changes},null,2));
console.log('Prepared six dedicated genetics lessons and a Punnett-square wording correction.');
