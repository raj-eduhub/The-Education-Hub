# Stripe integration — remaining setup

Checkout Studio configuration has been applied to the existing integration
(**Scenario A**: a Checkout Session call already existed and only its parameters
were changed). This file is the single source of truth for what is left to do.

---

## Where this stands (28 September 2026)

Everything in the code is done. What is left is putting your own keys in place,
which is deliberately not automated: keys are pasted by you, never by a tool.

Done: the test secret key, the price and the publishable key are in place, and
`STRIPE_API_BASE` has been deleted.

Still to do:

1. **Confirm the test secret key was rolled.** The original was pasted into a
   chat session. If it has not been rolled: Stripe Dashboard → Developers →
   API keys → Roll key, then paste the new one into `api/local.settings.json`.
2. **Install the Stripe CLI** — it is not on this machine yet (see Webhooks below).
3. **Forward webhooks** in a terminal you leave open, and copy the `whsec_…` it
   prints into `STRIPE_WEBHOOK_SECRET`. It still holds the stub value, so until
   this is done a test card is charged at Stripe but no subscription is
   activated.
4. **Restart** `npm run dev:all`, then sign up from the Y7to11.AI page and pay
   with `4242 4242 4242 4242`.

Checked against the test account: the checkout settings below create a session
(it returns a `client_secret` and no `url`), and the account holds one active
price, **Y7to11.AI, £14.99 a month**, `price_1UKDw22ZcvJZXQizaoisQcR2`.

Once real Stripe is configured, `npm run test:e2e` no longer applies as written:
it signs its own webhook with the stub secret. Run it with the stubs
(`npm run stubs` and the stub values restored) when you need it.

---

## Values to Replace

**Files containing placeholders:**

- [.env.example](.env.example) — copy these names into your real environment
- [api/local.settings.json](api/local.settings.json) — local Functions settings (gitignored, not in the repo)

| Field | Local status | What to Set |
|-------|--------------|-------------|
| `STRIPE_PRICE_MONTHLY` | Set | `price_1UKDw22ZcvJZXQizaoisQcR2` — the **Y7to11.AI £14.99/month** test price. Use the live price's ID when you go live. |
| `STRIPE_SECRET_KEY` | Set (`sk_test_…`) | Your test secret key from the [API keys page](https://dashboard.stripe.com/test/apikeys). |
| `STRIPE_WEBHOOK_SECRET` | **Still the stub** | From `stripe listen` (local) or your webhook endpoint (deployed). See **Webhooks** below. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Set (`pk_test_…`) | Your `pk_test_…` publishable key. **Must** carry the `VITE_` prefix — Vite only exposes prefixed variables to the browser. |
| `STRIPE_API_BASE` | Deleted | Leave it out. It points the SDK at the local Stripe stub; while it is set (and the host is in Development) no request ever reaches Stripe. |

`mode` and `line_items` were **not** replaced with placeholders — they already
held real values (`"subscription"`, and the price from `STRIPE_PRICE_MONTHLY`),
so those were preserved as required.

---

## Configured Parameters

These were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**

- [api/src/functions/billing.js](api/src/functions/billing.js) — the Checkout Session call
- [src/SubscriptionPage.jsx](src/SubscriptionPage.jsx) — the `appearance` object

| Parameter | Value |
|-----------|-------|
| `ui_mode` | `form` |
| `billing_address_collection` | `auto` |
| `phone_number_collection` | `{ enabled: false }` |
| `automatic_tax` | `{ enabled: false }` |
| `payment_method_collection` | `always` |
| `submit_type` | `auto` |
| `integration_identifier` | `custom_embedded_web_0001` |
| `mode` | `subscription` *(preserved — existing real value)* |
| `line_items` | `[{ price: STRIPE_PRICE_MONTHLY, quantity: 1 }]` *(preserved)* |

`ui_mode` is `form` because the installed SDK is **stripe 22.6.1** (≥ 21.0.0).
On an SDK below 21.0.0 this value must be `custom` instead.

The Stripe client is pinned to API version
`2026-03-25.dahlia; custom_checkout_payment_form_preview=v1`, which the embedded
form requires.

---

## Read this before you go live

Three things changed meaning, and one was deliberately **not** removed.

### 1. Four parameters were kept despite not being in the Checkout Studio set

`customer_email`, `client_reference_id`, `metadata` and `subscription_data.metadata`
are not Checkout Studio options, so the instructions would have removed them.
They were kept, because they are how a payment is matched back to an account:

- `handleStripeEvent()` in [api/src/lib/billingEvents.js](api/src/lib/billingEvents.js)
  reads `metadata.accountKey` on `checkout.session.completed`.
- `subscription_data.metadata` carries the same key onto every later
  `customer.subscription.*` event.

Without them every event returns `{ handled: false, reason: "missing-account-key" }`
— **cards would be charged and no subscription would ever be activated.**
If you want them gone, the webhook handler has to be reworked to look accounts up
by `stripeCustomerId` first.

### 2. `allow_promotion_codes` was removed

It was not in the configured set, so it is gone. **This disables promotion codes
at checkout.** If you still intend to run the £19.99 → £14.99 introductory offer
as a Stripe coupon, re-enable it in Checkout Studio, or the promotion code field
will not appear.

### 3. The API returns a client secret, not a URL

`POST /api/billing/checkout` now returns `{ client_secret }` instead of `{ url }`,
and the browser mounts the form instead of redirecting. `success_url` and
`cancel_url` were removed with the redirect flow.

[api/scripts/test-e2e.mjs](api/scripts/test-e2e.mjs) has been updated to match —
it accepts either a `client_secret` or, against the local stub, a `url`.

### 4. Pinning the API version changes a field you already read — fixed

From API version **2025-03-31**, `current_period_end` moved off the subscription
onto the subscription *item*. `periodEnd()` in
[api/src/lib/billingEvents.js](api/src/lib/billingEvents.js) now reads
`subscription.items.data[0].current_period_end` first.

### 5. The website sign-up takes payment on its own page

A parent arriving from the Y7to11.AI page has no session and no password yet.
The form `ui_mode` gives no `url` to redirect to, so the hand-off page mounts
the same embedded form, using a one-hour checkout grant instead of a session.
The mounting code is shared in [src/stripeCheckout.js](src/stripeCheckout.js).
The session sets no `return_url`, so the form passes one to `confirm()`, which
Stripe requires: `/?checkout=success`, the screen that waits for the webhook.
Stripe uses it for redirect-based methods such as 3D Secure; a card that
confirms on the page is sent there by the app instead.

---

## Setup

### 1. Environment variables

Local development — `api/local.settings.json` (gitignored):

```json
{
  "Values": {
    "STRIPE_SECRET_KEY": "sk_test_...",
    "STRIPE_WEBHOOK_SECRET": "whsec_...",
    "STRIPE_PRICE_MONTHLY": "price_..."
  }
}
```

Frontend — `.env.local` at the repo root (never commit):

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Deployed — set the same names as Azure Static Web Apps application settings.
The publishable key is the only one that belongs in the frontend build.

### 2. Webhooks

Local:

```bash
stripe listen --api-key sk_test_... --forward-to http://127.0.0.1:7071/api/billing/webhook
```

It prints a `whsec_…` — that is `STRIPE_WEBHOOK_SECRET`. Leave it running while
you test: it is what delivers `checkout.session.completed` to the local API,
and without it payments succeed at Stripe but no subscription is activated.

The Stripe CLI is not installed system-wide. Install it with
`winget install Stripe.StripeCli`, or use the Windows build from
[the stripe-cli releases](https://github.com/stripe/stripe-cli/releases).

Deployed: create an endpoint at `https://<your-domain>/api/billing/webhook`
subscribed to:

- `checkout.session.completed`
- `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- `invoice.payment_failed`, `invoice.paid`, `invoice.payment_succeeded`

The invoice events are what warn a parent when a renewal fails and clear the
warning when a retry succeeds. Leave them off and a failed card goes unnoticed
until Stripe cancels the subscription at the end of its retries.

### 3. Dependencies

No new packages. `stripe@22.6.1` is already in [api/package.json](api/package.json),
and Stripe.js is loaded from `https://js.stripe.com/dahlia/stripe.js` in
[index.html](index.html) — never bundle or self-host it, as PCI DSS requires the
payment form to come from Stripe's own origin.

---

## How the integration works

Signing up from the website takes the same route with the hand-off page
([src/PasswordLogin.jsx](src/PasswordLogin.jsx), `SignupHandoff`) in place of
the subscription page: `/api/auth/reserve` issues a checkout grant, the grant is
exchanged for a `client_secret`, and the form is mounted there.

```
Parent signs up  →  confirms email  →  SubscriptionPage
                                            │
                    POST /api/billing/checkout
                                            │
                    stripe.checkout.sessions.create({ ui_mode: "form", … })
                                            │
                              { client_secret }
                                            │
       stripe.initCheckoutFormSdk({ clientSecret, appearance })
       checkout.createForm({ layout: "expanded" }).mount("#checkout-form")
                                            │
                   form "confirm"  →  actions.confirm(…)
                                            │
   Stripe  →  POST /api/billing/webhook  (signature verified on the raw body)
                                            │
        handleStripeEvent() reads metadata.accountKey → grants access
                                            │
                          Learner setup → curriculum
```

Files touched:

| File | Change |
|------|--------|
| [api/src/functions/billing.js](api/src/functions/billing.js) | Session parameters, pinned API version, returns `client_secret` |
| [src/main.jsx](src/main.jsx) | `beginCheckout()` returns the client secret instead of redirecting |
| [src/SubscriptionPage.jsx](src/SubscriptionPage.jsx) | `#checkout-form` container; mounts the form through the shared helper |
| [src/stripeCheckout.js](src/stripeCheckout.js) | `appearance`, form mount, confirm, and the move to the payment-received screen |
| [src/PasswordLogin.jsx](src/PasswordLogin.jsx) | The website hand-off mounts the embedded form |
| [index.html](index.html) | Loads Stripe.js (dahlia build) |
| [.env.example](.env.example) | Stripe variable names |

---

## Testing

Use [Stripe's test cards](https://docs.stripe.com/testing) with any future
expiry, any CVC and any postcode:

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Succeeds |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Declined — insufficient funds |
| `4000 0000 0000 0341` | Attaches, then fails on the first charge |

Everything stays in test mode while the keys begin `sk_test_` / `pk_test_`.
The Sandbox banner in the Dashboard confirms it.

Existing suites: `npm test` runs the billing and webhook suites against the
storage emulator with synthetic events — no live Stripe account needed.
[api/scripts/test-failed-payments.mjs](api/scripts/test-failed-payments.mjs)
covers the failed-renewal path. To see it against real Stripe, pay with
`4000 0000 0000 0341` and watch `invoice.payment_failed` arrive in `stripe listen`.

---

## Next steps

1. Put the webhook secret in place — see **Where this stands** at the top.
2. Test the full flow with `4242 4242 4242 4242`, then confirm in the Dashboard
   that the subscription exists and that the local subscription row was written.
3. Decide on promotion codes (see item 2 under **Read this before you go live**)
   if you are running the introductory offer.
4. Decide on tax. `automatic_tax` is **off**, and the pricing page states
   "VAT £0.00" — correct only while you are not VAT-registered.
5. Deploy: set the Stripe values as Azure Static Web Apps application settings,
   and create the webhook endpoint with all seven events listed under **Webhooks**.

Already done: the `current_period_end` field move, the e2e assertion, and
`invoice.payment_failed` handling.

---

## Resources

- Stripe documentation — https://docs.stripe.com
- Stripe support — https://support.stripe.com
- Stripe MCP server — https://docs.stripe.com/mcp
- Test cards — https://docs.stripe.com/testing
- API keys — https://dashboard.stripe.com/test/apikeys
