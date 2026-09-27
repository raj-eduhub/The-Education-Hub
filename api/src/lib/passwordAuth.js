import { randomBytes, createHash, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const derive = promisify(scrypt);
export const digest = (text) => createHash("sha256").update(text).digest("hex");
let ready;
export async function authTable() {
  ready ??= (async () => {
    const name = process.env.AZURE_STORAGE_AUTH_TABLE ?? "EducationHubAuth";
    const client = process.env.AZURE_STORAGE_CONNECTION_STRING
      ? TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, name)
      : new TableClient(process.env.AZURE_STORAGE_ACCOUNT_URL, name, new DefaultAzureCredential());
    await client.createTable().catch(e => { if (e.statusCode !== 409) throw e; });
    return client;
  })();
  try { return await ready; } catch (error) { ready = undefined; throw error; }
}
export async function findAuth(key) {
  return (await authTable()).getEntity("auth", key).catch(e => { if (e.statusCode === 404) return null; throw e; });
}
export async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = await derive(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
  return { salt, passwordHash: hash.toString("hex") };
}
export async function checkPassword(password, account) {
  const computed = await hashPassword(password, account?.salt ?? "00000000000000000000000000000000");
  return timingSafeEqual(Buffer.from(computed.passwordHash, "hex"), Buffer.from(account?.passwordHash ?? "00".repeat(64), "hex")) && Boolean(account);
}
export function sessionToken(request) {
  return (request.headers.get("cookie") ?? "").split(";").map(s => s.trim()).find(s => s.startsWith("education_session="))?.slice(18) ?? "";
}
export async function passwordPrincipal(request) {
  const token = sessionToken(request);
  if (!/^[\w-]{43}$/.test(token)) return null;
  const session = await findAuth(`session-${digest(token)}`);
  if (!session || session.expiresAt <= Date.now()) return null;
  const account = await findAuth(session.accountId);
  if (!account) return null;
  // A session is only issued after the address is proven, so this should never
  // be false. It is checked anyway: the address is the identity every other
  // store is keyed on, and nothing should resolve from an unproven one.
  if (account.emailVerified !== true) return null;
  return { userDetails: account.email, name: account.name, userId: account.rowKey, userRoles: ["authenticated"], identityProvider: "password", emailVerified: true };
}
export async function revokeAccountTokens(accountId, prefixes = ["session-", "reset-"]) {
  const client = await authTable();
  for await (const entity of client.listEntities({ queryOptions: { filter: `PartitionKey eq 'auth' and accountId eq '${accountId}'` } })) {
    if (prefixes.some(prefix => entity.rowKey.startsWith(prefix))) {
      await client.deleteEntity("auth", entity.rowKey).catch(e => { if (e.statusCode !== 404) throw e; });
    }
  }
}
// Email verification.
//
// Registration accepts any address, and the address is this application's whole
// identity: it keys the access roster, the subscription, the learner profile,
// the progress partition and the safeguarding partition. Until the address is
// proven, registering it must grant nothing - otherwise whoever claims an
// address first owns the account that its real owner later pays for.
export async function createEmailVerification(accountId) {
  const token = randomBytes(32).toString("base64url");
  await revokeAccountTokens(accountId, ["verify-"]);
  await (await authTable()).createEntity({
    partitionKey: "auth",
    rowKey: `verify-${digest(token)}`,
    accountId,
    expiresAt: Date.now() + 24 * 3600000,
  });
  return token;
}

export async function completeEmailVerification(token) {
  if (!/^[\w-]{43}$/.test(token)) return null;
  const client = await authTable();
  const pending = await findAuth(`verify-${digest(token)}`);
  if (!pending || pending.expiresAt <= Date.now()) return null;
  // Claimed before the account is written, so a replayed link cannot verify twice.
  const claimed = await client.deleteEntity("auth", pending.rowKey, { etag: pending.etag })
    .then(() => true).catch(e => { if ([404, 412].includes(e.statusCode)) return false; throw e; });
  if (!claimed) return null;
  const account = await findAuth(pending.accountId);
  if (!account) return null;
  await client.updateEntity({ ...account, emailVerified: true }, "Replace", { etag: account.etag });
  return { accountId: pending.accountId, email: account.email, username: account.username, name: account.name };
}

export async function createPasswordReset(email, expiresInMs = 3600000) {
  const index = await findAuth(`email-${digest(email)}`);
  if (!index) return null;
  const account = await findAuth(index.accountId);
  if (!account) return null;
  const token = randomBytes(32).toString("base64url");
  await revokeAccountTokens(index.accountId, ["reset-"]);
  await (await authTable()).createEntity({ partitionKey: "auth", rowKey: `reset-${digest(token)}`, accountId: index.accountId, expiresAt: Date.now() + expiresInMs });
  return { token, username: account.username };
}

// An account created at sign-up has no password until the emailed link is
// used. checkPassword already fails safely against a missing hash, so this is
// only for telling the parent why they cannot sign in yet.
export async function accountAwaitsPassword(email) {
  const index = await findAuth(`email-${digest(email)}`);
  if (!index) return false;
  const account = await findAuth(index.accountId);
  return Boolean(account) && !account.passwordHash;
}
export async function completePasswordReset(token, password) {
  if (!/^[\w-]{43}$/.test(token)) return false;
  const client = await authTable();
  const reset = await findAuth(`reset-${digest(token)}`);
  if (!reset || reset.expiresAt <= Date.now()) return false;
  // Claim the single-use token before writing the password so a replayed link cannot reset it twice.
  const claimed = await client.deleteEntity("auth", reset.rowKey, { etag: reset.etag })
    .then(() => true).catch(e => { if ([404, 412].includes(e.statusCode)) return false; throw e; });
  if (!claimed) return false;
  const account = await findAuth(reset.accountId);
  if (!account) return false;
  // Using a link that was only ever sent to that address proves the address,
  // so this confirms it too. For an account created at sign-up, where the
  // password is set from the email that follows payment, this is the only
  // thing that ever confirms it - without it a parent who has paid and set a
  // password is still refused at the sign-in page. For an ordinary reset the
  // address was already confirmed and this changes nothing.
  await client.updateEntity({ ...account, ...await hashPassword(password), emailVerified: true }, "Replace", { etag: account.etag });
  await revokeAccountTokens(reset.accountId);
  return true;
}
// The username an address signs in with, for the receipt sent after payment.
// Returns "" rather than throwing: a missing username must not stop a paid
// account being activated, and the email is a receipt, not the way in.
export async function usernameForEmail(email) {
  try {
    const index = await findAuth(`email-${digest(email)}`);
    if (!index) return "";
    const account = await findAuth(index.accountId);
    return account?.username ?? "";
  } catch {
    return "";
  }
}
export async function verifyPaidAccount(email, password) {
  const index = await findAuth(`email-${digest(email)}`);
  if (!index) throw new Error("Create a username account before completing learner setup.");
  const account = await findAuth(index.accountId);
  const client = await authTable();
  await client.updateEntity({ ...account, ...await hashPassword(password), emailVerified: true }, "Replace", { etag: account.etag });
  await revokeAccountTokens(index.accountId);
}
// A grant that authorises one thing: starting a checkout for this address.
//
// Not a session. passwordPrincipal deliberately refuses any session whose
// address is not proven, and an account created at sign-up has proven nothing
// yet - paying, and then opening the link emailed to that address, is what
// proves it. So the sign-up carries a token that can reach Stripe and nothing
// else: it resolves to an email, never to a principal, and grants no access to
// content, profiles or anyone else's data.
export async function createCheckoutGrant(email, expiresInMs = 3600000) {
  const token = randomBytes(32).toString("base64url");
  await (await authTable()).createEntity({
    partitionKey: "auth",
    rowKey: `checkout-${digest(token)}`,
    email,
    expiresAt: Date.now() + expiresInMs,
  });
  return token;
}

// Left in place rather than consumed: a parent who abandons Stripe and comes
// back should not be stranded, and the grant expires on its own.
export async function emailForCheckoutGrant(token) {
  if (!/^[\w-]{43}$/.test(token ?? "")) return "";
  const grant = await findAuth(`checkout-${digest(token)}`);
  if (!grant || grant.expiresAt <= Date.now()) return "";
  return grant.email ?? "";
}

export async function createSession(accountId) {
  const token = randomBytes(32).toString("base64url");
  await (await authTable()).createEntity({ partitionKey: "auth", rowKey: `session-${digest(token)}`, accountId, expiresAt: Date.now() + 8 * 3600000 });
  return token;
}
export async function deleteCredentials(email) {
  const client = await authTable();
  const index = await findAuth(`email-${digest(email)}`);
  if (!index) return;
  for await (const entity of client.listEntities({ queryOptions: { filter: `PartitionKey eq 'auth'` } })) {
    if (entity.accountId === index.accountId || entity.rowKey === index.accountId) await client.deleteEntity("auth", entity.rowKey);
  }
}
