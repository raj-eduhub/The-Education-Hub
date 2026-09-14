import React from "react";
import { GraduationCap, MailCheck, LogOut } from "lucide-react";

export function SignupPending({ email, onSignOut }) {
  return <main className="signup-pending-page">
    <header><span><GraduationCap size={22} /></span><strong>Education Hub</strong></header>
    <section><MailCheck size={34} /><p className="eyebrow">Payment confirmed</p><h1>Check your email to finish signup</h1><p>We sent a secure, one-time signup link to <strong>{email}</strong>. It is valid for 48 hours and asks for the student and parent or guardian details.</p><small>The learning dashboard opens after the signup form is complete.</small><button onClick={onSignOut} type="button"><LogOut size={17} /> Sign out</button></section>
  </main>;
}
