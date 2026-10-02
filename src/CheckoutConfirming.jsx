import React, { useEffect, useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { BrandLogo } from "./BrandLogo.jsx";

// Stripe sends the customer straight back, but the webhook that marks the
// subscription active arrives separately and can be a few seconds behind.
// Showing the paywall again to someone who has just paid is the worst possible
// moment to get this wrong, so this screen waits and re-checks instead.
// A free trial takes no money, so after one this speaks of the saved card.
export function CheckoutConfirming({ email, onRecheck, onSignOut, trial = false }) {
  const [attempts, setAttempts] = useState(0);
  const slow = attempts >= 8;

  useEffect(() => {
    let cancelled = false;
    const timer = window.setInterval(async () => {
      if (cancelled) return;
      // A true result changes the subscription upstream, which re-renders this
      // screen away; there is nothing to do with it here.
      await onRecheck().catch(() => false);
      if (!cancelled) setAttempts((count) => count + 1);
    }, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [onRecheck]);

  return <main className="signup-pending-page">
    <header><BrandLogo height={36} /></header>
    <section>
      <LoaderCircle className="spin" size={34} />
      <p className="eyebrow">{trial ? "Card saved" : "Payment received"}</p>
      <h1>{trial ? "Starting your free trial" : "Confirming your subscription"}</h1>
      <p>
        {trial
          ? "Your card is saved and nothing has been charged. We are waiting for the confirmation from Stripe."
          : "Your payment went through and we are waiting for the confirmation from Stripe."}
        {" "}This usually takes a few seconds, and learner setup opens as soon as it lands.
      </p>
      {slow && <small>
        Still waiting. {trial ? "Your free trial will start" : "Your payment is safe and the subscription will activate"}; you can close this
        page and sign back in with <strong>{email}</strong> at any time.
      </small>}
      <button onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button>
    </section>
  </main>;
}
