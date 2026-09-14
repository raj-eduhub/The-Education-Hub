import React, { useEffect, useRef, useState } from "react";
import { BookOpenCheck, BrainCircuit, GraduationCap, ShieldCheck } from "lucide-react";

export function LoginScreen({ onCredential, error, checking }) {
  const buttonRef = useRef(null);
  const [providerReady, setProviderReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (window.google?.accounts?.id && buttonRef.current) {
        window.clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => onCredential(credential),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          shape: "rectangular",
          theme: "outline",
          text: "continue_with",
          size: "large",
          logo_alignment: "left",
          width: 320,
        });
        setProviderReady(true);
      } else if (attempts >= 50) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [clientId, onCredential]);

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-brand">
          <span><GraduationCap size={26} /></span>
          <strong>Education Hub</strong>
        </div>
        <div className="login-copy">
          <p className="eyebrow">KS3 to GCSE</p>
          <h1>Learn with focus.<br />Revise with confidence.</h1>
          <p>Clear learning paths, curriculum goals, and an AI tutor that meets each student at the right level.</p>
        </div>
        <div className="login-benefits">
          <div><BookOpenCheck size={20} /><span>Curriculum-led topics</span></div>
          <div><BrainCircuit size={20} /><span>Patient AI explanations</span></div>
          <div><ShieldCheck size={20} /><span>Controlled student access</span></div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-box">
          <div className="mobile-login-brand"><GraduationCap size={24} /><strong>Education Hub</strong></div>
          <p className="eyebrow">Welcome</p>
          <h2>Sign in to continue</h2>
          <p className="login-intro">Use your Google account to open your learning dashboard.</p>
          <div className="google-button" ref={buttonRef} />
          {!clientId && <p className="login-error">Google sign-in needs a client ID in the app configuration.</p>}
          {clientId && !providerReady && !checking && <p className="login-status">Loading secure sign-in...</p>}
          {checking && <p className="login-status">Checking your Education Hub access...</p>}
          {error && <p className="login-error" role="alert">{error}</p>}
          <p className="privacy-note">Your password is handled by Google and is never shared with Education Hub.</p>
        </div>
      </section>
    </main>
  );
}
