import { app } from "@azure/functions";
import { callFoundry, deployment } from "../lib/foundry.js";
import { getLearningAccess } from "../lib/learningAccess.js";
import { contentKey, getContent, saveContent } from "../lib/contentStore.js";
import { contentTypes, isQuestionBank, mayUseModel, routeFor, usesMathsNotation, variesByBoard } from "../lib/contentPolicy.js";
import { parseQuestion, questionPrompt } from "../lib/questionBank.js";
import { exampleSystemPrompt, parseWorkedExample, workedExamplePrompt } from "../lib/workedExample.js";

app.http("content", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "content",
  handler: async (request, context) => {
    try {
      const access = await getLearningAccess(request);
      if (!access.allowed) {
        return { status: 403, jsonBody: { error: "Your Education Hub access is inactive or has not been added yet." } };
      }

      const body = await request.json();
      const { topic, subtopic, refresh = false } = body;
      const requested = body.type;
      const type = Object.values(contentTypes).includes(requested) ? requested : contentTypes.EXAMPLE;
      const year = access.profile?.year ?? body.year;
      const tier = access.profile?.tier ?? body.tier;
      const examBoard = access.profile?.examBoard ?? body.examBoard;
      const subject = typeof body.subject === "string" ? body.subject : "";

      if (!Number.isInteger(year) || year < 7 || year > 11) {
        return { status: 400, jsonBody: { error: "A valid school year from 7 to 11 is required." } };
      }
      if (!topic?.title || (type === contentTypes.EXAMPLE && !subtopic?.title)) {
        return { status: 400, jsonBody: { error: "A topic, and a sub-topic for an example, are required." } };
      }

      // Years 10 and 11 keep an example per tier because Foundation and Higher
      // differ in demand. Explanations are the same for both.
      // Question banks are indexed in their own right, and vary by board from
      // Year 9, when GCSE preparation begins.
      const bankIndex = Math.max(0, Math.min(50, Number(body.index) || 0));
      const key = contentKey(type, topic.id, {
        index: isQuestionBank(type) ? bankIndex : subtopic?.index,
        board: variesByBoard(type) && year >= 9 ? examBoard : null,
        tier: year >= 10 ? tier : null,
      });
      if (!key) return { status: 400, jsonBody: { error: "That topic or sub-topic reference is not valid." } };

      const route = routeFor(type, subject);
      if (!route) return { status: 400, jsonBody: { error: "That content type is not supported." } };

      // Regenerating replaces content every learner sees, so it stays with administrators.
      if (refresh === true && !access.admin) {
        return { status: 403, jsonBody: { error: "Only an administrator can replace stored curriculum content." } };
      }
      const skipStore = refresh === true && access.admin && mayUseModel(route);

      // With the review gate on, only approved content is served and the model is
      // never called: generating more would only add unapproved rows.
      const reviewedOnly = process.env.REQUIRE_REVIEWED_CONTENT === "true" && !access.admin;

      if (!skipStore) {
        const stored = await getContent(key);
        if (stored && (!reviewedOnly || stored.reviewStatus === "approved")) {
          return { jsonBody: { content: { ...stored, source: "stored" }, route, generated: false } };
        }
        if (stored && reviewedOnly) {
          return {
            status: 404,
            jsonBody: { error: "This part of the lesson is waiting to be approved by a teacher.", route, awaitingReview: true },
          };
        }
      }

      if (reviewedOnly) {
        return {
          status: 404,
          jsonBody: { error: "This part of the lesson has not been published yet.", route, awaitingReview: true },
        };
      }

      if (!mayUseModel(route)) {
        // Explanations are authored, never generated. A miss means the seeding
        // step has not run for this topic rather than that the model should fill in.
        context.warn(`No stored ${type} for ${topic.id}; run the content seeding script.`);
        return {
          status: 404,
          jsonBody: { error: "This part of the curriculum has not been published yet.", route },
        };
      }

      const notation = usesMathsNotation(subject);
      const userPrompt = isQuestionBank(type)
        ? questionPrompt(type, topic, subtopic, { board: year >= 9 ? examBoard : null, tier: year >= 10 ? tier : null, year, notation, index: bankIndex })
        : workedExamplePrompt(topic, subtopic, { notation });
      const answer = await callFoundry({
        model: deployment,
        input: [
          { role: "system", content: exampleSystemPrompt(year <= 9 ? "KS3" : "KS4", year, examBoard, tier, subject) },
          { role: "user", content: userPrompt },
        ],
      });

      const parsed = isQuestionBank(type) ? parseQuestion(type, answer) : parseWorkedExample(answer);
      if (isQuestionBank(type) && !parsed) {
        context.warn(`Unparsed ${type} question for ${topic.id}`);
        return { status: 503, jsonBody: { error: "That question could not be prepared. Please try again." } };
      }
      const payload = parsed
        ? { ...parsed, notation }
        : { formulae: [], question: "", steps: [], answer: "", raw: answer, notation };
      await saveContent(key, payload, {
        type,
        subject,
        year,
        topicTitle: topic.title,
        subtopicTitle: subtopic?.title ?? "",
        origin: "model",
        model: deployment,
      });
      return { jsonBody: { content: { ...payload, source: "model" }, route, generated: true } };
    } catch (error) {
      context.error("Curriculum content failure", error.message);
      return { status: 503, jsonBody: { error: "That part of the lesson could not be prepared. Please try again." } };
    }
  },
});
