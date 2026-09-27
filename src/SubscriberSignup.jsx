import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, GraduationCap, LockKeyhole, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { apiFetch, authFetch, readJson } from "./auth.js";
import { subjects } from "./curriculum.js";
import { yearFromDateOfBirth } from "./schoolYear.js";
import { BrandLogo } from "./BrandLogo.jsx";

const years = [7, 8, 9, 10, 11];
// Exam boards are chosen per subject, because a school rarely enters every
// subject with the same board.
const signupBoards = ["AQA", "Edexcel"];
const noBoards = Object.fromEntries(subjects.map((subject) => [subject, ""]));

// Collects the student and guardian details. Two ways in:
//
//   in-app    signed in, payment just taken, no token - the normal path
//   by link   an emailed one-time token, kept for invitations already sent
//
// The emailed path also sets the account password, because that flow could be
// reached by someone who had not signed in. The in-app path never needs to: the
// person filling this in is already authenticated.
export function SubscriberSignup({ preview = false, token, account, onComplete }) {
  const byLink = Boolean(token);
  const accountEmail = (account?.email ?? "").trim().toLowerCase();
  const [invite, setInvite] = useState(
    preview ? { email: accountEmail || "parent@example.com" } : byLink ? null : { email: accountEmail }
  );
  const [status, setStatus] = useState(preview || !byLink ? "ready" : "loading");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    guardianName: "",
    guardianRelationship: "parent",
    guardianPhone: "",
    studentFirstName: "",
    dateOfBirth: "",
    year: 7,
    examBoards: noBoards,
    tier: "",
    parentalConsent: false,
    password: "",
  });

  useEffect(() => {
    if (preview || !byLink) return;
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
  }, [byLink, preview, token]);

  // The website email becomes the account identity during reservation. Keep
  // the setup form aligned with that account if session data hydrates after
  // this component's first render; the address remains read-only here.
  useEffect(() => {
    if (byLink || !accountEmail) return;
    setInvite((current) => current?.email === accountEmail ? current : { ...current, email: accountEmail });
  }, [accountEmail, byLink]);

  // GCSE preparation begins in Year 9, so the board is chosen from then on.
  // Foundation and Higher entry is only decided for the exam years.
  // Worked out from the date of birth rather than chosen, so it is one less
  // thing to hold about a child and one less thing that can be set wrongly.
  // The server derives it again and does not trust this value.
  const derivedYear = useMemo(() => {
    if (!form.dateOfBirth) return null;
    const year = yearFromDateOfBirth(form.dateOfBirth);
    return Number.isFinite(year) ? year : null;
  }, [form.dateOfBirth]);
  const inRange = derivedYear !== null && derivedYear >= 7 && derivedYear <= 11;
  const choosesBoards = useMemo(() => Number(derivedYear) >= 9, [derivedYear]);
  const isGcse = useMemo(() => Number(derivedYear) >= 10, [derivedYear]);

  // Everything on this form is required. Boards are only asked for from Year 9
  // and the tier only from Year 10, so what "complete" means depends on the
  // year the date of birth works out to.
  const missing = useMemo(() => {
    const gaps = [];
    if (!form.guardianName.trim()) gaps.push("the parent or guardian's full name");
    if (!form.guardianPhone.trim()) gaps.push("a mobile number");
    if (!form.studentFirstName.trim()) gaps.push("the student's first name");
    if (!inRange) gaps.push("a date of birth that works out as Year 7 to Year 11");
    if (choosesBoards && subjects.some((subject) => !form.examBoards[subject])) gaps.push("an exam board for every subject");
    if (isGcse && !form.tier) gaps.push("a tier for maths and science");
    if (!form.parentalConsent) gaps.push("your confirmation below");
    return gaps;
  }, [form, inRange, choosesBoards, isGcse]);

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
      const details = { ...form, examBoard: form.examBoards.Maths };
      if (!byLink) delete details.password;
      const request = byLink ? apiFetch : authFetch;
      const url = byLink ? `/api/signup/${encodeURIComponent(token)}` : "/api/onboarding";
      const response = await request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Learner setup could not be completed.");
      setStatus("complete");
      // In the app the learner can go straight in; there is nothing to sign in to again.
      if (!byLink) onComplete?.(data.profile);
    } catch (submitError) {
      setError(submitError.message);
      setStatus("ready");
    }
  }

  if (status === "loading") return <main className="signup-status-page"><p>Checking your secure signup link...</p></main>;
  if (status === "error") return <main className="signup-status-page"><div><LockKeyhole size={28} /><h1>Signup link unavailable</h1><p>{error}</p></div></main>;
  if (status === "complete") return <main className="signup-status-page"><div><CheckCircle2 size={32} /><p className="eyebrow">Setup complete</p><h1>The learning account is ready</h1>
    {byLink
      ? <><p>Sign in with <strong>{invite.email}</strong> to open the learner's curriculum.</p><a href="/">Continue to sign in</a></>
      : <p>Opening the curriculum...</p>}
  </div></main>;

  return <main className="subscriber-signup-page">
    <header className="signup-header"><BrandLogo height={36} /><small>Subscription active</small></header>
    <div className="signup-layout">
      <section className="signup-intro">
        <p className="eyebrow">Secure account setup</p>
        <h1>Tell us about the learner</h1>
        <p>One more step. These details build the learning path and are linked to your subscription.</p>
        <div><ShieldCheck size={19} /><span><strong>The school year is permanent</strong><small>Check it carefully. Once submitted, it cannot be changed from the app.</small></span></div>
      </section>

      <form className="signup-form" onSubmit={submit}>
        {byLink && <label>Set your account password<input type="password" autoComplete="new-password" minLength={15} maxLength={128} required value={form.password} onChange={event => update("password", event.target.value)} /></label>}
        <section>
          <div className="signup-section-heading"><UsersRound size={20} /><div><h2>Parent or guardian</h2><p>Account holder and primary contact</p></div></div>
          <div className="signup-fields two-columns">
            <label>Full name<input autoComplete="name" onChange={(event) => update("guardianName", event.target.value)} required value={form.guardianName} /></label>
            <label>Relationship<select onChange={(event) => update("guardianRelationship", event.target.value)} value={form.guardianRelationship}><option value="parent">Parent</option><option value="legal-guardian">Legal guardian</option><option value="carer">Carer</option></select></label>
            <label>Email<input autoComplete="email" readOnly type="email" value={invite.email} /></label>
            <label>Mobile number<input autoComplete="tel" inputMode="tel" onChange={(event) => update("guardianPhone", event.target.value)} placeholder="07700 900123" required type="tel" value={form.guardianPhone} /></label>
          </div>
        </section>

        <section>
          <div className="signup-section-heading"><UserRound size={20} /><div><h2>Student</h2><p>Details used to build the learning path</p></div></div>
          <div className="signup-fields two-columns">
            <label>First name<input autoComplete="given-name" onChange={(event) => update("studentFirstName", event.target.value)} required value={form.studentFirstName} /></label>
            <label><span>Date of birth</span><div className="input-with-icon"><CalendarDays size={17} /><input max={new Date().toISOString().slice(0, 10)} onChange={(event) => update("dateOfBirth", event.target.value)} required type="date" value={form.dateOfBirth} /></div></label>
          </div>
        </section>

        <section>
          <div className="signup-section-heading"><GraduationCap size={20} /><div><h2>Curriculum year</h2><p>Worked out from the date of birth above</p></div></div>
          <div className="derived-year">
            {!form.dateOfBirth
              ? <p>Enter a date of birth and the school year will appear here.</p>
              : inRange
                ? <><div className="derived-year-summary"><strong>Year {derivedYear}</strong><span>{derivedYear <= 8 ? "Key Stage 3" : derivedYear === 9 ? "GCSE preparation" : "GCSE"}</span></div>
                  <p className="year-locked-note">Check this is right. The school year cannot be changed once you continue, and it decides the whole curriculum.</p></>
                : <p className="out-of-range">Y7to11.AI covers Years 7 to 11. That date of birth works out as {derivedYear !== null && derivedYear > 11 ? "older than Year 11" : "younger than Year 7"}.</p>}
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
            {isGcse && <div className="signup-fields gcse-signup-fields"><label>Maths and Science tier<select onChange={(event) => update("tier", event.target.value)} required value={form.tier}><option disabled value="">Choose a tier</option><option>Foundation</option><option>Higher</option></select></label></div>}
          </>}
        </section>

        <label className="signup-consent"><input checked={form.parentalConsent} onChange={(event) => update("parentalConsent", event.target.checked)} type="checkbox" /><span>I confirm that I am the parent, legal guardian, or carer and consent to Y7to11.AI processing these details to provide the learning service.</span></label>
        {error && <p className="signup-error" role="alert">{error}</p>}
        {missing.length > 0 && <p className="signup-missing">Still needed: {missing.join(", ")}.</p>}
        <button className="signup-submit" disabled={missing.length > 0 || status === "submitting"} type="submit">{status === "submitting" ? "Saving..." : "Start learning"}<ArrowRight size={18} /></button>
      </form>
    </div>
  </main>;
}
