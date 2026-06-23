const BASE = import.meta.env.VITE_API_BASE as string;

const TOKEN_KEY = "sd_token";

/** Auth token: the per-user JWT from login if present, else the baked QA token. */
function authToken(): string {
  return localStorage.getItem(TOKEN_KEY) || (import.meta.env.VITE_API_TOKEN as string) || "";
}

function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("sd_authed");
}

/** On 401 the token is invalid/expired → drop it and bounce to login. */
function handleUnauthorized(): void {
  clearAuth();
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

/** Real per-user login: POST email+password → store the returned JWT. */
export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/web-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(res.status === 401 ? "Credenciales inválidas" : `Error ${res.status}`);
  }
  const data = (await res.json()) as { access_token: string };
  localStorage.setItem(TOKEN_KEY, data.access_token);
}

export function logout(): void {
  clearAuth();
}

export async function apiGet<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const token = authToken();
  if (!token) throw new Error("No auth token");
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) { handleUnauthorized(); throw new Error("401 — sesión expirada"); }
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const token = authToken();
  if (!token) throw new Error("No auth token");
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 401) { handleUnauthorized(); throw new Error("401 — sesión expirada"); }
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

/**
 * Fetch a protected binary resource (e.g. a PDF) WITH the auth header and return
 * a blob. `absolutePath` is a full API path (e.g. /api/v1/documents/123/download)
 * — it already includes the /api/v1 prefix, so it is fetched as-is via the proxy.
 */
export async function fetchBlob(absolutePath: string): Promise<Blob> {
  const token = authToken();
  if (!token) throw new Error("No auth token");
  const res = await fetch(absolutePath, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) { handleUnauthorized(); throw new Error("401 — sesión expirada"); }
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.blob();
}
