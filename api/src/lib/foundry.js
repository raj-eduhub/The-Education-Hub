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

export async function callFoundry(payload) {
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message ?? `Azure AI request failed with ${response.status}`);
  }

  return outputText(data);
}
