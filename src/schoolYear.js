// Which school year a date of birth puts a child in.
//
// In England the year group is fixed by a child's age on the 31st of August
// before the academic year starts, so the date of birth already answers it and
// there is no reason to ask for the year as well.
//
// The API derives this again from the same rule and does not trust the browser;
// this copy exists only so the form can show the answer as it is typed.
export function yearFromDateOfBirth(dateOfBirth, on = new Date()) {
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  if (Number.isNaN(birth.getTime())) return null;
  const academicStart = on.getUTCMonth() >= 8 ? on.getUTCFullYear() : on.getUTCFullYear() - 1;
  const hadBirthdayByCutoff =
    Date.UTC(academicStart, birth.getUTCMonth(), birth.getUTCDate()) <= Date.UTC(academicStart, 7, 31);
  const ageAtCutoff = academicStart - birth.getUTCFullYear() - (hadBirthdayByCutoff ? 0 : 1);
  return ageAtCutoff - 4;
}
