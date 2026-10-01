import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const root='output/curriculum-review';
const read=name=>JSON.parse(readFileSync(`${root}/${name}`,'utf8').replace(/^\uFEFF/,''));
const run=read('narration-run.json'),cache=read('narration-dry-run.json'),verification=read('speech-verification.json');
const amendment=read('narration-geography-final.json');
assert.equal(amendment.counts.failed,0);assert.equal(amendment.counts.stale,0);assert.equal(amendment.counts.unseeded,0);
assert.equal(amendment.voice,run.voice);
const browserOutput=readFileSync('output/playwright/speech-browser-results.txt','utf8');
const browser=JSON.parse(browserOutput.split(/\r?\n/).find(line=>line.startsWith('{')));
assert.equal(run.counts.failed,0);assert.equal(cache.counts.made,0);
assert.equal(cache.counts.skipped,cache.counts.beats);
assert.equal(verification.missing,0);assert.equal(verification.empty,0);
assert(browser.passed);assert.equal(browser.decodedClips,verification.apiResponses);
assert(cache.updatedAt>=run.updatedAt,'Cache check predates completion');
assert(cache.updatedAt>=amendment.updatedAt,'Cache check predates the final Geography amendment');
assert(verification.checkedAt>=cache.updatedAt,'API checks predate final cache inventory');
assert(browser.checkedAt>=verification.checkedAt,'Browser check predates API verification');
writeFileSync(`${root}/speech-browser-verification.json`,JSON.stringify(browser,null,2));
const report=`# Speech synthesis completion report

Verified ${browser.checkedAt}. **Complete for all currently authored narration in the configured local environment. Production was not modified.**

## Generation and storage

- Approved destination: rajkumaraiexpert-0649-resource.cognitiveservices.azure.com.
- Voice: **${run.voice}**; MP3, mono, requested 24 kHz / 48 kbps.
- **${run.counts.made.toLocaleString('en-GB')} missing clips generated in the final resumed run**, ${run.counts.skipped.toLocaleString('en-GB')} existing clips reused, ${run.counts.failed} failed. Reused clips include audio completed before resuming with the larger worker pool; the earlier partial manifest is preserved in pass-35/narration-partial-before-resume.json.
- In that resumed run, ${run.counts.characters.toLocaleString('en-GB')} characters were sent for synthesis; ${(run.counts.bytes/1e6).toFixed(2)} MB of new audio was saved to local Blob Storage.
- The final Geography amendment was detected as newer than the bulk process's imported source and safely skipped there. A fresh process generated its ${amendment.counts.made} required new clips with zero failures; see [amendment manifest](narration-geography-final.json). The post-run inventory below covers both batches.
- The fresh read-only inventory found **${cache.counts.beats.toLocaleString('en-GB')} required clips cached, zero missing, zero stale or unseeded topics**.

Coverage includes all ${cache.counts.topics} current topic lessons and their authored tier extensions, all ${verification.dedicatedSubtopics} dedicated subtopic lessons, and ${cache.counts.examples} stored worked examples. Voice-and-text cache keys prevent edited narration from reusing a previous sentence's audio.

## Verification

- Checked every required cache key against the stored blob inventory, including non-empty byte lengths.
- Verified ${verification.allLessonBeatsVerified} selected subtopic/tier beats against non-empty stored audio. Authenticated local API requests successfully returned ${verification.apiResponses} real audio clips, including a prose sample from every subtopic, distinct Higher extensions and all Genetics lesson beats.
- The browser decoded all ${browser.decodedClips} returned MP3 clips successfully. Each had positive duration, one channel and non-silent sample data.
- Speech text conversion and subtopic lesson regression tests passed before generation. No beat exceeds the API's 2,000-character request limit.

These are cache, delivery and audio-decoding checks. They do not claim that a person listened to every clip or certified every pronunciation.

## Remaining content scope

All ${verification.dedicatedSubtopics} catalogue outcomes have dedicated lessons in this verified snapshot. Content review remains distinct from audio validation: automated checks do not certify 100% subject accuracy. Future lesson edits require incremental synthesis. Audio deployment to production is separate from this local completion.

## Evidence

- [Generation log and clip manifest](narration-run.json)
- [Post-run cache inventory](narration-dry-run.json)
- [Authenticated API and blob checks](speech-verification.json)
- [Browser decoding results](speech-browser-verification.json)
- [Approval record](speech-authorization.json)
- [Pre-run inventories](speech-before-completion/narration-dry-run.json)
`;
writeFileSync(`${root}/speech-completion-report.md`,report);
const subtopicFile=`${root}/subtopic-fix-report.md`;
let subtopic=readFileSync(subtopicFile,'utf8');
const paragraph=subtopic.indexOf('## Speech synthesis');
if(paragraph>=0)subtopic=subtopic.slice(0,paragraph)+`## Speech synthesis\n\nComplete locally for the corrected content snapshot: ${run.counts.made+amendment.counts.made} clips generated in the resumed batches, with earlier completed audio reused; all ${cache.counts.beats} required clips cached with zero missing. Coverage includes ${verification.dedicatedSubtopics} dedicated subtopics and their tier extensions. The browser decoded ${browser.decodedClips} API-delivered samples, including narration from every subtopic. See the [speech completion report](speech-completion-report.md). Production was not modified; no claim of a human pronunciation review for every clip.\n`;
writeFileSync(subtopicFile,subtopic);
console.log(`Wrote verified speech completion report: ${run.counts.made} generated, ${cache.counts.beats} cached, ${browser.decodedClips} decoded through the browser.`);
