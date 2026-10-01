import React, { useMemo } from "react";
import katex from "katex";
import { contentSegments } from './contentSegments.js';

// Worked examples for Maths come back as sentences with LaTeX between single
// dollar signs. Everything outside the delimiters stays ordinary text, so a line
// still reads as a sentence if the model omits the notation entirely.

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
// Design & Technology all carry formulae, not just Maths.
const latexPattern = /\$[^$]*[\^_{}][^$]*\$/;

export function hasMaths(text) {
  return latexPattern.test(String(text ?? ""));
}

export function MathsText({ children, enabled = true }) {
  const segments = useMemo(() => {
    return contentSegments(children,enabled).map(segment => {
      if(segment.math === undefined)return segment;
      const html=render(segment.math);
      return html?{html}:{text:`$${segment.math}$`};
    });
  }, [children, enabled]);

  return segments.map((segment, index) => segment.code !== undefined
    ? <code className="content-code" key={index}>{segment.code}</code>
    : segment.html
      ? <span className="maths" dangerouslySetInnerHTML={{ __html: segment.html }} key={index} />
      : <span className="content-prose" key={index}>{segment.text}</span>);
}
