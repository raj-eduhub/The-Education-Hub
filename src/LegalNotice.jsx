import React, { useEffect } from "react";
import { X } from "lucide-react";

export function LegalNotice({ section = "privacy", onClose }) {
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="legal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
      <section aria-labelledby="legal-title" aria-modal="true" className="legal-dialog" onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <header><div><p className="eyebrow">Education Hub</p><h2 id="legal-title">{section === "terms" ? "Subscription terms" : "Privacy notice"}</h2></div><button aria-label="Close" onClick={onClose} title="Close" type="button"><X size={19} /></button></header>
        {section === "terms" ? <div className="legal-copy">
          <h3>Payment and renewal</h3><p>Education Hub is one subscription at GBP 9.99 per month. Payment is taken when the subscription is purchased and renews monthly unless cancelled before the renewal date. There is no free trial and no free tier.</p>
          <h3>Cancellation</h3><p>The account holder can cancel through the billing portal. Access continues until the end of the paid period unless applicable consumer law requires otherwise.</p>
          <h3>Learning service</h3><p>AI feedback supports learning but can make mistakes. It is not an official exam-board mark, predicted grade, or replacement for a qualified teacher.</p>
          <h3>Pricing</h3><p>The final amount, tax, and renewal date are shown by Stripe before payment confirmation.</p>
        </div> : <div className="legal-copy">
          <h3>Data we use</h3><p>Google provides the signed-in account name, verified email address, and optional profile image. Paid signup collects parent or guardian contact details and the student's name, date of birth, school, curriculum year, exam board, and tier.</p>
          <h3>Cloud records</h3><p>Azure Table Storage holds the registered profile, fixed curriculum year, account access, subscription status, attempts, accuracy, confidence, time spent, mastery, and review dates. Answer text and tutor chats are not stored in those tables.</p>
          <h3>Safety</h3><p>Sonia, the AI tutor, refuses messages that match its safety, prompt-injection, and academic-integrity rules. A refused message is stored with the account, along with the rule it matched, so that an Education Hub administrator can read it and decide what to do. Messages about self-harm and similar concerns also send an alert to the administrators; that alert names the learner and the rule and does not contain the message. Questions the tutor answers normally, and the tutor's replies, are not stored.</p>
          <h3>AI processing</h3><p>Questions and diagnostic answers are sent through the authenticated Azure Functions API to the configured Microsoft Foundry model. Learner name and date of birth are not included.</p>
          <h3>Payments</h3><p>Stripe processes payment details and subscription billing. Education Hub stores only Stripe customer and subscription identifiers plus billing status.</p>
          <h3>Your choices</h3><p>The account page provides billing management and permanent account deletion. Deletion removes Education Hub records and requests subscription cancellation, subject to legally required financial retention by Stripe.</p>
        </div>}
      </section>
    </div>
  );
}
