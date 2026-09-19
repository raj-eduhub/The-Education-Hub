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
export async function sendWelcomeEmail({ email, appUrl }) {
  await send({
    email,
    subject: "Your Education Hub subscription is active",
    plainText: `Your Education Hub subscription is active. Sign in to finish setting up the learner and open the curriculum: ${appUrl}

You can cancel or change payment details at any time from Account and privacy.`,
    html: `<h1>Your subscription is active</h1><p>Sign in to finish setting up the learner and open the curriculum.</p><p><a href="${appUrl}">Open Education Hub</a></p><p>You can cancel or change payment details at any time from Account and privacy.</p>`,
    undelivered: "The welcome email could not be delivered.",
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
