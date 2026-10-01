import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const decisions={
30:{
'y11-design-technology-design-decisions-and-exam-practice/practice-9-Edexcel-core':'A removable lid and the generic material name do not specify permissible heating temperature, duration or food conditions. The answer reasonably requires the manufacturer’s verified instructions rather than inferring universal microwave safety from BPA-free polypropylene. It does not claim the container can never be microwaved.',
'y7-design-technology-materials-tools-and-safety/example-4-core':'The revised prompt explicitly states a straight reference edge and a square end. Two lines perpendicular to the same straight edge are parallel; Nano’s geometry objection is false. This outcome is measuring and marking with a rule, pencil and try square, not powered cutting; a cutting-machine safety checklist would be inapplicable.'},
31:{
'y11-computing-ethical-legal-and-environmental-impacts/exam-7-Edexcel-core':'The answer cannot invent a consent mechanism absent from the scenario; it identifies that evidential limit and explains the conditional age rule. Verified ICO Children’s Code section 12 explicitly says profiling options off by default unless a compelling reason takes account of the child’s best interests: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/12-profiling/ . Nano’s proposed weaker default wording is not adopted.'},
32:{
'y10-maths-graphs/explanation':'AQA 8300 A25 explicitly uses linear sequences and extends nth-term construction to quadratic sequences at Higher. Linear is correct terminology. Formal finite-difference notation and an additional worked example are not required in this concise explanation; the extension correctly states the complete quadratic form and leading-coefficient rule.',
'y7-science-cells/explanation':'Cellular organisation is a standard KS3 characteristic of living organisms. Viruses are not classified as living cellular organisms in this teaching model; their disputed philosophical status does not invalidate the curriculum statement. Nano’s most living things formulation would misleadingly suggest recognised non-cellular organisms.',
'y9-design-technology-precision-manufacture/practice-3-Edexcel-core':'The Year 9 task supplies nominal dimensions but no fit or tolerance requirement. The plan explicitly says to agree tolerances before production and inspect all relevant dimensions. Inventing compulsory numerical tolerances is not necessary or justified.'}
};
for(const n of process.argv.slice(2).map(Number)){
const dir=`output/curriculum-review/pass-${n}`,plan=JSON.parse(readFileSync(`${dir}/correction-plan.json`));
writeFileSync(`${dir}/correction-adjudication.json`,JSON.stringify({adjudicatedAt:new Date().toISOString(),method:'Independently checked stock allowances, timing sums, experimental claims, exact SQL execution, task alignment and official factual references. Inspected all changed payloads and adjudicated model flags against the actual text; no teacher approval inferred.',payloadHashes:Object.fromEntries(plan.changes.map(c=>[c.ref,createHash('sha256').update(JSON.stringify(c.payload)).digest('hex')])),flagDecisions:decisions[n]},null,2));
}
