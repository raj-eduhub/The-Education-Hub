const tokenKey = "education-hub-google-token";

export function getAuthToken() {
  return sessionStorage.getItem(tokenKey);
}

export function setAuthToken(token) {
  sessionStorage.setItem(tokenKey, token);
}

export function clearAuthToken() {
  sessionStorage.removeItem(tokenKey);
}

async function validateApiResponse(response) {
  if (response.status === 204) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      response.ok
        ? "The backend API is not connected. Use the preview links or start the app with the Static Web Apps API."
        : `The backend returned an unavailable response (${response.status}).`
    );
  }
  return response;
}

export async function apiFetch(url, options = {}) {
  return validateApiResponse(await fetch(url, options));
}

export async function readJson(response) {
  if (response.status === 204) return {};
  const text = await response.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The backend returned an invalid response. Check that the Azure Functions API is running.");
  }
}

export async function authFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return validateApiResponse(await fetch(url, { ...options, headers }));
}
