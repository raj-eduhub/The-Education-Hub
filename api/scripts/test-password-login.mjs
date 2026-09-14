import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createPasswordReset, deleteCredentials } from "../src/lib/passwordAuth.js";
import { deleteUserByEmail, saveUser } from "../src/lib/userStore.js";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5173/api";
const username = `test_${randomBytes(8).toString("hex")}`;
const email = `${username}@example.com`;
const password = randomBytes(24).toString("base64url");
const post = (action, body, cookie = "") => fetch(`${base}/auth/${action}`, { method: "POST", headers: { "Content-Type": "application/json", cookie }, body: JSON.stringify(body) });
try {
  assert.equal((await fetch(`${base}/session`)).status, 401);
  const registered = await post("register", { username, email, password });
  assert.equal(registered.status, 201, await registered.text());
  const cookie = registered.headers.get("set-cookie").split(";")[0];
  assert.match(registered.headers.get("set-cookie"), /HttpOnly/);
  const session = await (await fetch(`${base}/session`, { headers: { cookie } })).json();
  assert.equal(session.isAdmin, false);
  assert.equal(session.accessRole, "parent");
  assert.equal((await fetch(`${base}/users`, { headers: { cookie } })).status, 403);
  await saveUser({ name: username, email, role: "student" });
  const studentSession = await (await fetch(`${base}/session`, { headers: { cookie } })).json();
  assert.equal(studentSession.accessRole, "student");
  assert.equal(studentSession.isAdmin, false);
  for (const method of ["GET", "POST", "PATCH", "DELETE"]) {
    const result = await fetch(`${base}/users/blocked-test-id`, {
      method, headers: { cookie, "Content-Type": "application/json" },
      ...(method === "POST" || method === "PATCH" ? { body: "{}" } : {}),
    });
    assert.equal(result.status, 403, `Student must not ${method} users`);
  }
  assert.equal((await post("login", { username, password: "incorrect password" })).status, 401);
  assert.equal((await post("login", { username, password })).status, 200);
  assert.equal((await post("logout", {}, cookie)).status, 200);
  assert.equal((await fetch(`${base}/session`, { headers: { cookie } })).status, 401);
  const forged = Buffer.from(JSON.stringify({ userDetails: email, userRoles: ["admin"] })).toString("base64");
  assert.equal((await fetch(`${base}/users`, { headers: { "x-ms-client-principal": forged } })).status, 403);

  // Password recovery. Requests are always accepted so the response cannot reveal which emails hold accounts.
  assert.equal((await post("forgot", { email: `absent-${username}@example.com` })).status, 202);
  assert.equal((await post("forgot", { email })).status, 202);
  const active = await post("login", { username, password });
  assert.equal(active.status, 200);
  const activeCookie = active.headers.get("set-cookie").split(";")[0];
  const reset = await createPasswordReset(email);
  assert.equal(reset.username, username);
  const newPassword = randomBytes(24).toString("base64url");
  assert.equal((await post("reset", { token: reset.token, password: "short" })).status, 400);
  assert.equal((await post("reset", { token: "not-a-real-token", password: newPassword })).status, 410);
  assert.equal((await post("reset", { token: reset.token, password: newPassword })).status, 200);
  assert.equal((await post("reset", { token: reset.token, password: newPassword })).status, 410, "A reset token must work only once");
  assert.equal((await fetch(`${base}/session`, { headers: { cookie: activeCookie } })).status, 401, "A reset must sign out existing sessions");
  assert.equal((await post("login", { username, password })).status, 401, "The old password must stop working");
  assert.equal((await post("login", { username, password: newPassword })).status, 200);
  console.log("PASS: registration, password checks, parent and student roles, all user-management methods denied to students, logout revocation, forged header rejection, password reset issue/single use/session revocation");
} finally {
  await deleteCredentials(email);
  await deleteUserByEmail(email);
}
