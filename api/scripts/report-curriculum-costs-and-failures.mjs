import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {curriculum} from '../../src/data/curriculumCatalog.js';
const root='output/curriculum-review',mapping=`${root}/standards-mapping`,costs=`${root}/costs`;
const read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const plan=read(`${mapping}/mapping-plan.json`),groups={reviewed:[],authenticationFailed:[],validationFailed:[],pending:[]};
for(const job of plan.jobs){
 const topicId=job.id.replace(/--(dfe|aqa|edexcel)$/,''),topic=curriculum.find(t=>t.id===topicId),file=`${mapping}/mappings/${job.id}.json`;
 const saved=existsSync(file)?read(file):null,item={id:job.id,topicId,year:topic.year,subject:topic.subject,title:topic.title,board:job.id.split('--')[1],error:saved?.error};
 if(saved?.inputHash===job.inputHash&&saved.state==='reviewed')groups.reviewed.push(item);
 else if(saved?.inputHash===job.inputHash&&saved.state==='failed')groups[/HTTP 401|HTTP 403/.test(saved.error)?'authenticationFailed':'validationFailed'].push(item);
 else groups.pending.push(item);
}
const counts=Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,v.length]));assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),359);
writeFileSync(`${mapping}/failed-task-list.json`,JSON.stringify({at:new Date().toISOString(),counts,...groups},null,2));
const yearRows=[7,8,9,10,11].map(y=>`| ${y} | ${groups.reviewed.filter(t=>t.year===y).length} | ${groups.authenticationFailed.filter(t=>t.year===y).length} | ${groups.pending.filter(t=>t.year===y).length} |`).join('\n');
const failedRows=groups.authenticationFailed.map(t=>`| ${t.year} | ${t.subject} | ${t.title} | ${t.board.toUpperCase()} | HTTP 401 |`).join('\n');
writeFileSync(`${mapping}/failed-tasks.md`,`# Failed and pending curriculum tasks

Updated ${new Date().toISOString()}. Counts refer to topic/board standards-review jobs, not defective lessons.

| Task | Status | Cause / evidence |
| --- | --- | --- |
| ${counts.authenticationFailed} standards-review jobs | Failed, resumable | Model endpoint returned HTTP 401. Every affected topic is listed below. |
| Nano credential repair | Blocked | After explicit user approval, Azure rejected account-key lookup with ReadOnlyDisabledSubscription. No key was retrieved, changed or rotated. |
| ${counts.pending} further standards-review jobs | Pending, not failed | No accepted complete review yet; worker stopped after authentication failure. |
| ${counts.reviewed} standards-review jobs | Completed model review | Preserved on disk and skipped by the resumable worker while their input hashes match. |
| Maths correction | Completed | Saved in local DB/source and rechecked by nano against the current exact payload. |
| Replacement narration | Completed | Two clips generated and decoded through the authenticated browser API. All 25,150 required clips cached. |
| Azure cost queries | Completed | ActualCost results retrieved and saved; see [cost report](../costs/report.md). |

Earlier draft validation retries are retained in the jobs folder; they are not additional failed task counts. Failed model calls did not publish replacement lessons or invalidate saved content. The two endpoint approvals and credential-repair approval are recorded in the conversation; no further endpoint consent is needed for resumption.

## By year

| Year | Completed | HTTP 401 failures | Pending |
| --- | ---: | ---: | ---: |
${yearRows}

## Every failed review job

| Year | Subject | Topic | Standard / board | Failure |
| --- | --- | --- | --- | --- |
${failedRows}

## Resumption

The live subscription API reports Warned, FreeTrial_2014-09-01 and spendingLimit On; the key lookup separately returns ReadOnlyDisabledSubscription. The specific cause (for example trial expiry or exhausted credit) has not been established. Resolve the account/subscription status in Azure before restarting the worker. No subscription upgrade, spending-limit removal or billing change has been performed. [Microsoft reactivation guidance](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/subscription-disabled).

After access is restored, the resumable command is:

\`\`\`powershell
node api/scripts/map-curriculum-standards.mjs run --concurrency=24
\`\`\`

The worker now stops new requests on the first HTTP 401/403 and saves future successful-response token usage, including responses whose JSON fails validation. [Machine-readable list](failed-task-list.json).
`);
function rows(name){const data=read(`${costs}/${name}.json`);assert(!data.error,data.error);return data.pages.flatMap(p=>p.properties.rows.map(r=>Object.fromEntries(p.properties.columns.map((c,i)=>[c.name,r[i]]))));}
const all=rows('subscription-costs'),recent=rows('review-resource-costs');assert([...all,...recent].every(r=>r.Currency==='GBP'));
const total=rs=>rs.reduce((n,r)=>n+r.Cost,0),money=n=>`£${n.toFixed(2)}`;
const services=[...new Set(all.map(r=>r.ServiceName))].map(service=>({service,cost:total(all.filter(r=>r.ServiceName===service))}));
const modelCost=total(recent.filter(r=>r.ServiceName==='Foundry Models')),speechCost=total(recent.filter(r=>r.MeterSubCategory==='Azure Speech'));
const summary={generatedAt:new Date().toISOString(),currency:'GBP',classification:'Azure Cost Management ActualCost, as posted at query time; not a final invoice or exclusive task cost',subscriptionPeriod:'2026-09-01 through 2026-10-01',subscriptionReportedTotal:total(all),services,reviewResourcePeriod:'2026-09-30 through 2026-10-01',reviewResourceReportedTotal:total(recent),modelFamilyReportedCost:modelCost,speechReportedCost:speechCost,recent,subscriptionState:read(`${costs}/subscription-state.json`)};
writeFileSync(`${costs}/summary.json`,JSON.stringify(summary,null,2));
const portal=`https://portal.azure.com/#@/resource/subscriptions/${summary.subscriptionState.id}/resourceGroups/rg-rajkumar.aiexpert-1140/providers/Microsoft.CognitiveServices/accounts/rajkumaraiexpert-0649-resource/overview`;
writeFileSync(`${costs}/report.md`,`# Curriculum work: Azure costs and limits

Queried ${read(`${costs}/review-resource-costs.json`).queriedAt}. Currency: **GBP**. These figures come from Azure Cost Management ActualCost, not assumed token prices. They are posted consumption costs, not a final invoice or proof of cash owed after trial credit.

## AI resource: 30 September–1 October 2026

| Service / meter family | Reported cost |
| --- | ---: |
| Foundry Models — Azure OpenAI GPT5 | ${money(modelCost)} |
| Foundry Tools — Azure Speech | ${money(speechCost)} |
| **Total, calculated before rounding** | **${money(total(recent))}** |

The exact totals are £${modelCost.toFixed(6)} for models and £${speechCost.toFixed(6)} for Speech, hence displayed row totals may differ by a penny from the rounded grand total. GPT5 is the billing meter family returned by this query; it does not isolate GPT-5 nano or a specific review run. The resource may also serve other app activity. [Daily source data](review-resource-costs.json), [exact query](review-resource-costs-query.json), [resource in Azure Portal](${portal}).

## Entire subscription: 1 September–1 October 2026

| Service | Reported cost |
| --- | ---: |
${services.map(s=>`| ${s.service} | ${s.cost>0&&s.cost<0.01?'Less than £0.01':money(s.cost)} |`).join('\n')}
| **Total** | **${money(total(all))}** |

These broader totals include other dates and resources, so they must not be presented as the cost of this curriculum task. [Subscription source data](subscription-costs.json), [exact query](subscription-costs-query.json).

## What is and is not included

- New speech in the latest amendment: **195 characters, two clips**, saved locally; 139 existing clips reused for that topic. This is a usage count, not an individually itemised Azure charge. The fresh inventory verifies 25,150 required clips cached.
- Local database and audio storage use Azurite. Local test/storage operations do not create Azure storage charges. Cloud-hosted infrastructure elsewhere remains part of the subscription totals where applicable.
- Codex/chat subscription costs are outside this Azure resource query and are not available from these logs.
- No reliable exact historical task total can be reconstructed from model output files alone: restarted/overwritten attempts and responses interrupted before persistence can be missing, while author/reviewer usage is duplicated across some artifacts. Do not sum all JSON usage fields blindly. Future standards responses now have a dedicated append-only token ledger, including billable responses rejected for invalid JSON.
- Costs for recent usage can appear late; Microsoft documents reporting delays and later adjustments. Today's costs are provisional. [Cost Management data guidance](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data).
- A quote for the unfinished ${359-counts.reviewed} mappings is not supplied: exact future tokens, retries and the applicable account price are unknown. No assumption of free calls or a fixed final bill is made.

## Current subscription problem

Azure's live subscription API returned **Warned**, offer **FreeTrial_2014-09-01**, spending limit **On**. Separately, the approved key lookup was rejected with **ReadOnlyDisabledSubscription**, and model calls returned HTTP 401. No credentials were changed. These observations do not identify whether the specific cause is expired trial credit, a spending limit or another billing condition. [Subscription evidence](subscription-state.json), [Microsoft reactivation guidance](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/subscription-disabled).

No subscription upgrade, billing change, spending-limit removal or key rotation has been performed. The nano worker is stopped; already completed content and narration remain available locally. [Failed task list](../standards-mapping/failed-tasks.md).
`);
console.log(JSON.stringify({taskCounts:counts,reportedResourceCost:summary.reviewResourceReportedTotal,reportedSubscriptionCost:summary.subscriptionReportedTotal,currency:'GBP'}));
