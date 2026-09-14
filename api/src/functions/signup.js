import { app } from "@azure/functions";
import { verifyPaidAccount } from "../lib/passwordAuth.js";
import { completeSignup, getSignupInvite } from "../lib/signupStore.js";
import { updateSubscriptionByAccountKey } from "../lib/subscriptionStore.js";

const relationships = ["parent", "legal-guardian", "carer"];
const boards = ["AQA", "Edexcel", "OCR"];
// Subjects are defined in the frontend catalogue, so the API validates the shape
// of the per-subject board map rather than an exact subject list.
const signupBoards = ["AQA", "Edexcel"];

function validBoards(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  if (!entries.length || entries.length > 30) return false;
  return entries.every(([subject, board]) =>
    typeof subject === "string" && subject.length > 0 && subject.length <= 60 && signupBoards.includes(board));
}
const tiers = ["Foundation", "Higher"];

function validDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date < new Date();
}

app.http("signup", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "signup/{token}",
  handler: async (request, context) => {
    try {
      const token = request.params.token;
      const invite = await getSignupInvite(token);
      if (!invite) return { status: 410, jsonBody: { error: "This signup link is invalid, expired, or already used." } };
      if (request.method === "GET") return { jsonBody: { email: invite.email, expiresAt: invite.expiresAt } };

      const body = await request.json();
      const year = Number(body.year);
      if (typeof body.password !== "string" || body.password.length < 15 || body.password.length > 128) return { status: 400, jsonBody: { error: "Set an account password of 15-128 characters." } };
      if (
        !body.guardianName?.trim() || !relationships.includes(body.guardianRelationship) ||
        !body.guardianPhone?.trim() || !body.studentFirstName?.trim() ||
        !body.studentLastName?.trim() || !validDate(body.dateOfBirth) ||
        ![7, 8, 9, 10, 11].includes(year) || body.parentalConsent !== true ||
        // Boards are chosen from Year 9, when GCSE preparation starts; tier entry
        // is only decided for the exam years.
        (year >= 9 && (!validBoards(body.examBoards) || !boards.includes(body.examBoard))) ||
        (year >= 10 && !tiers.includes(body.tier))
      ) {
        return { status: 400, jsonBody: { error: "Complete all required student and parent/guardian details." } };
      }
      await verifyPaidAccount(invite.email, body.password);
      const profile = await completeSignup(token, { ...body, year });
      await updateSubscriptionByAccountKey(invite.accountKey, { onboardingComplete: true });
      return { status: 201, jsonBody: { profile } };
    } catch (error) {
      context.error(error);
      return { status: error.statusCode ?? 500, jsonBody: { error: error.message ?? "Signup could not be completed." } };
    }
  },
});
