# Stripe integration — remaining setup

Checkout Studio configuration has been applied to the existing integration
(**Scenario A**: a Checkout Session call already existed and only its parameters
were changed). This file is the single source of truth for what is left to do.

---

## Values to Replace

**Files containing placeholders:**

- [.env.example](.env.example) — copy these names into your real environment
- [api/local.settings.json](api/local.settings.json) — local Functions settings (gitignored, not in the repo)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| `STRIPE_PRICE_MONTHLY` | `price_stub_999` | Your real Price ID from the [Dashboard](https://dashboard.stripe.com/test/prices). This is the **Y7to11.AI £14.99/month** price you created. |
| `STRIPE_SECRET_KEY` | `sk_test_stub` | Your test secret key from the [API keys page](https://dashboard.stripe.com/test/apikeys). |
| `STRIPE_WEBHOOK_SECRET` | `whsec_stub_secret` | From `stripe listen` (local) or your webhook endpoint (deployed). See **Webhooks** below. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | *not set* | Your `pk_test_…` publishable key. **Must** carry the `VITE_` prefix — Vite only exposes prefixed variables to the browser. |
| `STRIPE_API_BASE` | `http://127.0.0.1:4242` | **Delete this variable.** It points the SDK at the local Stripe stub; while it is set (and the host is in Development) no request ever reaches Stripe. |

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

**This means [api/scripts/test-e2e.mjs](api/scripts/test-e2e.mjs) will fail** —
it asserts the response contains a URL with `checkout=success`. Update that
assertion to check for `client_secret`.

### 4. Pinning the API version changes a field you already read

From API version **2025-03-31**, `current_period_end` moved off the subscription
onto the subscription *item*. `periodEnd()` in
[api/src/lib/billingEvents.js](api/src/lib/billingEvents.js) still reads
`subscription.current_period_end`, so on the pinned version it will resolve to
`null` and every renewal date will be stored empty. Read it from
`subscription.items.data[0].current_period_end` instead.

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
stripe listen --forward-to http://127.0.0.1:7071/api/billing/webhook
```

It prints a `whsec_…` — that is `STRIPE_WEBHOOK_SECRET`.

Deployed: create an endpoint at `https://<your-domain>/api/billing/webhook`
subscribed to `checkout.session.completed`, `customer.subscription.created`,
`customer.subscription.updated` and `customer.subscription.deleted`.

### 3. Dependencies

No new packages. `stripe@22.6.1` is already in [api/package.json](api/package.json),
and Stripe.js is loaded from `https://js.stripe.com/dahlia/stripe.js` in
[index.html](index.html) — never bundle or self-host it, as PCI DSS requires the
payment form to come from Stripe's own origin.

---

## How the integration works

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
| [src/SubscriptionPage.jsx](src/SubscriptionPage.jsx) | `appearance`, form mount, `#checkout-form` container |
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
storage emulator with synthetic events — no live Stripe account needed. Note the
e2e assertion change described above.

---

## Next steps

1. Replace the five values in **Values to Replace**, and delete `STRIPE_API_BASE`.
2. Fix the two live issues flagged above — the `current_period_end` field move,
   and the e2e assertion.
3. Decide on promotion codes (see item 2) if you are running the introductory offer.
4. Decide on tax. `automatic_tax` is **off**, and the pricing page states
   "VAT £0.00" — correct only while you are not VAT-registered.
5. Handle `invoice.payment_failed` so a failed renewal prompts a card update
   rather than silently lapsing into `past_due`.
6. Test the full flow with `4242 4242 4242 4242`, then confirm in the Dashboard
   that the subscription exists and that the local subscription row was written.

---

## Resources

- Stripe documentation — https://docs.stripe.com
- Stripe support — https://support.stripe.com
- Stripe MCP server — https://docs.stripe.com/mcp
- Test cards — https://docs.stripe.com/testing
- API keys — https://dashboard.stripe.com/test/apikeys
