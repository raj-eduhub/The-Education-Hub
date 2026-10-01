import {readFileSync,writeFileSync} from 'node:fs';
const root='output/curriculum-review';
const current=JSON.parse(readFileSync(`${root}/standards-mapping/current-inventory.json`));
const notice=`> **Standards-review update (1 October 2026):** the further Maths correction is saved in the local DB and source, passed its exact-payload nano recheck, and has current browser-verified replacement narration. All 25,150 required clips are cached. Standards mapping remains incomplete: ${current.counts.reviewed} of 359 topic/board jobs (${current.reviewedRows} outcome/board links) have passed model review. Azure now rejects nano requests with HTTP 401 and the approved key lookup with ReadOnlyDisabledSubscription. See the [current standards report](standards-mapping/report.md), [failed tasks](standards-mapping/failed-tasks.md) and [cost report](costs/report.md). Earlier audio counts below describe the preceding snapshot.`;
for(const name of ['subtopic-fix-report.md','curriculum-review-report.md','speech-completion-report.md']){
 const path=`${root}/${name}`;let text=readFileSync(path,'utf8');
 text=text.replace(/^> \*\*Standards-review update \(1 October 2026\):\*\*.*\r?\n/gm,'');
 const end=text.indexOf('\n');text=text.slice(0,end+1)+'\n'+notice+'\n'+text.slice(end+1);writeFileSync(path,text);
}
console.log('Marked the three earlier reports with the current correction, review and narration status.');
