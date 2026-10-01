import { editorialQuestions } from '../data/editorialQuestions.js';
import { editorialExamples } from '../../../src/data/editorialExamples.js';

export function getEditorialContent(key) {
  const ref = `${key.partitionKey}/${key.rowKey}`;
  const value = editorialQuestions[ref] ?? editorialExamples[ref];
  return value ? structuredClone(value) : null;
}
