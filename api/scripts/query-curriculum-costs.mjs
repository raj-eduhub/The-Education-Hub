// Read-only Azure billing queries. Outputs contain costs and resource metadata, never keys.
import {execSync} from 'node:child_process';
import {writeFileSync,mkdirSync} from 'node:fs';
const root='output/curriculum-review/costs';mkdirSync(root,{recursive:true});
const az=command=>JSON.parse(execSync(command,{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe'],maxBuffer:12*1024*1024}));
const account=az('az account show --query "{id:id,name:name,state:state}" --output json');
if(!/^[a-f0-9-]{36}$/i.test(account.id))throw Error('Invalid subscription id');
const scope=`/subscriptions/${account.id}`,resourceId=`${scope}/resourceGroups/rg-rajkumar.aiexpert-1140/providers/Microsoft.CognitiveServices/accounts/rajkumaraiexpert-0649-resource`;
const write=(file,data)=>writeFileSync(`${root}/${file}`,JSON.stringify(data,null,2));
try{const live=az(`az rest --method get --url "${scope}?api-version=2022-12-01" --output json`);write('subscription-state.json',{checkedAt:new Date().toISOString(),id:live.subscriptionId,name:live.displayName,state:live.state,subscriptionPolicies:live.subscriptionPolicies});}catch(e){write('subscription-state.json',{checkedAt:new Date().toISOString(),cached:account,error:String(e.stderr??e.message).slice(0,1500)});}
const aggregation={totalCost:{name:'Cost',function:'Sum'}};
const queries=[
 {name:'subscription-costs',body:{type:'ActualCost',timeframe:'Custom',timePeriod:{from:'2026-09-01T00:00:00Z',to:'2026-10-01T23:59:59Z'},dataset:{granularity:'Monthly',aggregation,grouping:[{type:'Dimension',name:'ServiceName'},{type:'Dimension',name:'ResourceId'}]}}},
 {name:'review-resource-costs',body:{type:'ActualCost',timeframe:'Custom',timePeriod:{from:'2026-09-30T00:00:00Z',to:'2026-10-01T23:59:59Z'},dataset:{granularity:'Daily',aggregation,filter:{dimensions:{name:'ResourceId',operator:'In',values:[resourceId]}},grouping:[{type:'Dimension',name:'ServiceName'},{type:'Dimension',name:'MeterSubCategory'}]}}}
];
for(const q of queries){
 write(`${q.name}-query.json`,q.body);let url=`${scope}/providers/Microsoft.CostManagement/query?api-version=2023-11-01`,pages=[];
 try{do{const page=az(`az rest --method post --url "${url}" --headers "ClientType=GitHubCopilotForAzure" --body "@${root}/${q.name}-query.json" --output json`);pages.push(page);url=page.properties?.nextLink;}while(url);write(`${q.name}.json`,{queriedAt:new Date().toISOString(),pages});console.log(JSON.stringify({query:q.name,pages:pages.length,rows:pages.reduce((n,p)=>n+(p.properties?.rows.length??0),0)}));}
 catch(e){const error=String(e.stderr??e.message).slice(0,2500);write(`${q.name}.json`,{queriedAt:new Date().toISOString(),error,pages});console.log(JSON.stringify({query:q.name,error}));if(/429|TooManyRequests/i.test(error))break;}
}
