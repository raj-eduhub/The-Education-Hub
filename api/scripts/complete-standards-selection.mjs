import {readFileSync,writeFileSync} from 'node:fs';
const p='output/curriculum-review/standards-mapping/source-selection.json';
const a=JSON.parse(readFileSync(p));
const more=[
{id:'dfe-history',subject:'History',board:'DfE',landingUrl:'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study',url:'https://assets.publishing.service.gov.uk/media/5a7c66d740f0b626628abcdd/SECONDARY_national_curriculum_-_History.pdf',label:'History programme of study: key stage 3'},
{id:'edexcel-design-and-technology-2017',subject:'Design & Technology',board:'Edexcel',landingUrl:'https://qualifications.pearson.com/en/subjects/design-and-technology.html',url:'https://qualifications.pearson.com/content/dam/pdf/GCSE/design-and-technology/2017/specification-and-sample-assessments/Pearson_Edexcel_GCSE_9_to_1_in_Design_and_Technology_Specification_issue3.pdf',label:'GCSE Design and Technology 1DT0 - verify issue from document, not filename'}
];
for(const r of more)if(!a.some(x=>x.id===r.id))a.push(r);
writeFileSync(p,JSON.stringify(a,null,2));console.log(`${a.length} sources selected.`);
