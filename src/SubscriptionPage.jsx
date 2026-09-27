import React, { useRef, useState } from "react";
import { BadgeCheck, BookOpenCheck, Check, LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { mountCheckoutForm } from "./stripeCheckout.js";
import { BrandLogo } from "./BrandLogo.jsx";

// One plan, one price, billed monthly. There is no trial: the subscription
// starts and is charged today, and it can be cancelled at any time.
const price = { amount: "£14.99", suffix: "/month", note: "Billed monthly from today. Cancel any time." };

export function SubscriptionPage({ checkoutState, currentUser, onCheckout, onPrivacy, onSignOut }) {
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  // The card form is rendered by Stripe inside its own iframe, so nothing here
  // ever touches a card number. It is mounted on demand rather than at load,
  // because creating a Checkout Session is a billable API call and most people
  // opening this page are reading it, not paying yet.
  async function subscribe() {
    setSubmitting(true);
    setError("");
    try {
      const clientSecret = await onCheckout();
      setPaying(true);
      await mountCheckoutForm(clientSecret, formRef.current ?? "#checkout-form", { onError: setError });
    } catch (checkoutError) {
      setError(checkoutError.message);
      setPaying(false);
      setSubmitting(false);
    }
  }

  return (
    <main className="subscription-page">
      <header className="subscription-nav">
        <div><BrandLogo height={36} /></div>
        <div><small>{currentUser.email}</small><button onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button></div>
      </header>

      <section className="subscription-content">
        <div className="subscription-intro">
          <p className="eyebrow">Education Hub subscription</p>
          <h1>A focused learning plan for Years 7 to 11</h1>
          <p>One subscription covering the complete curriculum, diagnostics, Sonia the AI tutor, and progress tracking. Learner setup takes a minute and happens right after payment.</p>
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
            <li><Check size={17} />Sonia, your AI tutor, across four learning modes</li>
            <li><Check size={17} />Student and parent progress dashboards</li>
            <li><Check size={17} />Cancel any time from Account and privacy</li>
          </ul>

          <div className="subscription-consent">
            <label><input checked={terms} onChange={(event) => setTerms(event.target.checked)} type="checkbox" /><span>I agree to the <button onClick={() => onPrivacy("terms")} type="button">subscription terms</button> and have read the <button onClick={() => onPrivacy("privacy")} type="button">privacy notice</button>.</span></label>
          </div>

          {checkoutState === "cancelled" && <p className="checkout-note">Checkout was cancelled. No charge was made.</p>}
          {error && <p className="subscription-error" role="alert">{error}</p>}

          {/* Stripe renders the card fields inside this element, in its own
              iframe. It stays in the tree once paying, so the mount target
              cannot disappear underneath the form. */}
          <div className="checkout-form" hidden={!paying} id="checkout-form" ref={formRef}></div>

          {!paying && <button className="subscribe-button" disabled={!terms || submitting} onClick={subscribe} type="button">
            <LockKeyhole size={17} /> {submitting ? "Opening secure payment..." : "Continue to secure payment"}
          </button>}
          <p className="payment-note">Payment details are collected and stored by Stripe, not Education Hub.</p>
        </section>
      </section>
    </main>
  );
}
