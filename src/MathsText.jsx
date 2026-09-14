import React, { useMemo } from "react";
import katex from "katex";

// Worked examples for Maths come back as sentences with LaTeX between single
// dollar signs. Everything outside the delimiters stays ordinary text, so a line
// still reads as a sentence if the model omits the notation entirely.
const segmentPattern = /\$([^$]+)\$/g;

function render(expression) {
  try {
    return katex.renderToString(expression, { throwOnError: false, displayMode: false, output: "html" });
  } catch {
    return null;
  }
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
