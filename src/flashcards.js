// Flash cards for a sub-topic, built from its authored lesson.
//
// Cards are taken from the reviewed key ideas and key formulas the lesson
// already shows, not written by the model: every sub-topic has a deck at once,
// it costs nothing to serve, and a card can never say something the lesson
// does not. The front is a cue to recall from, the back the authored line.
//
// Pure functions only, shared by the app and the website demo builder.

// A delimiter left open at the cut has to be closed on the front, or the cue
// renders a stray "$" or swallows the rest of the line as code.
function openDelimiter(text) {
  let open = null;
  for (const char of text) {
    if (open === null && (char === "$" || char === "`")) open = char;
    else if (char === open) open = null;
  }
  return open;
}

// The opening words of a key idea, with the rest to be recalled. About a third
// of the line, at least one word and at most five, and never cut inside maths
// or code. Short lines keep only their first word, or the cue is the answer.
export function ideaCue(idea) {
  const words = String(idea ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return null;
  const want = Math.min(5, Math.max(1, Math.round(words.length / 3)));
  for (let count = want; count >= 1; count -= 1) {
    const cue = words.slice(0, count).join(" ");
    if (openDelimiter(cue) === null) return `${cue.replace(/[,;:]$/, "")} …`;
  }
  return null;
}

// What a formula gives, with what it equals to be recalled: "speed = ?". The
// first "=" that is not part of "==", "<=", ">=" or "!=" is the split.
export function formulaCue(formula) {
  const text = String(formula ?? "").trim();
  const at = [...text].findIndex((char, index, chars) =>
    char === "=" && !"=<>!".includes(chars[index - 1] ?? "") && chars[index + 1] !== "=");
  if (at <= 0) return null;
  let left = [...text].slice(0, at).join("").trimEnd();
  let open = openDelimiter(left);
  // "Gradient $= \frac{...}$" opens its maths at the "=", so nothing is left
  // inside it on the front.
  if (open && left.endsWith(open)) {
    left = left.slice(0, -1).trimEnd();
    open = null;
  }
  if (!/[\p{L}\p{N}]/u.test(left.replace(/\\[a-zA-Z]+/g, "x"))) return null;
  return `${left} = ?${open ?? ""}`;
}

export function flashcardsFor(lesson, subtopicTitle) {
  const ideas = (lesson?.keyIdeas ?? []).filter((idea) => typeof idea === "string" && idea.trim());
  const formulae = (lesson?.formulae ?? []).filter((formula) => typeof formula === "string" && formula.trim());
  const cards = [
    ...ideas.map((idea, index) => ({
      id: `idea-${index}`,
      kind: "idea",
      label: `Key idea ${index + 1} of ${ideas.length}`,
      prompt: subtopicTitle ? `Finish the key idea from "${subtopicTitle}".` : "Finish the key idea.",
      cue: ideaCue(idea),
      answer: idea.trim(),
    })),
    ...formulae.map((formula, index) => ({
      id: `formula-${index}`,
      kind: "formula",
      label: `Key formula ${index + 1} of ${formulae.length}`,
      prompt: "Complete the formula.",
      cue: formulaCue(formula),
      answer: formula.trim(),
    })),
  ];
  // A line too short to cue from is still worth a card: recall it whole.
  return cards.map((card) => card.cue ? card : {
    ...card,
    prompt: card.kind === "formula" ? "Write down the key formula." : "State the key idea.",
  });
}
