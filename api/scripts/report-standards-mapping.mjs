import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide} from '../../src/topicGuides.js';
const root='output/curriculum-review/standards-mapping';
const read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const plan=read(`${root}/mapping-plan.json`),register=read(`${root}/source-register.json`);
const documents=new Map(register.map(s=>[s.id,read(`${root}/sources/${s.id}.json`)]));
const inventory=[],jobs=[];
for(const j of plan.jobs){
 const topicId=j.id.replace(/--(dfe|aqa|edexcel)$/,''),topic=curriculum.find(t=>t.id===topicId);
 const path=`${root}/mappings/${j.id}.json`,stored=existsSync(path)?read(path):null;
 const current=stored?.inputHash===j.inputHash;
 const state=!stored?'not-reviewed':!current?'stale':stored.state;
 jobs.push({id:j.id,state,error:stored?.error});
 for(const [index,title] of topic.outcomes.entries()){
  const mapped=state==='reviewed'?stored.mapping.outcomes.find(r=>r.index===index&&r.title===title):null;
  const citations=(mapped?.references??[]).map(ref=>{
   const doc=documents.get(ref.sourceId),page=doc?.pages.find(p=>p.page===ref.page);
   const excerpt=page?.text.split(/\r?\n/).slice(ref.lineStart-1,ref.lineEnd).join(' ').replace(/\s+/g,' ').trim();
   return {...ref,url:`${doc.url}#page=${ref.page}`,excerpt};
  });
  inventory.push({jobId:j.id,topicId,year:topic.year,subject:topic.subject,board:stored?.board??j.id.split('--')[1],index,title,reviewState:state,status:mapped?.status??'pending',reason:mapped?.reason??'',action:mapped?.action??'',dependencies:mapped?.dependencies??[],lessonEvidence:mapped?.lessonEvidence??'',citations,teacherSignoff:false});
 }
}
const counts=Object.fromEntries(['reviewed','failed','not-reviewed','stale'].map(s=>[s,jobs.filter(j=>j.state===s).length]));
const geographySearch=Object.fromEntries(['Russia','China','Middle East'].map(term=>[term,curriculum.filter(t=>t.year<=9&&t.subject==='Geography'&&new RegExp(term,'i').test(JSON.stringify({topic:t,guide:getTopicGuide(t.subject,t)}))).map(t=>t.id)]));
const coverageRows=[];
for(const year of [7,8,9,10,11])for(const subject of [...new Set(curriculum.map(t=>t.subject))]){
 const rows=inventory.filter(r=>r.year===year&&r.subject===subject);
 coverageRows.push({year,subject,outcomes:new Set(rows.map(r=>`${r.topicId}/${r.index}`)).size,boardMappings:rows.length,reviewed:rows.filter(r=>r.reviewState==='reviewed').length,pending:rows.filter(r=>r.reviewState!=='reviewed').length});
}
const report={createdAt:new Date().toISOString(),topics:curriculum.length,outcomes:plan.outcomes,plannedJobs:jobs.length,counts,mappingRows:inventory.length,reviewedRows:inventory.filter(r=>r.reviewState==='reviewed').length,coverageRows,geographySearch,jobs,inventory,teacherSignoff:false};
writeFileSync(`${root}/current-inventory.json`,JSON.stringify(report,null,2));
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const columns=['year','subject','board','topicId','index','title','reviewState','status','reason','action','dependencies','sourceLinks'];
writeFileSync(`${root}/outcome-mapping.csv`,'\uFEFF'+columns.join(',')+'\r\n'+inventory.map(r=>columns.map(k=>csv(k==='sourceLinks'?r.citations.map(c=>`${c.url} lines ${c.lineStart}-${c.lineEnd}`).join(' | '):Array.isArray(r[k])?r[k].join(' | '):r[k])).join(',')).join('\r\n'));
const table=coverageRows.map(r=>`| ${r.year} | ${r.subject} | ${r.outcomes} | ${r.boardMappings} | ${r.reviewed} | ${r.pending} |`).join('\n');
writeFileSync(`${root}/report.md`,`# Curriculum standards review — current checkpoint

Updated ${report.createdAt}. Local curriculum only; production unchanged. **The standards review is incomplete and is not teacher certification.**

## Work completed

- Archived 23 official DfE, AQA and Pearson specifications with retrieval dates, PDF hashes, extracted physical pages and source URLs.
- Prepared all ${plan.outcomes} outcomes across ${curriculum.length} topics, Years 7–11 and seven subjects. KS3 maps to DfE; GCSE maps separately to both configured boards: ${jobs.length} topic/board jobs and ${inventory.length} outcome/board rows.
- ${counts.reviewed} jobs (${report.reviewedRows} rows) have passed two separate GPT-5 nano calls and structural evidence checks. ${counts.failed} jobs failed validation, ${counts['not-reviewed']} have not completed review, and ${counts.stale} have changed inputs. Failed and stale results are excluded from accepted coverage.
- Source citations use archived document IDs, physical pages and numbered lines. Lesson evidence must occur in the actual lesson. Unsupported references are rejected; newer runs select existing lesson fields rather than generating quotations.
- Independently corrected the Year 7 factors/multiples lesson in the local DB and source. A number can be both a factor and a multiple of itself. The exact old row/source are backed up and the saved DB payload was read back. [Correction evidence](factor-correction/applied.json).
- Verification after this correction: 3,026 subtopic/tier selection, formula-policy and notation checks passed; all seven corrected-topic authenticated API checks passed. [API results](../y7-maths-number-routing-verification.json).
- The corrected Maths payload has now passed its exact-payload nano recheck. Both replacement narration clips were generated and passed authenticated browser delivery, decoding and non-silence checks. [Amendment verification](factor-correction/speech-verification.json).
- A fresh full-catalogue speech dry run found all 25,150 required clips cached, zero missing, zero stale or unseeded topics. [Current speech inventory](../narration-standards-post-correction.json).

## Current blocking condition

The user explicitly approved both configured endpoints, and later approved checking an active key for the same Azure resource and repairing only the local nano key setting. Endpoint permission is resolved. No learner records or credentials form part of the review payload.

The resumed model calls began returning HTTP 401. Azure then rejected the approved key lookup with **ReadOnlyDisabledSubscription**; no key was retrieved, changed or rotated. The live subscription API reports **Warned**, the Free Trial offer and a spending limit set to On. These are distinct API observations; the precise billing cause has not been established. The model worker is stopped, completed results are preserved, and a new authentication-failure stop condition prevents repeated calls on future runs. [Subscription evidence](../costs/subscription-state.json), [failed and pending tasks](failed-tasks.md), [reported costs](../costs/report.md).

## Findings requiring action

1. **KS3 Geography breadth:** exact searches of all current KS3 Geography catalogue entries, topic overviews and dedicated lessons found no explicit Russia, China or Middle East coverage. Add substantive map-based locational teaching, physical/human characteristics and checks for these places, or document equivalent teaching elsewhere. This is a lesson-coverage finding, not a claim about uninspected question-bank content. [DfE Geography, physical page 2](https://assets.publishing.service.gov.uk/media/5a7b8699ed915d131105fd16/SECONDARY_national_curriculum_-_Geography.pdf#page=2).
2. **Exam cohort:** confirm the exam year before final Computer Science mapping. The archived AQA 8525 specification applies to exams from 2027. [AQA change notice](https://www.aqa.org.uk/gcse-computer-science-specification-changes-for-summer-2027).
3. **School options:** confirm English set texts and anthology, History options and historic environment, Geography case studies/fieldwork and DT material specialism. Generic skills teaching cannot establish coverage of a particular school's chosen texts or options. Both configured boards remain separate in the inventory; Pearson Geography is specification B (1GB0).
4. **Practical completion:** explanations do not demonstrate that pupils completed Science investigations, Geography fieldwork, Computing projects in two programming languages, or DT making/cooking. Map tasks and pupil evidence separately; do not mark these complete from prose alone.
5. **Maths tiers:** preserve the basic Foundation, additional Foundation and Higher columns in AQA 8300. The PDF's column extraction was checked against a rendered page; bold text alone is not a reliable Higher-content rule.
6. **Independent subject review:** inspect each proposed standards link, lesson depth, progression and assessment coverage. Two calls to the same model are useful second readings, not independent human certification or proof of 100% accuracy.

## Complete inventory

Every outcome is listed, including pending rows, in [outcome-mapping.csv](outcome-mapping.csv). [Machine-readable inventory](current-inventory.json) includes actual source excerpts, exact lesson evidence and status per outcome. Section labels supplied by the model remain provisional; the archived page/line reference is the traceable evidence.

| Year | Subject | Outcomes | Required board mappings | Model reviewed | Pending |
| --- | --- | ---: | ---: | ---: | ---: |
${table}

## Method and limits

“Aligned” means a lesson supports its cited teaching statement; it does not establish complete qualification coverage. Candidate page retrieval is not exhaustive absence proof. KS3 year placement is a local teaching sequence, not a DfE requirement. Model comments must be checked against the original page, especially multi-column tables and tier restrictions. No missing formula or worked example is treated as an error by itself.

The next resumable run retains current accepted jobs and retries the rest once Azure access is restored. Permission has already been granted; restoring the subscription is the remaining external dependency. Narration is current. No school options have been invented and no teacher approvals have been assigned.

[Official source register](source-register.json) · [Mapping plan](mapping-plan.json) · [Original subtopic repair report](../subtopic-fix-report.md)
`);
console.log(JSON.stringify({jobs:jobs.length,counts,mappingRows:report.mappingRows,reviewedRows:report.reviewedRows,geographySearch}));
