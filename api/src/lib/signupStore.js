import { createHash } from "node:crypto";
import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";
import { accountKey } from "./subscriptionStore.js";
import { yearFromDateOfBirth } from "./learnerDetails.js";

const inviteTableName = process.env.AZURE_STORAGE_SIGNUP_INVITES_TABLE ?? "EducationHubSignupInvites";
const profileTableName = process.env.AZURE_STORAGE_PROFILES_TABLE ?? "EducationHubProfiles";
const clients = new Map();
const ready = new Map();

function table(name) {
  if (clients.has(name)) return clients.get(name);
  let current;
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    current = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, name);
  } else if (process.env.AZURE_STORAGE_ACCOUNT_URL) {
    current = new TableClient(process.env.AZURE_STORAGE_ACCOUNT_URL, name, new DefaultAzureCredential());
  } else {
    throw new Error("Signup storage is not configured.");
  }
  clients.set(name, current);
  return current;
}

async function readyTable(name) {
  const current = table(name);
  if (!ready.has(name)) {
    ready.set(name, current.createTable().catch((error) => {
      if (error.statusCode !== 409) throw error;
    }));
  }
  await ready.get(name);
  return current;
}

function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

// Invitations are no longer issued: learner setup happens in the app straight
// after payment. This reader stays so that a link already sent still works
// until it expires, after which the invites table is only ever read.
export async function getSignupInvite(token) {
  if (!token) return null;
  const current = await readyTable(inviteTableName);
  const invite = await current.getEntity("invites", tokenHash(token)).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  if (!invite || invite.usedAt || new Date(invite.expiresAt).getTime() <= Date.now()) return null;
  return invite;
}

// The learner profile, written from whichever route collected it. Onboarding
// now happens in the app straight after payment, so the profile is keyed on the
// signed-in account; the emailed-link route still exists for any invitation
// already in someone's inbox, and both end up here.
async function writeProfile(key, email, input) {
  const profiles = await readyTable(profileTableName);
  const existing = await profiles.getEntity("profiles", key).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  // Derived here as well as at validation, so the stored year can only ever be
  // the one the date of birth gives. No caller can put a different one in.
  const year = yearFromDateOfBirth(input.dateOfBirth);
  if (existing && Number(existing.year) !== year) {
    const error = new Error("The registered school year cannot be changed.");
    error.statusCode = 409;
    throw error;
  }
  const now = new Date().toISOString();
  const profile = {
    partitionKey: "profiles",
    rowKey: key,
    email,
    guardianName: (input.guardianName ?? "").trim(),
    guardianRelationship: input.guardianRelationship,
    guardianPhone: (input.guardianPhone ?? "").trim(),
    studentFirstName: input.studentFirstName.trim(),
    dateOfBirth: input.dateOfBirth,
    year,
    examBoard: input.examBoard ?? "AQA",
    // Table Storage holds scalars, so the per-subject map travels as JSON.
    examBoards: JSON.stringify(input.examBoards ?? {}),
    tier: input.tier ?? "Higher",
    consentAcceptedAt: now,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await profiles.upsertEntity(profile, "Replace");
  return publicProfile(profile);
}

// The in-app route: the learner is already signed in and has just paid, so the
// account itself identifies them and no one-time token is involved.
export async function saveLearnerProfile(email, input) {
  const normalised = String(email).trim().toLowerCase();
  return writeProfile(accountKey(normalised), normalised, input);
}

export async function completeSignup(token, input) {
  const invite = await getSignupInvite(token);
  if (!invite) return null;
  const profile = await writeProfile(invite.accountKey, invite.email, input);
  const invites = await readyTable(inviteTableName);
  await invites.updateEntity({ ...invite, usedAt: new Date().toISOString() }, "Replace");
  return profile;
}

function parseBoards(value) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function publicProfile(profile) {
  if (!profile) return null;
  return {
    guardianName: profile.guardianName,
    guardianRelationship: profile.guardianRelationship,
    guardianPhone: profile.guardianPhone,
    studentFirstName: profile.studentFirstName,
    dateOfBirth: profile.dateOfBirth,
    year: Number(profile.year),
    examBoard: profile.examBoard,
    examBoards: parseBoards(profile.examBoards),
    tier: profile.tier,
    yearLocked: true,
  };
}

export async function getProfile(email) {
  const profiles = await readyTable(profileTableName);
  const profile = await profiles.getEntity("profiles", accountKey(email)).catch((error) => {
    if (error.statusCode === 404) return null;
    throw error;
  });
  return publicProfile(profile);
}

export async function deleteProfile(email) {
  const key = accountKey(email);
  const profiles = await readyTable(profileTableName);
  await profiles.deleteEntity("profiles", key).catch((error) => {
    if (error.statusCode !== 404) throw error;
  });
  const invites = await readyTable(inviteTableName);
  for await (const invite of invites.listEntities({
    queryOptions: { filter: `accountKey eq '${key}'` },
  })) {
    await invites.deleteEntity(invite.partitionKey, invite.rowKey);
  }
}
