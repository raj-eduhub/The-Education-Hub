import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { TableClient } from '@azure/data-tables';
import { curriculum } from '../../src/data/curriculumCatalog.js';
import { getTopicGuide } from '../../src/topicGuides.js';

const dir = 'output/curriculum-review/pass-33';
if (existsSync(`${dir}/applied-corrections.json`)) throw Error('This batch has already been applied.');
mkdirSync(dir, { recursive: true });
const settings = JSON.parse(readFileSync(new URL('../local.settings.json', import.meta.url), 'utf8').replace(/^\uFEFF/, '')).Values;
const table = settings.AZURE_STORAGE_CONTENT_TABLE ?? 'EducationHubContent';
const client = TableClient.fromConnectionString(settings.AZURE_STORAGE_CONNECTION_STRING, table);
const topic = curriculum.find(t => t.id === 'y9-maths-powers');
const guide = getTopicGuide(topic.subject, topic);
const examples = [
  {
    formulae: ['$a^m \\times a^n = a^{m+n}$', '$a^m \\div a^n = a^{m-n}$, for $a \\ne 0$'],
    question: 'Simplify $\\frac{x^5 \\times x^2}{x^3}$, where $x \\ne 0$.',
    steps: ['The numerator multiplies powers with the same base, so add the indices: $x^5 \\times x^2 = x^7$.', 'Divide powers with the same non-zero base by subtracting the indices: $x^7 \\div x^3 = x^{7-3}$.', 'Simplify the index: $7-3=4$.'],
    answer: '$x^4$',
  },
  {
    formulae: [],
    question: 'Estimate $\\sqrt{50}$ to one decimal place without a calculator. Show how you check the rounding.',
    steps: ['Since $7^2=49$ and $8^2=64$, the root lies between $7$ and $8$.', 'Since $7.0^2=49$ and $7.1^2=50.41$, it lies between $7.0$ and $7.1$.', 'The rounding midpoint is $7.05$. Its square is $49.7025$, which is less than $50$, so the root is above $7.05$.', 'The root is between $7.05$ and $7.1$, so it rounds to $7.1$ to one decimal place.'],
    answer: '$\\sqrt{50} \\approx 7.1$ to one decimal place.',
  },
  {
    formulae: ['$(a \\times 10^m)(b \\times 10^n) = ab \\times 10^{m+n}$'],
    question: 'Calculate $(4 \\times 10^5)(3 \\times 10^{-2})$. Give your answer in standard form.',
    steps: ['Multiply the coefficients: $4 \\times 3=12$.', 'Multiply the powers of ten by adding their indices: $10^5 \\times 10^{-2}=10^3$.', 'The product is $12 \\times 10^3$. Rewrite $12$ as $1.2 \\times 10$ to obtain $1.2 \\times 10^4$.', 'Check using ordinary numbers: $400000 \\times 0.03=12000$.'],
    answer: '$1.2 \\times 10^4$',
  },
  {
    formulae: ['$x \\times 10^{-n}=x \\div 10^n$'],
    question: 'Calculate $4.56 \\times 10^3$ and $4.56 \\times 10^{-2}$.',
    steps: ['$10^3=1000$. Multiplying $4.56$ by $1000$ moves its digits three place-value columns to the left: $4560$.', '$10^{-2}=\\frac{1}{100}$. Multiplying by this is dividing by $100$, which gives $0.0456$.', 'Check the sizes: multiplying by $1000$ increases this positive number, while dividing by $100$ reduces it.'],
    answer: '$4560$ and $0.0456$, respectively.',
  },
  {
    formulae: [],
    question: 'Write $0.00072$ in standard form, then write $5.3 \\times 10^4$ as an ordinary number.',
    steps: ['For $0.00072$, choose the coefficient $7.2$, which is at least $1$ and less than $10$.', 'To recover $0.00072$ from $7.2$, divide by $10000$, so use the exponent $-4$: $7.2 \\times 10^{-4}$.', 'For the second number, multiply $5.3$ by $10000$ to get $53000$.', 'Reverse each conversion to check that its value has stayed the same.'],
    answer: '$7.2 \\times 10^{-4}$ and $53000$, respectively.',
  },
  {
    formulae: [],
    question: 'Calculate $3^2 + \\sqrt{(16+9)} \\times 2$.',
    steps: ['Evaluate the brackets under the root sign: $16+9=25$.', 'Evaluate the power and root: $3^2=9$ and $\\sqrt{25}=5$. The expression becomes $9+5 \\times 2$.', 'Multiply before adding: $5 \\times 2=10$.', 'Finally add: $9+10=19$.'],
    answer: '$19$',
  },
];
const payloads = [{ rowKey: 'explanation', type: 'explanation', subtopicTitle: '', payload: Object.fromEntries(['explanation','keyIdeas','formulae','higher','subtopics'].filter(k => guide[k] !== undefined).map(k => [k, guide[k]])) },
  ...examples.map((p, i) => ({rowKey: `example-${i}-core`, type: 'example', subtopicTitle: topic.outcomes[i], payload: {...p, notation: true}}))];
const changes = [];
for (const row of payloads) {
  const existing = await client.getEntity(topic.id, row.rowKey);
  changes.push({ref: `${topic.id}/${row.rowKey}`, type: row.type, subtopicTitle: row.subtopicTitle,
    beforeHash: createHash('sha256').update(JSON.stringify([existing.payload, existing.subtopicTitle])).digest('hex'),
    payload: row.payload, reason: 'Separate the six powers, roots and standard-form outcomes with relevant teaching, formulas and distinct age-appropriate examples.'});
}
writeFileSync(`${dir}/correction-plan.json`, JSON.stringify({table, createdAt: new Date().toISOString(), changes}, null, 2));
console.log(`Prepared ${changes.length} corrections without changing the database.`);
