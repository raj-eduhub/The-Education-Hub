import React, { useState } from "react";
import { CreditCard, ExternalLink, ShieldCheck, Trash2 } from "lucide-react";
import { LegalNotice } from "./LegalNotice.jsx";
import { readJson } from "./auth.js";

export function AccountSettings({ currentUser, onDeleted, request, subscription }) {
  const [confirmation, setConfirmation] = useState("");
  const [legalSection, setLegalSection] = useState(null);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  async function openBillingPortal() {
    setWorking(true);
    setMessage("");
    try {
      const response = await request("/api/billing/portal", { method: "POST" });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Billing could not be opened.");
      window.location.assign(data.url);
    } catch (error) {
      setMessage(error.message);
      setWorking(false);
    }
  }

  async function deleteAccount() {
    setWorking(true);
    setMessage("");
    try {
      const response = await request("/api/account", { method: "DELETE" });
      if (!response.ok) {
        const data = await readJson(response);
        throw new Error(data.error ?? "The account could not be deleted.");
      }
      onDeleted();
    } catch (error) {
      setMessage(error.message);
      setWorking(false);
    }
  }

  const isAdminPlan = subscription?.plan === "admin";
  return <section className="account-settings">
    <header className="account-settings-header">
      <p className="eyebrow">Account & privacy</p>
      <h2>Your Y7to11.AI account</h2>
      <p>Manage billing, understand how data is used, or permanently close this account.</p>
    </header>

    <section className="account-section">
      <div className="account-section-icon"><CreditCard size={20} /></div>
      <div><h3>Subscription</h3><p>{isAdminPlan ? "Administrator access does not use a paid subscription." : `Your learner plan is ${subscription?.status ?? "inactive"}.`}</p></div>
      {!isAdminPlan && <button disabled={working} onClick={openBillingPortal} type="button">Manage billing <ExternalLink size={16} /></button>}
    </section>

    <section className="account-section">
      <div className="account-section-icon"><ShieldCheck size={20} /></div>
      <div><h3>Privacy and terms</h3><p>Review the information used for sign-in, learning progress, Sonia the AI tutor, and payments.</p></div>
      <div className="account-links"><button onClick={() => setLegalSection("privacy")} type="button">Privacy notice</button><button onClick={() => setLegalSection("terms")} type="button">Subscription terms</button></div>
    </section>

    <section className="account-section danger-zone">
      <div className="account-section-icon"><Trash2 size={20} /></div>
      <div><h3>Delete account</h3><p>This cancels the subscription and permanently removes the access record, attempts, and mastery data for <strong>{currentUser.email}</strong>.</p><label>Type DELETE to confirm<input autoComplete="off" onChange={(event) => setConfirmation(event.target.value)} value={confirmation} /></label></div>
      <button disabled={confirmation !== "DELETE" || working || isAdminPlan} onClick={deleteAccount} type="button"><Trash2 size={16} /> Delete account</button>
    </section>
    {isAdminPlan && <p className="account-note">Administrator deletion is disabled until the address is removed from the server-side ADMIN_EMAILS setting.</p>}
    {message && <p className="account-error" role="alert">{message}</p>}
    {legalSection && <LegalNotice onClose={() => setLegalSection(null)} section={legalSection} />}
  </section>;
}
