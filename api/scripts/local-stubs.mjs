// Local stand-ins for the two paid services the signup flow touches: Stripe and
// Azure Communication Services Email. Neither is a simulator; each implements
// only the handful of calls this application actually makes, so the whole
// registration and learning flow can be walked on a laptop with no accounts.
//
//   npm run stubs
//
// Everything either stub receives is written to api/scripts/.stub-log.json, so a
// run can be inspected afterwards - including the full text of every email that
// would have been sent.
import http from "node:http";
import { writeFileSync } from "node:fs";
import Stripe from "stripe";

const logPath = new URL("./.stub-log.json", import.meta.url);
const log = { checkoutSessions: [], portalSessions: [], emails: [] };
const save = () => writeFileSync(logPath, JSON.stringify(log, null, 2));
save();

const appUrl = process.env.APP_BASE_URL ?? "http://127.0.0.1:5173";
const stripePort = Number(process.env.STUB_STRIPE_PORT ?? 4242);
const emailPort = Number(process.env.STUB_EMAIL_PORT ?? 4243);
const apiBase = process.env.STUB_API_BASE ?? "http://127.0.0.1:7071/api";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_stub_secret";

// Real Stripe takes the payment and then calls the webhook. The stub has no card
// form, so it does both: it hands back a success URL and delivers the signed
// checkout.session.completed event the application is waiting for. Without this
// the browser returns from "checkout" to an app that never learns it was paid.
//
// A trial checkout is the same with no money taken, as Stripe reports it:
// payment_status "no_payment_required", then the subscription in "trialing",
// with the dates the first charge depends on.
const subscriptions = new Map();

async function deliverWebhook(session) {
  const customer = `cus_stub_${Date.now()}`;
  const id = `sub_stub_${Date.now()}`;
  const trialing = session.trialDays > 0;
  const now = Math.floor(Date.now() / 1000);
  const subscription = {
    id, object: "subscription", customer,
    status: trialing ? "trialing" : "active",
    cancel_at_period_end: false,
    metadata: session.metadata,
    current_period_end: now + (trialing ? session.trialDays * 86400 : 30 * 86400),
    ...(trialing ? { trial_start: now, trial_end: now + session.trialDays * 86400 } : {}),
  };
  subscriptions.set(id, subscription);
  await sendEvent("checkout.session.completed", {
    mode: "subscription",
    payment_status: trialing ? "no_payment_required" : "paid",
    customer,
    subscription: id,
    customer_details: { email: session.customer_email },
    customer_email: session.customer_email,
    metadata: session.metadata,
  });
  await sendEvent("customer.subscription.created", subscription);
}

async function sendEvent(type, object) {
  const event = { id: `evt_stub_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`, type, data: { object } };
  const payload = JSON.stringify(event);
  const signature = new Stripe("sk_test_stub").webhooks.generateTestHeaderString({ payload, secret: webhookSecret });
  try {
    const response = await fetch(`${apiBase}/billing/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "stripe-signature": signature },
      body: payload,
    });
    console.log(`[stripe] ${type} delivered -> HTTP ${response.status}`);
  } catch (error) {
    console.log(`[stripe] webhook could not be delivered: ${error.message} (is the API on ${apiBase}?)`);
  }
}

function body(request) {
  return new Promise((resolve) => {
    let data = "";
    request.on("data", (chunk) => { data += chunk; });
    request.on("end", () => resolve(data));
  });
}

// ---- Stripe -----------------------------------------------------------------
// The SDK posts form-encoded bodies and expects JSON back.
const stripe = http.createServer(async (request, response) => {
  const params = new URLSearchParams(await body(request));
  const json = (status, payload) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(payload));
  };

  if (request.url.startsWith("/v1/checkout/sessions")) {
    const id = `cs_test_${Date.now()}`;
    const trialDays = Number(params.get("subscription_data[trial_period_days]") ?? 0);
    const session = {
      id,
      object: "checkout.session",
      // The stub cannot show a card form, so it sends the customer back exactly
      // where the app's embedded form would on success, plan=trial included.
      url: `${appUrl}/?checkout=success${trialDays > 0 ? "&plan=trial" : ""}&session=${id}`,
      customer_email: params.get("customer_email"),
      client_reference_id: params.get("client_reference_id"),
      metadata: {
        accountKey: params.get("metadata[accountKey]"),
        plan: params.get("metadata[plan]"),
        billingPeriod: params.get("metadata[billingPeriod]"),
      },
      line_items: [{ price: params.get("line_items[0][price]"), quantity: 1 }],
      mode: params.get("mode"),
      trialDays,
    };
    log.checkoutSessions.push({ at: new Date().toISOString(), session });
    save();
    console.log(`[stripe] checkout for ${session.customer_email}  price=${session.line_items[0].price}  mode=${session.mode}${session.trialDays ? `  trial=${session.trialDays}d` : ""}`);
    json(200, session);
    // Fired after the response, and slightly late, so the app genuinely exercises
    // the "payment received, waiting for Stripe" screen rather than skipping it.
    setTimeout(() => { deliverWebhook(session); }, 600);
    return;
  }

  // The payments dashboard reads the plan price from Stripe so the revenue
  // figure cannot drift from what customers are actually charged.
  if (request.url.startsWith("/v1/prices/")) {
    const id = request.url.split("/v1/prices/")[1].split("?")[0];
    console.log(`[stripe] price ${id}`);
    return json(200, {
      id, object: "price", active: true, currency: "gbp",
      unit_amount: 999, recurring: { interval: "month", interval_count: 1 },
    });
  }

  if (request.url.startsWith("/v1/subscriptions/")) {
    const id = request.url.split("/v1/subscriptions/")[1].split("?")[0];
    // Ending a trial early, as the app's "start now" does: Stripe charges at
    // once, the subscription turns active, and the update is reported.
    if (request.method === "POST" && params.get("trial_end") === "now" && subscriptions.has(id)) {
      const updated = { ...subscriptions.get(id), status: "active", trial_end: Math.floor(Date.now() / 1000) };
      subscriptions.set(id, updated);
      console.log(`[stripe] subscription ${id} trial ended early -> active`);
      setTimeout(() => { sendEvent("customer.subscription.updated", updated); }, 300);
      return json(200, updated);
    }
    if (subscriptions.has(id)) return json(200, subscriptions.get(id));
    console.log(`[stripe] subscription ${id}`);
    return json(200, {
      id, object: "subscription", status: "active", customer: "cus_stub_1",
      cancel_at_period_end: false,
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
    });
  }

  if (request.url.startsWith("/v1/billing_portal/sessions")) {
    log.portalSessions.push({ at: new Date().toISOString(), customer: params.get("customer") });
    save();
    console.log("[stripe] billing portal session");
    return json(200, { id: `bps_test_${Date.now()}`, object: "billing_portal.session", url: `${appUrl}/?portal=stub` });
  }

  console.log(`[stripe] unhandled ${request.method} ${request.url}`);
  return json(404, { error: { message: `stub has no route for ${request.url}` } });
});

// ---- Azure Communication Services Email --------------------------------------
// beginSend posts the message, then the poller follows Operation-Location until
// the status is Succeeded. The stub accepts any signature: it exists to capture
// what would have been sent, not to check credentials.
const email = http.createServer(async (request, response) => {
  const raw = await body(request);

  if (request.url.includes("/emails:send")) {
    const id = `op_${Date.now()}`;
    let message;
    try { message = JSON.parse(raw); } catch { message = { unparsed: raw }; }
    log.emails.push({ at: new Date().toISOString(), id, message });
    save();
    const to = message?.recipients?.to?.map((entry) => entry.address).join(", ");
    console.log(`[email] "${message?.content?.subject}" -> ${to}`);
    response.writeHead(202, {
      "Content-Type": "application/json",
      "Operation-Location": `http://127.0.0.1:${emailPort}/emails/operations/${id}?api-version=2023-03-31`,
    });
    return response.end(JSON.stringify({ id, status: "NotStarted" }));
  }

  if (request.url.includes("/emails/operations/")) {
    const id = request.url.split("/emails/operations/")[1].split("?")[0];
    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(JSON.stringify({ id, status: "Succeeded" }));
  }

  console.log(`[email] unhandled ${request.method} ${request.url}`);
  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: { message: "not found" } }));
});

stripe.listen(stripePort, "127.0.0.1", () => console.log(`[stripe] stub listening on 127.0.0.1:${stripePort}`));
email.listen(emailPort, "127.0.0.1", () => console.log(`[email]  stub listening on 127.0.0.1:${emailPort}`));
