import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { hasMaths, MathsText } from "./MathsText.jsx";
import { currentVoice, listVoices, narrate, setVoice, speechSupported, stopSpeaking, toSpoken } from "./speech.js";
import { beatSpeech, lessonBeats } from "./lessonBeats.js";
import { loadNarration, playNarration, releaseNarration } from "./narration.js";
import { claimPlayback, releasePlayback } from "./playback.js";
import { visualsFor } from "./lessonVisuals/index.js";

// A narrated lesson, built from the authored content rather than from a video
// file.
//
// This is what a video would give a learner - pacing, a voice, and one idea on
// screen at a time - without any of what a video costs. Nothing is rendered
// ahead of time, nothing is stored, nothing is streamed, and correcting a
// sentence in the authored content changes the lesson on the next load rather
// than requiring 210 topics to be re-rendered.
//
// The timeline is driven by the narration itself: each beat is one utterance,
// and the stage moves when the voice reaches it. There is no timing file to
// drift out of step with the words.

// Reading speed for the silent fallback, in words per minute. Deliberately
// slower than speech, because a learner reading a formula is not reading prose.
const silentWordsPerMinute = 130;

function beatsFor(topic, content) {
  // The sequence itself is shared with the synthesis script, so the audio that
  // was recorded matches the beats that get asked for. Only the drawings are
  // attached here, because they cannot live in a module Node has to import.
  const drawings = new Map(visualsFor(topic.id).map((visual) => [visual.id, visual.render]));
  return lessonBeats(topic, content).map((beat) => (
    beat.kind === "visual" ? { ...beat, render: drawings.get(beat.id) } : beat
  ));
}

const estimatedMs = (text) =>
  Math.max(2200, (String(text).split(/\s+/).length / silentWordsPerMinute) * 60000);

export function LessonPlayer({ topic, content, onFinish, request }) {
  const beats = useMemo(() => beatsFor(topic, content), [topic, content]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(!speechSupported());
  const handle = useRef(null);
  const timer = useRef(null);
  const stageRef = useRef(null);
  // Identity for the playback registry, stable for the life of the component.
  const owner = useRef({});

  const canSpeak = speechSupported();
  const beat = beats[index] ?? beats[0];

  // The recorded narration for this topic, if it has been voiced. Held in a ref
  // as well as state because the cleanup has to revoke the object URLs, and the
  // cleanup must not re-run every time the beat changes.
  const [recorded, setRecorded] = useState({ status: "loading", urls: [] });
  const recordedUrls = useRef([]);

  useEffect(() => {
    let current = true;
    setRecorded({ status: "loading", urls: [] });
    if (!request) {
      setRecorded({ status: "absent", urls: [] });
      return undefined;
    }
    // One text per beat, in order: loadNarration returns urls[i] for beats[i],
    // so dropping an entry here would play every later clip against the wrong
    // beat rather than simply missing one.
    const texts = beats.map((entry) => beatSpeech(entry, toSpoken));
    loadNarration(request, topic.id, texts).then((result) => {
      if (!current) {
        releaseNarration(result.urls);
        return;
      }
      recordedUrls.current = result.urls;
      setRecorded({ status: result.complete ? "ready" : "absent", urls: result.urls });
    });
    return () => {
      current = false;
      releaseNarration(recordedUrls.current);
      recordedUrls.current = [];
    };
  }, [beats, request, topic.id]);

  // Voices load asynchronously, so the list is read after mount rather than
  // during render, and again when the browser reports more have arrived.
  const [voices, setVoices] = useState([]);
  const [voiceUri, setVoiceUri] = useState("");
  useEffect(() => {
    if (!canSpeak) return undefined;
    const refresh = () => {
      setVoices(listVoices());
      setVoiceUri(currentVoice()?.uri ?? "");
    };
    refresh();
    window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
  }, [canSpeak]);

  // Stops this lesson's own playback and gives up the floor. It never stops
  // another player, so calling it from cleanup while the worked example is
  // speaking leaves that alone.
  const halt = useCallback(() => {
    handle.current?.stop();
    handle.current = null;
    clearTimeout(timer.current);
    timer.current = null;
    releasePlayback(owner.current);
  }, []);

  // Everything stops when the topic changes or the player unmounts: a lesson
  // still talking after the learner has moved on is the worst version of this.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
    halt();
    stopSpeaking();
  }, [topic.id, halt]);

  useEffect(() => () => { halt(); stopSpeaking(); }, [halt]);

  // One effect owns playback. It restarts whenever the learner plays, pauses,
  // mutes, or jumps, and each run is responsible for cleaning up after itself.
  useEffect(() => {
    halt();
    if (!playing) return undefined;
    // Only one voice at a time. Stopping speech synthesis covers the fallback
    // path, but not a recorded clip playing in another component's audio
    // element, which is the case that happens once a topic has been voiced.
    // Claiming the floor stops the key formulas or the worked example if either
    // is speaking, and puts its button back to Play.
    stopSpeaking();
    claimPlayback(owner.current, () => {
      handle.current?.stop();
      handle.current = null;
      clearTimeout(timer.current);
      timer.current = null;
      setPlaying(false);
    });

    if (muted || (!canSpeak && recorded.status !== "ready")) {
      // Silent mode still has to advance, or "play" does nothing for a learner
      // who cannot use sound.
      const step = (position) => {
        timer.current = setTimeout(() => {
          if (position + 1 >= beats.length) {
            setPlaying(false);
            onFinish?.();
            return;
          }
          setIndex(position + 1);
          step(position + 1);
        }, estimatedMs(beats[position].text));
      };
      step(index);
      return () => halt();
    }

    const finish = () => {
      setPlaying(false);
      releasePlayback(owner.current);
      onFinish?.();
    };

    // The recorded voice where the topic has been voiced, the device's own
    // where it has not. Never a mixture: switching voice partway through a
    // lesson sounds worse than either voice on its own.
    if (recorded.status === "ready") {
      handle.current = playNarration(recorded.urls, {
        from: index,
        onBeat: (position) => setIndex(position),
        onEnd: finish,
      });
      return () => halt();
    }

    // Still checking. Waiting is better than starting in the wrong voice and
    // swapping a moment later; the effect re-runs when the answer arrives.
    if (recorded.status === "loading") return undefined;

    handle.current = narrate(beats.map((entry) => beatSpeech(entry, toSpoken)), {
      from: index,
      onBeat: (position) => setIndex(position),
      onEnd: finish,
    });
    return () => halt();
    // `index` is intentionally absent: including it would restart the narration
    // on every beat it reports. Jumping is handled by goTo, which restarts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, muted, canSpeak, beats, halt, onFinish, recorded]);

  const goTo = useCallback((next) => {
    const position = Math.max(0, Math.min(next, beats.length - 1));
    halt();
    setIndex(position);
    if (playing) {
      // Re-enter playback at the new beat. Toggling through false forces the
      // playback effect to run again rather than seeing an unchanged value.
      setPlaying(false);
      requestAnimationFrame(() => setPlaying(true));
    }
  }, [beats.length, halt, playing]);

  // Keep the spoken beat in view without yanking the page around.
  useEffect(() => {
    const active = stageRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [index]);

  const voiceName = voices.find((entry) => entry.uri === voiceUri)?.name ?? "";
  const typeset = (text) => hasMaths(text);
  const ideas = content.keyIdeas ?? [];
  const formulae = content.formulae ?? [];
  const reached = (kind, position) =>
    beats.findIndex((entry) => entry.kind === kind && entry.position === position) <= index;

  return <section className="lesson-player">
    <header className="player-heading">
      <div>
        <p className="eyebrow">Narrated lesson</p>
        <h4>{topic.title}</h4>
      </div>
      <span className="player-count">{index + 1} / {beats.length}</span>
    </header>

    <div className="player-progress" role="progressbar"
      aria-valuemin={1} aria-valuemax={beats.length} aria-valuenow={index + 1}
      aria-label="Lesson progress">
      <span style={{ width: `${((index + 1) / beats.length) * 100}%` }} />
    </div>

    <div className="player-stage" ref={stageRef}>
      {beat.kind === "title" && <div className="stage-title" data-active="true">
        <h3><MathsText enabled={typeset(beat.text)}>{beat.text}</MathsText></h3>
        <p>{beat.aside}</p>
      </div>}

      {beat.kind === "prose" && <p className="stage-prose" data-active="true">
        <MathsText enabled={typeset(beat.text)}>{beat.text}</MathsText>
      </p>}

      {beat.kind === "idea" && <div className="stage-ideas">
        <p className="stage-label">Key ideas</p>
        <ul>
          {ideas.map((idea, position) => {
            const shown = reached("idea", position);
            const active = beat.position === position;
            return <li aria-hidden={!shown} className={active ? "active" : ""}
              data-active={active ? "true" : undefined} data-shown={shown} key={idea}>
              <MathsText enabled={typeset(idea)}>{idea}</MathsText>
            </li>;
          })}
        </ul>
      </div>}

      {beat.kind === "formula" && <div className="stage-formulae">
        <p className="stage-label">Key formulas</p>
        {formulae.map((formula, position) => {
          const shown = reached("formula", position);
          const active = beat.position === position;
          return <code aria-hidden={!shown} className={`${active ? "active" : ""} ${typeset(formula) ? "typeset" : ""}`}
            data-active={active ? "true" : undefined} data-shown={shown} key={formula}>
            <MathsText enabled={typeset(formula)}>{formula}</MathsText>
          </code>;
        })}
      </div>}

      {beat.kind === "visual" && <div className="stage-visual" data-active="true">
        {beat.render()}
      </div>}

      {beat.kind === "end" && <div className="stage-end" data-active="true">
        <p>{beat.text}</p>
        <p className="stage-label">Replay it, or start a practice question below.</p>
      </div>}
    </div>

    <div className="player-controls">
      <button aria-label="Previous step" disabled={index === 0} onClick={() => goTo(index - 1)} type="button">
        <ChevronLeft size={17} />
      </button>
      <button className="player-play" onClick={() => setPlaying((value) => !value)} type="button">
        {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> {index === 0 ? "Play lesson" : "Resume"}</>}
      </button>
      <button aria-label="Next step" disabled={index >= beats.length - 1} onClick={() => goTo(index + 1)} type="button">
        <ChevronRight size={17} />
      </button>
      <button aria-label="Start again" onClick={() => goTo(0)} type="button">
        <RotateCcw size={15} />
      </button>
      {canSpeak && <button aria-label={muted ? "Turn the voice on" : "Turn the voice off"}
        className={muted ? "muted" : ""} onClick={() => setMuted((value) => !value)} type="button">
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>}
    </div>

    {recorded.status !== "ready" && canSpeak && voices.length > 1 && <label className="player-voice">
      Voice
      <select onChange={(event) => {
        setVoice(event.target.value);
        setVoiceUri(event.target.value);
        // Restart on the new voice rather than changing it mid-sentence.
        if (playing) { setPlaying(false); requestAnimationFrame(() => setPlaying(true)); }
      }} value={voiceUri}>
        {voices.map((voice) => <option key={voice.uri} value={voice.uri}>{voice.name}</option>)}
      </select>
    </label>}

    {/* Always state where the voice is coming from. Without this a learner
        hearing the wrong voice has no way to tell whether the topic is
        unrecorded, the browser is substituting its own, or something failed. */}
    <p className="player-note">
      {recorded.status === "loading" && "Checking for the recorded voice..."}
      {recorded.status === "ready" && "Recorded voice."}
      {recorded.status === "absent" && (canSpeak
        ? `This topic has not been recorded yet, so it is read by this browser${voiceName ? ` (${voiceName})` : ""}.`
        : "This topic has not been recorded and this browser has no speech voice, so the lesson advances at reading pace instead.")}
    </p>
  </section>;
}
