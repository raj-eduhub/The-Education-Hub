// Guard the reported failure: a catalogue card must select its own substantive
// lesson, with appropriate notation, in every year/subject/tier combination.
import assert from 'node:assert/strict';
import katex from 'katex';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide} from '../../src/topicGuides.js';
import {selectExplanation} from '../../src/data/selectExplanation.js';
import {warrantsFormulae} from '../../src/data/workedExampleOutcomes.js';
import {lessonBeats,beatSpeech} from '../../src/lessonBeats.js';
import {toSpoken} from '../../src/speech.js';
let checked=0;const errors=[];
for(const topic of curriculum){
 const guide=getTopicGuide(topic.subject,topic),original=JSON.stringify(guide);
 for(const tier of ['Foundation','Higher']){
  const seen=new Set();
  for(const [index,title] of topic.outcomes.entries()){
   try{
    const lesson=selectExplanation(guide,index,tier);
    assert.equal(lesson.scope,'subtopic','Shared overview fallback');assert.equal(lesson.subtopicTitle,title);assert.equal(lesson.subtopicIndex,index);
    assert(lesson.explanation.length>100);assert(!('subtopics' in lesson));assert(!('higher' in lesson));
    const normalized=lesson.explanation.toLowerCase().replace(/[^a-z0-9]+/g,' ');assert(!seen.has(normalized),'Duplicate explanation within topic');seen.add(normalized);
    assert(!lesson.formulae.length||warrantsFormulae(topic.id,index),'Inapplicable formula panel');
    const text=JSON.stringify(lesson);
    if(tier==='Foundation'&&topic.tiers.includes('Foundation')){
     if(topic.subject==='Science')assert(!/\bglucagon\b|\bmoles?\b|inverse.square/i.test(text),'Higher Science content leaked into Foundation');
     if(topic.subject==='Maths')assert(!/quadratic formula|complet(?:e|ing) the square|conditional probability|P\(B\|A\)/i.test(text),'Higher Maths method leaked into Foundation');
    }
    for(const text of [lesson.explanation,...lesson.keyIdeas,...lesson.formulae])for(const [,math]of text.matchAll(/\$([^$]+)\$/g)){
     assert(!/(^|[^\\])%/.test(math),'Unescaped percent truncates rendered maths');
     assert(!/\\\\[A-Za-z]/.test(math)||math.includes('begin{'),'Doubled slash corrupts maths command');
     katex.renderToString(math,{throwOnError:true,strict:'error'});
    }
    for(const beat of lessonBeats(topic,lesson)){const spoken=beatSpeech(beat,toSpoken);assert(spoken.trim());assert(!/[\\${}]/.test(spoken),`Unspoken notation: ${spoken}`);}
    checked++;
   }catch(error){errors.push({topic:topic.id,index,title,tier,error:error.message});}
  }
 }
 assert.equal(JSON.stringify(guide),original,'Selection mutated stored lesson');
}
console.log(JSON.stringify({variantsChecked:checked+errors.length,passed:checked,errors:errors.length,details:errors.slice(0,40)},null,2));
if(errors.length)process.exitCode=1;
