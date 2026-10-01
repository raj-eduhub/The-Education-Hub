// Full-table policy audit. --apply removes unnecessary examples and formula
// lists only, after saving a restorable backup of every affected entity.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { TableClient } from '@azure/data-tables';
import { curriculum } from '../../src/data/curriculumCatalog.js';
import { topicContent } from '../../src/data/topicContent/index.js';
import { classifiedOutcomes, warrantsWorkedExample, warrantsFormulae } from '../../src/data/workedExampleOutcomes.js';

const settings = JSON.parse(readFileSync(new URL('../local.settings.json', import.meta.url), 'utf8').replace(/^\uFEFF/, '')).Values;
const connection = process.env.AZURE_STORAGE_CONNECTION_STRING ?? settings.AZURE_STORAGE_CONNECTION_STRING;
const table = process.env.AZURE_STORAGE_CONTENT_TABLE ?? settings.AZURE_STORAGE_CONTENT_TABLE ?? 'EducationHubContent';
const client = TableClient.fromConnectionString(connection, table);
const topics = new Map(curriculum.map(t => [t.id, t]));
const entities = [];
for await (const entity of client.listEntities()) entities.push(entity);
mkdirSync('output/curriculum-review', {recursive:true});
if (process.argv.includes('--snapshot')) writeFileSync('output/curriculum-review/content-snapshot.json', JSON.stringify({table,entities},null,2));
const changes = [], findings = [], counts = {};
for (const entity of entities) {
  const topic = topics.get(entity.partitionKey);
  counts[entity.type] = (counts[entity.type] ?? 0) + 1;
  const ref = `${entity.partitionKey}/${entity.rowKey}`;
  let payload;
  try { payload = JSON.parse(entity.payload); } catch { findings.push({ref, issue:'Invalid payload'}); continue; }
  if (!topic) { findings.push({ref, issue:'Unknown topic'}); continue; }
  if (entity.subtopicTitle && !topic.outcomes.includes(entity.subtopicTitle)) findings.push({ref, issue:'Stale sub-topic label', recorded:entity.subtopicTitle});
  if (entity.subject !== topic.subject || Number(entity.year) !== topic.year) findings.push({ref,issue:'Subject/year metadata mismatch'});
  const variant = /-(Foundation|Higher)$/.exec(entity.rowKey)?.[1];
  if (variant && !topic.tiers.includes(variant)) findings.push({ref,issue:'Unavailable tier variant'});
  const match = /^example-(\d+)-(core|Foundation|Higher)$/.exec(entity.rowKey);
  if (match) {
    const index = Number(match[1]);
    if (!topic.outcomes[index] || (entity.subtopicTitle && entity.subtopicTitle !== topic.outcomes[index])) {
      findings.push({ref, issue:'Outcome mismatch'}); continue;
    }
    if (!warrantsWorkedExample(topic.id, index)) {
      changes.push({entity, action:'delete', reason:'Example not warranted'}); continue;
    }
    if (!warrantsFormulae(topic.id, index) && payload.formulae?.length) {
      changes.push({entity, action:'update', reason:'Formula list not warranted', payload:{...payload, formulae:[]}});
    }
  }
  if (entity.type === 'explanation') {
    const authored = topicContent[topic.id];
    if (authored && ['explanation','keyIdeas','formulae','higher'].some(k => JSON.stringify(payload[k]) !== JSON.stringify(authored[k]))) {
      findings.push({ref, issue:'Stored explanation differs from authored content'});
      if (process.argv.includes('--sync-authored')) changes.push({entity,action:'update',reason:'Sync reviewed authored explanation',payload:{...payload,explanation:authored.explanation,keyIdeas:authored.keyIdeas,formulae:authored.formulae??[],higher:authored.higher}});
    }
    if (!classifiedOutcomes(topic.id)?.formulae.length && payload.formulae?.length) findings.push({ref, issue:'Topic formula list needs editorial review', formulae:payload.formulae});
  }
  const text = JSON.stringify(payload);
  if (/standard error|confidence interval|t-distribution|finite population correction|\\\\int\b/i.test(text)) findings.push({ref, issue:'Potential post-GCSE content; inspect context'});
  if (entity.type === 'example' && (!payload.question || !payload.answer || !payload.steps?.length)) findings.push({ref, issue:'Incomplete worked example'});
  if (entity.type === 'exam' && (!payload.marks || !payload.markScheme?.length)) findings.push({ref, issue:'Incomplete exam question'});
  if (entity.type === 'exam' && payload.marks !== payload.markScheme?.length) findings.push({ref,issue:'Marks and scheme point count differ',marks:payload.marks,points:payload.markScheme?.length});
  if (entity.type === 'practice' && (!payload.answer || (payload.working?.length ?? 0)<2)) findings.push({ref,issue:'Incomplete practice question'});
  if (payload.raw) findings.push({ref,issue:'Unparsed content'});
  if (/\b(in|from|on) the (diagram|figure|graph|sketch|grid|net|scale drawing)\b|\bthe (diagram|figure) (shows|below|above)\b|\bshown (below|above)\b/i.test(payload.question??'')) findings.push({ref,issue:'Check missing visual stimulus',question:payload.question});
  if (/\b(Text|Source|Extract|Passage)\s+[AB]\b|\bthe extract\b|\bthe poem\b/i.test(payload.question??'')) findings.push({ref,issue:'Check source/text is supplied',question:payload.question});
  if (/\\\\(?:frac|sqrt|times|le|ge|text|prod|sum)\b/.test(text)) {
    // JSON text escapes single backslashes. Inspect actual text below instead.
    const visible = [payload.question,payload.answer,payload.explanation,...(payload.steps??[]),...(payload.working??[]),...(payload.markScheme??[]),...(payload.formulae??[])].filter(Boolean).join('\n');
    if (/\\\\(?:frac|sqrt|times|le|ge|text|prod|sum)\b/.test(visible)) findings.push({ref,issue:'Double-escaped LaTeX'});
  }
  if (entity.subject==='Science' && Number(entity.year)>=10 && /strong and weak|partially ionis|completely ionis/i.test(text) && variant==='Foundation') findings.push({ref,issue:'AQA Higher-only acid strength in Foundation variant'});
  if (entity.subject==='Science' && Number(entity.year)>=10 && /flame test|silver nitrate|barium chloride|test.*(?:sulfate|halide) ions|atom economy|percentage yield/i.test(text)) findings.push({ref,issue:'Check separate Chemistry content in Combined Science'});
  if (entity.subject==='Computing' && /\b(?:log[_( ]?2|O\(n|O\(log|big[ -]?o\b|time complexity\b)/i.test(text)) findings.push({ref,issue:'Formal complexity outside GCSE scope'});
}
mkdirSync('output/curriculum-review', {recursive:true});
const duplicateGroups = new Map();
for (const entity of entities) {
  let p; try { p=JSON.parse(entity.payload); } catch { continue; }
  if (!p.question) continue;
  const key = `${entity.partitionKey}|${entity.type}|${p.question.toLowerCase().replace(/\s+/g,' ').trim()}`;
  const group = duplicateGroups.get(key)??[]; group.push(`${entity.partitionKey}/${entity.rowKey}`); duplicateGroups.set(key,group);
}
const duplicates=[...duplicateGroups.values()].filter(g=>g.length>1);
const inventory = curriculum.map(topic=>({id:topic.id,year:topic.year,subject:topic.subject,title:topic.title,outcomes:topic.outcomes.length,tiers:topic.tiers,boards:topic.examBoards,rows:entities.filter(e=>e.partitionKey===topic.id).length}));
const statuses=entities.reduce((a,e)=>{const s=e.reviewStatus??(e.reviewed?'approved':'pending');a[s]=(a[s]??0)+1;return a;},{});
const report = {scanned:entities.length, topics:curriculum.length, counts, statuses, inventory, duplicates, changes:changes.map(({entity, ...change}) => ({...change, payload:undefined, ref:`${entity.partitionKey}/${entity.rowKey}`})), findings};
writeFileSync('output/curriculum-review/audit.json', JSON.stringify(report,null,2));
console.log(JSON.stringify({scanned:report.scanned, counts, changes:changes.length, findings:findings.length}));
if (process.argv.includes('--apply') && changes.length) {
  writeFileSync(`output/curriculum-review/backup-${Date.now()}.json`, JSON.stringify({table,entities:changes.map(c=>c.entity)},null,2));
  for (const {entity,action,payload} of changes) {
    if (action === 'delete') await client.deleteEntity(entity.partitionKey,entity.rowKey,{etag:entity.etag});
    else await client.updateEntity({partitionKey:entity.partitionKey,rowKey:entity.rowKey,payload:JSON.stringify(payload),reviewed:false,reviewStatus:'pending',reviewedBy:'',reviewedAt:''},'Merge',{etag:entity.etag});
  }
  console.log(`Applied ${changes.length} backed-up policy corrections.`);
}
