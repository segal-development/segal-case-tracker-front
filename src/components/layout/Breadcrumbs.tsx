import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ROUTE_MAP: Record<string, string[]> = {
  "/":              ["Inicio", "Dashboard"],
  "/causas":        ["Inicio", "Causas"],
  "/plazos":        ["Inicio", "Plazos"],
  "/productividad": ["Inicio", "Productividad"],
  "/supervisor":    ["Inicio", "Vista de estudio"],
  "/admin":         ["Inicio", "Centro operativo"],
  "/movil":         ["Inicio", "Móvil"],
  "/showcase":      ["Inicio", "Showcase"],
};

function getItems(pathname: string): string[] {
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];
  if (pathname.startsWith("/causas/")) return ["Inicio", "Causas", "Detalle"];
  return ["Inicio"];
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const items = getItems(pathname);

  return (
    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && (
            <ChevronRight size={12} strokeWidth={1.8} color="var(--fj-ink3)" />
          )}
          <span style={{
            fontFamily: "var(--fj-body)", fontSize: 13,
            color: i === items.length - 1 ? "var(--fj-ink)" : "var(--fj-ink3)",
            fontWeight: i === items.length - 1 ? 600 : 500,
          }}>
            {item}
          </span>
        </span>
      ))}
    </nav>
  );
}
