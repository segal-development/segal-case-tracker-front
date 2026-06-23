import { useState } from "react";
import type { MouseEvent } from "react";
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/primitives/Avatar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useRole } from "@/hooks/useRole";
import { useNovedades } from "@/novedades/useNovedades";
import type { Novedad } from "@/novedades/useNovedades";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
import { useMe } from "@/hooks/useMe";
import { logout } from "@/lib/api";
import { fromNow } from "@/lib/format";
import type { Role } from "@/hooks/useRole";

function getInitials(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const AVATAR_PALETTE = [
  "#1a56db", "#0e9f6e", "#7e3af2", "#e3a008",
  "#e02424", "#3f83f8", "#057a55", "#8b5cf6",
];
function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]!;
}

interface NotifPanelProps {
  novedades: Novedad[];
  count: number;
  markAllSeen: () => void;
  isLoading: boolean;
  onClose: () => void;
}

function NotifPanel({ novedades, count, markAllSeen, isLoading, onClose }: NotifPanelProps) {
  const navigate = useNavigate();
  const visible = novedades.slice(0, 6);

  function handleRowClick(causaId: string) {
    navigate(`/causas/${causaId}`);
    onClose();
  }

  function handleMarkAllSeen() {
    markAllSeen();
    onClose();
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
      <div style={{
        position: "absolute", right: 120, top: 56, width: 360, zIndex: 41,
        background: "var(--fj-panel)", border: "1px solid var(--fj-line)",
        borderRadius: 12, boxShadow: "0 10px 30px rgba(15,22,38,.14)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 16px", borderBottom: "1px solid var(--fj-line)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--fj-heading)", fontSize: 16, color: "var(--fj-ink)", fontWeight: 500 }}>
            Novedades{count > 0 ? ` (${count})` : ""}
          </span>
          {count > 0 && (
            <button
              onClick={handleMarkAllSeen}
              style={{
                fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-primary)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              Marcar todas como vistas
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ maxHeight: 380, overflowY: "auto" }}>
          {isLoading ? (
            <div style={{ padding: "20px 16px", textAlign: "center", fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)" }}>
              Cargando…
            </div>
          ) : count === 0 ? (
            <div style={{ padding: "24px 16px", textAlign: "center", fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)" }}>
              Sin novedades
            </div>
          ) : (
            visible.map((nov) => (
              <div key={nov.causa.id} style={{ borderBottom: "1px solid var(--fj-line)" }}>
                <button
                  onClick={() => handleRowClick(nov.causa.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    width: "100%", padding: "12px 16px", gap: 2,
                    background: nov.isNew ? "var(--fj-primary-soft)" : "transparent",
                    border: "none",
                    cursor: "pointer", textAlign: "left",
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = "var(--fj-panel2)";
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = nov.isNew ? "var(--fj-primary-soft)" : "transparent";
                  }}
                >
                  <span style={{ fontFamily: "var(--fj-body)", fontSize: 12.5, color: "var(--fj-ink)", lineHeight: 1.4, fontWeight: nov.isNew ? 600 : 400 }}>
                    Movimiento nuevo · {nov.causa.rol}
                  </span>
                  <span style={{
                    fontFamily: "var(--fj-body)", fontSize: 11, color: "var(--fj-ink3)", lineHeight: 1.3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%",
                  }}>
                    {nov.causa.caratula.length > 50
                      ? nov.causa.caratula.slice(0, 50) + "…"
                      : nov.causa.caratula
                    } · {fromNow(nov.ultima)}
                  </span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--fj-line)", textAlign: "center" }}>
          <button
            onClick={() => { navigate("/novedades"); onClose(); }}
            style={{
              fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-primary)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            Ver todas
          </button>
        </div>
      </div>
    </>
  );
}

export function Header() {
  const { role, setRole } = useRole();
  const { abogado, clear } = useSelectedLawyer();
  const { data: me } = useMe();
  const isAdmin = me?.role === "admin";
  const { novedades, count, markAllSeen, isLoading } = useNovedades();
  const [notifOpen, setNotifOpen] = useState(false);

  const badgeLabel = count > 99 ? "99+" : String(count);

  return (
    <header style={{
      height: 64, borderBottom: "1px solid var(--fj-line)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", background: "var(--fj-panel)", position: "relative",
      flexShrink: 0,
    }}>
      <Breadcrumbs />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          height: 36, padding: "0 12px", borderRadius: 8,
          background: "var(--fj-panel2)", color: "var(--fj-ink3)",
          width: 240,
        }}>
          <Search size={15} strokeWidth={1.8} />
          <input
            placeholder="Buscar por ROL, carátula, parte…"
            style={{
              border: 0, background: "transparent", outline: "none", flex: 1,
              fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)",
            }}
          />
          <kbd style={{
            fontFamily: "var(--fj-mono)", fontSize: 10, color: "var(--fj-ink3)",
            padding: "1px 5px", borderRadius: 4, background: "var(--fj-panel)",
            border: "1px solid var(--fj-line)",
          }}>⌘ K</kbd>
        </div>

        {/* Bell */}
        <button
          onClick={() => setNotifOpen((v) => !v)}
          style={{
            position: "relative", width: 36, height: 36, borderRadius: 8, border: 0,
            background: "transparent", color: "var(--fj-ink2)",
            cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.background = "var(--fj-panel2)";
          }}
          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.background = "transparent";
          }}
          title="Novedades"
        >
          <Bell size={16} strokeWidth={1.8} />
          {count > 0 && (
            <span style={{
              position: "absolute", top: 4, right: 3,
              minWidth: count > 99 ? 22 : count > 9 ? 18 : 14, height: 14, borderRadius: 999,
              background: "var(--fj-rojo)", border: "1.5px solid var(--fj-panel)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--fj-mono)", fontSize: 9, color: "#fff",
              fontWeight: 700, lineHeight: 1, padding: "0 2px",
            }}>
              {badgeLabel}
            </span>
          )}
        </button>

        {/* User info */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, paddingLeft: 12,
          borderLeft: "1px solid var(--fj-line)", height: 28, flexShrink: 0,
        }}>
          {abogado && (
            <Avatar
              iniciales={getInitials(abogado.nombre)}
              color={colorFromName(abogado.nombre)}
              nombre={abogado.nombre}
              size={30}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: "var(--fj-body)", fontSize: 12.5, color: "var(--fj-ink)", fontWeight: 600 }}>
              {abogado?.nombre ?? "—"}
            </span>
            {isAdmin && (
              <button
                onClick={clear}
                style={{
                  fontFamily: "var(--fj-body)", fontSize: 11, color: "var(--fj-primary)",
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, textAlign: "left",
                }}
              >
                Cambiar abogado
              </button>
            )}
            <button
              onClick={() => { logout(); clear(); window.location.href = "/login"; }}
              style={{
                fontFamily: "var(--fj-body)", fontSize: 11, color: "var(--fj-ink3)",
                background: "none", border: "none", cursor: "pointer",
                padding: 0, textAlign: "left", marginTop: 2,
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Role switcher — demo tool, admins only */}
        {isAdmin && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            style={{
              height: 28, padding: "0 8px", borderRadius: 6,
              border: "1px solid var(--fj-line-strong)",
              background: "var(--fj-panel)", color: "var(--fj-ink2)",
              fontFamily: "var(--fj-body)", fontSize: 11.5, cursor: "pointer",
            }}
            title="Cambiar rol (demo)"
          >
            <option value="abogado">Abogado</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </div>

      {notifOpen && (
        <NotifPanel
          novedades={novedades}
          count={count}
          markAllSeen={markAllSeen}
          isLoading={isLoading}
          onClose={() => setNotifOpen(false)}
        />
      )}
    </header>
  );
}
