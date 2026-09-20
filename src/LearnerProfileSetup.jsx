import React, { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Check, GraduationCap, ShieldCheck, UserRound } from "lucide-react";
import { examBoards, subjects, tiers, topicsFor } from "./curriculum.js";

const schoolYears = [7, 8, 9, 10, 11];

function ageOnDate(dateOfBirth) {
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const birthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!birthdayPassed) age -= 1;
  return age;
}

export function LearnerProfileSetup({ initialProfile, onSave, onCancel, yearLocked = false }) {
  const [profile, setProfile] = useState({
    firstName: initialProfile?.firstName ?? "",
    dateOfBirth: initialProfile?.dateOfBirth ?? "",
    year: initialProfile?.year ?? 7,
    // Per subject, because a learner can sit Maths with one board and Science
    // with another, and paid signup already collects it that way.
    examBoards: initialProfile?.examBoards
      ?? Object.fromEntries(subjects.map((entry) => [entry, initialProfile?.examBoard ?? examBoards[0]])),
    tier: initialProfile?.tier ?? "Higher",
    subject: initialProfile?.subject ?? "Maths",
    topicId: initialProfile?.topicId ?? "",
  });

  const age = useMemo(
    () => (profile.dateOfBirth ? ageOnDate(profile.dateOfBirth) : null),
    [profile.dateOfBirth]
  );

  const availableTopics = useMemo(
    () => topicsFor({
      year: profile.year,
      subject: profile.subject,
      examBoard: profile.examBoards?.[profile.subject],
      tier: profile.tier,
    }),
    [profile.examBoards, profile.subject, profile.tier, profile.year]
  );

  const selectedTopicId = availableTopics.some((item) => item.id === profile.topicId)
    ? profile.topicId
    : availableTopics[0]?.id ?? "";

  function updateCurriculum(partial) {
    setProfile((current) => ({ ...current, ...partial, topicId: "" }));
  }

  function submit(event) {
    event.preventDefault();
    // The API validates a top-level examBoard as well as the per-subject map,
    // and boardFor() falls back to it for a subject the map does not name.
    // Maths is the one every learner takes, so it is the sensible default.
    onSave({
      ...profile,
      topicId: selectedTopicId,
      examBoard: profile.examBoards?.Maths ?? examBoards[0],
    });
  }

  return (
    <main className="profile-page">
      <section className="profile-intro">
        <div className="profile-mark"><GraduationCap size={28} /></div>
        <p className="eyebrow">Personal learning path</p>
        <h1>Set up the learner profile</h1>
        <p>We use the school year to show only the right curriculum and tune tutor explanations to the learner's level.</p>
        <div className="profile-privacy"><ShieldCheck size={18} /><span>Profile details are protected in Azure and are never included in AI tutor prompts.</span></div>
      </section>

      <form className="profile-form" onSubmit={submit}>
        <label>
          <span><UserRound size={17} /> Learner's first name</span>
          <input
            autoComplete="given-name"
            maxLength="40"
            onChange={(event) => setProfile({ ...profile, firstName: event.target.value })}
            placeholder="First name"
            required
            value={profile.firstName}
          />
        </label>

        <label>
          <span><CalendarDays size={17} /> Date of birth</span>
          <input
            max={new Date().toISOString().slice(0, 10)}
            min="2008-09-01"
            onChange={(event) => setProfile({ ...profile, dateOfBirth: event.target.value })}
            required
            type="date"
            value={profile.dateOfBirth}
          />
          {age !== null && <small>Current age: {age}</small>}
        </label>

        <fieldset>
          <legend>Current school year</legend>
          <div className="year-options">
            {schoolYears.map((year) => (
              <button
                className={Number(profile.year) === year ? "active" : ""}
                disabled={yearLocked}
                key={year}
                onClick={() => updateCurriculum({ year })}
                type="button"
              >
                <strong>Year {year}</strong>
                <span>{year <= 9 ? "KS3" : "GCSE"}</span>
              </button>
            ))}
          </div>
          {yearLocked && <p className="year-locked-note">The school year was fixed during paid signup and cannot be changed.</p>}
        </fieldset>

        {Number(profile.year) >= 9 && (
          <div className="gcse-options">
            <fieldset className="board-fieldset">
              <legend>Exam board for each subject</legend>
              <p className="board-note">
                Chosen from Year 9, when GCSE preparation starts. Questions are written to the board
                you pick, so it is worth checking with the school.
              </p>
              <div className="board-grid">
                {subjects.map((entry) => (
                  <label key={entry}>
                    {entry}
                    <select
                      onChange={(event) => updateCurriculum({
                        examBoards: { ...profile.examBoards, [entry]: event.target.value },
                      })}
                      value={profile.examBoards?.[entry] ?? examBoards[0]}
                    >
                      {examBoards.map((board) => <option key={board}>{board}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            </fieldset>
            {/* Tier entry is only decided for the exam years. */}
            {Number(profile.year) >= 10 && <label>
              Maths and Science tier
              <select onChange={(event) => updateCurriculum({ tier: event.target.value })} value={profile.tier}>
                {tiers.map((tier) => <option key={tier}>{tier}</option>)}
              </select>
            </label>}
          </div>
        )}

        <section className="curriculum-choice" aria-labelledby="curriculum-choice-title">
          <div className="choice-heading">
            <BookOpen size={18} />
            <div>
              <h2 id="curriculum-choice-title">Choose a starting topic</h2>
              <p>Showing curriculum topics for Year {profile.year}</p>
            </div>
          </div>

          <label>
            Subject
            <select
              onChange={(event) => updateCurriculum({ subject: event.target.value })}
              value={profile.subject}
            >
              {subjects.map((subject) => <option key={subject}>{subject}</option>)}
            </select>
          </label>

          <div className="topic-choice-list" role="radiogroup" aria-label={`Year ${profile.year} ${profile.subject} topics`}>
            {availableTopics.map((item) => (
              <button
                aria-checked={item.id === selectedTopicId}
                className={item.id === selectedTopicId ? "topic-choice active" : "topic-choice"}
                key={item.id}
                onClick={() => setProfile({ ...profile, topicId: item.id })}
                role="radio"
                type="button"
              >
                <span className="topic-choice-check"><Check size={14} /></span>
                <span>
                  <small>{item.unit}</small>
                  <strong>{item.title}</strong>
                  <span>{item.goal}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="profile-actions">
          {onCancel && <button className="secondary-button" onClick={onCancel} type="button">Cancel</button>}
          <button className="profile-submit" type="submit">Open learning path <ArrowRight size={18} /></button>
        </div>
      </form>
    </main>
  );
}
