import { app } from "@azure/functions";
import { getLearningAccess } from "../lib/learningAccess.js";
import { getHabit, getProgress, getReviewQueue, recordActivity, recordAttempt } from "../lib/progressStore.js";

const modes = ["learn", "practice", "exam", "review", "diagnostic"];

app.http("progress", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "progress/{action?}",
  handler: async (request, context) => {
    try {
      const access = await getLearningAccess(request);
      const { allowed, email } = access;
      if (!allowed) return { status: 403, jsonBody: { error: "Your Education Hub access is inactive." } };

      if (request.method === "GET") {
        const yearValue = access.profile?.year ?? Number(request.query.get("year"));
        const year = Number.isInteger(yearValue) && yearValue >= 7 && yearValue <= 11 ? yearValue : undefined;
        // The daily target and the run of days it has been met.
        if (request.params.action === "habit") {
          return { jsonBody: await getHabit(email) };
        }
        if (request.params.action === "review") {
          return { jsonBody: await getReviewQueue(email, {
            year,
            subject: request.query.get("subject") ?? undefined,
            limit: Math.max(1, Math.min(50, Number(request.query.get("limit")) || 20)),
          }) };
        }
        return { jsonBody: await getProgress(email, year) };
      }

      const body = await request.json();
      const registeredYear = access.profile?.year ?? body.year;

      // Engagement is recorded separately and never carries attainment data.
      if (body.kind === "activity") {
        const validActivity =
          Number.isInteger(registeredYear) && registeredYear >= 7 && registeredYear <= 11 &&
          typeof body.subject === "string" && body.subject.length <= 60 &&
          typeof body.topicId === "string" && body.topicId.length <= 140 &&
          modes.includes(body.mode) && Number.isFinite(Number(body.durationSeconds));
        if (!validActivity) return { status: 400, jsonBody: { error: "Valid activity details are required." } };
        return { status: 201, jsonBody: await recordActivity(email, { ...body, year: registeredYear }) };
      }

      const valid =
        Number.isInteger(registeredYear) && registeredYear >= 7 && registeredYear <= 11 &&
        typeof body.subject === "string" && body.subject.length <= 60 &&
        typeof body.topicId === "string" && body.topicId.length <= 140 &&
        typeof body.topicTitle === "string" && body.topicTitle.length <= 180 &&
        modes.includes(body.mode) &&
        Number.isFinite(Number(body.accuracy)) &&
        (body.confidence === undefined || body.confidence === null || Number.isFinite(Number(body.confidence))) &&
        Number.isFinite(Number(body.durationSeconds));
      if (!valid) return { status: 400, jsonBody: { error: "Valid attempt details are required." } };

      const result = await recordAttempt(email, {
        contentType: typeof body.contentType === "string" ? body.contentType.slice(0, 20) : "",
        contentRowKey: typeof body.contentRowKey === "string" ? body.contentRowKey.slice(0, 60) : "",
        year: registeredYear,
        subject: body.subject,
        topicId: body.topicId,
        topicTitle: body.topicTitle,
        mode: body.mode,
        accuracy: body.accuracy,
        confidence: body.confidence,
        durationSeconds: body.durationSeconds,
        score: Number.isFinite(Number(body.score)) ? Number(body.score) : undefined,
        maxScore: Number.isFinite(Number(body.maxScore)) ? Number(body.maxScore) : undefined,
      });
      return { status: 201, jsonBody: result };
    } catch (error) {
      context.error(error);
      return { status: 500, jsonBody: { error: "Progress storage is unavailable." } };
    }
  },
});
