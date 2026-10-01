import assert from 'node:assert/strict';
import {parseQuestion} from '../src/lib/questionBank.js';
import {parseWorkedExample} from '../src/lib/workedExample.js';
import {contentSegments} from '../../src/contentSegments.js';
const code='```python\ndef square(n):\n    text = "ANSWER: **keep**"\n    return n ** 2\n```';
const exam=parseQuestion('exam',`QUESTION: Write a function.\nMARKS: 2\nMARKSCHEME:\n- Correct function.\n- Correct return.\nANSWER:\n${code}\n\nFor 5 it returns 25.`);
assert.equal(exam.answer,`${code}\n\nFor 5 it returns 25.`);
assert.deepEqual(exam.markScheme,['Correct function.','Correct return.']);
const practice=parseQuestion('practice','QUESTION: Compare two ideas.\n\nKeep this paragraph.\nHINT: Use evidence.\nWORKING:\n- Read both.\n- Compare reasons.\nANSWER: First paragraph.\n\nSecond paragraph.');
assert.equal(practice.question,'Compare two ideas.\n\nKeep this paragraph.');
assert.equal(practice.answer,'First paragraph.\n\nSecond paragraph.');
const example=parseWorkedExample(`QUESTION: Square 5.\nSTEP: ${code}\nANSWER: It returns 25.`,'Computing',false);
assert.equal(example.steps[0],code);
assert.equal(parseWorkedExample('QUESTION: Simplify.\nSTEP: n ** 2 is a power.\nANSWER: n ** 2.','Computing',false).answer,'n ** 2.');
assert.deepEqual(contentSegments('First.\n\nSecond.\n```python\n    price = "$5"\n    result = n ** 2\n```\n$x^2$'),[
 {text:'First.\n\nSecond.\n'}, {code:'    price = "$5"\n    result = n ** 2'}, {text:'\n'}, {math:'x^2'},
]);
assert.deepEqual(contentSegments('$5 and $10',false),[{text:'$5 and $10'}]);
console.log('PASS: paragraph breaks, fenced Python indentation/powers/strings, marking lists and example code survive parsing.');
