// Reading a lesson aloud.
//
// Uses the browser's own speech synthesis: no Azure resource, no key, no
// per-character cost, and it works offline. The trade-off is that the voice is
// whatever the device provides, so an en-GB voice is preferred where one exists.
//
// The hard part is not the speaking, it is the maths. The authored explanations
// carry LaTeX between dollar signs, and read literally that becomes "dollar a
// backslash times ten caret open brace n close brace dollar". Everything inside
// the delimiters is turned into words first.

const supported = typeof window !== "undefined" && "speechSynthesis" in window;

export function speechSupported() {
  return supported;
}

const ordinalPowers = { 2: "squared", 3: "cubed" };

// LaTeX to words. Ordered: the structural forms are unwrapped before the
// symbols, so the contents of a fraction or a root are themselves converted.
function spokenMaths(expression) {
  let text = expression;
  // Escaped punctuation first: these carry no braces and would otherwise survive
  // to the end and be read as "backslash".
  text = text.replace(/\\%/g, " percent ");
  text = text.replace(/\^\{?\\circ\}?/g, " degrees ");

  text = text.replace(/\\(?:d)?frac\{([^{}]*)\}\{([^{}]*)\}/g, " $1 over $2 ");
  text = text.replace(/\\sqrt\[([^\]]*)\]\{([^{}]*)\}/g, " the $1 root of $2 ");
  text = text.replace(/\\sqrt\{([^{}]*)\}/g, " the square root of $1 ");
  text = text.replace(/\\overrightarrow\{([^{}]*)\}/g, " vector $1 ");
  text = text.replace(/\\bar\{([^{}]*)\}/g, " $1 bar ");

  // Indices before the unit commands, because a unit such as \mathrm{CO_{2}}
  // nests braces and the command would not match while they are still there.
  text = text.replace(/\^\{?(-?\d+)\}?/g, (match, power) => (
    ordinalPowers[power] ? ` ${ordinalPowers[power]} ` : ` to the power ${power} `
  ));
  text = text.replace(/\^\{([^{}]*)\}/g, " to the power $1 ");
  text = text.replace(/\^(\w)/g, " to the power $1 ");
  text = text.replace(/_\{([^{}]*)\}/g, " $1 ");
  text = text.replace(/_(\w)/g, " $1 ");

  text = text.replace(/\\(?:text|mathrm|mathbf|operatorname)\{([^{}]*)\}/g, " $1 ");

  const words = [
    [/\\times/g, " times "], [/\\div/g, " divided by "], [/\\cdot/g, " times "],
    [/\\pm/g, " plus or minus "], [/\\leq?\b/g, " is less than or equal to "],
    [/\\geq?\b/g, " is greater than or equal to "], [/\\neq/g, " does not equal "],
    [/\\approx/g, " is approximately "], [/\\propto/g, " is proportional to "],
    [/\\rightarrow|\\to\b/g, " gives "], [/\\sim\b/g, " is similar to "],
    [/\\pi\b/g, " pi "], [/\\theta\b/g, " theta "], [/\\alpha\b/g, " alpha "],
    [/\\beta\b/g, " beta "], [/\\sigma\b/g, " sigma "], [/\\rho\b/g, " rho "],
    [/\\mu\b/g, " mu "], [/\\lambda\b/g, " lambda "], [/\\Delta\b/g, " delta "],
    [/\\angle/g, " angle "], [/\\infty/g, " infinity "],
    [/\\cap/g, " intersect "], [/\\cup/g, " union "], [/\\mid/g, " given "],
    [/\\circ/g, " degrees "], [/\\ldots|\\dots/g, " and so on "],
    [/\\left|\\right|\\!|\\;|\\:|\\,/g, " "],
    [/=/g, " equals "], [/</g, " is less than "], [/>/g, " is greater than "],
    [/\+/g, " plus "],
  ];
  for (const [pattern, replacement] of words) text = text.replace(pattern, replacement);
  // Anything still carrying a backslash is an unknown command; drop the marker
  // rather than reading it out.
  text = text.replace(/\\([a-zA-Z]+)/g, " $1 ");
  return text.replace(/[{}]/g, " ");
}

// Turns a mixed string of prose and LaTeX into something worth listening to.
export function toSpoken(text) {
  return String(text ?? "")
    .replace(/\$([^$]+)\$/g, (match, expression) => spokenMaths(expression))
    .replace(/\s{2,}/g, " ")
    .trim();
}

function preferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // A UK curriculum read in a UK voice where the device has one.
  return voices.find((voice) => voice.lang === "en-GB")
    ?? voices.find((voice) => voice.lang?.startsWith("en"))
    ?? null;
}

export function stopSpeaking() {
  if (supported) window.speechSynthesis.cancel();
}

// Speaks the parts in order. Long text is split into sentences, because some
// browsers silently truncate a single very long utterance.
export function speak(parts, { onEnd } = {}) {
  if (!supported) return false;
  window.speechSynthesis.cancel();
  const text = parts.filter(Boolean).map(toSpoken).join(". ");
  if (!text) return false;

  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  const voice = preferredVoice();
  sentences.forEach((sentence, index) => {
    const utterance = new SpeechSynthesisUtterance(sentence.trim());
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "en-GB";
    // A shade under normal: this is an explanation, not an announcement.
    utterance.rate = 0.95;
    utterance.pitch = 1;
    if (index === sentences.length - 1 && onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  });
  return true;
}
