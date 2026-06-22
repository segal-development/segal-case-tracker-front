const BASE = import.meta.env.VITE_API_BASE as string;
const TOKEN = import.meta.env.VITE_API_TOKEN as string;

export async function apiGet<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  if (!TOKEN) throw new Error('VITE_API_TOKEN is not set');
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  if (!TOKEN) throw new Error('VITE_API_TOKEN is not set');
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

/**
 * Fetch a protected binary resource (e.g. a PDF) WITH the auth header and return
 * a blob. `absolutePath` is a full API path (e.g. /api/v1/documents/123/download)
 * — it already includes the /api/v1 prefix, so it is fetched as-is via the proxy.
 */
export async function fetchBlob(absolutePath: string): Promise<Blob> {
  if (!TOKEN) throw new Error('VITE_API_TOKEN is not set');
  const res = await fetch(absolutePath, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.blob();
}
