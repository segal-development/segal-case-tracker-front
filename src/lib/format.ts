export function fmtCLP(v: number | null): string {
  if (v === null) return "—";
  return "$" + v.toLocaleString("es-CL");
}

// Accepts a date-only string ("2025-03-12") OR a full ISO datetime
// ("2026-04-15T00:00:00") — the API returns the latter. Normalize to the date
// part + noon to avoid timezone shifts.
function _atNoon(d: string): Date | null {
  if (!d) return null;
  const date = new Date(d.split("T")[0] + "T12:00:00");
  return isNaN(date.getTime()) ? null : date;
}

export function fmtDate(d: string): string {
  const date = _atNoon(d);
  if (!date) return "—";
  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}

export function fmtShortDate(d: string): string {
  const date = _atNoon(d);
  if (!date) return "—";
  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }).replace(".", "");
}

export function fmtRUT(r: string): string {
  const clean = r.replace(/[^0-9kK]/g, "");
  if (clean.length < 2) return r;
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv.toUpperCase()}`;
}

export function fromNow(iso: string): string {
  const date = _atNoon(iso);
  if (!date) return fmtDate(iso);
  const diffMs = Date.now() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "hoy";
  if (diffH < 24) return `hace ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "ayer";
  if (diffD < 30) return `hace ${diffD} días`;
  const diffSem = Math.floor(diffD / 7);
  if (diffSem < 9) return `hace ${diffSem} semanas`;
  return fmtDate(iso);
}
