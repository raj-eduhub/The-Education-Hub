import { app } from "@azure/functions";
import { authTable, findAuth, digest, hashPassword, checkPassword, createSession, sessionToken, createPasswordReset, completePasswordReset } from "../lib/passwordAuth.js";
import { sendPasswordResetEmail } from "../lib/email.js";
import { getUserByEmail, saveUser } from "../lib/userStore.js";

app.http("passwordLogin", {
  methods: ["POST"], authLevel: "anonymous", route: "auth/{action}",
  handler: async (request, context) => {
    const fail = (status, error) => ({ status, jsonBody: { error } });
    const secure = process.env.AZURE_FUNCTIONS_ENVIRONMENT !== "Development";
    const cookie = (token, age) => `education_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${secure ? "; Secure" : ""}`;
    try {
      if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) return fail(415, "JSON is required.");
      const action = request.params.action;
      const client = await authTable();
      // Conditional writes count attempts across Functions instances, including unknown accounts.
      const withinLimit = async (key, max) => {
        const rate = await findAuth(key);
        const attempts = rate && rate.until > Date.now() ? rate.attempts + 1 : 1;
        if (attempts > max) return false;
        const next = { partitionKey: "auth", rowKey: key, attempts, until: rate?.until > Date.now() ? rate.until : Date.now() + 900000 };
        if (rate) await client.updateEntity(next, "Replace", { etag: rate.etag });
        else await client.createEntity(next);
        return true;
      };
      if (action === "logout") {
        await client.deleteEntity("auth", `session-${digest(sessionToken(request))}`).catch(e => { if (e.statusCode !== 404) throw e; });
        return { jsonBody: { ok: true }, headers: { "Set-Cookie": cookie("", 0) } };
      }
      const body = await request.json();
      if (action === "forgot") {
        // Always accept, so the response cannot be used to discover which emails hold accounts.
        const accepted = { status: 202, jsonBody: { ok: true }, headers: { "Cache-Control": "no-store" } };
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return accepted;
        if (!await withinLimit(`rate-reset-${digest(email)}`, 5)) return accepted;
        try {
          const reset = await createPasswordReset(email);
          const appUrl = process.env.APP_BASE_URL ?? new URL(request.url).origin;
          if (reset) await sendPasswordResetEmail({ email, username: reset.username, resetUrl: `${appUrl}/?reset=${encodeURIComponent(reset.token)}` });
        } catch (error) {
          // Delivery and storage faults must not reveal whether the email matched an account.
          context.error("Password reset request failure", error.code ?? error.name);
        }
        return accepted;
      }
      if (action === "reset") {
        if (typeof body.password !== "string" || body.password.length < 15 || body.password.length > 128) return fail(400, "Set a password of 15-128 characters.");
        if (!await completePasswordReset(typeof body.token === "string" ? body.token : "", body.password)) return fail(410, "This reset link is invalid, expired, or already used.");
        return { status: 200, jsonBody: { ok: true }, headers: { "Set-Cookie": cookie("", 0), "Cache-Control": "no-store" } };
      }
      const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
      if (!/^[a-z0-9_.-]{3,32}$/.test(username) || typeof body.password !== "string" || body.password.length > 128) return fail(400, "Use a username of 3-32 letters, numbers, dots, underscores or hyphens and a password up to 128 characters.");
      const accountId = `user-${digest(username)}`;
      if (!await withinLimit(`rate-${digest(username)}`, 10)) return fail(429, "Too many attempts. Try again in 15 minutes.");
      let account = await findAuth(accountId);
      if (action === "register") {
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || body.password.length < 15) return fail(400, "Enter a valid email and a password of 15-128 characters.");
        if (account || await getUserByEmail(email)) return fail(409, "Unable to create this account. Use another username or contact support for an existing account.");
        account = { partitionKey: "auth", rowKey: accountId, username, email, name: username, ...await hashPassword(body.password) };
        await client.submitTransaction([
          ["create", account],
          ["create", { partitionKey: "auth", rowKey: `email-${digest(email)}`, accountId }],
        ]);
        await saveUser({ name: username, email, role: "parent" });
      } else if (action === "login") {
        if (!await checkPassword(body.password, account)) return fail(401, "Username or password is incorrect.");
        const user = await getUserByEmail(account.email);
        if (user?.status !== "active") return fail(403, "This account is inactive. Contact support.");
      } else return fail(404, "Unknown action.");
      const token = await createSession(accountId);
      return { status: action === "register" ? 201 : 200, jsonBody: { ok: true }, headers: { "Set-Cookie": cookie(token, 28800), "Cache-Control": "no-store" } };
    } catch (error) {
      context.error("Password authentication failure", error.code ?? error.name);
      return fail([409, 412].includes(error.statusCode) ? 409 : 503, "Unable to complete sign-in. Please try again.");
    }
  },
});
