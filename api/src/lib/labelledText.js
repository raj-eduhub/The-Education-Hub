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

  for (const rawLine of String(text ?? "").split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(pattern);
    if (match) {
      current = match[1].toUpperCase();
      const inline = clean(match[2]);
      if (inline) sections.get(current).push(inline);
      continue;
    }
    // A line with no label belongs to the section above it, if there is one.
    if (current) {
      const value = clean(line);
      if (value) sections.get(current).push(value);
    }
  }
  return sections;
}

function clean(value) {
  return String(value).replace(bullet, "").replace(/\*\*/g, "").trim();
}

// Single-valued fields can still arrive across several lines in block form, so
// they are joined rather than truncated to the first line.
export function single(sections, label) {
  const values = sections.get(label) ?? [];
  return values.join(" ").trim();
}

export function many(sections, label) {
  return sections.get(label) ?? [];
}
