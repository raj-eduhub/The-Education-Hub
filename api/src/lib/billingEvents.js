// The money path: what a Stripe event does to a learner's access. Kept out of the
// HTTP handler so it can be tested directly with synthetic events, without a
// signing secret, a server, or a live Stripe account.
import { sendWelcomeEmail } from "./email.js";
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

export async function handleStripeEvent(event, { appUrl, sendEmail = sendWelcomeEmail, log = () => {} } = {}) {
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
    // must not be told the event failed just because delivery did. The email is
    // now only a receipt: learner setup happens in the app, so nothing about
    // getting started depends on it arriving.
    await updateSubscriptionByAccountKey(key, {
      plan: object.metadata.plan,
      billingPeriod: object.metadata.billingPeriod,
      status: "active",
      stripeCustomerId: object.customer,
      stripeSubscriptionId: object.subscription,
      // Setup already done stays done. A second checkout event for the same
      // account is not a new learner: someone resubscribing after cancelling
      // still has their profile, and sending them back through learner setup
      // would ask for a school year that is immutable anyway.
      onboardingComplete: existing?.onboardingComplete === true,
      lastCheckoutEventId: event.id,
    });

    let welcomeSent = false;
    let deliveryError = "";
    try {
      await sendEmail({ email, appUrl });
      welcomeSent = true;
    } catch (failure) {
      // Recorded rather than thrown, so a failed receipt can be resent without
      // replaying the payment event.
      deliveryError = failure.message;
      log(`Welcome email failed for a paid account: ${failure.message}`);
    }
    await updateSubscriptionByAccountKey(key, {
      welcomeSentAt: welcomeSent ? new Date().toISOString() : "",
      welcomeDelivery: welcomeSent ? "sent" : "failed",
      welcomeError: deliveryError.slice(0, 300),
    });
    return { handled: true, welcomeSent, accountKey: key };
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
