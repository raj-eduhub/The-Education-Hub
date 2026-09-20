// Validation for the student and guardian details collected at onboarding.
//
// Two routes collect the same details: the in-app one, used straight after
// payment, and the emailed-link one kept alive for invitations already sent.
// The rules live here so the two cannot drift apart.
const relationships = ["parent", "legal-guardian", "carer"];
// The boards offered, matching examBoards in the frontend catalogue. The API
// cannot import from src/, because only api/ is deployed, so the list is
// repeated here and the curriculum validator checks the two still agree.
//
// These were previously two different lists: the per-subject map accepted AQA
// and Edexcel while the top-level board also accepted OCR, so a learner could
// be stored against a board that had no content and no signup path.
// Subjects are defined in the frontend catalogue, so the API validates the shape
// of the per-subject board map rather than an exact subject list.
const boards = ["AQA", "Edexcel"];
const tiers = ["Foundation", "Higher"];
const years = [7, 8, 9, 10, 11];

function validBoards(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  if (!entries.length || entries.length > 30) return false;
  return entries.every(([subject, board]) =>
    typeof subject === "string" && subject.length > 0 && subject.length <= 60 && boards.includes(board));
}

function validDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date < new Date();
}

export function validateLearnerDetails(body) {
  const year = Number(body?.year);
  const valid =
    Boolean(body?.guardianName?.trim()) &&
    relationships.includes(body?.guardianRelationship) &&
    Boolean(body?.guardianPhone?.trim()) &&
    Boolean(body?.studentFirstName?.trim()) &&
    Boolean(body?.studentLastName?.trim()) &&
    validDate(body?.dateOfBirth) &&
    years.includes(year) &&
    body?.parentalConsent === true &&
    // Boards are chosen from Year 9, when GCSE preparation starts; tier entry is
    // only decided for the exam years.
    (year < 9 || (validBoards(body?.examBoards) && boards.includes(body?.examBoard))) &&
    (year < 10 || tiers.includes(body?.tier));

  if (!valid) return { valid: false, error: "Complete all required student and parent/guardian details." };
  return { valid: true, value: { ...body, year } };
}
