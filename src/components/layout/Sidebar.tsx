import { useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import {
  Home, Briefcase, Clock, TrendingUp, Users, Settings, Smartphone, RefreshCw,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { SDMark } from "@/components/primitives/SDMark";
import { Wordmark } from "@/components/primitives/Wordmark";
import { Pill } from "@/components/primitives/Pill";
import { useRole } from "@/hooks/useRole";
import { CAUSAS, RESUMEN_PLAZOS, ADMIN } from "@/data/mock";
import type { Role } from "@/hooks/useRole";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeTone?: "rojo" | "neutral";
}

function getNavItems(role: Role): NavItem[] {
  const causasBadge = CAUSAS.length;
  const plazosBadge = RESUMEN_PLAZOS.proximos + RESUMEN_PLAZOS.vencidos;

  if (role === "supervisor") {
    return [
      { path: "/",              label: "Vista de estudio", icon: <Home size={17} strokeWidth={1.6} /> },
      { path: "/causas",        label: "Causas",           icon: <Briefcase size={17} strokeWidth={1.6} />, badge: causasBadge },
      { path: "/productividad", label: "Equipo",           icon: <TrendingUp size={17} strokeWidth={1.6} /> },
      { path: "/plazos",        label: "Plazos",           icon: <Clock size={17} strokeWidth={1.6} /> },
      { path: "/supervisor",    label: "Supervisor",       icon: <Users size={17} strokeWidth={1.6} /> },
    ];
  }

  if (role === "admin") {
    return [
      { path: "/",              label: "Centro operativo", icon: <Home size={17} strokeWidth={1.6} />, badge: ADMIN.SIN_ASIGNAR.length, badgeTone: "rojo" },
      { path: "/causas",        label: "Causas",           icon: <Briefcase size={17} strokeWidth={1.6} />, badge: causasBadge },
      { path: "/plazos",        label: "Plazos",           icon: <Clock size={17} strokeWidth={1.6} /> },
      { path: "/productividad", label: "Reportes",         icon: <TrendingUp size={17} strokeWidth={1.6} /> },
      { path: "/admin",         label: "Admin",            icon: <Settings size={17} strokeWidth={1.6} /> },
      { path: "/movil",         label: "Móvil",            icon: <Smartphone size={17} strokeWidth={1.6} /> },
    ];
  }

  // abogado (default)
  return [
    { path: "/",              label: "Dashboard",     icon: <Home size={17} strokeWidth={1.6} /> },
    { path: "/causas",        label: "Causas",        icon: <Briefcase size={17} strokeWidth={1.6} />, badge: causasBadge },
    { path: "/plazos",        label: "Plazos",        icon: <Clock size={17} strokeWidth={1.6} />, badge: plazosBadge, badgeTone: "rojo" },
    { path: "/productividad", label: "Productividad", icon: <TrendingUp size={17} strokeWidth={1.6} /> },
  ];
}

const sectionLabel: Record<Role, string> = {
  abogado:    "Trabajo",
  supervisor: "Vista ejecutiva",
  admin:      "Operaciones",
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { role } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const items = getNavItems(role);

  const activePath = location.pathname;

  function isActive(path: string) {
    if (path === "/") return activePath === "/";
    return activePath.startsWith(path);
  }

  return (
    <aside style={{
      width: collapsed ? 64 : 232,
      transition: "width .18s ease",
      borderRight: "1px solid var(--fj-line)",
      background: "var(--fj-panel)",
      display: "flex",
      flexDirection: "column",
      flex: "0 0 auto",
      overflow: "hidden",
    }}>
      <div style={{
        height: 64, display: "flex", alignItems: "center",
        padding: collapsed ? "0 0 0 18px" : "0 18px",
        borderBottom: "1px solid var(--fj-line)", gap: 10,
        flexShrink: 0,
      }}>
        {collapsed ? <SDMark size={28} /> : <Wordmark size={28} />}
      </div>

      <nav style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 2, overflow: "hidden" }}>
        {!collapsed && (
          <div style={{
            fontFamily: "var(--fj-body)", fontSize: 10.5, fontWeight: 600,
            letterSpacing: ".14em", textTransform: "uppercase",
            color: "var(--fj-ink3)", padding: "10px 10px 6px",
          }}>
            {sectionLabel[role]}
          </div>
        )}
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                border: 0, borderRadius: 8, cursor: "pointer",
                background: active ? "var(--fj-primary-soft)" : "transparent",
                color: active ? "var(--fj-primary)" : "var(--fj-ink2)",
                fontFamily: "var(--fj-body)", fontSize: 13.5, fontWeight: active ? 600 : 500,
                width: "100%",
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                if (!active) e.currentTarget.style.background = "var(--fj-panel2)";
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              {item.icon}
              {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>}
              {!collapsed && ["/supervisor", "/admin", "/productividad"].includes(item.path) && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 500,
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: "var(--fj-panel2)",
                  color: "var(--fj-ink3)",
                  lineHeight: 1.4,
                  border: "1px solid var(--fj-line)",
                  flexShrink: 0,
                  fontFamily: "var(--fj-body)",
                }}>
                  demo
                </span>
              )}
              {!collapsed && item.badge != null && item.badge > 0 && (
                <Pill tone={item.badgeTone ?? "neutral"} style={{ fontSize: 10.5, padding: "1px 7px" }}>
                  {item.badge}
                </Pill>
              )}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        {!collapsed && (
          <div style={{
            margin: 10, padding: 14, borderRadius: 10,
            background: "var(--fj-panel2)", border: "1px solid var(--fj-line)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <RefreshCw size={14} strokeWidth={1.8} color="var(--fj-primary)" />
              <span style={{
                fontFamily: "var(--fj-body)", fontSize: 11, fontWeight: 600,
                letterSpacing: ".10em", textTransform: "uppercase", color: "var(--fj-primary)",
              }}>Sincronización</span>
            </div>
            <div style={{ fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)", lineHeight: 1.4 }}>
              Última conexión PJUD: <strong style={{ color: "var(--fj-ink2)" }}>hace 12 min</strong>
            </div>
          </div>
        )}
      </nav>

      <button
        onClick={onToggleCollapse}
        style={{
          margin: 10, height: 32, border: 0, background: "transparent",
          color: "var(--fj-ink3)", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
          gap: 8, padding: collapsed ? 0 : "0 12px", borderRadius: 8,
          fontFamily: "var(--fj-body)", fontSize: 12,
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "var(--fj-panel2)";
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {collapsed
          ? <ChevronRight size={14} strokeWidth={1.8} />
          : <ChevronLeft size={14} strokeWidth={1.8} />
        }
        {!collapsed && "Contraer"}
      </button>
    </aside>
  );
}
