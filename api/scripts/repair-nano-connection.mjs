// Diagnose only the explicitly approved resource. Never print or rotate keys.
import {execSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const file='api/local.settings.json',settings=JSON.parse(readFileSync(file,'utf8').replace(/^\uFEFF/,'')),values=settings.Values;
const host='rajkumaraiexpert-0649-resource.services.ai.azure.com';
assert.equal(new URL(values.AZURE_AI_FOUNDRY_ENDPOINT).hostname,host);
const resource='rajkumaraiexpert-0649-resource',group='rg-rajkumar.aiexpert-1140';
const az=command=>JSON.parse(execSync(command,{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}));
const metadata=az(`az cognitiveservices account show --name ${resource} --resource-group ${group} --output json`);
assert.equal(metadata.name,resource);assert.equal(metadata.properties.customSubDomainName,resource);
assert.equal(metadata.properties.disableLocalAuth,false);
const keys=az(`az cognitiveservices account keys list --name ${resource} --resource-group ${group} --output json`);
const candidates=[...new Set([values.AZURE_AI_API_KEY,keys.key1,keys.key2].filter(Boolean))];
const results=[];let valid;
for(const key of candidates){
 const response=await fetch(`${values.AZURE_AI_FOUNDRY_ENDPOINT.replace(/\/$/,'')}/responses`,{method:'POST',headers:{'Content-Type':'application/json','api-key':key},signal:AbortSignal.timeout(45000),body:JSON.stringify({model:'gpt-5-nano',reasoning:{effort:'low'},max_output_tokens:150,input:'Reply with OK.'})});
 results.push({credential:key===values.AZURE_AI_API_KEY?'configured':'current-resource-key',status:response.status});
 if(response.ok){valid=key;break;}
}
const changed=Boolean(valid&&valid!==values.AZURE_AI_API_KEY&&process.argv.includes('--repair'));
if(changed){values.AZURE_AI_API_KEY=valid;writeFileSync(file,JSON.stringify(settings,null,2)+'\n');}
const report={checkedAt:new Date().toISOString(),hostname:host,resource,localAuthEnabled:true,configuredKeyMatchesActiveResourceKey:[keys.key1,keys.key2].includes(values.AZURE_AI_API_KEY),checks:results,repairedLocalConfiguration:changed,keysRotated:false};
writeFileSync('output/curriculum-review/standards-mapping/connection-check.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));if(!valid)process.exitCode=1;
