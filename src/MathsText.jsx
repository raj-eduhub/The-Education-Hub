import React, { useMemo } from "react";
import katex from "katex";

// Worked examples for Maths come back as sentences with LaTeX between single
// dollar signs. Everything outside the delimiters stays ordinary text, so a line
// still reads as a sentence if the model omits the notation entirely.
const segmentPattern = /\$([^$]+)\$/g;

// Content stored before the parser normalised this still carries doubled
// backslashes, which LaTeX reads as a line break: a question rendered as
// "AB = 8" with "textcm" italicised on the next line. Repairing it here fixes
// what is already stored without regenerating any of it.
function normaliseLatex(expression) {
  return expression.replace(/\\{2,}(?=[a-zA-Z{])/g, "\\");
}

function render(expression) {
  try {
    return katex.renderToString(normaliseLatex(expression), { throwOnError: false, displayMode: false, output: "html" });
  } catch {
    return null;
  }
}

// Whether a string carries typesettable maths: a dollar-delimited span holding a
// LaTeX control character. Prices such as "$5 and $10" do not match, so this is
// safe to consult for every subject - and Science, Computing, Geography and
// Design Technology all carry formulae, not just Maths.
const latexPattern = /\$[^$]*[\^_{}][^$]*\$/;

export function hasMaths(text) {
  return latexPattern.test(String(text ?? ""));
}

export function MathsText({ children, enabled = true }) {
  const segments = useMemo(() => {
    const text = String(children ?? "");
    if (!enabled || !text.includes("$")) return [{ text }];
    const parts = [];
    let cursor = 0;
    for (const match of text.matchAll(segmentPattern)) {
      if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) });
      const html = render(match[1]);
      parts.push(html ? { html } : { text: match[0] });
      cursor = match.index + match[0].length;
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor) });
    return parts;
  }, [children, enabled]);

  return segments.map((segment, index) => segment.html
    ? <span className="maths" dangerouslySetInnerHTML={{ __html: segment.html }} key={index} />
    : <React.Fragment key={index}>{segment.text}</React.Fragment>);
}
