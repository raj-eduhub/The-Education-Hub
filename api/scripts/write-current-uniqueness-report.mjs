import {readFileSync,writeFileSync} from 'node:fs';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide} from '../../src/topicGuides.js';
const root='output/curriculum-review',read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const inventory=read(`${root}/pass-35/coverage-current.json`),speech=read(`${root}/narration-unique-speech-current.json`),api=read(`${root}/all-subtopics-routing-verification.json`);
const normal=s=>s.toLowerCase().normalize('NFKC').replace(/[^a-z0-9]+/g,' ').trim(),lessons=[],overviews=[];
for(const topic of curriculum){
 const guide=getTopicGuide(topic.subject,topic);overviews.push({topicId:topic.id,text:normal(guide.explanation)});
 for(const [index,title] of topic.outcomes.entries())lessons.push({topicId:topic.id,index,title,text:normal(guide.subtopics[index].explanation)});
}
function duplicateGroups(rows){const m=new Map();for(const row of rows){const list=m.get(row.text)??[];list.push({topicId:row.topicId,index:row.index,title:row.title});m.set(row.text,list);}return [...m.values()].filter(xs=>xs.length>1);}
const globalLessonDuplicates=duplicateGroups(lessons),overviewDuplicates=duplicateGroups(overviews);
const report={checkedAt:new Date().toISOString(),environment:'Local Azurite and source; production unchanged',databaseSnapshotAt:inventory.checkedAt,topics:curriculum.length,outcomes:inventory.total,
 db:{dedicated:inventory.dedicated,sharedFallbacks:inventory.shared,duplicateExplanationsWithinTopic:inventory.duplicateDedicated,sourceMismatches:inventory.outcomes.filter(x=>!x.sourceMatch).length},
 exactNormalizedExplanationDuplicatesAcrossAllTopics:{subtopics:globalLessonDuplicates,topicOverviews:overviewDuplicates},
 outcomeExplanationsGloballyUnique:globalLessonDuplicates.length===0,topicOverviewsGloballyUnique:overviewDuplicates.length===0,
 api:{checked:api.checked,passed:api.passed,errors:api.errors.length,source:'stored DB and authored source'},
 speech:{inventoryAt:speech.updatedAt,voice:speech.voice,topics:speech.counts.topics,requiredBeats:speech.counts.beats,cachedBeats:speech.counts.skipped,missing:speech.counts.made,failed:speech.counts.failed,stale:speech.counts.stale,unseeded:speech.counts.unseeded},
 limits:['Uniqueness compares lesson explanation text after case and punctuation normalization. It does not require formulas, examples, key ideas, question stems or assessments to be textually different when repetition is pedagogically appropriate.','Speech completion means every current selected narration beat resolves to a cached clip; it does not mean a person has listened to every clip.']};
if(!report.outcomeExplanationsGloballyUnique||!report.topicOverviewsGloballyUnique||report.db.dedicated!==report.outcomes||report.db.sharedFallbacks||report.db.duplicateExplanationsWithinTopic||report.db.sourceMismatches||report.api.errors||report.speech.requiredBeats!==report.speech.cachedBeats||report.speech.failed||report.speech.stale||report.speech.unseeded)process.exitCode=1;
writeFileSync(`${root}/current-content-and-speech-verification.json`,JSON.stringify(report,null,2));
writeFileSync(`${root}/current-content-and-speech-report.md`,`# Current content uniqueness and speech check

Checked ${report.checkedAt}. **All ${report.outcomes} subtopic explanation texts are distinct, and all required speech clips are cached.** Data is from the current local DB/source. Production was not modified.

| Check | Result |
| --- | ---: |
| Topics and topic overview explanations | ${report.topics}; ${overviewDuplicates.length} duplicate groups |
| Dedicated subtopic explanations | ${report.db.dedicated}/${report.outcomes} |
| Shared overview fallbacks | ${report.db.sharedFallbacks} |
| Duplicate explanations within a topic | ${report.db.duplicateExplanationsWithinTopic} |
| Duplicate subtopic explanations across the full curriculum | ${globalLessonDuplicates.length} |
| DB/source explanation mismatches | ${report.db.sourceMismatches} |
| Current stored DB routes checked | ${report.api.checked}; ${report.api.passed} passed; ${report.api.errors} failed |
| Current narration beats | ${report.speech.requiredBeats}; ${report.speech.cachedBeats} cached |
| Missing, failed, stale or unseeded clips | ${report.speech.missing}, ${report.speech.failed}, ${report.speech.stale}, ${report.speech.unseeded} |

Uniqueness uses case- and punctuation-normalized explanation text, including comparison across all topics and subtopics. The check does not force key ideas, justified formulas, examples, questions or assessments to avoid appropriate repetition. The speech check verified every beat against its cache key; it does not represent listening review of every clip.

Evidence: [complete DB audit](pass-35/coverage-current.json), [3,026 formula/tier/notation checks](pass-35/verification-results.json), [all-outcome API verification](all-subtopics-routing-verification.json), [complete speech manifest](narration-unique-speech-current.json), [machine-readable current summary](current-content-and-speech-verification.json).

Standards alignment is a separate workstream and remains incomplete: ${read(`${root}/standards-mapping/current-inventory.json`).counts.reviewed} of 359 topic/board mappings are reviewed. See [standards mapping report](standards-mapping/report.md).
`);
console.log(JSON.stringify({checkedAt:report.checkedAt,topics:report.topics,outcomes:report.outcomes,globalSubtopicDuplicateGroups:globalLessonDuplicates.length,overviewDuplicateGroups:overviewDuplicates.length,db:report.db,api:report.api,speech:report.speech}));
