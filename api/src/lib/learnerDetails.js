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

// Loose on purpose: enough digits to be a real number, and tolerant of spaces,
// brackets and an international prefix. Refusing a valid number is worse than
// accepting an odd-looking one.
function validMobile(value) {
  if (typeof value !== "string") return false;
  const digits = value.replace(/[\s()\-.]/g, "");
  return /^\+?\d{10,15}$/.test(digits);
}

function validDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date < new Date();
}

// The school year, worked out rather than asked for.
//
// In England the year group is fixed by a child's age on the 31st of August
// before the academic year starts, so the date of birth already answers it.
// Asking for the year as well would be a second piece of personal data that
// tells us nothing the first one does not, and it would be the one a child
// could quietly change to get easier work.
export function yearFromDateOfBirth(dateOfBirth, on = new Date()) {
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  if (Number.isNaN(birth.getTime())) return null;
  // September onwards belongs to the academic year that has just started.
  const academicStart = on.getUTCMonth() >= 8 ? on.getUTCFullYear() : on.getUTCFullYear() - 1;
  const hadBirthdayByCutoff =
    Date.UTC(academicStart, birth.getUTCMonth(), birth.getUTCDate()) <= Date.UTC(academicStart, 7, 31);
  const ageAtCutoff = academicStart - birth.getUTCFullYear() - (hadBirthdayByCutoff ? 0 : 1);
  // Reception is the year a child turns five, so the group runs four behind.
  return ageAtCutoff - 4;
}

export function validateLearnerDetails(body) {
  // Derived, never taken from the request: a year sent by the client would let
  // the registered year be chosen rather than established.
  const year = validDate(body?.dateOfBirth) ? yearFromDateOfBirth(body.dateOfBirth) : NaN;
  const valid =
    Boolean(body?.guardianName?.trim()) &&
    relationships.includes(body?.guardianRelationship) &&
    // The adult's own record: a name, an address we can reach them on, and a
    // number. This is the account holder, not the child.
    validMobile(body?.guardianPhone) &&
    Boolean(body?.studentFirstName?.trim()) &&
    validDate(body?.dateOfBirth) &&
    years.includes(year) &&
    body?.parentalConsent === true &&
    // Boards are chosen from Year 9, when GCSE preparation starts; tier entry is
    // only decided for the exam years.
    (year < 9 || (validBoards(body?.examBoards) && boards.includes(body?.examBoard))) &&
    (year < 10 || tiers.includes(body?.tier));

  if (!valid && validDate(body?.dateOfBirth) && !years.includes(year)) {
    return { valid: false, error: "Y7to11.AI covers Years 7 to 11. That date of birth falls outside those years." };
  }
  if (!valid) return { valid: false, error: "Complete all required student and parent/guardian details." };
  return { valid: true, value: { ...body, year } };
}
