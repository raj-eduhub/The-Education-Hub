import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {TableClient} from '@azure/data-tables';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide,getAuthoredExample} from '../../src/topicGuides.js';
import {warrantsWorkedExample,warrantsFormulae} from '../../src/data/workedExampleOutcomes.js';
import {getEditorialContent} from '../src/lib/editorialContent.js';
const dir='output/curriculum-review',read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,'')),hash=p=>createHash('sha256').update(JSON.stringify(p)).digest('hex');
const settings=read(new URL('../local.settings.json',import.meta.url)).Values;
const connection=settings.AZURE_STORAGE_CONNECTION_STRING,table=settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent';
const local=/UseDevelopmentStorage=true|127\.0\.0\.1|localhost/.test(connection);
const client=TableClient.fromConnectionString(connection,table),entities=[];
for await(const entity of client.listEntities())entities.push(entity);
writeFileSync(`${dir}/current-snapshot.json`,JSON.stringify({capturedAt:new Date().toISOString(),environment:local?'local Azurite':'configured storage',table,entities},null,2));
const batches=[dir,...readdirSync(dir).filter(s=>/^pass-\d+$/.test(s)).sort((a,b)=>Number(a.slice(5))-Number(b.slice(5))).map(s=>`${dir}/${s}`)];
if(existsSync(`${dir}/standards-mapping/factor-correction/applied-corrections.json`))batches.push(`${dir}/standards-mapping/factor-correction`);
const latest=new Map(),history=[],adjudicated=new Map(),modelReviews=new Map();
for(const batch of batches){
 if(existsSync(`${batch}/applied-corrections.json`)){
  const log=read(`${batch}/applied-corrections.json`);
  for(const row of log.applied){history.push({...row,batch:batch===dir?'initial editorial batch':batch.split('/').at(-1),appliedAt:log.appliedAt});latest.set(row.ref,row);}
 }
 if(existsSync(`${batch}/correction-adjudication.json`)){
  const a=read(`${batch}/correction-adjudication.json`);
  for(const [ref,payloadHash] of Object.entries(a.payloadHashes??{}))adjudicated.set(`${ref}/${payloadHash}`,a.flagDecisions?.[ref]??'Independently inspected correction; exact payload second-reviewed.');
 }
 for(const name of ['nano','nano-deep','nano-corrections']){
  const path=`${batch}/${name}`;if(!existsSync(path))continue;
  for(const f of readdirSync(path).filter(f=>f.endsWith('.json')&&f!=='run-summary.json')){
   const r=read(`${path}/${f}`);if(!r.result?.rows)continue;
   for(const row of r.result.rows){
    const ref=`${r.topicId}/${row.id}`,h=r.rowHashes?.[row.id];if(!h)continue;
    const key=`${ref}/${h}`,previous=modelReviews.get(key),rank=name==='nano'?0:name==='nano-deep'?1:2;
    if(!previous||rank>previous.rank||(rank===previous.rank&&r.reviewedAt>previous.reviewedAt))modelReviews.set(key,{...row,rank,reviewedAt:r.reviewedAt,file:`${path}/${f}`});
   }
  }
 }
}
if(existsSync(`${dir}/retained-review-decisions.json`))for(const r of read(`${dir}/retained-review-decisions.json`))adjudicated.set(`${r.ref}/${r.payloadHash}`,r.reason);
const counts={},subjects={},manifest=[],outstanding=[],sourceErrors=[];
for(const e of entities){
 const ref=`${e.partitionKey}/${e.rowKey}`,p=JSON.parse(e.payload),h=hash(p),review=modelReviews.get(`${ref}/${h}`),decision=adjudicated.get(`${ref}/${h}`);
 const topic=curriculum.find(t=>t.id===e.partitionKey);assert(topic,ref);
 counts[e.type]=(counts[e.type]??0)+1;
 const s=subjects[e.subject]??={topics:0,outcomes:0,rows:0,exactModelReviewed:0,changedRows:0,openFlags:0};s.rows++;
 if(review)s.exactModelReviewed++;
 if(latest.has(ref))s.changedRows++;
 const state=decision?'editorially_adjudicated':review?.status==='ok'?'model_no_issue_reported':review?'needs_editorial_adjudication':'no_exact_payload_review';
 if(state==='needs_editorial_adjudication'||!review){s.openFlags++;outstanding.push({ref,payloadHash:h,state,issues:review?.issues??[],reviewFile:review?.file});}
 manifest.push({ref,subject:e.subject,year:e.year,type:e.type,subtopic:e.subtopicTitle??null,payloadHash:h,model:review?'gpt-5-nano':null,state,decision:decision??null,reviewFile:review?.file??null});
 if(e.type==='explanation'){
  const guide=getTopicGuide(topic.subject,topic);
  for(const k of ['explanation','keyIdeas','formulae','higher','subtopics'])if(JSON.stringify(p[k]??null)!==JSON.stringify(guide[k]??null))sourceErrors.push(`${ref}/${k}`);
 }
 if(latest.has(ref)&&e.type!=='explanation'){
  assert.equal(hash(getEditorialContent(e)),h,`Editorial source differs: ${ref}`);
  if(e.type==='example'){
   const [,index,tier]=/^example-(\d+)-(.*)$/.exec(e.rowKey);
   const a=getAuthoredExample(topic.subject,topic,Number(index),tier==='core'?null:tier);
   for(const k of ['question','steps','answer','formulae'])assert.deepEqual(a[k]??[],p[k]??[],`Authored lookup differs: ${ref}/${k}`);
  }
 }
 if(e.type==='example'){
  const index=Number(/^example-(\d+)/.exec(e.rowKey)[1]);
  assert(warrantsWorkedExample(e.partitionKey,index),`Unwarranted stored example: ${ref}`);
  assert(!p.formulae?.length||warrantsFormulae(e.partitionKey,index),`Unwarranted formula panel: ${ref}`);
 }
}
assert.equal(sourceErrors.length,0,`Explanation source drift: ${sourceErrors.join(', ')}`);
for(const t of curriculum){subjects[t.subject].topics++;subjects[t.subject].outcomes+=t.outcomes.length;}
const audit=read(`${dir}/audit.json`),baseline=read(`${dir}/baseline-audit.json`),deep=read(`${dir}/pass-3/deep-flags-current.json`);
const initialPolicyOperations=read(`${dir}/backup-1790805750241.json`).entities.length;
const narration=['narration-dry-run.json','narration-standards-post-correction.json'].map(name=>`${dir}/${name}`).filter(existsSync).map(read).filter(r=>r.dryRun&&r.includeExamples&&r.counts.topics===curriculum.length).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0]??null;
const narrationRun=existsSync(`${dir}/narration-run.json`)?read(`${dir}/narration-run.json`):null;
const latestNarratedEdit=entities.filter(e=>['explanation','example'].includes(e.type)).reduce((latest,e)=>e.storedAt>latest?e.storedAt:latest,'');
const speechComplete=!!narration && narration.updatedAt>=latestNarratedEdit && narration.includeExamples && narration.counts.topics===curriculum.length
 && narration.counts.beats>0 && narration.counts.skipped===narration.counts.beats
 && ['made','failed','stale','unseeded'].every(k=>narration.counts[k]===0);
const exact=manifest.filter(r=>r.model).length,manual=manifest.filter(r=>r.state==='editorially_adjudicated').length;
const subtopicInventory=curriculum.flatMap(t=>{
 const stored=entities.find(e=>e.partitionKey===t.id&&e.rowKey==='explanation');
 const lessons=stored?JSON.parse(stored.payload).subtopics:[];
 return t.outcomes.map((title,index)=>({topicId:t.id,subject:t.subject,year:t.year,index,title,
  explanation:lessons?.[index]?.title===title?'dedicated':'shared_topic_overview',
  exampleRows:entities.filter(e=>e.partitionKey===t.id&&e.rowKey.startsWith(`example-${index}-`)).map(e=>e.rowKey)}));
});
const exampleGroups=new Map();
for(const e of entities.filter(e=>e.type==='example')){
 const p=JSON.parse(e.payload),tier=e.rowKey.split('-').at(-1);
 const key=JSON.stringify([e.partitionKey,tier,String(p.question??'').trim().replace(/\s+/g,' ')]);
 const group=exampleGroups.get(key)??[];group.push(`${e.partitionKey}/${e.rowKey}`);exampleGroups.set(key,group);
}
const duplicateExampleQuestions=[...exampleGroups.values()].filter(g=>g.length>1);
const subtopicCoverage={dedicated:subtopicInventory.filter(s=>s.explanation==='dedicated').length,total:subtopicInventory.length,duplicateExampleQuestionGroups:duplicateExampleQuestions.length};
writeFileSync(`${dir}/subtopic-inventory.json`,JSON.stringify({generatedAt:new Date().toISOString(),coverage:subtopicCoverage,duplicateExampleQuestions,outcomes:subtopicInventory},null,2));
const summary={generatedAt:new Date().toISOString(),environment:local?'Local Azurite; production not modified':'Configured storage',table,baselineRows:baseline.scanned,currentRows:entities.length,topics:curriculum.length,outcomes:curriculum.reduce((n,t)=>n+t.outcomes.length,0),counts,subjects,initialPolicyOperations,editorialOperations:history.length,distinctEditorialRows:latest.size,exactPayloadModelReviews:exact,editoriallyAdjudicatedRows:manual,modelFlagsAwaitingAdjudication:outstanding.length,deepSnapshotRows:deep.rows,deepFlaggedRows:deep.flags.length,sourceDrift:sourceErrors.length,policyViolations:audit.changes.length,reviewStatuses:audit.statuses,narration:narration?.counts};
summary.subtopicCoverage=subtopicCoverage;
summary.speechComplete=speechComplete;
summary.narrationRun=narrationRun?{updatedAt:narrationRun.updatedAt,counts:narrationRun.counts}:null;
writeFileSync(`${dir}/review-summary.json`,JSON.stringify(summary,null,2));
writeFileSync(`${dir}/validation-manifest.json`,JSON.stringify({generatedAt:summary.generatedAt,meaning:'Model review is not certification; row hashes identify the exact payload examined.',rows:manifest},null,2));
writeFileSync(`${dir}/outstanding-model-flags.json`,JSON.stringify({generatedAt:summary.generatedAt,meaning:'Unadjudicated model suggestions, not confirmed defects. Do not apply blindly.',rows:outstanding},null,2));
const mdTable=(headers,rows)=>[headers.join(' | '),headers.map(()=> '---').join(' | '),...rows.map(r=>r.map(v=>String(v).replace(/\|/g,'/').replace(/\n/g,' ')).join(' | '))].join('\n');
writeFileSync(`${dir}/topic-inventory.md`,`# Topic inventory\n\n${mdTable(['Topic','Year','Subject','Outcomes','Stored rows'],curriculum.map(t=>[t.title,t.year,t.subject,t.outcomes.length,entities.filter(e=>e.partitionKey===t.id).length]))}\n`);
writeFileSync(`${dir}/applied-changes.md`,`# Applied editorial changes\n\n${history.length} backed-up editorial row operations across ${latest.size} distinct current records. Initial policy cleanup is recorded separately in baseline-audit.json and its backup. Every editorial application uses preflight hashes, ETags and read-back verification.\n\n${mdTable(['Batch','Record','Correction'],history.map(r=>[r.batch,r.ref,r.reason]))}\n`);
const suggestions=[
 ['Maintenance','Subtopic teaching',`${subtopicCoverage.dedicated}/${subtopicCoverage.total} outcomes have dedicated explanations; ${subtopicCoverage.total-subtopicCoverage.dedicated} remain. Preserve coverage and selection regression checks when changing the catalogue. Inspect ${duplicateExampleQuestions.length} same-topic/tier groups with identical example questions before treating them as duplicates. See subtopic-inventory.json.`],
 ['P1','Subject review',outstanding.length?`Adjudicate the remaining ${outstanding.length} model-flagged current records against their exact text. Model suggestions include false positives; the queue is not a defect count. Record evidence and recheck any changed payload.`:'All current nano flags have documented editorial decisions. Obtain qualified subject review of factual accuracy, age demand and teaching quality; model agreement is not certification.'],
 ['P1','Qualifications','Map every outcome to exact current board specification statements and selected options. Configure English set texts/anthologies, History options and Geography case studies. Ancient History enrichment cannot be labelled complete AQA 8145 or Edexcel 1HI0 coverage.'],
 ['P1','Assessment','Review remaining mark-scheme length anomalies contextually. Some are alternative credit points; others need explicit mark allocations. Add extended-response and practical-assessment formats rather than claiming the uniform 1–6-mark bank represents complete GCSE examinations.'],
 [speechComplete?'Maintenance':'P1','Speech',speechComplete
  ? `All ${narration.counts.beats} currently required narration clips are cached locally. Re-run synthesis and validation after future content changes, especially newly authored subtopic lessons. Production audio deployment and listening-quality review remain separate.`
  : `Complete the approved Azure Speech synthesis and verify the cache. The latest dry run identifies ${narration?.counts.made??'unknown'} missing clips; see narration-run.json for live progress.`],
 ['P2','Coverage','Fill 481 practice and 477 exam slots if retaining the target of ten questions per topic/board/tier. These are product-bank targets, not 958 missing curriculum standards. All 240 explanations and 616 warranted example slots are present.'],
 ['P2','Teaching evidence','Record KS3 reading breadth, regional geography coverage, science practical strands, programming practice and DT making/testing evidence. Topic titles and text questions alone cannot demonstrate these requirements.'],
 ['P2','Maintenance','Introduce stable outcome IDs, specification/version references, review evidence and regression checks; continue using backed-up conditional writes and hash-based re-review.'],
];
writeFileSync(`${dir}/suggested-changes.md`,`# Remaining changes and checks\n\n${mdTable(['Priority','Area','Action'],suggestions)}\n\nSee outstanding-model-flags.json for record-level suggestions. None has been automatically accepted as fact.\n`);
const report=`# Curriculum correction and validation report

Generated ${summary.generatedAt}. Database: **${table}, ${summary.environment}**.

**Corrections have been saved to the local database and source files. This is not a certificate of 100% factual accuracy or complete exam-board alignment.** All ${entities.length.toLocaleString('en-GB')} current records have ${exact===entities.length?'an exact-payload GPT-5 nano review':'been inventoried; see exact review coverage below'}. Model review and structural checks cannot establish that every statement is correct. ${outstanding.length} current model-flagged records still need documented editorial decisions, and formal subject/specification sign-off remains outstanding.

## Scope and coverage

${summary.topics} topics and ${summary.outcomes} named outcomes, Years 7–11, seven subjects. Inventory covers every current database record and every catalogue topic/outcome.

${mdTable(['Subject','Topics','Outcomes','DB records','Exact model reviews','Editorially changed rows','Open model flags'],Object.entries(subjects).sort().map(([name,s])=>[name,s.topics,s.outcomes,s.rows,s.exactModelReviewed,s.changedRows,s.openFlags]))}

${mdTable(['Content','Stored','Configured target'],[['Explanations',counts.explanation,240],['Applicable worked examples',counts.example,616],['Practice questions',counts.practice,4450],['Exam questions',counts.exam,4450]])}

Question-bank completeness is 90.2% overall at the configured ten-question target. Empty bank slots are not equivalent to missing specification statements. See [all topics](topic-inventory.md) and [coverage output](coverage.txt).

## Corrections applied

Initial policy cleanup: ${initialPolicyOperations} operations, comprising nine unwarranted example removals, 237 formula-panel clearances and 13 explanation synchronisations. The earlier baseline audit listed 244 proposed operations; the actual 259-entity backup includes the expanded applied plan. Subsequent editorial work: **${history.length} row operations across ${latest.size} distinct records**. These counts overlap and must not be added as distinct records. Row count changed from 8,805 to ${entities.length}: nine removals and two new warranted examples.

- Maths: corrected calculations, units, interval bounds, numerical iteration, probability decimals and incomplete solutions; restored valid Foundation compound interest, numerical inverse proportion and exact trigonometric content.
- Science: removed inappropriate Foundation/post-GCSE demand; separated shared explanations from Higher extensions; corrected reactions, forces, gas tests, reflex pathways, uncertainty and ecological savings. Kept necessary scientific equations and chemical formulae.
- English: supplied missing extracts and model responses, corrected quotation-based analysis and paragraphing, replaced misattributed texts with original teaching stimuli, and checked narrative lengths. Removed forced calculation tasks and generic preview examples.
- History: replaced irrelevant arithmetic with historical reasoning; corrected dates and education chronology; labelled invented source exercises; removed fabricated official statistics and unsupported quotations.
- Geography: supplied missing data, corrected sums and rounding, replaced invalid comparisons of unlike measures, distinguished fictional cases from real located examples, and corrected fieldwork reliability and planning answers.
- Computing: repaired Python formatting and traces, binary-search conventions, SQL answers, processor instructions, network claims and privacy explanations; removed a logarithmic formula from a Year 7 search example.
- Design & Technology: corrected energy proportions, production timings, material/size claims, delayed fan control, incomplete testing judgements and worst-case tolerance fit; distinguished proposed performance from verified test results.

All editorial writes were backed up, checked against the previously read payload and ETag, and read back from storage. Corrections remain pending formal approval. [Record-level changes](applied-changes.md) include reasons; each pass folder contains the plan, model response, adjudication, backup and application log.

## Formula and example applicability

The reported Year 9 Powers, Roots and Standard Form defect exposed a gap that the earlier row-level review did not measure: topic explanations were being presented while learners changed subtopics. All six outcomes in that unit now have their own authored explanations, relevant formula lists and distinct worked examples, saved in source and the local DB. The API and development preview select the requested subtopic, and narration uses that same selected lesson. Root estimation uses square-number bounds and midpoint rounding rather than an advanced approximation rule.

**Dedicated subtopic explanation coverage is ${subtopicCoverage.dedicated}/${subtopicCoverage.total}.** There are ${subtopicCoverage.total-subtopicCoverage.dedicated} shared-overview fallbacks remaining. The latest pass authored and independently model-reviewed every replacement topic payload, then corrected or adjudicated flagged content against its exact text. The all-outcome [inventory](subtopic-inventory.json) also records ${duplicateExampleQuestions.length} same-topic/tier groups with identical example question text, for contextual review. Distinct text alone does not establish teaching quality. [Stored API checks](all-subtopics-routing-verification.json) verify all 1,513 selected lessons against DB and source; [regression details](subtopic-fix-report.md) record the browser checks and limits. Source selection checks cover both tier variants (3,026 checks); browser checks exercise 217 cards across all 35 year/subject groups and separately verify the six Genetics cards.

Formula and worked-example decisions are separate and tied to outcomes, not blanket subject rules. Necessary mathematics, scientific equations, code traces and quantitative Geography/DT remain. English and History can retain useful model analysis or writing where it serves the outcome; they do not acquire formula panels merely to fill a template. Generation prompts, parsing, seeding, API routing and preview formatting now respect this distinction.

Current storage contains **${audit.changes.length} violations of the configured example/formula policy**. This verifies policy compliance, not that the classification of every outcome is beyond professional judgement. Twelve topic-level equation/definition lists are flagged by a broad heuristic because no quantitative example index is listed; this does not alone make their scientific equations or definitions unnecessary.

## Source consistency and review evidence

The current database matches all 240 authored explanations, including Higher extensions: **zero source drift**. Editorial examples and questions are preserved in source registries and used on seeding/cache misses. The report generator verifies their exact payloads against the DB and checks authored example lookup behaviour. Corrected DB content will therefore survive a fresh seed.

The first nano pass covered the 8,805-row baseline. The deeper pass covered all 8,796 rows in its snapshot in 1,231 successful jobs, raising 448 row-level suggestions. Each later editorial payload was reviewed again using its exact SHA-256 hash. Current exact-payload model coverage: **${exact}/${entities.length}**. Independently documented editorial decisions: ${manual} current rows. The remaining ${outstanding.length} model flags are not silently marked resolved. See [validation manifest](validation-manifest.json) and [outstanding suggestions](outstanding-model-flags.json).

Nano was a second reader, not an authority. Rejected suggestions included a wrong 1928 date for the Åland settlement, incorrect estimates of a 915-word story’s length, inversion of a correctly labelled pulley ratio, and double-counting end-of-life energy. Corrections were checked against actual stimuli and calculations.

The database has ${audit.statuses.approved??0} pre-existing approved flags and ${audit.statuses.pending??0} pending rows. These flags are not independent evidence of qualified teacher review; no new teacher approvals were assigned.

## Speech synthesis

Speech conversion now handles ordinary mathematical symbols, temperature/area units, powers and code fences. Foundation and Higher content are selected before building spoken lesson beats. The cache preparation also covers all warranted stored worked examples and deduplicates identical text. Audio keys depend on voice and spoken text, so changed text cannot silently reuse the old clip.

Latest read-only cache check (${narration?.updatedAt??'not run'}): ${narration?.counts.topics??0} topics, ${narration?.counts.examples??0} worked examples, ${narration?.counts.beats??0} unique topic/text clips; ${narration?.counts.skipped??0} already cached and **${narration?.counts.made??0} needing synthesis**, totalling ${narration?.counts.characters??0} uncached characters. Stale topics: ${narration?.counts.stale??'unknown'}; unseeded topics: ${narration?.counts.unseeded??'unknown'}. [Narration manifest](narration-dry-run.json).

${speechComplete
 ? `Following the user's explicit approval, Azure Speech generated ${narrationRun?.counts.made??0} missing clips using en-GB-SoniaNeural and saved them to the configured local Blob Storage cache. The post-run inventory confirms zero missing clips for all currently authored topic lessons, Higher extensions, ${subtopicCoverage.dedicated} dedicated subtopic lessons and ${narration.counts.examples} stored worked examples. See [synthesis run](narration-run.json), [audio verification](speech-verification.json) and [completion report](speech-completion-report.md). This does not deploy audio to production or certify every pronunciation by human listening.`
 : `The user approved transmission to the configured Azure Speech endpoint after the earlier automatic approval block. Completion remains subject to a clean post-run cache inventory; see narration-run.json. Existing cached audio and browser speech remain available.`}

## Verification and remaining limitations

Catalogue validation, outcome policy tests, Foundation/Higher selection tests, speech conversion, exclusive playback and DB integrity checks pass. Catalogue validation retains 16 near-duplicate-outcome warnings. The production build result is recorded in [build output](build.txt); it retains a bundle-size advisory. No production deployment is claimed. Audio cache, delivery and decoding checks are recorded separately in the speech completion report; they do not replace human listening review.

[Verification record](verification-results.json) records the checks, including execution of eight corrected Python answers and the corrected SQL insert/update example. [Heuristic categories](heuristic-summary.json) distinguish the remaining pattern matches from confirmed defects.

The automated audit retains ${audit.findings.length} heuristic findings, including supplied-source checks and mark-scheme allocation candidates. These are not ${audit.findings.length} proven errors. A complete specification crosswalk, selected school options, qualified subject review and practical/extended assessment evidence are still required before claiming full qualification readiness. [Prioritised remaining work](suggested-changes.md).

## Standards and factual references consulted

- [England national curriculum](https://www.gov.uk/government/collections/national-curriculum)
- [AQA Mathematics 8300](https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/subject-content)
- [AQA statistics tier boundaries](https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/subject-content/3.6-statistics): quartiles, interquartile range and box plots kept in Higher extensions.
- [UK Parliament: Pride's Purge](https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/civilwar/overview/prides-purge/) and [Charles I's trial](https://www.parliament.uk/about/living-heritage/building/palace/westminsterhall/government-and-administration/trial-of-charlesi/): checked chronology and parliamentary context.
- [PUB: NEWater](https://www.pub.gov.sg/Public/WaterLoop/OurWaterStory/NEWater): checked the illustrative resource-management lesson; school case-study choices still need configuration.
- [AQA Combined Science chemistry](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content) and [biology](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content)
- [Pearson Combined Science specification](https://qualifications.pearson.com/en/qualifications/edexcel-gcses/sciences-2016.html)
- [ICO: children and lawful bases](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/how-do-the-lawful-bases-apply-to-children-s-personal-information/)
- [UK Parliament: education reform chronology](https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/school/overview/1870educationact/) and [WSPU formation](https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/startsuffragette-/)
- [UN Peacemaker: Åland settlement](https://peacemaker.un.org/en/node/9375)
- [Folger: Macbeth, Act 1 Scene 7](https://www.folger.edu/explore/shakespeares-works/macbeth/read/1/7/)
- [USHMM: rescue of Danish Jews](https://encyclopedia.ushmm.org/content/en/map/rescue-of-danish-jews-fall-1943)
- [Dorset Council: coastal protection and Lyme Regis](https://www.dorsetcouncil.gov.uk/w/coast-protection-in-west-dorset)
- [National Weather Service: revised Katrina fatalities and damage](https://www.weather.gov/lix/katrina_anniversary)
- [World Bank: Haiyan damage and losses](https://blogs.worldbank.org/en/sustainablecities/what-super-typhoon-yolanda-philippines-told-us-about-building-back-better)
- [Philippine News Agency: official Haiyan death count](https://www.pna.gov.ph/articles/1188062)
- [NASA: Moon orbit and phase periods](https://science.nasa.gov/moon/moon-phases/)
- [Dickens: Great Expectations, primary text](https://www.gutenberg.org/files/1400/1400-h/1400-h.htm)
- [ICO: children’s profiling safeguards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/12-profiling/)
- [UK copyright exceptions](https://www.gov.uk/guidance/exceptions-to-copyright) and [Creative Commons: non-commercial interpretation](https://wiki.creativecommons.org/wiki/NonCommercial_interpretation)
`;
writeFileSync(`${dir}/curriculum-review-report.md`,report);
await import('./refresh-curriculum-review-docs.mjs');
console.log(JSON.stringify({...summary,subjects:undefined,narration:summary.narration},null,2));
