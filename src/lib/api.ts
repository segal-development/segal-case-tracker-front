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
