// A narrowly scoped, independently proved correction. Local DB only.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {TableClient} from '@azure/data-tables';
const dir='output/curriculum-review/standards-mapping/factor-correction';
mkdirSync(dir,{recursive:true});
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const settings=JSON.parse(readFileSync('api/local.settings.json','utf8').replace(/^\uFEFF/,'')).Values;
assert(/UseDevelopmentStorage=true|127\.0\.0\.1|localhost/.test(settings.AZURE_STORAGE_CONNECTION_STRING),'Local storage only');
const table=settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent';
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,table);
const original='A frequent misconception is confusing the two terms: for instance, a factor of a number is not a multiple of that number, and vice versa.';
const replacement='Factors and multiples describe different relationships, but they can overlap: every positive integer is both a factor and a multiple of itself. For example, 6 divides 6 exactly and 6 is 6 times 1.';
const sourcePath='src/data/generatedSubtopicLessons.js',source=readFileSync(sourcePath,'utf8');
const entity=await client.getEntity('y7-maths-number','explanation'),payload=JSON.parse(entity.payload);
assert.equal(payload.subtopics[1].title,'Use factors and multiples');
if(payload.subtopics[1].explanation.includes(replacement)){
 assert(source.includes(replacement)&&!source.includes(original));
 assert(existsSync(`${dir}/applied.json`));console.log('Correction already saved in DB and source.');process.exit();
}
assert(payload.subtopics[1].explanation.includes(original));assert.equal(source.split(original).length,2);
payload.subtopics[1].explanation=payload.subtopics[1].explanation.replace(original,replacement);
// Check the counterexample and the general positive-integer relationship.
assert.equal(6%6,0);assert.equal(6*1,6);
for(let n=1;n<=100;n++){assert.equal(n%n,0);assert.equal(n*1,n);}
const proof='For every positive integer n, n = n × 1, so n divides itself and is a multiple of itself. The original categorical exclusion is false; 6 is a concrete counterexample.';
const plan={table,createdAt:new Date().toISOString(),changes:[{ref:'y7-maths-number/explanation',type:'explanation',subtopicTitle:entity.subtopicTitle,beforeHash:hash([entity.payload,entity.subtopicTitle]),payload,reason:proof}]};
writeFileSync(`${dir}/correction-plan.json`,JSON.stringify(plan,null,2));
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Direct mathematical proof and checked counterexample; no teacher approval or nano review claimed.',payloadHashes:{'y7-maths-number/explanation':hash(payload)},proof,flagDecisions:{}},null,2));
if(!process.argv.includes('--apply')){console.log('Prepared exact local DB correction and mathematical proof.');process.exit();}
writeFileSync(`${dir}/backup.json`,JSON.stringify({table,entity,sourcePath,source},null,2));
await client.updateEntity({partitionKey:entity.partitionKey,rowKey:entity.rowKey,payload:JSON.stringify(payload),origin:'editorial',reviewed:false,reviewStatus:'pending',reviewedBy:'',reviewedAt:'',storedAt:new Date().toISOString()},'Merge',{etag:entity.etag});
const saved=await client.getEntity(entity.partitionKey,entity.rowKey);assert.equal(saved.payload,JSON.stringify(payload));
writeFileSync(sourcePath,source.replace(original,replacement));
writeFileSync(`${dir}/applied.json`,JSON.stringify({appliedAt:new Date().toISOString(),environment:'local Azurite and source',ref:plan.changes[0].ref,payloadHash:hash(payload),sourceHash:hash(readFileSync(sourcePath,'utf8')),backup:`${dir}/backup.json`,proof,nanoReview:'pending endpoint approval',teacherSignoff:false},null,2));
console.log('Saved and read back the factor/multiple correction in local DB and source. Nano recheck and refreshed narration pending.');
