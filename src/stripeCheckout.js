// Mounts Stripe's embedded payment form for one Checkout Session.
//
// Shared by the subscription page and the sign-up hand-off from the website,
// because a Checkout Session created in the form ui_mode hands back a
// client_secret and no url: there is nothing to redirect to, so every page that
// takes a payment has to mount the form itself.
//
// The card fields render inside Stripe's own iframe, so nothing here ever
// touches a card number.

// Configured in Checkout Studio. Passed to the form SDK as-is.
const appearance = {
  theme: "stripe",
  labels: "auto",
  inputs: "spaced",
  variables: {
    borderRadius: "4px",
    colorBackground: "#ffffff",
    colorDanger: "#df1b41",
    colorPrimary: "#0570de",
    colorSuccess: "#00c853",
    colorText: "#30313d",
    fontFamily: "default",
    fontSizeBase: "16px",
    spacingUnit: "4px",
  },
};

// The session has no return_url, so a confirmed payment stays on this page.
// It is sent to the payment-received screen here instead, which is where the
// app waits for Stripe's webhook to activate the subscription.
const paidDestination = "/?checkout=success";

export async function mountCheckoutForm(clientSecret, target, { onError }) {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!window.Stripe) throw new Error("The payment form could not be loaded. Check your connection and try again.");
  if (!publishableKey) throw new Error("Payments are not configured yet.");

  const stripe = window.Stripe(publishableKey, { betas: ["custom_checkout_payment_form_1"] });
  const checkout = stripe.initCheckoutFormSdk({ clientSecret, appearance });
  const form = checkout.createForm({ layout: "expanded" });
  form.mount(target);

  const loadActionsResult = await checkout.loadActions();
  if (loadActionsResult.type !== "success") {
    throw new Error(loadActionsResult.error?.message ?? "The payment form could not be loaded.");
  }
  form.on("confirm", async (event) => {
    try {
      const result = await loadActionsResult.actions.confirm({ formConfirmEvent: event });
      if (result?.type === "error") {
        onError(result.error?.message ?? "The payment could not be confirmed.");
        return;
      }
      window.location.assign(paidDestination);
    } catch (confirmError) {
      onError(confirmError.message ?? "The payment could not be confirmed.");
    }
  });
}
