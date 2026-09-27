import React, { useEffect, useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { BrandLogo } from "./BrandLogo.jsx";

// Stripe sends the customer straight back, but the webhook that marks the
// subscription active arrives separately and can be a few seconds behind.
// Showing the paywall again to someone who has just paid is the worst possible
// moment to get this wrong, so this screen waits and re-checks instead.
export function CheckoutConfirming({ email, onRecheck, onSignOut }) {
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
      <p className="eyebrow">Payment received</p>
      <h1>Confirming your subscription</h1>
      <p>
        Your payment went through and we are waiting for the confirmation from Stripe.
        This usually takes a few seconds, and learner setup opens as soon as it lands.
      </p>
      {slow && <small>
        Still waiting. Your payment is safe and the subscription will activate; you can close this
        page and sign back in with <strong>{email}</strong> at any time.
      </small>}
      <button onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button>
    </section>
  </main>;
}
