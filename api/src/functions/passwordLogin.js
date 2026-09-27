import { app } from "@azure/functions";
import { authTable, findAuth, digest, hashPassword, checkPassword, createSession, sessionToken, createPasswordReset, completePasswordReset, createEmailVerification, completeEmailVerification, createCheckoutGrant } from "../lib/passwordAuth.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../lib/email.js";
import { getUserByEmail, saveUser } from "../lib/userStore.js";
import { getSubscription, grantsAccess } from "../lib/subscriptionStore.js";

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
      if (action === "verify") {
        const verified = await completeEmailVerification(typeof body.token === "string" ? body.token : "");
        if (!verified) return fail(410, "This confirmation link is invalid, expired, or already used.");
        // The roster row is written here, not at registration: it is the flag
        // every other route reads, and it must not exist for an unproven address.
        await saveUser({ name: verified.name ?? verified.username, email: verified.email, role: "parent" });
        const token = await createSession(verified.accountId);
        return { status: 200, jsonBody: { ok: true }, headers: { "Set-Cookie": cookie(token, 28800), "Cache-Control": "no-store" } };
      }
      if (action === "reset") {
        if (typeof body.password !== "string" || body.password.length < 15 || body.password.length > 128) return fail(400, "Set a password of 15-128 characters.");
        if (!await completePasswordReset(typeof body.token === "string" ? body.token : "", body.password)) return fail(410, "This reset link is invalid, expired, or already used.");
        return { status: 200, jsonBody: { ok: true }, headers: { "Set-Cookie": cookie("", 0), "Cache-Control": "no-store" } };
      }
      const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
      // "reserve" is the one action that carries no password: the account is
      // created at sign-up and the password is set later from an emailed link.
      const needsPassword = action !== "reserve";
      if (!/^[a-z0-9_.-]{3,32}$/.test(username)) return fail(400, "Use a username of 3-32 letters, numbers, dots, underscores or hyphens.");
      if (needsPassword && (typeof body.password !== "string" || body.password.length > 128)) return fail(400, "Use a password of up to 128 characters.");
      const accountId = `user-${digest(username)}`;
      if (!await withinLimit(`rate-${digest(username)}`, 10)) return fail(429, "Too many attempts. Try again in 15 minutes.");
      let account = await findAuth(accountId);
      if (action === "register") {
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || body.password.length < 15) return fail(400, "Enter a valid email and a password of 15-128 characters.");
        if (account || await findAuth(`email-${digest(email)}`) || await getUserByEmail(email)) return fail(409, "Unable to create this account. Use another username or contact support for an existing account.");
        // Registration proves nothing yet, so it grants nothing: no roster row
        // and no session until the address is confirmed.
        account = { partitionKey: "auth", rowKey: accountId, username, email, name: username, emailVerified: false, ...await hashPassword(body.password) };
        await client.submitTransaction([
          ["create", account],
          ["create", { partitionKey: "auth", rowKey: `email-${digest(email)}`, accountId }],
        ]);
        const verifyToken = await createEmailVerification(accountId);
        const appUrl = process.env.APP_BASE_URL ?? new URL(request.url).origin;
        try {
          await sendVerificationEmail({ email, username, verifyUrl: `${appUrl}/?verify=${encodeURIComponent(verifyToken)}` });
        } catch (error) {
          // The account exists but is unusable until confirmed, so a delivery
          // fault is reported rather than swallowed: there is no way in without it.
          context.error("Confirmation email failure", error.code ?? error.name);
          return fail(503, "The account was created but the confirmation email could not be sent. Use Forgot your password to request a new link.");
        }
        return { status: 202, jsonBody: { ok: true, verificationRequired: true }, headers: { "Cache-Control": "no-store" } };
      }
      // Sign-up from the website: the username and email are taken, the
      // account is created, and that is all. No password is chosen here and
      // none is carried in a URL - it is set later from the link emailed once
      // payment clears, which is also what proves the address belongs to them.
      //
      // What comes back is a checkout grant, not a session: passwordPrincipal
      // refuses a session whose address is not proven, and nothing here has
      // proven it. The grant authorises one Stripe checkout for this address
      // and expires in an hour.
      if (action === "reserve") {
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return fail(400, "Enter an email address we can reach you on.");
        if (body.consent !== true) return fail(400, "Confirm you are the parent, guardian or carer.");
        if (account || await findAuth(`email-${digest(email)}`) || await getUserByEmail(email)) {
          const refuse = (code, error) => ({ status: 409, jsonBody: { error, code }, headers: { "Cache-Control": "no-store" } });
          // The same parent coming back to a sign-up they did not finish: this
          // username with this email, no password yet, and nothing paid. Stripe
          // was closed, the tab was lost or the card failed. Refusing them left
          // them locked out of their own account with no way to pay for it, so
          // they get a fresh grant instead. Nothing is handed over that the
          // first attempt did not already give: the grant still only reaches
          // Stripe, and the password link still goes only to this address.
          const sameSignup = account && account.email === email && !account.passwordHash;
          const paid = sameSignup && grantsAccess((await getSubscription(email))?.status);
          if (sameSignup && !paid) {
            return {
              status: 201,
              jsonBody: { ok: true, username, email, awaitingPassword: true, resumed: true, checkoutToken: await createCheckoutGrant(email) },
              headers: { "Cache-Control": "no-store" },
            };
          }
          if (sameSignup) {
            return refuse("awaiting-password", "You have already paid for this account. Use the link we emailed to set your password, or use Forgot your password to get a new one.");
          }
          if (account && account.email === email) {
            return refuse("existing", "You already have an account with this username and email. Sign in, or use Forgot your password.");
          }
          return refuse("taken", "That username or email is already used by another account. Start again with a different username, or sign in if the account is yours.");
        }
        account = { partitionKey: "auth", rowKey: accountId, username, email, name: username, emailVerified: false };
        await client.submitTransaction([
          ["create", account],
          ["create", { partitionKey: "auth", rowKey: `email-${digest(email)}`, accountId }],
        ]);
        return {
          status: 201,
          jsonBody: { ok: true, username, email, awaitingPassword: true, checkoutToken: await createCheckoutGrant(email) },
          headers: { "Cache-Control": "no-store" },
        };
      }

      if (action === "login") {
        if (account && !account.passwordHash) return fail(403, "Your password has not been set yet. Use the link in the email we sent when your payment went through, or Forgot your password to get another.");
        if (!await checkPassword(body.password, account)) return fail(401, "Username or password is incorrect.");
        if (account.emailVerified !== true) return fail(403, "Confirm your email address before signing in. Check your inbox for the confirmation link.");
        const user = await getUserByEmail(account.email);
        if (user?.status !== "active") return fail(403, "This account is inactive. Contact support.");
      } else return fail(404, "Unknown action.");
      const token = await createSession(accountId);
      return { status: 200, jsonBody: { ok: true }, headers: { "Set-Cookie": cookie(token, 28800), "Cache-Control": "no-store" } };
    } catch (error) {
      context.error("Password authentication failure", error.code ?? error.name);
      return fail([409, 412].includes(error.statusCode) ? 409 : 503, "Unable to complete sign-in. Please try again.");
    }
  },
});
