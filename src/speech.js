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

  // One level of nesting is allowed inside an argument. Almost every fraction
  // in the authored content is \frac{\text{mass}}{\text{volume}} or has a
  // subscript such as M_{r}, and a flat [^{}]* argument matched none of them,
  // so 38 topics were narrated as "frac mass volume".
  const arg = "((?:[^{}]|\\{[^{}]*\\})*)";
  text = text.replace(new RegExp(`\\\\(?:d)?frac\\{${arg}\\}\\{${arg}\\}`, "g"), " $1 over $2 ");
  text = text.replace(new RegExp(`\\\\sqrt\\[3\\]\\{${arg}\\}`, "g"), " the cube root of $1 ");
  text = text.replace(new RegExp(`\\\\sqrt\\[([^\\]]*)\\]\\{${arg}\\}`, "g"), " the $1 root of $2 ");
  text = text.replace(new RegExp(`\\\\sqrt\\{${arg}\\}`, "g"), " the square root of $1 ");
  text = text.replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, " column vector $1, $2 ");
  text = text.replace(/\\overrightarrow\{([^{}]*)\}/g, " vector $1 ");
  // Read before the general index rule, which would otherwise take the digit
  // of Cu^{2+} as a power ("Cu squared plus") and f^{-1} as a reciprocal.
  text = text.replace(/\^\{(\d*)([+-])\}/g, (match, charge, sign) => ` ${charge} ${sign === "+" ? "plus" : "minus"} `);
  text = text.replace(/\b(f|g|h|sin|cos|tan)\^\{-1\}/g, " $1 inverse ");
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
    // Operators last, and only inside the delimiters: a hyphen in ordinary
    // prose is a hyphen, but between maths terms it is a minus sign. Read
    // literally, "the largest value of $a - b$" lost the operator entirely.
    [/\+/g, " plus "], [/-/g, " minus "],
  ];
  for (const [pattern, replacement] of words) text = text.replace(pattern, replacement);
  // Anything still carrying a backslash is an unknown command; drop the marker
  // rather than reading it out.
  text = text.replace(/\\([a-zA-Z]+)/g, " $1 ");
  // A backslash not followed by a letter is a spacing command such as "\ " in
  // "\rightarrow\ ", or an escape nothing above claimed. The letter-based rule
  // cannot match those, so the marker survived and the decay equations were
  // read with a stray backslash in the middle.
  text = text.replace(/\\(?![a-zA-Z])/g, " ");
  return text.replace(/[{}]/g, " ");
}

// Turns a mixed string of prose and LaTeX into something worth listening to.
export function toSpoken(text) {
  return String(text ?? "")
    .replace(/\$([^$]+)\$/g, (match, expression) => spokenMaths(expression))
    // Pseudocode. Assignment is read the way it is taught, and an identifier
    // such as RANDOM_INT is read as its words rather than "underscore".
    .replace(/\s*←\s*/g, " becomes ")
    .replace(/([A-Za-z0-9])_(?=[A-Za-z0-9])/g, "$1 ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Voices arrive asynchronously. getVoices() returns an empty list on the first
// call in Chrome and Edge and only fills in when voiceschanged fires, so asking
// once at speaking time returned nothing and the lesson was read in whatever
// the browser defaults to - usually the oldest voice installed.
let voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices() ?? [];
}
if (supported) {
  loadVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
}

// A learner's own choice always wins, remembered across sessions.
const voiceChoiceKey = "educationHub.voice";
let chosenVoiceUri = null;
try { chosenVoiceUri = window.localStorage?.getItem(voiceChoiceKey) ?? null; } catch { chosenVoiceUri = null; }

// Voice quality varies enormously and the list is not ordered by it. Windows
// ships both the modern neural voices and the 2010-era formant ones, and the
// old ones sort first: taking the first en-GB match meant every lesson was read
// by Hazel, which is what "robotic" sounds like. Rank instead of taking [0].
function rank(voice) {
  const name = (voice.name ?? "").toLowerCase();
  let score = 0;
  // A UK curriculum in a UK voice where the device has one.
  if (voice.lang === "en-GB") score += 100;
  else if (voice.lang?.startsWith("en")) score += 40;
  else return -1000;
  // Neural voices announce themselves. "Online" is how Edge labels the cloud
  // ones, which are the best available in a browser without a paid key.
  if (/natural|neural/.test(name)) score += 60;
  if (/online/.test(name)) score += 35;
  if (voice.localService === false) score += 20;
  if (/google/.test(name)) score += 25;
  // The legacy Microsoft and Apple formant voices, by name, because nothing in
  // the API distinguishes them.
  if (/hazel|george|susan|zira|david|mark|daniel|fiona|moira|tessa|karen/.test(name)) score -= 50;
  return score;
}

export function listVoices() {
  return [...voices]
    .filter((voice) => rank(voice) > -1000)
    .sort((a, b) => rank(b) - rank(a))
    .map((voice) => ({ uri: voice.voiceURI, name: voice.name, lang: voice.lang }));
}

export function setVoice(uri) {
  chosenVoiceUri = uri || null;
  try {
    if (uri) window.localStorage?.setItem(voiceChoiceKey, uri);
    else window.localStorage?.removeItem(voiceChoiceKey);
  } catch {
    // A browser refusing storage is not a reason to refuse the choice.
  }
}

function preferredVoice() {
  if (!voices.length) loadVoices();
  if (!voices.length) return null;
  const chosen = chosenVoiceUri && voices.find((voice) => voice.voiceURI === chosenVoiceUri);
  if (chosen) return chosen;
  const best = [...voices].sort((a, b) => rank(b) - rank(a))[0];
  return best && rank(best) > -1000 ? best : null;
}

export function currentVoice() {
  const voice = preferredVoice();
  return voice ? { uri: voice.voiceURI, name: voice.name, lang: voice.lang } : null;
}

export function stopSpeaking() {
  if (supported) window.speechSynthesis.cancel();
}

// Splits prose into sentences without breaking on decimals or on a full stop
// inside maths. A naive split on "." cuts "4.55 cm" in half, and the authored
// content is full of measurements: the break has to be punctuation followed by
// whitespace and then something that can start a sentence.
export function splitSentences(text) {
  return String(text ?? "")
    .split(/(?<=[.!?])\s+(?=[A-Z$“"(])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

// Narrates a list of beats, reporting which one is being spoken so a caller can
// move the lesson with the voice.
//
// The beats are chained rather than queued all at once: a long queue stalls in
// some browsers, and cancelling one to jump elsewhere is unreliable. Speaking
// the next beat from the previous one's onend keeps at most one utterance live,
// which also makes pausing and skipping exact.
export function narrate(beats, { onBeat, onEnd, from = 0, rate = 0.95 } = {}) {
  if (!supported || !beats?.length) return null;
  window.speechSynthesis.cancel();
  const voice = preferredVoice();
  let index = Math.max(0, Math.min(from, beats.length - 1));
  let stopped = false;
  let retrying = false;

  function speakBeat() {
    if (stopped) return;
    if (index >= beats.length) {
      onEnd?.();
      return;
    }
    const position = index;
    const words = toSpoken(beats[position]);
    // A beat with nothing sayable (a bare formula that reduced to symbols) must
    // still advance, or the lesson stops on it.
    if (!words) {
      index = position + 1;
      speakBeat();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(words);
    // The best voices are cloud-backed, so they can fail where a local one
    // would not. A failed beat is retried once on the device's default voice
    // before moving on: skipping it would silently drop a step of the lesson.
    if (voice && !retrying) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "en-GB";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onstart = () => { if (!stopped) onBeat?.(position); };
    // cancel() fires onend on the live utterance, so the stopped flag is what
    // separates "finished speaking" from "was interrupted".
    utterance.onend = () => {
      if (stopped) return;
      retrying = false;
      index = position + 1;
      speakBeat();
    };
    utterance.onerror = (event) => {
      if (stopped || event.error === "canceled" || event.error === "interrupted") return;
      if (!retrying) {
        retrying = true;
        speakBeat();
        return;
      }
      retrying = false;
      index = position + 1;
      speakBeat();
    };
    window.speechSynthesis.speak(utterance);
  }

  speakBeat();
  return {
    stop() {
      stopped = true;
      window.speechSynthesis.cancel();
    },
  };
}

// Speaks the parts in order. Long text is split into sentences, because some
// browsers silently truncate a single very long utterance.
export function speak(parts, { onEnd } = {}) {
  if (!supported) return false;
  window.speechSynthesis.cancel();
  const text = parts.filter(Boolean).map(toSpoken).join(". ");
  if (!text) return false;

  // Split on sentence ends only, so a measurement such as "4.55 cm" is not read
  // as two fragments with a pause in the middle of the number.
  const sentences = splitSentences(text);
  if (!sentences.length) sentences.push(text);
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
