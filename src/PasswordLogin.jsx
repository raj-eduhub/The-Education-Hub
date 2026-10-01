import React, { useEffect, useRef, useState } from "react";
import { apiFetch, readJson } from "./auth.js";
import { mountCheckoutForm } from "./stripeCheckout.js";
import { BrandLogo } from "./BrandLogo.jsx";
import { RequiredMark, RequiredNote } from "./RequiredMark.jsx";

// Log in, or ask for a reset. Creating an account is not offered here: that
// happens on the website, where the plan is chosen and paid for, and the
// password is set afterwards from a one-time emailed link.
export function LoginScreen({ onAuthenticated, error, checking }) {
  // ?forgot=1 opens straight on the reset form, for a page that has just told
  // someone to use Forgot your password.
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get("forgot") === "1" ? "forgot" : "login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const signup = false;
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
  return <main className="password-login"><div className="login-box">
    <div className="password-brand"><BrandLogo /></div>
    <p className="login-no-account">New here? Accounts are created at <strong>Y7to11.AI</strong>, where you choose your plan. We email you a link to set your password once payment goes through.</p>
    <h1>{forgot ? "Reset your password" : signup ? "Create your account" : "Welcome back"}</h1>
    {signup && <p>Parent or guardian account. We will email a link to confirm your address, and a paid subscription and learner setup are required before learning begins.</p>}
    {forgot && !sent && <p>Enter the email registered to the account. If it matches an account, we send the username and a reset link to that address.</p>}
    {sent ? <div className="login-sent">
      <p role="status">{signup
        ? "Check your email. We have sent a link to confirm the address, which expires in 24 hours. The account cannot be used until it is confirmed."
        : "If that email matches a Y7to11.AI account, a reset link is on its way. The link expires in one hour and can be used once."}</p>
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

  return <main className="password-login"><div className="login-box">
    <div className="password-brand"><BrandLogo /></div>
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
      const response = await apiFetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, username: form.username, password: form.password }) });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error);
      setDone(true);
    } catch (failure) { setMessage(failure.message); }
    finally { setBusy(false); }
  }
  return <main className="password-login"><div className="login-box">
    <div className="password-brand"><BrandLogo /></div>
    <h1>Choose a new password</h1>
    {done ? <div className="login-sent">
      <p role="status">Your password is updated and every signed-in device was signed out. Log in with your new password.</p>
      <button type="button" className="login-link" onClick={() => window.location.assign("/")}>Go to log in</button>
    </div> : <form className="password-form" onSubmit={submit}>
      <p>Enter the username from the email this link came in, then choose your password. The link can be used once.</p>
      <RequiredNote />
      {/* Asked for rather than filled in: it has to match the account the link
          was sent for, and typing it here lets a password manager save the
          username and password together. */}
      <label><span>Username<RequiredMark /></span><input name="username" autoCapitalize="none" autoComplete="username" required minLength={3} maxLength={32} pattern="[A-Za-z0-9_.\-]{3,32}" spellCheck={false} /></label>
      <label><span>New password (15-128 characters)<RequiredMark /></span><input name="password" type="password" autoComplete="new-password" required minLength={15} maxLength={128} /></label>
      <label><span>Confirm new password<RequiredMark /></span><input name="confirm" type="password" autoComplete="new-password" required maxLength={128} /></label>
      {message && <p role="alert" className="login-error">{message}</p>}
      <button type="submit" disabled={busy}>{busy ? "Please wait..." : "Update password"}</button>
      <button type="button" className="login-link" onClick={() => window.location.assign("/")}>Back to log in</button>
    </form>}
  </div></main>;
}

// Arriving from the website, where the username, email and consent were given.
//
// No password is asked for: the account is created without one and the password
// is set later, from a one-time emailed link. So this is a confirmation rather
// than a form - check the two details, then either start free (the link is
// sent now) or pay (the link is sent when payment clears).
export function SignupHandoff({ username, email }) {
  const [busy, setBusy] = useState(false);
  // Set once a free start has sent the set-password email.
  const [freeStarted, setFreeStarted] = useState(false);
  const [message, setMessage] = useState("");
  // Set when the details belong to an account that already exists, so the
  // way forward is a button rather than advice in a sentence.
  const [conflict, setConflict] = useState("");
  // Set once the card form is on the page. Stripe's form ui_mode answers with a
  // client_secret and no url, so the payment is taken here rather than on a
  // page redirected to.
  const [paying, setPaying] = useState(false);
  const formRef = useRef(null);

  async function startFree() {
    setBusy(true);
    setMessage("");
    setConflict("");
    try {
      const response = await apiFetch("/api/auth/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, consent: true, start: "free" }),
      });
      const data = await readJson(response);
      if (!response.ok) {
        if (response.status === 409) setConflict(data.code ?? "existing");
        throw new Error(data.error ?? "The account could not be created.");
      }
      setFreeStarted(true);
    } catch (failure) {
      setMessage(failure.message);
    } finally {
      setBusy(false);
    }
  }

  async function create(event) {
    event.preventDefault();
    const registration = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setMessage("");
    setConflict("");
    try {
      const response = await apiFetch("/api/auth/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registration.username,
          email: registration.email,
          consent: true,
        }),
      });
      const data = await readJson(response);
      if (!response.ok) {
        if (response.status === 409) setConflict(data.code ?? "existing");
        throw new Error(data.error ?? "The account could not be created.");
      }

      // Straight on to Stripe using the grant that came back. There is no
      // session yet - the address has not been proven - so the grant is what
      // authorises this one checkout.
      const checkout = await apiFetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutToken: data.checkoutToken }),
      });
      const session = await readJson(checkout);
      if (!checkout.ok) throw new Error(session.error ?? "Checkout could not be opened.");
      // A hosted checkout hands back a url to send the parent to. The embedded
      // form hands back a client_secret instead and has to be mounted on a page
      // in this application, which is not wired for a sign-up that has no
      // session yet: say so rather than leaving a button that does nothing.
      if (session.url) {
        window.location.assign(session.url);
        return;
      }
      if (!session.client_secret) throw new Error("The payment form could not be opened. Please try again, or contact support.");
      setPaying(true);
      await mountCheckoutForm(session.client_secret, formRef.current, { onError: setMessage });
      setBusy(false);
    } catch (failure) {
      setMessage(failure.message);
      setPaying(false);
      setBusy(false);
    }
  }

  if (freeStarted) {
    return <main className="password-login"><div className="login-box">
      <div className="password-brand"><BrandLogo /></div>
      <h1>Check your email</h1>
      <p>We have sent a link to <strong>{email}</strong> to set your password. It works for seven days.</p>
      <p className="login-no-account">Once it is set, sign in with the username <strong>{username}</strong>, tell us about the learner, and choose one topic to study free for a week.</p>
      <button type="button" className="login-link" onClick={() => window.location.assign("/?forgot=1")}>Didn't get the email? Send another link</button>
    </div></main>;
  }

  return <main className="password-login"><div className="login-box">
    <div className="password-brand"><BrandLogo /></div>
    <h1>Check your details</h1>
    <p>These came across from Y7to11.AI. Try one topic free for a week with no card needed, or subscribe now for every topic. Either way we email you a link to set your password.</p>
    <form className="password-form" onSubmit={create}>
      <label>Username<input autoComplete="username" name="username" readOnly value={username} /></label>
      <label>Email<input autoComplete="email" name="email" readOnly type="email" value={email} /></label>
      {/* Stripe renders the card fields in here, in its own iframe. Kept in the
          tree throughout so the mount target cannot disappear under the form. */}
      <div className="checkout-form" hidden={!paying} ref={formRef}></div>
      {message && <p role="alert" className="login-error">{message}</p>}
      {paying ? null : conflict ? <>
        <button type="button" onClick={() => window.location.assign("/")}>Sign in</button>
        <button type="button" className="login-link" onClick={() => window.location.assign("/?forgot=1")}>Forgot your password?</button>
      </> : <>
        <button type="button" disabled={busy} onClick={startFree}>{busy ? "Please wait..." : "Try one topic free for a week"}</button>
        <button type="submit" className="secondary-button" disabled={busy}>Subscribe now - £14.99/month</button>
      </>}
      <button type="button" className="login-link" onClick={() => window.location.assign("/")}>These are wrong - start again</button>
    </form>
  </div></main>;
}
