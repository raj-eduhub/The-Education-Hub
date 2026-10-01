import {readFileSync} from 'node:fs';
import {TableClient} from '@azure/data-tables';
const settings=JSON.parse(readFileSync(new URL('../local.settings.json',import.meta.url),'utf8').replace(/^\uFEFF/,'')).Values;
const client=TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING,settings.AZURE_STORAGE_CONTENT_TABLE??'EducationHubContent');
for(const ref of process.argv.slice(2)){
 const [partitionKey,rowKey]=ref.split('/'),e=await client.getEntity(partitionKey,rowKey);
 console.log(JSON.stringify({ref,type:e.type,outcome:e.subtopicTitle,payload:JSON.parse(e.payload)}));
}
