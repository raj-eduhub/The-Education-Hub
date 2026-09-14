// Shared by the content endpoint and the offline seeding script so a stored
// example and a freshly generated one always have the same shape.
export function workedExamplePrompt(topic, subtopic, { notation = false } = {}) {
  return [
    `Write one fully worked example for the sub-topic "${subtopic.title}" within the topic "${topic.title}".`,
    "Reply using only the labelled lines below. Do not add a heading, an introduction, or a closing comment.",
    "FORMULA: a formula this sub-topic uses, on its own line for each formula, omitted when none applies",
    "QUESTION: the question the example works through",
    "STEP: one step of the solution, on its own line for each step, in order",
    "ANSWER: the final answer",
    // Maths is typeset in the browser, so its expressions are requested as LaTeX.
    notation
      ? [
          "Write every mathematical expression as LaTeX between single dollar signs.",
          String.raw`For example: $3.45 \times 10^{-3}$, $\frac{a+b}{2}$, $x^2 - 5x + 6 = 0$, $\sqrt{49} = 7$.`,
          "Keep ordinary words outside the dollar signs so each line still reads as a sentence.",
        ].join("\n")
      : "",
  ].filter(Boolean).join("\n");
}

export function parseWorkedExample(text) {
  const example = { formulae: [], question: "", steps: [], answer: "" };
  for (const line of String(text ?? "").split("\n")) {
    const match = line.trim().match(/^[*#\-\s]*(FORMULA|QUESTION|STEP|ANSWER)S?[*\s]*:\s*(.+)$/i);
    if (!match) continue;
    const label = match[1].toUpperCase();
    // Markdown emphasis is stripped, but LaTeX dollar delimiters are preserved.
    const content = match[2].replace(/\*\*/g, "").trim();
    if (!content) continue;
    if (label === "FORMULA") example.formulae.push(content);
    else if (label === "STEP") example.steps.push(content);
    else if (label === "QUESTION" && !example.question) example.question = content;
    else if (label === "ANSWER" && !example.answer) example.answer = content;
  }
  return example.question && example.steps.length ? example : null;
}

export function exampleSystemPrompt(stage, year, examBoard, tier, subject) {
  return [
    "You are a patient UK education tutor for KS3, KS4, and GCSE learners.",
    "Use British English and keep the example age-appropriate.",
    "Show every calculation or reasoning step and include units where they apply.",
    "Stay strictly within the demand of the stated school year. Never use methods from a later key stage or from post-16 study.",
    "Do not reproduce copyrighted exam-paper questions. Write an original example.",
    `Current stage: ${stage}.`,
    `Current school year: Year ${year}. Only use content appropriate to this year group.`,
    `GCSE exam board: ${examBoard ?? "Not applicable"}.`,
    `GCSE tier: ${tier ?? "Not applicable"}.`,
    `Current subject: ${subject}.`,
  ].join("\n");
}
