import React, { useEffect, useState } from "react";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { apiFetch, readJson } from "./auth.js";
import { ThemeToggle } from "./ThemeToggle.jsx";

export function LoginScreen({ onAuthenticated, error, checking }) {
  const [view, setView] = useState("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const signup = view === "register";
  const forgot = view === "forgot";
  function show(next) { setView(next); setMessage(""); setSent(false); }
  async function submit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (signup && form.password !== form.confirm) { setMessage("Passwords do not match."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await apiFetch(`/api/auth/${view === "login" ? "login" : signup ? "register" : "forgot"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error);
      // Registration returns 202 and no session: the address has to be proven
      // before the account grants anything.
      if (forgot || (signup && data.verificationRequired)) setSent(true);
      else await onAuthenticated();
    } catch (failure) { setMessage(failure.message); }
    finally { setBusy(false); }
  }
  return <main className="password-login"><ThemeToggle className="floating" /><div className="login-box">
    <div className="password-brand"><GraduationCap size={30} /><strong>Education Hub</strong></div>
    <div className="password-tabs" role="group" aria-label="Account access">
      <button type="button" aria-pressed={view === "login"} onClick={() => show("login")}><LogIn size={18} /> Log in</button>
      <button type="button" aria-pressed={signup} onClick={() => show("register")}><UserPlus size={18} /> Sign up</button>
    </div>
    <h1>{forgot ? "Reset your password" : signup ? "Create your account" : "Welcome back"}</h1>
    {signup && <p>Parent or guardian account. We will email a link to confirm your address, and a paid subscription and learner setup are required before learning begins.</p>}
    {forgot && !sent && <p>Enter the email registered to the account. If it matches an account, we send the username and a reset link to that address.</p>}
    {sent ? <div className="login-sent">
      <p role="status">{signup
        ? "Check your email. We have sent a link to confirm the address, which expires in 24 hours. The account cannot be used until it is confirmed."
        : "If that email matches an Education Hub account, a reset link is on its way. The link expires in one hour and can be used once."}</p>
      <button type="button" className="login-link" onClick={() => show("login")}>Back to log in</button>
    </div> : <form className="password-form" key={view} onSubmit={submit}>
      {forgot ? <label>Account email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label> : <>
        <label>Username<input name="username" autoComplete="username" required minLength={3} maxLength={32} pattern="[A-Za-z0-9_.\-]{3,32}" /></label>
        {signup && <label>Parent or guardian email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
        <label>{signup ? "Password (15-128 characters)" : "Password"}<input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 15 : 1} maxLength={128} /></label>
        {signup && <label>Confirm password<input name="confirm" type="password" autoComplete="new-password" required maxLength={128} /></label>}
      </>}
      {(message || error) && <p role="alert" className="login-error">{message || error}</p>}
      <button type="submit" disabled={busy || checking}>{busy || checking ? "Please wait..." : forgot ? "Send reset link" : signup ? "Sign up" : "Log in"}</button>
      {!signup && <button type="button" className="login-link" onClick={() => show(forgot ? "login" : "forgot")}>{forgot ? "Back to log in" : "Forgot your password?"}</button>}
    </form>}
  </div></main>;
}


export function EmailVerification({ token }) {
  const [status, setStatus] = useState("working");
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        const data = await readJson(response);
        if (!response.ok) throw new Error(data.error ?? "This confirmation link is unavailable.");
        setStatus("done");
      })
      .catch((failure) => {
        setMessage(failure.message);
        setStatus("error");
      });
  }, [token]);

  return <main className="password-login"><ThemeToggle className="floating" /><div className="login-box">
    <div className="password-brand"><GraduationCap size={30} /><strong>Education Hub</strong></div>
    <h1>{status === "done" ? "Email confirmed" : status === "error" ? "Link unavailable" : "Confirming your email"}</h1>
    {status === "working" && <p role="status">One moment.</p>}
    {status === "done" && <div className="login-sent">
      <p role="status">Your address is confirmed and you are signed in. Choose a subscription to begin.</p>
      <button type="button" onClick={() => window.location.assign("/")}>Continue</button>
    </div>}
    {status === "error" && <div className="login-sent">
      <p role="alert" className="login-error">{message}</p>
      <p>Confirmation links expire after 24 hours and can be used once. Request a new one with Forgot your password.</p>
      <button type="button" className="login-link" onClick={() => window.location.assign("/")}>Back to log in</button>
    </div>}
  </div></main>;
}

export function PasswordReset({ token }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (form.password !== form.confirm) { setMessage("Passwords do not match."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await apiFetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: form.password }) });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error);
      setDone(true);
    } catch (failure) { setMessage(failure.message); }
    finally { setBusy(false); }
  }
  return <main className="password-login"><ThemeToggle className="floating" /><div className="login-box">
    <div className="password-brand"><GraduationCap size={30} /><strong>Education Hub</strong></div>
    <h1>Choose a new password</h1>
    {done ? <div className="login-sent">
      <p role="status">Your password is updated and every signed-in device was signed out. Log in with your new password.</p>
      <button type="button" className="login-link" onClick={() => window.location.assign("/")}>Go to log in</button>
    </div> : <form className="password-form" onSubmit={submit}>
      <p>This link can be used once and expires one hour after it was requested.</p>
      <label>New password (15-128 characters)<input name="password" type="password" autoComplete="new-password" required minLength={15} maxLength={128} /></label>
      <label>Confirm new password<input name="confirm" type="password" autoComplete="new-password" required maxLength={128} /></label>
      {message && <p role="alert" className="login-error">{message}</p>}
      <button type="submit" disabled={busy}>{busy ? "Please wait..." : "Update password"}</button>
      <button type="button" className="login-link" onClick={() => window.location.assign("/")}>Back to log in</button>
    </form>}
  </div></main>;
}
