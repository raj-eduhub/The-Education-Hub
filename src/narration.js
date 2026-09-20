// Playback of pre-recorded narration.
//
// The browser's own speech synthesis is the fallback, not the plan: the voice a
// learner gets depends on what their device happens to have installed, so the
// same lesson sounds professional on one machine and robotic on another. This
// plays one neural voice, recorded once, for everybody.
//
// Audio is fetched through the API rather than straight from storage, because
// it reads the paid explanations aloud and belongs behind the same access check
// as the lesson. A beat that has not been recorded yet simply comes back 404.

// Enough to keep the network busy without opening a socket per beat.
const concurrency = 4;

async function fetchBeat(request, topicId, text) {
  try {
    const response = await request("/api/narration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, text }),
    });
    if (!response.ok) return null;
    return URL.createObjectURL(await response.blob());
  } catch {
    return null;
  }
}

// Fetches every beat of a topic, or reports that the topic is not fully voiced.
//
// All or nothing on purpose: a lesson that switched between a neural voice and
// the device's own halfway through would sound worse than either alone, so a
// single missing beat sends the whole topic to the fallback.
export async function loadNarration(request, topicId, texts) {
  const urls = new Array(texts.length).fill(null);
  let cursor = 0;

  const worker = async () => {
    while (cursor < texts.length) {
      const index = cursor;
      cursor += 1;
      urls[index] = await fetchBeat(request, topicId, texts[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, texts.length) }, worker));

  const complete = urls.every(Boolean);
  if (!complete) {
    releaseNarration(urls);
    return { complete: false, urls: [] };
  }
  return { complete: true, urls };
}

export function releaseNarration(urls) {
  for (const url of urls ?? []) if (url) URL.revokeObjectURL(url);
}

// Plays the clips in order, reporting each as it starts.
//
// Chained rather than scheduled, for the same reason the speech-synthesis path
// is: one clip is live at a time, so pausing and skipping are exact and there
// is no queue to unwind.
export function playNarration(urls, { onBeat, onEnd, from = 0 } = {}) {
  if (!urls?.length) return null;
  const audio = new Audio();
  let index = Math.max(0, Math.min(from, urls.length - 1));
  let stopped = false;

  function playFrom(position) {
    if (stopped) return;
    if (position >= urls.length) {
      onEnd?.();
      return;
    }
    index = position;
    audio.src = urls[position];
    onBeat?.(position);
    const attempt = audio.play();
    // Autoplay can be refused if the learner has not interacted with the page
    // yet. Reporting it as the end is wrong, so it stops quietly and the caller
    // still holds a paused player.
    attempt?.catch(() => { if (!stopped) onEnd?.(); });
  }

  audio.onended = () => { if (!stopped) playFrom(index + 1); };
  // A clip that will not load must not strand the lesson on it.
  audio.onerror = () => { if (!stopped) playFrom(index + 1); };

  playFrom(index);

  return {
    stop() {
      stopped = true;
      audio.pause();
      audio.src = "";
    },
  };
}
