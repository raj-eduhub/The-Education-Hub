import React, { useRef, useState } from "react";
import { ArrowLeft, Check, Gift, LockKeyhole, LogOut, Sparkles } from "lucide-react";
import { mountCheckoutForm } from "./stripeCheckout.js";
import { BrandLogo } from "./BrandLogo.jsx";

// The two ways to start, as plan cards. Both take a card through Stripe:
//
//   trial  7 days free with one topic; £14.99 a month from day 8 unless it is
//          cancelled first. Offered once per account (trialAvailable).
//   full   £14.99 a month from today, every topic straight away.
//
// The features listed are what the app actually does for each, so keep them in
// step with getLearningAccess() and the tutor caps.
const plans = {
  trial: {
    icon: Gift,
    name: "7-day free trial",
    blurb: "Try one topic properly before you pay.",
    price: "£0",
    suffix: "for 7 days",
    after: "then £14.99/month unless you cancel",
    usage: ["One topic of your choice", "Sonia, the AI tutor: 20 questions a day"],
    included: [
      "Lessons, read aloud or on screen",
      "Worked examples, practice and exam questions",
      "Marking and progress tracking",
      "Card needed, nothing charged for 7 days",
      "Cancel before day 8 and pay nothing",
      "Reminder email the day before the first charge",
    ],
    cta: "Start 7-day free trial",
  },
  full: {
    icon: Sparkles,
    name: "Full access",
    blurb: "Every subject and every topic, Years 7 to 11.",
    price: "£14.99",
    suffix: "/month",
    after: "billed monthly from today",
    badge: "Everything",
    usage: ["All seven subjects, every topic in the year", "Sonia, the AI tutor: 200 questions a day"],
    included: [
      "Placement check and a personal learning path",
      "Learn, Practice, Exam and Review modes",
      "AQA and Edexcel, Foundation and Higher",
      "Lessons read aloud, with worked examples",
      "Parent progress dashboard",
      "Cancel any time from Account and privacy",
    ],
    cta: "Subscribe now",
  },
};

export function SubscriptionPage({ checkoutState, currentUser, freeTopic = null, onAccount, onBack, onCheckout, onPrivacy, onSignOut, onSupport, trialAvailable = true, trialEnded = false }) {
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const offered = trialAvailable ? ["trial", "full"] : ["full"];

  // The card form is rendered by Stripe inside its own iframe, so nothing here
  // ever touches a card number. It is mounted on demand rather than at load,
  // because creating a Checkout Session is a billable API call and most people
  // opening this page are reading it, not paying yet.
  async function choose(plan) {
    if (!terms) {
      setError("Tick the box to agree to the subscription terms first.");
      return;
    }
    setSubmitting(plan);
    setError("");
    try {
      const { clientSecret, url, trial } = await onCheckout({ trial: plan === "trial" });
      if (url && !clientSecret) {
        window.location.assign(url);
        return;
      }
      if (!clientSecret) throw new Error("The payment form could not be opened. Please try again, or contact support.");
      setPaying(true);
      await mountCheckoutForm(clientSecret, formRef.current ?? "#checkout-form", { onError: setError, trial });
    } catch (checkoutError) {
      setError(checkoutError.message);
      setPaying(false);
      setSubmitting("");
    }
  }

  return (
    <main className="subscription-page">
      <header className="subscription-nav">
        <div><BrandLogo height={36} /></div>
        <div>
          {onBack && <button onClick={onBack} type="button"><ArrowLeft size={17} /> {freeTopic ? "Back to my free topic" : "Back to the topics"}</button>}
          <small>{currentUser.email}</small><button onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button>
        </div>
      </header>

      <section className="plan-page">
        <header className="plan-page-heading">
          <p className="eyebrow">{trialEnded ? "Your free trial has ended" : "Y7to11.AI plans"}</p>
          <h1>{trialEnded ? "Carry on with full access" : trialAvailable ? "Try it free, or start straight away" : "Start your subscription"}</h1>
          <p>{trialEnded
            ? `${freeTopic ? `The free trial of ${freeTopic.title} is over. ` : ""}Subscribe to pick up where you left off. The learner's setup and progress are kept.`
            : "One learner, Years 7 to 11, KS3 to GCSE. Payment is taken securely by Stripe, and you can cancel any time."}</p>
        </header>

        <div className={`plan-cards${offered.length === 1 ? " single" : ""}`}>
          {offered.map((key) => {
            const plan = plans[key];
            const Icon = plan.icon;
            return <article className={`plan-card plan-${key}`} key={key} aria-labelledby={`plan-${key}-name`}>
              {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              <Icon className="plan-icon" size={34} strokeWidth={1.6} />
              <h2 id={`plan-${key}-name`}>{plan.name}</h2>
              <p className="plan-blurb">{plan.blurb}</p>
              <p className="plan-price"><strong>{plan.price}</strong><span>{plan.suffix}</span></p>
              <p className="plan-after">{plan.after}</p>
              <p className="plan-section">Usage</p>
              <ul>{plan.usage.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
              <p className="plan-section">Included</p>
              <ul>{plan.included.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
              {!paying && <button className={`plan-cta plan-cta-${key}`} disabled={Boolean(submitting)} onClick={() => choose(key)} type="button">
                <LockKeyhole size={17} /> {submitting === key ? "Opening secure payment..." : plan.cta}
              </button>}
            </article>;
          })}
        </div>

        <div className="plan-checkout">
          {!paying && <div className="subscription-consent">
            <label><input checked={terms} onChange={(event) => { setTerms(event.target.checked); setError(""); }} type="checkbox" /><span>I agree to the <button onClick={() => onPrivacy("terms")} type="button">subscription terms</button> and have read the <button onClick={() => onPrivacy("privacy")} type="button">privacy notice</button>.</span></label>
          </div>}
          {checkoutState === "cancelled" && <p className="checkout-note">Checkout was cancelled. No charge was made.</p>}
          {error && <p className="subscription-error" role="alert">{error}</p>}

          {/* Stripe renders the card fields inside this element, in its own
              iframe. It stays in the tree once paying, so the mount target
              cannot disappear underneath the form. */}
          <div className="checkout-form" hidden={!paying} id="checkout-form" ref={formRef}></div>
          <p className="payment-note">Payment details are collected and stored by Stripe, not Y7to11.AI.</p>
          {/* When this is the page the app opens on, the way to the account and
              to help is here too. */}
          {(onAccount || onSupport) && <p className="payment-note subscription-links">
            {onAccount && <button className="login-link" onClick={onAccount} type="button">Account and privacy</button>}
            {onSupport && <button className="login-link" onClick={onSupport} type="button">Help and support</button>}
          </p>}
        </div>
      </section>
    </main>
  );
}
