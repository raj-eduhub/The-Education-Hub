// One voice at a time, across the whole lesson view.
//
// Three things can talk: the narrated lesson, the key formulas, and the worked
// example. Each owned its own Audio element or speech-synthesis run and none of
// them could see the others, so pressing play on the worked example left the
// lesson still reading and the two ran over each other. Stopping speech
// synthesis is global and looked like it covered this, but it does nothing to
// another component's Audio element, which is the case that actually happens
// once a topic has been voiced.
//
// Whoever starts takes the floor, and the player that held it is told to stop
// so it can put its own button back to Play and clear its highlight. A player
// re-claiming while it already holds the floor keeps it, because the lesson
// re-enters its playback effect when the recorded audio finishes loading and
// must not stop itself doing so.
//
// `owner` is any stable value identifying the player, in practice a ref object
// held for the life of the component.

let holder = null;

// Stops whatever is playing and tells it so. Safe to call when nothing is.
export function stopPlayback() {
  if (!holder) return;
  const previous = holder;
  // Cleared before the callback runs: releasePlayback() inside it must not see
  // a stale holder, and nothing should be able to stop a player twice.
  holder = null;
  previous.onStopped?.();
}

// Takes the floor for `owner`, stopping the previous holder if it is someone
// else. `onStopped` is called when another player takes over.
export function claimPlayback(owner, onStopped) {
  if (holder?.owner !== owner) stopPlayback();
  holder = { owner, onStopped };
  return owner;
}

// Gives up the floor, if this owner still holds it. A player that has already
// been stopped by someone else no longer does, so this is a no-op for it and
// cannot stop the player that took over.
export function releasePlayback(owner) {
  if (holder?.owner === owner) holder = null;
}

export function playbackHeldBy(owner) {
  return holder?.owner === owner;
}
