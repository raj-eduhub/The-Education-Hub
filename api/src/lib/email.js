import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";

async function send({ email, subject, plainText, html, undelivered }) {
  const connectionString = process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING;
  const senderAddress = process.env.AZURE_COMMUNICATION_EMAIL_SENDER;
  if (!connectionString || !senderAddress) throw new Error("Email delivery is not configured.");

  const client = new EmailClient(connectionString);
  const poller = await client.beginSend({
    senderAddress,
    recipients: { to: [{ address: email }] },
    content: { subject, plainText, html },
  });
  const result = await poller.pollUntilDone();
  if (result.status !== KnownEmailSendStatus.Succeeded) {
    throw new Error(undelivered);
  }
}

export async function sendSignupEmail({ email, signupUrl }) {
  await send({
    email,
    subject: "Complete your Education Hub signup",
    plainText: `Your Education Hub subscription payment is confirmed. Complete the student and parent/guardian signup within 48 hours: ${signupUrl}`,
    html: `<h1>Complete your Education Hub signup</h1><p>Your subscription payment is confirmed.</p><p><a href="${signupUrl}">Enter the student and parent/guardian details</a></p><p>This secure link expires in 48 hours and can be used once.</p>`,
    undelivered: "The signup email could not be delivered.",
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
