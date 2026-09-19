import React, { useState } from "react";
import { BadgeCheck, BookOpenCheck, Check, GraduationCap, LockKeyhole, LogOut, ShieldCheck } from "lucide-react";

// One plan, one price, billed monthly. There is no trial: the subscription
// starts and is charged today, and it can be cancelled at any time.
const price = { amount: "GBP 9.99", suffix: "/month", note: "Billed monthly from today. Cancel any time." };

export function SubscriptionPage({ checkoutState, currentUser, onCheckout, onPrivacy, onSignOut }) {
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function subscribe() {
    setSubmitting(true);
    setError("");
    try {
      await onCheckout();
    } catch (checkoutError) {
      setError(checkoutError.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="subscription-page">
      <header className="subscription-nav">
        <div><span><GraduationCap size={22} /></span><strong>Education Hub</strong></div>
        <div><small>{currentUser.email}</small><button onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button></div>
      </header>

      <section className="subscription-content">
        <div className="subscription-intro">
          <p className="eyebrow">Education Hub subscription</p>
          <h1>A focused learning plan for Years 7 to 11</h1>
          <p>One subscription covering the complete curriculum, diagnostics, AI tutoring, and progress tracking. Learner setup takes a minute and happens right after payment.</p>
          <div className="subscription-benefits">
            <div><BookOpenCheck size={19} /><span><strong>Seven subjects</strong><small>Year-specific KS3 and GCSE pathways</small></span></div>
            <div><BadgeCheck size={19} /><span><strong>Adaptive support</strong><small>Learn, Practice, Exam, and Review modes</small></span></div>
            <div><ShieldCheck size={19} /><span><strong>Parent visibility</strong><small>Progress, confidence, and learning time</small></span></div>
          </div>
        </div>

        <section className="subscription-plan" aria-labelledby="plan-title">
          <div className="plan-heading">
            <span>One learner account</span>
            <h2 id="plan-title">Learner plan</h2>
            <p><strong>{price.amount}</strong><span>{price.suffix}</span></p>
            <small>{price.note}</small>
          </div>
          <ul>
            <li><Check size={17} />Complete Year 7-11 curriculum</li>
            <li><Check size={17} />Initial diagnostic and personal learning path</li>
            <li><Check size={17} />Azure AI tutor across four learning modes</li>
            <li><Check size={17} />Student and parent progress dashboards</li>
            <li><Check size={17} />Cancel any time from Account and privacy</li>
          </ul>

          <div className="subscription-consent">
            <label><input checked={terms} onChange={(event) => setTerms(event.target.checked)} type="checkbox" /><span>I agree to the <button onClick={() => onPrivacy("terms")} type="button">subscription terms</button> and have read the <button onClick={() => onPrivacy("privacy")} type="button">privacy notice</button>.</span></label>
          </div>

          {checkoutState === "cancelled" && <p className="checkout-note">Checkout was cancelled. No charge was made.</p>}
          {error && <p className="subscription-error" role="alert">{error}</p>}
          <button className="subscribe-button" disabled={!terms || submitting} onClick={subscribe} type="button">
            <LockKeyhole size={17} /> {submitting ? "Opening secure checkout..." : "Continue to secure payment"}
          </button>
          <p className="payment-note">Payment details are collected and stored by Stripe, not Education Hub.</p>
        </section>
      </section>
    </main>
  );
}
