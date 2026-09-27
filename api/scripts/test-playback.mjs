// Checks that only one thing can be speaking at a time.
//
// The lesson, the key formulas and the worked example each own their own audio
// element or speech-synthesis run, and none of them could see the others.
// Stopping speech synthesis is global and looked like it covered this, but it
// does nothing to another component's audio element, so once a topic had been
// voiced a learner could start the worked example over a lesson still reading
// and hear both at once.
//
// Pure functions only: no browser, no network, no storage.
//   node api/scripts/test-playback.mjs
import { claimPlayback, playbackHeldBy, releasePlayback, stopPlayback } from "../../src/playback.js";

let failures = 0;
const fail = (label, detail) => { failures += 1; console.log(`FAIL ${label}  ${detail}`); };
const ok = (label, detail = "") => console.log(`OK   ${label}${detail ? `  ${detail}` : ""}`);
const is = (label, actual, expected) => {
  if (actual === expected) ok(label, String(actual));
  else fail(label, `expected ${expected}, got ${actual}`);
};

// Stand-ins for the three players. Each records whether it was told to stop.
function player(name) {
  const self = { name, owner: {}, stopped: 0 };
  self.play = () => claimPlayback(self.owner, () => { self.stopped += 1; });
  self.held = () => playbackHeldBy(self.owner);
  self.release = () => releasePlayback(self.owner);
  return self;
}

// --- starting one stops the other -------------------------------------------
{
  stopPlayback();
  const lesson = player("lesson");
  const example = player("example");

  lesson.play();
  is("the lesson holds the floor once it starts", lesson.held(), true);

  example.play();
  is("starting the worked example stops the lesson", lesson.stopped, 1);
  is("the lesson no longer holds the floor", lesson.held(), false);
  is("the worked example holds it instead", example.held(), true);
  is("the worked example was not stopped by its own start", example.stopped, 0);
}

// --- all three take turns ----------------------------------------------------
{
  stopPlayback();
  const lesson = player("lesson");
  const formulas = player("formulas");
  const example = player("example");

  lesson.play();
  formulas.play();
  example.play();
  is("only the last to start is playing", [lesson.held(), formulas.held(), example.held()].filter(Boolean).length, 1);
  is("the lesson was stopped once", lesson.stopped, 1);
  is("the formulas were stopped once", formulas.stopped, 1);

  lesson.play();
  is("starting the lesson again stops the worked example", example.stopped, 1);
  is("and the lesson is playing", lesson.held(), true);
}

// --- a player re-claiming keeps the floor ------------------------------------
{
  // The lesson re-enters its playback effect when the recorded audio finishes
  // loading. Claiming again must not stop itself, or the lesson would fall
  // silent the moment its narration arrived.
  stopPlayback();
  const lesson = player("lesson");
  lesson.play();
  lesson.play();
  lesson.play();
  is("re-claiming does not stop the player that already holds the floor", lesson.stopped, 0);
  is("and it still holds it", lesson.held(), true);
}

// --- releasing never stops whoever took over ---------------------------------
{
  // The worked example tears itself down whenever its beats change, which
  // happens when a new example loads. If that could stop the current holder, a
  // lesson would be cut off by a component that is not even playing.
  stopPlayback();
  const lesson = player("lesson");
  const example = player("example");

  example.play();
  lesson.play();
  is("the worked example was stopped when the lesson started", example.stopped, 1);

  example.release();
  is("the stopped player releasing does not stop the lesson", lesson.stopped, 0);
  is("the lesson still holds the floor", lesson.held(), true);
}

// --- stopping everything ------------------------------------------------------
{
  stopPlayback();
  const lesson = player("lesson");
  lesson.play();
  stopPlayback();
  is("stopPlayback stops the holder", lesson.stopped, 1);
  is("and nobody holds the floor", lesson.held(), false);

  // Changing topic calls this whether or not anything is playing.
  stopPlayback();
  is("stopping again is harmless", lesson.stopped, 1);
}

// --- a player that finished leaves the floor free ----------------------------
{
  stopPlayback();
  const example = player("example");
  example.play();
  example.release();
  is("a finished player no longer holds the floor", example.held(), false);
  const lesson = player("lesson");
  lesson.play();
  is("and starting the lesson afterwards stops nothing", example.stopped, 0);
}

console.log(failures ? `\n${failures} playback check(s) FAILED` : "\nPASS: one voice at a time");
process.exit(failures ? 1 : 0);
