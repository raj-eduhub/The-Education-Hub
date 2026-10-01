import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TableClient} from '@azure/data-tables';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {foundationScienceRepair} from '../../src/data/foundationScienceRepairs.js';
import {warrantsFormulae} from '../../src/data/workedExampleOutcomes.js';
const dir='output/curriculum-review/pass-4';mkdirSync(dir,{recursive:true});
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values;
const table=settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent';
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,table);
const candidates=JSON.parse(readFileSync('output/curriculum-review/pass-3/foundation-candidates.json'));
const previous=new Set(JSON.parse(readFileSync('output/curriculum-review/pass-3/applied-corrections.json')).applied.map(c=>c.ref));
// These were read in context. A concentration used only as experimental context
// or subtraction on a reaction profile does not by itself exceed Foundation.
const retained=new Map([
 ['y10-science-chemical-changes/exam-2-Edexcel-Foundation','Energy-level subtraction and catalyst interpretation; no mole calculation.'],
 ['y10-science-chemical-changes/exam-8-AQA-Foundation','Energy-level subtraction and qualitative temperature effect; no mole calculation.'],
 ['y10-science-chemical-changes/exam-8-Edexcel-Foundation','Energy-level subtraction and catalyst interpretation; no mole calculation.'],
 ['y10-science-chemical-changes/exam-5-AQA-Foundation','Neutralisation explanation; given equal volumes/concentrations do not require a mole calculation.'],
 ['y10-science-chemical-changes/exam-6-AQA-Foundation','Qualitative displacement and acid reactions; concentration is supplied context.'],
 ['y10-science-chemical-changes/practice-6-AQA-Foundation','Qualitative reactivity prediction; supplied concentration is not a mole calculation.'],
 ['y10-science-chemical-changes/practice-6-Edexcel-Foundation','Qualitative reactivity prediction; supplied concentration is not a mole calculation.'],
 ['y11-science-rates/exam-3-AQA-Foundation','Qualitative collision explanation; concentration values do not require moles.'],
 ['y11-science-rates/exam-3-Edexcel-Foundation','Qualitative collision explanation; concentration values do not require moles.'],
 ['y11-science-rates/exam-7-Edexcel-Foundation','Qualitative explanation of temperature and successful collisions.'],
 ['y11-science-rates/exam-9-AQA-Foundation','Qualitative rate-factor explanations; concentration is context.'],
]);
const changes=[],coverage=[];
for(const candidate of candidates){
 const ref=candidate.ref;
 if(previous.has(ref)){coverage.push({ref,status:'corrected-in-pass-3'});continue;}
 if(retained.has(ref)){coverage.push({ref,status:'retained-after-contextual-review',reason:retained.get(ref)});continue;}
 const [partitionKey,rowKey]=ref.split('/'),e=await client.getEntity(partitionKey,rowKey),topic=curriculum.find(t=>t.id===partitionKey);
 const slot=Number(rowKey.split('-')[1]),variant=slot+(rowKey.includes('Edexcel')?1:0)+(e.type==='practice'?2:0);
 const authored=foundationScienceRepair(partitionKey,e.subtopicTitle,variant);
 if(!authored)throw new Error(`Missing verified rewrite ${ref}`);
 const {question,steps,answer}=authored;
 let payload;
 if(e.type==='example')payload={...authored,formulae:warrantsFormulae(partitionKey,slot)?authored.formulae:[],notation:false};
 else if(e.type==='exam')payload={question,marks:steps.length,markScheme:steps,answer,notation:false};
 else payload={question,hint:'Identify the scientific principle, apply it to the information given and explain your conclusion.',working:steps,answer,notation:false};
 changes.push({ref,type:e.type,subtopicTitle:e.subtopicTitle,beforeHash:createHash('sha256').update(JSON.stringify([e.payload,e.subtopicTitle])).digest('hex'),payload,reason:'Remove inappropriate Foundation demand, unsupported inference or distracting quantitative work; assess the stated outcome using complete GCSE-level information.'});
 coverage.push({ref,status:'rewrite-prepared'});
}
writeFileSync(`${dir}/correction-plan.json`,JSON.stringify({table,createdAt:new Date().toISOString(),changes},null,2));
writeFileSync(`${dir}/foundation-candidate-decisions.json`,JSON.stringify(coverage,null,2));
console.log(`Prepared ${changes.length} rewrites; every one of ${candidates.length} scope candidates has a disposition.`);
