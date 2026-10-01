// Parses the labelled-line format the model is asked to reply in.
//
// The model uses two shapes interchangeably, and only ever agreed to one of
// them. Inline:
//
//   ANSWER: $t = 8$
//
// and block, where the label stands alone and its content follows:
//
//   MARKSCHEME:
//   $t = k/A$
//   $k = 72$
//
// Accepting only the inline shape discarded roughly a quarter of generated exam
// questions and silently dropped the mark scheme from most of the rest, so both
// are handled here.
const bullet = /^\s*(?:[-*•]|\d{1,2}[.)])\s+/;

export function parseLabelledSections(text, labels) {
  const pattern = new RegExp(`^[*#\\-\\s]*(${labels.join("|")})S?[*\\s]*:\\s*(.*)$`, "i");
  const sections = new Map(labels.map((label) => [label, []]));
  let current = null;
  let fence = null;
  const listLabels = new Set(['FORMULA', 'STEP', 'WORKING', 'MARKSCHEME']);
  function append(value) {
    const values = sections.get(current);
    if (/^\s*(```|~~~)/.test(value)) {
      values.push(value.trim());
      fence = { marker: value.trim().slice(0, 3), index: values.length - 1 };
    } else {
      values.push(clean(value, listLabels.has(current)));
    }
  }

  for (const rawLine of String(text ?? "").split("\n")) {
    const line = rawLine.trim();
    if (fence) {
      const values = sections.get(current);
      // Code is data: preserve indentation, powers, strings and backslashes.
      values[fence.index] += '\n' + rawLine.replace(/\r$/, '');
      if (line.startsWith(fence.marker)) fence = null;
      continue;
    }
    if (!line) { if (current) sections.get(current).push(''); continue; }
    const match = line.match(pattern);
    if (match) {
      current = match[1].toUpperCase();
      if (match[2]) append(match[2]);
      continue;
    }
    // A line with no label belongs to the section above it, if there is one.
    if (current) {
      append(rawLine.replace(/\r$/, ''));
    }
  }
  return sections;
}

function clean(value, stripBullet = false) {
  const text = stripBullet ? String(value).replace(bullet, '') : String(value);
  return normaliseLatex(text.replace(/\*\*([^*\n]+)\*\*/g, '$1').trimEnd());
}

// The model frequently doubles its backslashes, so a command arrives as
// \\text{ cm} where \text{ cm} was meant. A doubled backslash is a line break
// in LaTeX, so the typesetter broke the line and rendered the command name as
// italic variables: a question reading "AB = 8" with "textcm" on the line below.
// Inline maths at this level never wants a line break, so the doubling is undone.
export function normaliseLatex(text) {
  return String(text ?? "").replace(/\\{2,}(?=[a-zA-Z{])/g, "\\");
}

// Single-valued fields can still arrive across several lines in block form, so
// they are joined rather than truncated to the first line.
export function single(sections, label) {
  const values = sections.get(label) ?? [];
  return values.join("\n").trim();
}

export function many(sections, label) {
  return (sections.get(label) ?? []).filter(value => value.trim());
}
