export function fmtCLP(v: number | null): string {
  if (v === null) return "—";
  return "$" + v.toLocaleString("es-CL");
}

export function fmtDate(d: string): string {
  const date = new Date(d + "T12:00:00"); // noon to avoid timezone shifts
  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}

export function fmtShortDate(d: string): string {
  const date = new Date(d + "T12:00:00");
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
