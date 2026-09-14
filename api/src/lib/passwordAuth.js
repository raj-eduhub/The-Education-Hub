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
  return { userDetails: account.email, name: account.name, userId: account.rowKey, userRoles: ["authenticated"], identityProvider: "password", emailVerified: account.emailVerified === true };
}
export async function revokeAccountTokens(accountId, prefixes = ["session-", "reset-"]) {
  const client = await authTable();
  for await (const entity of client.listEntities({ queryOptions: { filter: `PartitionKey eq 'auth' and accountId eq '${accountId}'` } })) {
    if (prefixes.some(prefix => entity.rowKey.startsWith(prefix))) {
      await client.deleteEntity("auth", entity.rowKey).catch(e => { if (e.statusCode !== 404) throw e; });
    }
  }
}
export async function createPasswordReset(email) {
  const index = await findAuth(`email-${digest(email)}`);
  if (!index) return null;
  const account = await findAuth(index.accountId);
  if (!account) return null;
  const token = randomBytes(32).toString("base64url");
  await revokeAccountTokens(index.accountId, ["reset-"]);
  await (await authTable()).createEntity({ partitionKey: "auth", rowKey: `reset-${digest(token)}`, accountId: index.accountId, expiresAt: Date.now() + 3600000 });
  return { token, username: account.username };
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
  await client.updateEntity({ ...account, ...await hashPassword(password) }, "Replace", { etag: account.etag });
  await revokeAccountTokens(reset.accountId);
  return true;
}
export async function verifyPaidAccount(email, password) {
  const index = await findAuth(`email-${digest(email)}`);
  if (!index) throw new Error("Create a username account before completing learner setup.");
  const account = await findAuth(index.accountId);
  const client = await authTable();
  await client.updateEntity({ ...account, ...await hashPassword(password), emailVerified: true }, "Replace", { etag: account.etag });
  await revokeAccountTokens(index.accountId);
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
