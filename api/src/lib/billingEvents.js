// The money path: what a Stripe event does to a learner's access. Kept out of the
// HTTP handler so it can be tested directly with synthetic events, without a
// signing secret, a server, or a live Stripe account.
import { sendPaymentFailedEmail, sendWelcomeEmail } from "./email.js";
import {
  accountKey,
  findSubscriptionByCustomerId,
  getSubscriptionEntityByAccountKey,
  updateSubscriptionByAccountKey,
} from "./subscriptionStore.js";

export const subscriptionEvents = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

// A renewal that failed, and one that recovered. Stripe owns the retry schedule
// and the decision to cancel at the end of it; this only records what happened
// and tells the parent, because a card can only be fixed by someone who knows.
export const invoiceEvents = ["invoice.payment_failed", "invoice.paid", "invoice.payment_succeeded"];

// Which account an event belongs to.
//
// Our own checkout puts the key in metadata, but a Payment Link cannot: it has
// no per-customer metadata, so its events would otherwise be dropped - the
// cancellation included, leaving someone who stopped paying with access. Every
// other route back to the account is tried in turn, ending with the address
// itself, because accountKey() is a pure hash of it.
async function resolveAccountKey(object, email) {
  if (object.metadata?.accountKey) return object.metadata.accountKey;
  if (object.client_reference_id) return object.client_reference_id;
  const known = await findSubscriptionByCustomerId(object.customer);
  if (known) return known.rowKey;
  return email ? accountKey(email) : null;
}

// When the current period ends.
//
// This moved. Up to API version 2025-03-31 it sat on the subscription; from
// there it belongs to the subscription item, because a subscription can hold
// items on different cycles. The client is pinned past that, so the item is
// read first and the old position kept as a fallback - events already stored,
// and any account still on an older version, keep working.
function periodEnd(subscription) {
  const seconds = subscription.items?.data?.[0]?.current_period_end
    ?? subscription.current_period_end;
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

export async function handleStripeEvent(event, {
  appUrl,
  sendEmail = sendWelcomeEmail,
  notifyPaymentFailed = sendPaymentFailedEmail,
  log = () => {},
} = {}) {
  const object = event.data.object;

  if (event.type === "checkout.session.completed" && object.payment_status === "paid") {
    const email = object.customer_details?.email ?? object.customer_email;
    if (!email) return { handled: false, reason: "missing-email" };

    const key = await resolveAccountKey(object, email);
    if (!key) return { handled: false, reason: "missing-account-key" };
    const existing = await getSubscriptionEntityByAccountKey(key);
    if (existing?.lastCheckoutEventId === event.id) return { handled: true, duplicate: true };

    // Access is granted before the email is attempted. The learner has paid, so a
    // mail outage must not decide whether they get what they bought, and Stripe
    // must not be told the event failed just because delivery did. The email is
    // now only a receipt: learner setup happens in the app, so nothing about
    // getting started depends on it arriving.
    await updateSubscriptionByAccountKey(key, {
      plan: object.metadata?.plan ?? "learner",
      billingPeriod: object.metadata?.billingPeriod ?? "monthly",
      status: "active",
      // A new payment clears any earlier failure.
      paymentFailedAt: "",
      paymentAttemptCount: 0,
      nextPaymentAttempt: "",
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
    const key = await resolveAccountKey(object, "");
    if (!key) return { handled: false, reason: "missing-account-key" };
    await updateSubscriptionByAccountKey(key, {
      plan: object.metadata?.plan ?? "learner",
      billingPeriod: object.metadata?.billingPeriod ?? "monthly",
      status: object.status,
      stripeCustomerId: object.customer,
      stripeSubscriptionId: object.id,
      currentPeriodEnd: periodEnd(object),
      cancelAtPeriodEnd: object.cancel_at_period_end,
    });
    return { handled: true, status: object.status, accountKey: key };
  }

  if (invoiceEvents.includes(event.type)) {
    const email = object.customer_email ?? "";
    const key = await resolveAccountKey(object, email);
    if (!key) return { handled: false, reason: "missing-account-key" };

    if (event.type === "invoice.payment_failed") {
      const nextAttempt = object.next_payment_attempt
        ? new Date(object.next_payment_attempt * 1000).toISOString()
        : "";
      await updateSubscriptionByAccountKey(key, {
        paymentFailedAt: new Date().toISOString(),
        paymentAttemptCount: object.attempt_count ?? 1,
        nextPaymentAttempt: nextAttempt,
      });

      // Recorded first, then told. The record is what the app reads to warn the
      // parent in the product, so it must survive a mail outage.
      let notified = false;
      if (email) {
        try {
          await notifyPaymentFailed({ email, appUrl, attemptCount: object.attempt_count ?? 1, nextAttempt: nextAttempt || null });
          notified = true;
        } catch (failure) {
          log(`Payment failure email could not be sent: ${failure.message}`);
        }
      }
      return { handled: true, paymentFailed: true, notified, accountKey: key };
    }

    // A retry that succeeded, so the warning goes away.
    await updateSubscriptionByAccountKey(key, {
      paymentFailedAt: "",
      paymentAttemptCount: 0,
      nextPaymentAttempt: "",
    });
    return { handled: true, paymentRecovered: true, accountKey: key };
  }

  return { handled: false, reason: "ignored-event" };
}
