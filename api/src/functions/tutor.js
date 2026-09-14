import { app } from "@azure/functions";
import { callFoundry, deployment } from "../lib/foundry.js";
import { getLearningAccess } from "../lib/learningAccess.js";
import { checkAnswer, checkQuestion, guardInstructions, verdicts } from "../lib/tutorGuard.js";
import { findStoredAnswer, loadStudyMaterial, materialText } from "../lib/tutorRetrieval.js";
import { recordAttempt } from "../lib/progressStore.js";

const modeInstructions = {
  learn: "Give a clear explanation first, then key ideas, a fully worked example, and one check question. Do not skip calculation or reasoning steps.",
  practice: "Create adaptive, original practice questions. Ask one question at a time, wait for the learner, then give constructive feedback before adjusting difficulty.",
  exam: "Use original timed, mark-based questions in the style and demand of the stated qualification without copying exam papers. State the available marks and mark submitted answers explicitly.",
  review: "Use short spaced-retrieval prompts focused on weak knowledge. Prefer recall before hints, then reinforce the correct idea concisely.",
};

function buildSystemPrompt(stage, year, examBoard, tier, subject, topic, mode, mastery) {
  return [
    guardInstructions(subject, topic),
    "You are a patient UK education tutor for KS3, KS4, and GCSE learners.",
    "Use British English and keep explanations age-appropriate.",
    "Use short headings and separate paragraphs so the answer is easy to scan.",
    "Define unfamiliar vocabulary before using it and explain why each worked step is taken.",
    "For Maths, always include a KEY FORMULAS section when a formula applies. Define every symbol, show substitution with units, show each calculation, and state the final answer clearly.",
    "For non-Maths subjects, include a concrete worked example that models a strong response or applies the topic to a specific situation.",
    "End Learn-mode explanations with one short check-your-understanding question.",
    "Do not reproduce copyrighted exam-paper questions.",
    "Create original practice questions and mark student answers constructively.",
    `Current stage: ${stage}.`,
    `Current school year: Year ${year}. Only teach content appropriate to this year group.`,
    `GCSE exam board: ${examBoard ?? "Not applicable"}.`,
    `GCSE tier: ${tier ?? "Not applicable"}.`,
    `Current subject: ${subject}.`,
    `Current topic: ${topic?.title ?? "General revision"}.`,
    `Learning goal: ${topic?.goal ?? "Help the student revise clearly."}`,
    `Learning mode: ${mode}. ${modeInstructions[mode]}`,
    mastery
      ? `Recorded topic mastery: ${mastery.masteryScore}/100, accuracy ${Math.round(mastery.accuracy * 100)}%, confidence ${mastery.confidence}/5. Adapt difficulty without mentioning this score unless asked.`
      : "No prior mastery evidence exists for this topic. Begin with an accessible check.",
    mode === "practice" || mode === "exam"
      ? "When, and only when, you have marked an answer the learner submitted, end your reply with a final line in exactly this form: MARK: earned/available, for example MARK: 3/4. Do not write that line when you are asking a question rather than marking one."
      : "",
  ].filter(Boolean).join("\n");
}

// The tutor marks the learner's own answer, so the score is observed evidence
// rather than a self-assessment or a guess.
const markPattern = /(?:^|\n)\s*\**MARK\**\s*:\s*(\d{1,3})\s*\/\s*(\d{1,3})\s*\**\s*$/i;

export function readMark(answer) {
  const match = String(answer ?? "").match(markPattern);
  if (!match) return null;
  const earned = Number(match[1]);
  const available = Number(match[2]);
  if (!available || earned > available) return null;
  return { earned, available, accuracy: earned / available };
}

export function stripMark(answer) {
  return String(answer ?? "").replace(markPattern, "").trimEnd();
}

app.http("tutor", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "tutor",
  handler: async (request, context) => {
    try {
      const access = await getLearningAccess(request);
      const { allowed } = access;
      if (!allowed) {
        return {
          status: 403,
          jsonBody: { error: "Your Education Hub access is inactive or has not been added yet." },
        };
      }

      const body = await request.json();
      const year = access.profile?.year ?? body.year;
      const stage = year <= 9 ? "KS3" : "KS4";
      const examBoard = access.profile?.examBoard ?? body.examBoard;
      const tier = access.profile?.tier ?? body.tier;
      const { subject, topic, mode = "learn", mastery, question, history = [] } = body;

      if (!question || typeof question !== "string") {
        return {
          status: 400,
          jsonBody: { error: "A question is required." },
        };
      }

      if (!Number.isInteger(year) || year < 7 || year > 11) {
        return {
          status: 400,
          jsonBody: { error: "A valid school year from 7 to 11 is required." },
        };
      }

      if (!modeInstructions[mode]) {
        return { status: 400, jsonBody: { error: "A valid learning mode is required." } };
      }

      // Study material for this topic feeds both the guard's sense of what counts
      // as on-topic and the attempt to answer without the model.
      const material = await loadStudyMaterial(topic?.id).catch(() => []);
      const guard = checkQuestion({
        question,
        topic,
        subject,
        topicTitles: Array.isArray(body.topicTitles) ? body.topicTitles.slice(0, 80) : [],
        studyMaterial: materialText(material),
        hasHistory: history.length > 1,
      });
      if (guard.verdict !== verdicts.ALLOW) {
        context.warn(`Tutor guard ${guard.verdict} (${guard.reason}) for ${subject}/${topic?.id ?? "no topic"}`);
        return { jsonBody: { answer: guard.message, guard: { verdict: guard.verdict, reason: guard.reason }, source: "guard" } };
      }

      // A question the stored material already answers costs no model tokens.
      if (mode === "learn") {
        const stored = findStoredAnswer(question, material);
        if (stored) {
          return { jsonBody: { answer: stored.answer, source: "stored", match: { type: stored.type, score: Number(stored.score.toFixed(2)) } } };
        }
      }

      const recentHistory = history
        .slice(-6)
        .map((message) => `${message.role}: ${message.text}`)
        .join("\n");

      const answer = await callFoundry({
        model: deployment,
        input: [
          {
            role: "system",
            content: buildSystemPrompt(stage, year, examBoard, tier, subject, topic, mode, mastery),
          },
          {
            role: "user",
            content: [
              recentHistory ? `Recent conversation:\n${recentHistory}` : "",
              `Student request:\n${question}`,
              // Repeated at the end of the turn, where the model follows it far
              // more reliably than from the system prompt alone.
              mode === "practice" || mode === "exam"
                ? "Reminder: if this message is the learner's answer and you are marking it, end your reply with a line of exactly the form MARK: earned/available. Omit that line entirely if you are asking a question instead of marking one."
                : "",
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
        ],
      });

      // A marked answer is recorded automatically, server-side, so the record
      // reflects what the tutor actually marked rather than anything the client
      // chose to report. Confidence is deliberately absent.
      let recorded = null;
      const mark = readMark(answer);
      if (mark && (mode === "practice" || mode === "exam") && topic?.id) {
        try {
          const result = await recordAttempt(access.email, {
            year,
            subject,
            topicId: topic.id,
            topicTitle: topic.title,
            mode,
            kind: "auto",
            accuracy: mark.accuracy,
            confidence: null,
            durationSeconds: Number(body.durationSeconds) || 60,
            score: mark.earned,
            maxScore: mark.available,
          });
          recorded = { mastery: result.mastery, mark };
        } catch (failure) {
          context.warn(`Automatic progress recording failed: ${failure.message}`);
        }
      }

      const answerCheck = checkAnswer(answer);
      if (answerCheck.verdict !== verdicts.ALLOW) {
        context.warn(`Tutor answer guard ${answerCheck.reason}`);
        return { jsonBody: { answer: answerCheck.message, guard: { verdict: answerCheck.verdict, reason: answerCheck.reason }, source: "guard" } };
      }

      return {
        jsonBody: {
          answer:
            stripMark(answer) ||
            "I reached the model, but it did not return text. Try asking the question again.",
          source: "model",
          recorded,
        },
      };
    } catch (error) {
      context.error(error);
      return {
        status: 500,
        jsonBody: {
          error:
            "The Azure AI tutor is not configured yet. Check identity, endpoint, and model deployment settings.",
        },
      };
    }
  },
});
