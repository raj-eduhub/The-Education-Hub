// Preserve applied, independently adjudicated corrections for future seeding.
// Refuse to export a row if it has changed since its last verified application.
import {readFileSync,writeFileSync,readdirSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {TableClient} from '@azure/data-tables';
const root='output/curriculum-review', dirs=[root,...readdirSync(root).filter(s=>/^pass-\d+$/.test(s)).sort((a,b)=>Number(a.slice(5))-Number(b.slice(5))).map(s=>`${root}/${s}`)];
const latest=new Map();
for(const dir of dirs){if(!existsSync(`${dir}/applied-corrections.json`))continue;const applied=JSON.parse(readFileSync(`${dir}/applied-corrections.json`));for(const row of applied.applied)latest.set(row.ref,row);}
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values;
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent');
const examples={},questions={},manifest=[];
for(const [ref,row] of [...latest].sort()){
 const [partitionKey,rowKey]=ref.split('/'),entity=await client.getEntity(partitionKey,rowKey),payload=JSON.parse(entity.payload);
 const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex');assert.equal(hash,row.payloadHash,`DB changed after application: ${ref}`);
 if(entity.type==='example')examples[ref]=payload;
 if(['practice','exam'].includes(entity.type))questions[ref]=payload;
 manifest.push({ref,payloadHash:hash,type:entity.type,reason:row.reason});
}
const writeModule=(path,name,value)=>writeFileSync(path,`// Editorial corrections, verified against the database. Not formal teacher approval.\n// Regenerate with node api/scripts/persist-editorial-source.mjs after applying reviewed plans.\nexport const ${name} = ${JSON.stringify(value,null,2)};\n`);
mkdirSync('api/src/data',{recursive:true});
writeModule('src/data/editorialExamples.js','editorialExamples',examples);
writeModule('api/src/data/editorialQuestions.js','editorialQuestions',questions);
writeFileSync(`${root}/source-manifest.json`,JSON.stringify({generatedAt:new Date().toISOString(),examples:Object.keys(examples).length,questions:Object.keys(questions).length,rows:manifest},null,2));
console.log(`Preserved ${Object.keys(examples).length} examples and ${Object.keys(questions).length} questions; verified ${manifest.length} applied records against DB.`);
