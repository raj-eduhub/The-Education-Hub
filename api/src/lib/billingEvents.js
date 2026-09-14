// The money path: what a Stripe event does to a learner's access. Kept out of the
// HTTP handler so it can be tested directly with synthetic events, without a
// signing secret, a server, or a live Stripe account.
import { sendSignupEmail } from "./email.js";
import { createSignupInvite } from "./signupStore.js";
import { getSubscriptionEntityByAccountKey, updateSubscriptionByAccountKey } from "./subscriptionStore.js";

export const subscriptionEvents = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

function periodEnd(subscription) {
  return subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;
}

export async function handleStripeEvent(event, { appUrl, sendEmail = sendSignupEmail, log = () => {} } = {}) {
  const object = event.data.object;

  if (event.type === "checkout.session.completed" && object.payment_status === "paid") {
    const key = object.metadata?.accountKey;
    if (!key) return { handled: false, reason: "missing-account-key" };
    const existing = await getSubscriptionEntityByAccountKey(key);
    if (existing?.lastCheckoutEventId === event.id) return { handled: true, duplicate: true };

    const email = object.customer_details?.email ?? object.customer_email;
    if (!email) return { handled: false, reason: "missing-email" };

    // Access is granted before the email is attempted. The learner has paid, so a
    // mail outage must not decide whether they get what they bought, and Stripe
    // must not be told the event failed just because delivery did.
    const token = await createSignupInvite(email);
    await updateSubscriptionByAccountKey(key, {
      plan: object.metadata.plan,
      billingPeriod: object.metadata.billingPeriod,
      status: "active",
      stripeCustomerId: object.customer,
      stripeSubscriptionId: object.subscription,
      onboardingComplete: false,
      lastCheckoutEventId: event.id,
    });

    let invitationSent = false;
    let deliveryError = "";
    try {
      await sendEmail({ email, signupUrl: `${appUrl}/?signup=${encodeURIComponent(token)}` });
      invitationSent = true;
    } catch (failure) {
      // Recorded rather than thrown, so the invitation can be resent without
      // replaying the payment event.
      deliveryError = failure.message;
      log(`Signup email failed for a paid account: ${failure.message}`);
    }
    await updateSubscriptionByAccountKey(key, {
      signupInviteSentAt: invitationSent ? new Date().toISOString() : "",
      signupInviteDelivery: invitationSent ? "sent" : "failed",
      signupInviteError: deliveryError.slice(0, 300),
    });
    return { handled: true, invitationSent, accountKey: key };
  }

  if (subscriptionEvents.includes(event.type)) {
    const key = object.metadata?.accountKey;
    if (!key) return { handled: false, reason: "missing-account-key" };
    await updateSubscriptionByAccountKey(key, {
      plan: object.metadata.plan,
      billingPeriod: object.metadata.billingPeriod,
      status: object.status,
      stripeCustomerId: object.customer,
      stripeSubscriptionId: object.id,
      currentPeriodEnd: periodEnd(object),
      cancelAtPeriodEnd: object.cancel_at_period_end,
    });
    return { handled: true, status: object.status, accountKey: key };
  }

  return { handled: false, reason: "ignored-event" };
}
