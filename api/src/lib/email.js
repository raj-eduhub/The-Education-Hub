import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";

async function send({ email, to, subject, plainText, html, undelivered }) {
  const connectionString = process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING;
  const senderAddress = process.env.AZURE_COMMUNICATION_EMAIL_SENDER;
  if (!connectionString || !senderAddress) throw new Error("Email delivery is not configured.");

  // Local development only: a stub mail service runs over plain HTTP, which the
  // SDK refuses by default. Guarded both on the Functions host running in
  // Development and on the endpoint already being http, so it cannot loosen
  // anything in a deployed environment.
  const insecure =
    process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Development" && connectionString.includes("endpoint=http://");
  const client = new EmailClient(connectionString, insecure ? { allowInsecureConnection: true } : undefined);
  const poller = await client.beginSend({
    senderAddress,
    recipients: { to: (to ?? [email]).map((address) => ({ address })) },
    content: { subject, plainText, html },
  });
  const result = await poller.pollUntilDone();
  if (result.status !== KnownEmailSendStatus.Succeeded) {
    throw new Error(undelivered);
  }
}

// Sent once payment is confirmed. It is a receipt and a way back in, not a key:
// learner setup happens in the app, so this link carries no token and never
// expires. A learner who never opens the email loses nothing.
// Sent once payment has gone through. It carries the two things somebody needs
// to get back in - where to sign in, and the username they chose on the website
// - because those are what a parent forgets between paying and returning. The
// password is never included, and never could be: it is stored only as a hash.
export async function sendWelcomeEmail({ email, appUrl, username = "" }) {
  const signIn = username
    ? `Sign in at ${appUrl} with your username ${username} and the password you chose.`
    : `Sign in at ${appUrl} with the username and password you chose.`;
  const signInHtml = username
    ? `<p>Sign in with your username <strong>${username}</strong> and the password you chose.</p>`
    : `<p>Sign in with the username and password you chose.</p>`;
  await send({
    email,
    subject: "Your Education Hub subscription is active",
    plainText: `Your Education Hub subscription is active.

${signIn}

The first time you sign in you will be asked for the learner's details, including the school year, which cannot be changed afterwards.

We never include your password in an email. If you have forgotten it, use "Forgot your password?" on the sign-in page.

You can cancel or change payment details at any time from Account and privacy.`,
    html: `<h1>Your subscription is active</h1>${signInHtml}<p><a href="${appUrl}">Open Education Hub</a></p><p>The first time you sign in you will be asked for the learner's details, including the school year, which cannot be changed afterwards.</p><p>We never include your password in an email. If you have forgotten it, use "Forgot your password?" on the sign-in page.</p><p>You can cancel or change payment details at any time from Account and privacy.</p>`,
    undelivered: "The welcome email could not be delivered.",
  });
}

// Sent the moment payment clears, to an account that has no password yet.
//
// This is the way in, not a receipt, so the link lives for seven days rather
// than the hour a password reset gets: it arrives while the parent is still on
// the payment confirmation page and may not be opened until that evening. It is
// still one-time and still revokes any earlier link.
export async function sendSetPasswordEmail({ email, username, setUrl }) {
  await send({
    email,
    subject: "Your subscription is active - set your password",
    plainText: `Your Education Hub subscription is active.

Set the password for your account "${username}" here: ${setUrl}

The link works once and expires in seven days. If it expires, use "Forgot your password?" on the sign-in page and we will send another.

Once your password is set you will be asked for the learner's details, including the school year, which cannot be changed afterwards.`,
    html: `<h1>Your subscription is active</h1><p>Set the password for your account <strong>${username}</strong>.</p><p><a href="${setUrl}">Set your password</a></p><p>The link works once and expires in seven days. If it expires, use "Forgot your password?" on the sign-in page and we will send another.</p><p>Once your password is set you will be asked for the learner's details, including the school year, which cannot be changed afterwards.</p>`,
    undelivered: "The set-password email could not be delivered.",
  });
}

// Sent on registration, before the account can do anything. The address is the
// identity everything else is keyed on, so it has to be proven before it grants
// access to a roster, a subscription or a child's profile.
export async function sendVerificationEmail({ email, username, verifyUrl }) {
  await send({
    email,
    subject: "Confirm your Education Hub email address",
    plainText: `An Education Hub account with the username "${username}" was created with this email address. Confirm the address to finish setting it up: ${verifyUrl}\n\nThis link expires in 24 hours and can be used once. If you did not create this account, ignore this email and nothing further will happen.`,
    html: `<h1>Confirm your email address</h1><p>An Education Hub account with the username <strong>${username}</strong> was created with this email address.</p><p><a href="${verifyUrl}">Confirm this address</a></p><p>This link expires in 24 hours and can be used once. If you did not create this account, ignore this email and nothing further will happen.</p>`,
    undelivered: "The confirmation email could not be delivered.",
  });
}

// Sent when a renewal payment fails. Stripe retries on its own schedule, so
// this is not a cancellation notice - it is the one chance to fix the card
// before the retries run out. It carries no card details and no amount beyond
// the plan, because the billing portal is where those belong.
export async function sendPaymentFailedEmail({ email, appUrl, attemptCount = 1, nextAttempt = null }) {
  const retry = nextAttempt
    ? `We will try again on ${new Date(nextAttempt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}.`
    : "We will try again shortly.";
  await send({
    email,
    subject: "Your Education Hub payment did not go through",
    plainText: `We could not take this month's Education Hub payment. ${retry}

Your child still has full access for now. To keep it, update the card in Account and privacy: ${appUrl}

If the card is not updated before the retries run out, the subscription will be cancelled.`,
    html: `<h1>Your payment did not go through</h1><p>We could not take this month's Education Hub payment${attemptCount > 1 ? ` (attempt ${attemptCount})` : ""}. ${retry}</p><p><strong>Your child still has full access for now.</strong> To keep it, update the card from Account and privacy.</p><p><a href="${appUrl}">Update payment details</a></p><p>If the card is not updated before the retries run out, the subscription will be cancelled.</p>`,
    undelivered: "The payment failure email could not be delivered.",
  });
}

// Told to whoever is on the desk. It carries the reference, the category and
// who raised it, so a ticket can be triaged from the notification - and stops
// there. What the customer actually wrote stays behind an administrator
// sign-in, the same rule the safeguarding alert follows.
export async function sendSupportTicketEmail({ reference, subject, category, priority, name, email, dashboardUrl, recipients }) {
  const to = (recipients ?? (process.env.SUPPORT_ALERT_EMAILS ?? process.env.ADMIN_EMAILS ?? "").split(","))
    .map((address) => address.trim())
    .filter(Boolean);
  if (!to.length) throw new Error("No administrator address is configured for support alerts.");
  const flag = priority === "high" ? "[priority] " : "";
  await send({
    to,
    subject: `${flag}Support ticket ${reference}: ${subject}`,
    plainText: `A support ticket was raised.

Reference: ${reference}
Subject:   ${subject}
Category:  ${category}
Priority:  ${priority}
From:      ${name || "(no name on the account)"} <${email}>

Open it here: ${dashboardUrl}`,
    html: `<h1>Support ticket ${reference}</h1><p><strong>${subject}</strong></p><p>Category: ${category}<br>Priority: ${priority}<br>From: ${name || "(no name on the account)"} &lt;${email}&gt;</p><p><a href="${dashboardUrl}">Open it in the support desk</a></p>`,
    undelivered: "The support alert could not be delivered.",
  });
}

// The customer's acknowledgement. Its job is the reference: something to quote
// so nobody has to describe the problem twice.
export async function sendSupportReceiptEmail({ email, reference, subject, appUrl }) {
  await send({
    email,
    subject: `We have your message - ticket ${reference}`,
    plainText: `Thank you - we have your message and somebody will read it.

Your reference is ${reference}, for "${subject}".

You can follow it, and add anything you have forgotten, in Help and support inside your account: ${appUrl}

If this is about a child's immediate safety, please do not wait for us. Contact the police on 999, or the NSPCC on 0808 800 5000.`,
    html: `<h1>We have your message</h1><p>Thank you - somebody will read it.</p><p>Your reference is <strong>${reference}</strong>, for &ldquo;${subject}&rdquo;.</p><p><a href="${appUrl}">Follow it in Help and support</a>, where you can also add anything you have forgotten.</p><p>If this is about a child&rsquo;s immediate safety, please do not wait for us: contact the police on <strong>999</strong>, or the NSPCC on <strong>0808 800 5000</strong>.</p>`,
    undelivered: "The support receipt could not be delivered.",
  });
}

const alertSubjects = {
  unsafe: "Safeguarding alert: a learner message was blocked",
};

// Sent to the people named in SAFEGUARDING_ALERT_EMAILS, or the administrators.
// It names the learner and the rule, and stops there: what the child actually
// wrote stays in the dashboard, behind an administrator sign-in, rather than
// being copied into mailboxes and forwarded on.
export async function sendSafeguardingAlertEmail({ recipients, studentName, email, reason, subject, topicTitle, occurredAt, dashboardUrl }) {
  const where = [subject, topicTitle].filter(Boolean).join(" / ") || "the tutor";
  await send({
    to: recipients,
    subject: alertSubjects[reason] ?? "Safeguarding alert: a learner message was flagged",
    plainText: `The Education Hub tutor blocked a message from ${studentName} (${email}) in ${where} at ${occurredAt}.\n\nRule: ${reason}.\n\nThe message itself is not included here. Sign in as an administrator and open Safeguarding to read it and record what you did: ${dashboardUrl}`,
    html: `<h1>Safeguarding alert</h1><p>The Education Hub tutor blocked a message from <strong>${studentName}</strong> (${email}) in ${where} at ${occurredAt}.</p><p>Rule: <strong>${reason}</strong>.</p><p>The message itself is not included in this email. <a href="${dashboardUrl}">Open Safeguarding</a> to read it and record what you did.</p>`,
    undelivered: "The safeguarding alert could not be delivered.",
  });
}

export async function sendPasswordResetEmail({ email, username, resetUrl }) {
  await send({
    email,
    subject: "Reset your Education Hub password",
    plainText: `A password reset was requested for the Education Hub account "${username}". Choose a new password within one hour: ${resetUrl}\n\nIf you did not request this, ignore this email. Your current password stays active.`,
    html: `<h1>Reset your Education Hub password</h1><p>A password reset was requested for the account <strong>${username}</strong>.</p><p><a href="${resetUrl}">Choose a new password</a></p><p>This secure link expires in one hour and can be used once. Resetting signs out every device.</p><p>If you did not request this, ignore this email. Your current password stays active.</p>`,
    undelivered: "The password reset email could not be delivered.",
  });
}
