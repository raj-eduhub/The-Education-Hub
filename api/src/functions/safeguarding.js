import { app } from "@azure/functions";
import { getLearningAccess } from "../lib/learningAccess.js";
import { flagStatuses, flagSummary, getLearnerFlags, listFlags, setFlagStatus } from "../lib/safeguardingStore.js";
import { getProfile } from "../lib/signupStore.js";

// Reading a safeguarding flag means reading what a named child wrote, so this is
// administrator-only and never a parent-level permission: the flag may be about
// the household the parent account belongs to.

// The people an administrator would actually need to contact. Read fresh from
// the profile rather than copied onto every flag row, so a changed phone number
// is right everywhere and the contact details are stored once.
async function withGuardianContact(rows) {
  const byEmail = new Map();
  for (const row of rows) {
    if (row.email && !byEmail.has(row.email)) byEmail.set(row.email, getProfile(row.email).catch(() => null));
  }
  const profiles = new Map(await Promise.all([...byEmail].map(async ([email, pending]) => [email, await pending])));
  return rows.map((row) => {
    const profile = profiles.get(row.email);
    return {
      ...row,
      studentName: row.studentName || [profile?.studentFirstName, profile?.studentLastName].filter(Boolean).join(" "),
      year: row.year || profile?.year || 0,
      guardian: profile
        ? { name: profile.guardianName ?? "", relationship: profile.guardianRelationship ?? "", phone: profile.guardianPhone ?? "" }
        : null,
    };
  });
}

app.http("safeguarding", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "safeguarding/{action?}",
  handler: async (request, context) => {
    try {
      const access = await getLearningAccess(request);
      if (!access.admin) {
        return { status: 403, jsonBody: { error: "Only an administrator can review safeguarding flags." } };
      }

      if (request.method === "GET") {
        if (request.params.action === "summary") {
          return { jsonBody: await flagSummary() };
        }
        // One learner's whole history, which is the question an adult asks next:
        // has this happened before?
        if (request.params.action === "learner") {
          const email = request.query.get("email") ?? "";
          if (!email) return { status: 400, jsonBody: { error: "A learner email is required." } };
          const rows = await getLearnerFlags(email, { limit: Math.max(1, Math.min(100, Number(request.query.get("limit")) || 50)) });
          return { jsonBody: { rows: await withGuardianContact(rows) } };
        }
        const page = await listFlags({
          severity: request.query.get("severity") ?? undefined,
          // Open flags unless every status is asked for by name. Defaulting to
          // every flag ever raised would bury the ones still needing an adult.
          status: request.query.get("status") ?? "open",
          email: request.query.get("email") ?? undefined,
          since: request.query.get("since") ?? undefined,
          limit: Math.max(1, Math.min(100, Number(request.query.get("limit")) || 25)),
          cursor: request.query.get("cursor") ?? undefined,
        });
        return { jsonBody: { ...page, rows: await withGuardianContact(page.rows) } };
      }

      const body = await request.json();
      const { learnerId, rowKey, status, note } = body;
      if (typeof learnerId !== "string" || typeof rowKey !== "string") {
        return { status: 400, jsonBody: { error: "A learner and flag reference are required." } };
      }
      if (!flagStatuses.includes(status)) {
        return { status: 400, jsonBody: { error: `Status must be one of: ${flagStatuses.join(", ")}.` } };
      }
      const result = await setFlagStatus(learnerId, rowKey, status, access.email, note);
      if (!result) return { status: 404, jsonBody: { error: "That flag could not be found." } };
      return { jsonBody: { flag: result } };
    } catch (error) {
      context.error("Safeguarding review failure", error.message);
      return { status: 503, jsonBody: { error: "Safeguarding review is unavailable right now." } };
    }
  },
});
