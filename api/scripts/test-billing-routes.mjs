// Guards the Stripe webhook route against being shadowed again. This is an HTTP
// test on purpose: the bug it covers was invisible to unit tests, because both
// functions were correct in isolation and only the routing was wrong.
import assert from "node:assert/strict";
import Stripe from "stripe";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5173/api";
let failures = 0;
const check = (label, run) => {
  try {
    const result = run();
    if (result && typeof result.then === "function") throw new Error("check() takes a synchronous function");
    console.log(`OK   ${label}`);
  } catch (error) { failures += 1; console.log(`FAIL ${label}: ${error.message}`); }
};

const stripe = new Stripe("sk_test_not_a_real_key");
const payload = JSON.stringify({ id: "evt_route_test", type: "checkout.session.completed", data: { object: {} } });
const signed = stripe.webhooks.generateTestHeaderString({ payload, secret: "whsec_test_secret" });

const post = (headers, body = payload) => fetch(`${base}/billing/webhook`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body });

const unsigned = await post({});
check("the webhook is not answered as an authenticated billing action", () => {
  // 403 means the wildcard billing/{action} route swallowed the delivery, which
  // Stripe would see as a permanent rejection of a real payment.
  assert.notEqual(unsigned.status, 403, "webhook route is shadowed by billing/{action}");
});
check("an unsigned payload is rejected", () => {
  assert.ok([400, 500].includes(unsigned.status), `expected 400 or 500, received ${unsigned.status}`);
});

const wrongSignature = await post({ "stripe-signature": "t=1,v1=deadbeef" });
check("a bad signature is rejected", () => {
  assert.notEqual(wrongSignature.status, 200);
  assert.notEqual(wrongSignature.status, 403);
});

const status = await fetch(`${base}/billing/status`);
check("other billing actions still require access", () => {
  assert.equal(status.status, 403);
});

console.log(failures ? `\n${failures} billing route check(s) FAILED` : "\nPASS: the Stripe webhook route is reachable, unauthenticated, and rejects bad signatures");
process.exit(failures ? 1 : 0);
