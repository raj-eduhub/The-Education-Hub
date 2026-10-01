import { authTable, digest, findAuth } from "./passwordAuth.js";

// A per-learner cap on model calls.
//
// Nothing limited them before. The tutor guard refuses abusive content and the
// content routes serve storage first, but an authenticated subscriber could
// still hold the send key down: every message is a paid call, and at £14.99 a
// month one determined learner could cost more than they pay. Worse, a leaked
// session would have an uncapped meter attached to it.
//
// Two windows, because they catch different things. A short one catches a
// script or a stuck retry loop within seconds. A daily one catches the slow,
// patient version that a burst limit never notices.
//
// Counted with the same conditional write the sign-in limiter uses, so the
// count holds across Functions instances rather than being per-process.
const burst = {
  key: "burst",
  windowMs: 60_000,
  limit: () => Number(process.env.MODEL_CALLS_PER_MINUTE ?? 12),
  message: "That is a lot of questions at once. Give it a moment and try again.",
};

const daily = {
  key: "daily",
  windowMs: 24 * 60 * 60 * 1000,
  limit: () => Number(process.env.MODEL_CALLS_PER_DAY ?? 200),
  message: "You have reached today's limit for new questions. Everything you have already studied is still here, and the limit resets tomorrow.",
};

// A free trial gets a handful of tutor replies in all, not per day: enough to
// see what the tutor does in the free topic, and a fixed, small cost for an
// account anyone can make without paying. The window is long enough to be a
// lifetime for a trial. Paying lifts it, because only a trial is counted here.
const trial = {
  key: "trial",
  windowMs: 365 * 24 * 60 * 60 * 1000,
  limit: () => Number(process.env.TRIAL_MODEL_CALLS ?? 10),
  message: "That is all the tutor questions in the free topic. Subscribe to keep asking Sonia, in every topic.",
};

// A window that has expired starts again; one still running is added to. The
// etag makes the update fail rather than overwrite if another instance counted
// the same call, and a lost race is retried once.
async function consume(rowKey, windowMs, limit) {
  const client = await authTable();
  const existing = await findAuth(rowKey);
  const live = existing && existing.until > Date.now();
  const used = live ? existing.used + 1 : 1;
  if (used > limit) return { allowed: false, used: existing.used, resetAt: existing.until };

  const entity = {
    partitionKey: "auth",
    rowKey,
    used,
    until: live ? existing.until : Date.now() + windowMs,
  };
  try {
    if (existing) await client.updateEntity(entity, "Replace", { etag: existing.etag });
    else await client.createEntity(entity);
  } catch (error) {
    // 412 is another instance counting the same moment; 409 is two creating at
    // once. Either way the call is allowed and the next one will see the count.
    if (error.statusCode !== 412 && error.statusCode !== 409) throw error;
  }
  return { allowed: true, used, resetAt: entity.until };
}

// Returns null when the call may proceed, or the response to send instead.
//
// Failing open is deliberate: if the table is unreachable, a learner should
// still get their lesson. This protects a budget, it does not protect data, and
// a limiter that breaks the product when it breaks is worse than the overspend.
export async function checkModelBudget(email, { context, trial: inTrial = false } = {}) {
  if (!email) return null;
  const id = digest(email).slice(0, 32);
  try {
    // The trial allowance is checked first, so a spent one is refused without
    // also counting against the short windows.
    for (const window of inTrial ? [trial, burst, daily] : [burst, daily]) {
      const limit = window.limit();
      if (!Number.isFinite(limit) || limit <= 0) continue;
      const result = await consume(`model-${window.key}-${id}`, window.windowMs, limit);
      if (result.allowed) continue;
      const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
      context?.warn(`model budget reached (${window.key}) for a learner: ${result.used}/${limit}`);
      // Waiting does not end a trial's allowance, so no Retry-After is sent.
      if (window === trial) return { status: 429, jsonBody: { error: window.message, limit: window.key, code: "trial-tutor-used" } };
      return {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
        jsonBody: { error: window.message, limit: window.key, retryAfterSeconds: retryAfter },
      };
    }
  } catch (error) {
    context?.error(`model budget could not be checked: ${error.message}`);
    return null;
  }
  return null;
}

// What a learner has used, for the account page and for support questions.
export async function modelUsage(email) {
  if (!email) return null;
  const id = digest(email).slice(0, 32);
  const read = async (window) => {
    const row = await findAuth(`model-${window.key}-${id}`);
    const live = row && row.until > Date.now();
    return { used: live ? row.used : 0, limit: window.limit(), resetAt: live ? row.until : null };
  };
  return { burst: await read(burst), daily: await read(daily) };
}
