import { app } from "@azure/functions";
import { getLearningAccess } from "../lib/learningAccess.js";
import { getNarration, narrationKey } from "../lib/narrationStore.js";

// Serves the cached narration for one lesson beat.
//
// Behind the same access check as the lesson itself: the narration reads the
// paid explanations aloud, so a public blob container would hand the curriculum
// to anyone who could guess a URL. The cost of proxying is a few kilobytes of
// Functions egress per beat, against giving the content away.
//
// The client sends the spoken text and the API derives the key, so the browser
// never needs to know which voice was used or how the digest is built. A miss
// is a 404 and the player falls back to the device's own speech synthesis,
// which is why this is never an error the learner sees.
const voice = () => process.env.AZURE_SPEECH_VOICE ?? "en-GB-SoniaNeural";

app.http("narration", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "narration",
  handler: async (request, context) => {
    try {
      const access = await getLearningAccess(request);
      if (!access.allowed) {
        return { status: 403, jsonBody: { error: "Your Education Hub access is inactive or has not been added yet." } };
      }

      const body = await request.json();
      const topicId = typeof body.topicId === "string" ? body.topicId : "";
      const text = typeof body.text === "string" ? body.text : "";

      // The topic id becomes a blob path segment, so it is held to the same
      // shape the catalogue produces rather than trusted from the client.
      if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(topicId)) {
        return { status: 400, jsonBody: { error: "That topic reference is not valid." } };
      }
      // Long enough for any authored beat, short enough that this cannot be
      // used to probe storage with arbitrary volumes of text.
      if (!text || text.length > 2000) {
        return { status: 400, jsonBody: { error: "A beat of narration text is required." } };
      }

      const key = narrationKey(topicId, text, voice());
      const audio = await getNarration(key);
      if (!audio) {
        // A miss is invisible from the outside - the player simply sounds worse
        // - so the one case worth a log line is the beat that was asked for and
        // is not there, with enough of the text to find which one.
        context.warn(`narration MISS ${topicId} "${text.slice(0, 60)}"`);
        // Not an error: the topic has not been voiced yet, and the player reads
        // it with the browser instead.
        return { status: 404, jsonBody: { error: "That narration has not been recorded yet.", voiced: false } };
      }

      return {
        status: 200,
        headers: {
          "Content-Type": audio.contentType,
          // The key is a digest of the text, so this file can never change.
          "Cache-Control": "private, max-age=31536000, immutable",
        },
        body: audio.body,
      };
    } catch (error) {
      context.error("Narration failure", error.message);
      // Also not fatal: the player falls back to the browser voice.
      return { status: 404, jsonBody: { error: "That narration is unavailable.", voiced: false } };
    }
  },
});
