import { app } from "@azure/functions";
import { callFoundry, deployment } from "../lib/foundry.js";
import { checkModelBudget } from "../lib/modelBudget.js";
import { getLearningAccess, mayStudyTopic, trialRefusal } from "../lib/learningAccess.js";
import { contentKey, getContent, saveContent } from "../lib/contentStore.js";
import { allowsFormulae, contentTypes, isQuestionBank, mayUseModel, routeFor, supportsQuestionBank, usesMathsNotation, variesByBoard, variesByTier, warrantsWorkedExample } from "../lib/contentPolicy.js";
import { parseQuestion, questionPrompt } from "../lib/questionBank.js";
import { exampleSystemPrompt, parseWorkedExample, workedExamplePrompt } from "../lib/workedExample.js";
import { selectExplanation } from '../../../src/data/selectExplanation.js';
import { curriculum } from '../../../src/data/curriculumCatalog.js';
import { getEditorialContent } from '../lib/editorialContent.js';

app.http("content", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "content",
  handler: async (request, context) => {
    try {
      const access = await getLearningAccess(request);
      // An inactive account, or a free week that has run out.
      if (!access.allowed && !access.trial) return trialRefusal(access);

      const body = await request.json();
      // A trial reaches only its free topic. Checked against the id the stored
      // row is keyed on, so the explicit-key lookup below is held to it too.
      if (!mayStudyTopic(access, body.topic?.id)) return trialRefusal(access);
      const { topic, subtopic, refresh = false } = body;
      const requested = body.type;
      const type = Object.values(contentTypes).includes(requested) ? requested : contentTypes.EXAMPLE;
      const year = access.profile?.year ?? body.year;
      const tier = access.profile?.tier ?? body.tier;
      const examBoard = access.profile?.examBoard ?? body.examBoard;
      const subject = typeof body.subject === "string" ? body.subject : "";
      const canonicalTopic = curriculum.find(entry => entry.id === topic?.id);
      // Stored variants belong to the topic's year, even when an older learner
      // revisits it. A Year 9 example must never be looked up as a GCSE tier row.
      const contentYear = canonicalTopic?.year ?? year;

      if (!Number.isInteger(year) || year < 7 || year > 11) {
        return { status: 400, jsonBody: { error: "A valid school year from 7 to 11 is required." } };
      }
      if (!topic?.title || (type === contentTypes.EXAMPLE && !subtopic?.title)) {
        return { status: 400, jsonBody: { error: "A topic, and a sub-topic for an example, are required." } };
      }

      if (subtopic != null && [contentTypes.EXPLANATION, contentTypes.EXAMPLE].includes(type)) {
        const canonical = canonicalTopic;
        if (!canonical || canonical.subject !== subject
          || !Number.isInteger(subtopic.index) || canonical.outcomes[subtopic.index] !== subtopic.title) {
          return { status: 400, jsonBody: { error: 'That sub-topic reference is not valid.' } };
        }
      }

      // Years 10 and 11 keep an example per tier because Foundation and Higher
      // differ in demand. Explanation rows contain their authored subtopic and
      // tier variants; select only the requested lesson from that stored row.
      // Question banks are indexed in their own right, and vary by board from
      // Year 9, when GCSE preparation begins.
      const bankIndex = Math.max(0, Math.min(50, Number(body.index) || 0));
      // Review re-asks an exact stored question, so the key can be given directly
      // rather than derived from an index. It is restricted to the shapes
      // contentKey() can actually produce: the curriculum table is shared by
      // every learner, so a client-chosen key is a write into other people's
      // lessons unless it is both constrained and read-only.
      const explicitRowKey = typeof body.rowKey === "string"
        && /^(explanation|example-\d{1,2}-(Foundation|Higher|core)|(practice|exam)-\d{1,2}-(AQA|Edexcel|core)-(Foundation|Higher|core))$/.test(body.rowKey)
        ? body.rowKey
        : "";
      const key = explicitRowKey
        ? { partitionKey: topic.id, rowKey: explicitRowKey }
        : contentKey(type, topic.id, {
        index: isQuestionBank(type) ? bankIndex : subtopic?.index,
        board: variesByBoard(type) && contentYear >= 9 ? examBoard : null,
        // Only the tiered subjects split their content by tier.
        tier: contentYear >= 10 && variesByTier(subject) ? tier : null,
      });
      if (!key) return { status: 400, jsonBody: { error: "That topic or sub-topic reference is not valid." } };
      // A question asked for by key must already exist; generating a different
      // one under that key would defeat the point of re-asking it.
      if (explicitRowKey && !/^[a-z0-9][a-z0-9-]{0,120}$/.test(topic.id)) {
        return { status: 400, jsonBody: { error: "That topic reference is not valid." } };
      }

      const route = routeFor(type, subject);
      if (!route) return { status: 400, jsonBody: { error: "That content type is not supported." } };

      // A ruler-and-compass construction or a workshop build cannot be set or
      // marked through a text box, so no question bank is generated for it.
      if (isQuestionBank(type) && !supportsQuestionBank(topic?.id)) {
        return {
          status: 404,
          jsonBody: { error: "This topic is practical, so it is learned through its explanation and worked examples rather than typed questions.", route },
        };
      }

      // Some sub-topics have no method to work through: naming, recognising and
      // recalling are single steps, and analysing has no one right answer. Asked
      // for an example anyway the model writes a question with no answer and
      // steps that restate the outcome, so the route stops here rather than
      // generating one and storing it.
      if (type === contentTypes.EXAMPLE && !warrantsWorkedExample(topic.id, subtopic?.index)) {
        return {
          status: 404,
          jsonBody: { error: "This sub-topic is learned through its explanation and practice rather than a worked example.", route, noWorkedExample: true },
        };
      }

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
          const selected = key.rowKey === 'explanation' ? selectExplanation(stored, subtopic?.index, tier) : stored;
          return { jsonBody: { content: { ...selected, rowKey: key.rowKey, source: "stored" }, route, generated: false } };
        }
        if (stored && reviewedOnly) {
          return {
            status: 404,
            jsonBody: { error: "This part of the lesson is waiting to be approved by a teacher.", route, awaitingReview: true },
          };
        }
      }

      // Asking for a key directly is a lookup, never a commission. Falling
      // through here would let a learner choose where the generated row lands,
      // and the curriculum table is shared: the next learner to open that topic
      // would be served whatever this request produced.
      if (explicitRowKey) {
        return { status: 404, jsonBody: { error: "That question is no longer stored.", route } };
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

      const editorial = !skipStore && getEditorialContent(key);
      if (editorial) {
        await saveContent(key, editorial, { type, subject, year: contentYear, topicTitle: topic.title,
          subtopicTitle: subtopic?.title ?? '', origin: 'editorial' });
        return { jsonBody: { content: { ...editorial, reviewStatus: 'pending', reviewed: false,
          rowKey: key.rowKey, source: 'editorial' }, route, generated: false } };
      }

      // Only a call that genuinely reaches the model is counted. A learner
      // reading stored content all evening costs nothing and should not be
      // limited for it.
      const overBudget = await checkModelBudget(access.email, { context });
      if (overBudget) return overBudget;

      const notation = usesMathsNotation(subject);
      // Decided per outcome rather than per subject, so the few argued
      // sub-topics with a real relationship behind them keep it.
      const formulaeAllowed = type === contentTypes.EXAMPLE
        ? allowsFormulae(subject, topic.id, subtopic?.index)
        : null;
      const userPrompt = isQuestionBank(type)
        ? questionPrompt(type, topic, subtopic, { board: contentYear >= 9 ? examBoard : null, tier: contentYear >= 10 && variesByTier(subject) ? tier : null, year: contentYear, notation, index: bankIndex })
        : workedExamplePrompt(topic, subtopic, { notation });
      const answer = await callFoundry({
        model: deployment,
        input: [
          { role: "system", content: exampleSystemPrompt(contentYear <= 9 ? "KS3" : "KS4", contentYear, examBoard, tier, subject, formulaeAllowed) },
          { role: "user", content: userPrompt },
        ],
      });

      const parsed = isQuestionBank(type) ? parseQuestion(type, answer) : parseWorkedExample(answer, subject, formulaeAllowed);
      if (!parsed) {
        context.warn(`Unparsed ${type} question for ${topic.id}`);
        return { status: 503, jsonBody: { error: "That question could not be prepared. Please try again." } };
      }
      const payload = { ...parsed, notation };
      await saveContent(key, payload, {
        type,
        subject,
        year: contentYear,
        topicTitle: topic.title,
        subtopicTitle: subtopic?.title ?? "",
        origin: "model",
        model: deployment,
      });
      return { jsonBody: { content: { ...payload, rowKey: key.rowKey, source: "model" }, route, generated: true } };
    } catch (error) {
      context.error("Curriculum content failure", error.message);
      return { status: 503, jsonBody: { error: "That part of the lesson could not be prepared. Please try again." } };
    }
  },
});
