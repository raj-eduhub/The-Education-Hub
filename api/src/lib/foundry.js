import { DefaultAzureCredential } from "@azure/identity";

const defaultEndpoint = "https://rajkumaraiexpert-0649-resource.services.ai.azure.com/openai/v1";
const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT ?? defaultEndpoint;
// The model every call asks for first, and the one it falls back to. The
// backup is the cheaper, long-proven gpt-5-nano: if the main deployment is
// throttled, unavailable or returns nothing, the learner still gets an answer.
// Set AZURE_AI_FALLBACK_DEPLOYMENT to "" to turn the fallback off.
export const deployment = process.env.AZURE_AI_MODEL_DEPLOYMENT ?? "gpt-6-luna";
export const fallbackDeployment = process.env.AZURE_AI_FALLBACK_DEPLOYMENT ?? "gpt-5-nano";
const scope = process.env.AZURE_AI_TOKEN_SCOPE ?? "https://ai.azure.com/.default";

function outputText(response) {
  if (response.output_text) return response.output_text;

  const fragments = [];
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) fragments.push(content.text);
    }
  }
  return fragments.join("\n").trim();
}

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

// A deployment has a rate limit, and both callers here can reach it: a seeding
// run makes thousands of calls, and a busy lesson makes many at once. Without a
// retry a throttle was an error - a lost row during seeding, and a "could not
// be prepared" message to the learner during a lesson - when the service had
// only asked us to wait a moment. The main model gets one retry rather than
// the full set, so a struggling deployment hands over to the backup quickly
// instead of keeping a learner waiting through every back-off.
const maxAttempts = 4;
const primaryAttempts = 2;

async function headersFor() {
  const apiKey = process.env.AZURE_AI_API_KEY;
  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["api-key"] = apiKey;
  } else {
    const credential = new DefaultAzureCredential();
    const token = await credential.getToken(scope);
    headers.Authorization = `Bearer ${token.token}`;
  }
  return headers;
}

// One deployment, with retries for throttling and server faults. Throws with
// the HTTP status attached, so the caller can tell a key problem from a model one.
async function callDeployment(payload, attempts) {
  const headers = await headersFor();
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/responses`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (response.ok) return outputText(await response.json());

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt < attempts - 1) {
      // Honour the wait the service asks for, and back off where it names none.
      const suggested = Number(response.headers.get("retry-after")) * 1000;
      await wait(Number.isFinite(suggested) && suggested > 0 ? suggested : 2 ** attempt * 1500);
      continue;
    }
    const data = await response.json().catch(() => ({}));
    const failure = new Error(data.error?.message ?? `Azure AI request failed with ${response.status}`);
    failure.status = response.status;
    throw failure;
  }
}

// Asks the main model, and the backup if the main one fails or returns no text.
// Returns the text and the deployment that actually wrote it, so stored content
// records its real author. A 401 or 403 is not retried on the backup: both
// deployments share the key, so it would fail the same way and only hide the cause.
export async function callFoundryWithModel(payload) {
  const primary = payload.model ?? deployment;
  const backup = fallbackDeployment && fallbackDeployment !== primary ? fallbackDeployment : null;
  let primaryFailure;
  try {
    const text = await callDeployment({ ...payload, model: primary }, backup ? primaryAttempts : maxAttempts);
    if (text || !backup) return { text, model: primary };
    primaryFailure = new Error(`${primary} returned no text`);
  } catch (failure) {
    if (!backup || [401, 403].includes(failure.status)) throw failure;
    primaryFailure = failure;
  }
  console.warn(`Model ${primary} failed (${primaryFailure.message}); falling back to ${backup}`);
  return { text: await callDeployment({ ...payload, model: backup }, maxAttempts), model: backup };
}

export async function callFoundry(payload) {
  return (await callFoundryWithModel(payload)).text;
}
