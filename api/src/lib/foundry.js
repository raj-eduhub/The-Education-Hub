import { DefaultAzureCredential } from "@azure/identity";

const defaultEndpoint = "https://rajkumaraiexpert-0649-resource.services.ai.azure.com/openai/v1";
const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT ?? defaultEndpoint;
export const deployment = process.env.AZURE_AI_MODEL_DEPLOYMENT ?? "gpt-5-nano";
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
// only asked us to wait a moment.
const maxAttempts = 4;

export async function callFoundry(payload, attempt = 0) {
  const apiKey = process.env.AZURE_AI_API_KEY;
  const headers = { "Content-Type": "application/json" };

  if (apiKey) {
    headers["api-key"] = apiKey;
  } else {
    const credential = new DefaultAzureCredential();
    const token = await credential.getToken(scope);
    headers.Authorization = `Bearer ${token.token}`;
  }

  const response = await fetch(`${endpoint.replace(/\/$/, "")}/responses`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt < maxAttempts - 1) {
      // Honour the wait the service asks for, and back off where it names none.
      const suggested = Number(response.headers.get("retry-after")) * 1000;
      await wait(Number.isFinite(suggested) && suggested > 0 ? suggested : 2 ** attempt * 1500);
      return callFoundry(payload, attempt + 1);
    }
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message ?? `Azure AI request failed with ${response.status}`);
  }

  return outputText(await response.json());
}
