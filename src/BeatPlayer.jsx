import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { beatSpeech } from "./lessonBeats.js";
import { loadNarration, playNarration, releaseNarration } from "./narration.js";
import { narrate, speechSupported, stopSpeaking, toSpoken } from "./speech.js";
import { claimPlayback, playbackHeldBy, releasePlayback } from "./playback.js";

// Reads a sequence of beats aloud, one at a time: a worked example, or the
// key formulas on their own.
//
// The beats come from exampleBeats() rather than being assembled here, and the
// text sent to the API is beatSpeech(), because the recorded audio is keyed by
// a digest of exactly that string. Building the sequence any other way asks for
// clips that were never recorded and silently falls back to the device voice.
//
// Audio is fetched on the first press rather than on render: a learner who
// never plays it should not cost a dozen requests per sub-topic they look at.
//
// The caller builds the beats, and must build them with the shared helpers in
// lessonBeats.js for the recorded audio to be found.
export function BeatPlayer({ topic, beats, request, onBeat, onComplete, label }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const urls = useRef([]);
  const player = useRef(null);
  // Identity for the playback registry, stable for the life of the component.
  const owner = useRef({});

  // Tears down this player's own audio. It gives up the floor but never stops
  // anyone else, so it is safe to call from cleanup while another player is
  // the one actually speaking.
  const stop = useCallback(() => {
    player.current?.stop();
    player.current = null;
    // Only silence the device voice when it is this player's. Cancelling speech
    // synthesis is global, and this runs whenever the beats change - which
    // happens when a new worked example loads - so an unguarded call would cut
    // the lesson off mid-sentence.
    if (playbackHeldBy(owner.current)) stopSpeaking();
    releasePlayback(owner.current);
  }, []);

  // Releasing the object URLs matters here: a learner moving through sub-topics
  // would otherwise leave a dozen blobs per example held for the session.
  const release = useCallback(() => {
    releaseNarration(urls.current);
    urls.current = [];
  }, []);

  useEffect(() => {
    stop();
    release();
    setPlaying(false);
    onBeat?.(null);
  }, [beats, onBeat, release, stop]);

  useEffect(() => () => { stop(); release(); }, [release, stop]);

  const start = useCallback(async () => {
    if (!beats.length) return;
    const texts = beats.map((beat) => beatSpeech(beat, toSpoken));

    // Take the floor before the audio is fetched, so a learner pressing play on
    // the lesson while this one is still loading is not talked over when it
    // arrives.
    claimPlayback(owner.current, () => {
      player.current?.stop();
      player.current = null;
      stopSpeaking();
      setPlaying(false);
      onBeat?.(null);
    });

    if (!urls.current.length && request) {
      setLoading(true);
      const result = await loadNarration(request, topic.id, texts);
      setLoading(false);
      if (result.complete) urls.current = result.urls;
    }

    // Fetching the audio takes long enough for a learner to have started the
    // lesson in the meantime. If they did, the floor is theirs and this must
    // not begin: without the check the clips would arrive and play over it.
    if (!playbackHeldBy(owner.current)) return;

    // Both players also report the end when they give up early (a refused
    // autoplay), so reaching the last beat is what separates heard-it-all.
    let reached = -1;
    const report = (index) => {
      reached = Math.max(reached, index);
      onBeat?.(beats[index] ?? null);
    };
    const finish = () => {
      setPlaying(false);
      onBeat?.(null);
      releasePlayback(owner.current);
      if (reached === beats.length - 1) onComplete?.();
    };

    if (urls.current.length) {
      player.current = playNarration(urls.current, { onBeat: report, onEnd: finish });
    } else if (speechSupported()) {
      // Not every example is voiced - some slots are still unseeded - so the
      // device voice is the fallback rather than the button doing nothing.
      // narrate() takes the spoken strings, not the beats, and reports the same
      // position back, so the highlight works either way round.
      player.current = narrate(texts, { onBeat: report, onEnd: finish });
    } else {
      finish();
      return;
    }
    setPlaying(true);
  }, [beats, onBeat, onComplete, request, topic.id]);

  if (!beats.length) return null;
  if (!request && !speechSupported()) return null;

  return (
    // Same ask-tutor face as "Play this as a lesson": it is the same offer,
    // made about a smaller piece of content, so it should not look like a
    // different kind of control.
    <button
      className="ask-tutor example-play"
      onClick={() => {
        if (playing) {
          stop();
          setPlaying(false);
          onBeat?.(null);
          return;
        }
        start();
      }}
      type="button"
    >
      {playing
        ? <><Pause size={15} /> Pause</>
        : <>{loading ? <Volume2 size={15} /> : <Play size={15} />} {loading ? "Loading audio..." : label}</>}
    </button>
  );
}
