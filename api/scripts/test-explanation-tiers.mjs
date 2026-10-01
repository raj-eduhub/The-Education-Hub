import assert from 'node:assert/strict';
import {topicContent} from '../../src/data/topicContent/index.js';
import {explanationForTier} from '../../src/data/explanationTier.js';
import {getTopicGuide} from '../../src/topicGuides.js';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {lessonBeats,beatSpeech} from '../../src/lessonBeats.js';
import {toSpoken} from '../../src/speech.js';
for(const [id,term] of [['y11-science-homeostasis','glucagon'],['y10-science-bioenergetics','inverse-square'],['y10-science-chemical-changes','ionised'],['y10-maths-graphs','coefficient']]){
 const raw=topicContent[id],before=JSON.stringify(raw),core=explanationForTier(raw,'Foundation'),higher=explanationForTier(raw,'Higher');
 assert(!JSON.stringify(core).includes(term),`${id} leaks Higher teaching into Foundation`);
 assert(JSON.stringify(higher).includes(term),`${id} loses Higher teaching`);
 assert(!('higher' in core)&&!('higher' in higher),'Unselected extension returned to learner');
 assert.equal(JSON.stringify(raw),before,'Tier selection mutated the stored content');
 assert.deepEqual(explanationForTier(raw,undefined),core,'Unknown tier should not expose Higher extension');
 const topic=curriculum.find(t=>t.id===id),guide=getTopicGuide(topic.subject,topic,'Higher');
 assert.equal(guide.explanation,higher.explanation,'Preview and API selection disagree');
 for(const c of [core,higher])for(const beat of lessonBeats(topic,c))assert(!/[\\${}]/.test(beatSpeech(beat,toSpoken)),'Tiered lesson has unspoken markup');
}
console.log('PASS: Foundation/Higher selection, immutable payloads, preview consistency and tiered spoken text.');
