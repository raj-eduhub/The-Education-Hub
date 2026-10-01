import {writeFileSync} from 'node:fs';
import {curriculum} from '../../src/data/curriculumCatalog.js';
import {getTopicGuide} from '../../src/topicGuides.js';
import {selectExplanation} from '../../src/data/selectExplanation.js';
const seen=new Set(),cases=[];
for(const t of curriculum){const key=`${t.year}/${t.subject}`;if(seen.has(key))continue;seen.add(key);const guide=getTopicGuide(t.subject,t);cases.push({year:t.year,subject:t.subject,topic:t.title,id:t.id,lessons:t.outcomes.map((title,index)=>({title,index,explanation:selectExplanation(guide,index,'Foundation').explanation}))});}
writeFileSync('output/playwright/subtopic-browser-cases.json',JSON.stringify(cases,null,2));
console.log(`Prepared ${cases.length} year/subject groups, ${cases.reduce((n,c)=>n+c.lessons.length,0)} card checks.`);
