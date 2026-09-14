import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, GraduationCap, LockKeyhole, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { apiFetch, readJson } from "./auth.js";
import { subjects } from "./curriculum.js";

const years = [7, 8, 9, 10, 11];
// Exam boards are chosen per subject, because a school rarely enters every
// subject with the same board.
const signupBoards = ["AQA", "Edexcel"];
const defaultBoards = Object.fromEntries(subjects.map((subject) => [subject, signupBoards[0]]));

export function SubscriberSignup({ preview = false, token }) {
  const [invite, setInvite] = useState(preview ? { email: "parent@example.com" } : null);
  const [status, setStatus] = useState(preview ? "ready" : "loading");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    guardianName: "",
    guardianRelationship: "parent",
    guardianPhone: "",
    studentFirstName: "",
    studentLastName: "",
    dateOfBirth: "",
    year: 7,
    schoolName: "",
    examBoards: defaultBoards,
    tier: "Higher",
    parentalConsent: false,
    password: "",
  });

  useEffect(() => {
    if (preview) return;
    apiFetch(`/api/signup/${encodeURIComponent(token)}`)
      .then(async (response) => {
        const data = await readJson(response);
        if (!response.ok) throw new Error(data.error ?? "This signup link is unavailable.");
        setInvite(data);
        setStatus("ready");
      })
      .catch((loadError) => {
        setError(loadError.message);
        setStatus("error");
      });
  }, [preview, token]);

  // GCSE preparation begins in Year 9, so the board is chosen from then on.
  // Foundation and Higher entry is only decided for the exam years.
  const choosesBoards = useMemo(() => Number(form.year) >= 9, [form.year]);
  const isGcse = useMemo(() => Number(form.year) >= 10, [form.year]);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (preview) {
      setStatus("complete");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const response = await apiFetch(`/api/signup/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, examBoard: form.examBoards.Maths }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Signup could not be completed.");
      setStatus("complete");
    } catch (submitError) {
      setError(submitError.message);
      setStatus("ready");
    }
  }

  if (status === "loading") return <main className="signup-status-page"><p>Checking your secure signup link...</p></main>;
  if (status === "error") return <main className="signup-status-page"><div><LockKeyhole size={28} /><h1>Signup link unavailable</h1><p>{error}</p></div></main>;
  if (status === "complete") return <main className="signup-status-page"><div><CheckCircle2 size={32} /><p className="eyebrow">Signup complete</p><h1>The learning account is ready</h1><p>Sign in with <strong>{invite.email}</strong> to open the learner's curriculum.</p><a href="/">Continue to sign in</a></div></main>;

  return <main className="subscriber-signup-page">
    <header className="signup-header"><span><GraduationCap size={22} /></span><strong>Education Hub</strong><small>Paid subscription confirmed</small></header>
    <div className="signup-layout">
      <section className="signup-intro">
        <p className="eyebrow">Secure account setup</p>
        <h1>Tell us about the learner</h1>
        <p>Complete the student and parent or guardian details linked to the paid subscription.</p>
        <div><ShieldCheck size={19} /><span><strong>The school year is permanent</strong><small>Check it carefully. Once submitted, it cannot be changed from the app.</small></span></div>
      </section>

      <form className="signup-form" onSubmit={submit}>
        <label>Set your account password<input type="password" autoComplete="new-password" minLength={15} maxLength={128} required value={form.password} onChange={event => update("password", event.target.value)} /></label>
        <section>
          <div className="signup-section-heading"><UsersRound size={20} /><div><h2>Parent or guardian</h2><p>Account holder and primary contact</p></div></div>
          <div className="signup-fields two-columns">
            <label>Full name<input autoComplete="name" onChange={(event) => update("guardianName", event.target.value)} required value={form.guardianName} /></label>
            <label>Relationship<select onChange={(event) => update("guardianRelationship", event.target.value)} value={form.guardianRelationship}><option value="parent">Parent</option><option value="legal-guardian">Legal guardian</option><option value="carer">Carer</option></select></label>
            <label>Email<input readOnly type="email" value={invite.email} /></label>
            <label>Phone number<input autoComplete="tel" onChange={(event) => update("guardianPhone", event.target.value)} required type="tel" value={form.guardianPhone} /></label>
          </div>
        </section>

        <section>
          <div className="signup-section-heading"><UserRound size={20} /><div><h2>Student</h2><p>Details used to build the learning path</p></div></div>
          <div className="signup-fields two-columns">
            <label>First name<input autoComplete="given-name" onChange={(event) => update("studentFirstName", event.target.value)} required value={form.studentFirstName} /></label>
            <label>Last name<input autoComplete="family-name" onChange={(event) => update("studentLastName", event.target.value)} required value={form.studentLastName} /></label>
            <label><span>Date of birth</span><div className="input-with-icon"><CalendarDays size={17} /><input max={new Date().toISOString().slice(0, 10)} onChange={(event) => update("dateOfBirth", event.target.value)} required type="date" value={form.dateOfBirth} /></div></label>
            <label>School name <small>(optional)</small><input onChange={(event) => update("schoolName", event.target.value)} value={form.schoolName} /></label>
          </div>
        </section>

        <section>
          <div className="signup-section-heading"><GraduationCap size={20} /><div><h2>Curriculum year</h2><p>This selection locks when the form is submitted</p></div></div>
          <div className="signup-year-options">
            {years.map((year) => <button className={Number(form.year) === year ? "active" : ""} key={year} onClick={() => update("year", year)} type="button"><strong>Year {year}</strong><span>{year <= 8 ? "KS3" : year === 9 ? "GCSE prep" : "GCSE"}</span></button>)}
          </div>
          {choosesBoards && <>
            <fieldset className="board-picker">
              <legend>Exam board for each subject</legend>
              <p className="board-picker-hint">GCSE preparation begins in Year 9. Pick the board the student will be entered for in each subject, and check the entry codes with the school if you are not sure.</p>
              {subjects.map((subject) => (
                <div className="board-row" key={subject}>
                  <span className="board-subject">{subject}</span>
                  <div className="board-options" role="radiogroup" aria-label={`Exam board for ${subject}`}>
                    {signupBoards.map((board) => (
                      <label className={form.examBoards[subject] === board ? "board-option active" : "board-option"} key={board}>
                        <input
                          checked={form.examBoards[subject] === board}
                          name={`board-${subject}`}
                          onChange={() => update("examBoards", { ...form.examBoards, [subject]: board })}
                          type="radio"
                          value={board}
                        />
                        <span>{board}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>
            {isGcse && <div className="signup-fields gcse-signup-fields"><label>Maths and Science tier<select onChange={(event) => update("tier", event.target.value)} value={form.tier}><option>Foundation</option><option>Higher</option></select></label></div>}
          </>}
        </section>

        <label className="signup-consent"><input checked={form.parentalConsent} onChange={(event) => update("parentalConsent", event.target.checked)} type="checkbox" /><span>I confirm that I am the parent, legal guardian, or carer and consent to Education Hub processing these details to provide the learning service.</span></label>
        {error && <p className="signup-error" role="alert">{error}</p>}
        <button className="signup-submit" disabled={!form.parentalConsent || status === "submitting"} type="submit">{status === "submitting" ? "Creating account..." : "Create learning account"}<ArrowRight size={18} /></button>
      </form>
    </div>
  </main>;
}
