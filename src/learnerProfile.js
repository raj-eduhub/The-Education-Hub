const profileKey = "education-hub-learner-profile";

export function loadLearnerProfile(ownerEmail) {
  try {
    const profile = JSON.parse(localStorage.getItem(profileKey));
    return profile?.ownerEmail === ownerEmail ? profile : null;
  } catch {
    return null;
  }
}

export function saveLearnerProfile(ownerEmail, profile) {
  const stored = {
    ownerEmail,
    firstName: profile.firstName.trim(),
    dateOfBirth: profile.dateOfBirth,
    year: Number(profile.year),
    examBoard: profile.examBoard ?? "AQA",
    examBoards: profile.examBoards ?? {},
    tier: profile.tier ?? "Higher",
    subject: profile.subject ?? "Maths",
    topicId: profile.topicId ?? "",
    yearLocked: profile.yearLocked === true,
  };
  localStorage.setItem(profileKey, JSON.stringify(stored));
  return stored;
}

// A learner can sit different subjects with different boards, so the board is
// always resolved for the subject in hand, falling back to the single board
// recorded before per-subject entry existed.
export function boardFor(profile, subject) {
  return profile?.examBoards?.[subject] ?? profile?.examBoard ?? "AQA";
}
