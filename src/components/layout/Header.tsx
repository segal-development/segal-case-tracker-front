import { useState } from "react";
import type { MouseEvent } from "react";
import { Bell, Search, Clock } from "lucide-react";
import { Avatar } from "@/components/primitives/Avatar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useRole } from "@/hooks/useRole";
import { useNotificaciones } from "@/hooks/useNotificaciones";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
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

function NotifPanel({ onClose }: { onClose: () => void }) {
  const { data: notifs = [] } = useNotificaciones();
  const unread = notifs.filter((n) => !n.leido);
  const hasUnread = unread.length > 0;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
      <div style={{
        position: "absolute", right: 120, top: 56, width: 360, zIndex: 41,
        background: "var(--fj-panel)", border: "1px solid var(--fj-line)",
        borderRadius: 12, boxShadow: "0 10px 30px rgba(15,22,38,.14)", overflow: "hidden",
      }}>
        <div style={{
          padding: "14px 16px", borderBottom: "1px solid var(--fj-line)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--fj-heading)", fontSize: 16, color: "var(--fj-ink)", fontWeight: 500 }}>
            Notificaciones {hasUnread && `(${unread.length})`}
          </span>
          <button
            onClick={onClose}
            style={{
              fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-primary)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            Marcar todas como leídas
          </button>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto" }}>
          {notifs.map((n) => (
            <div key={n.id} style={{
              padding: "12px 16px", display: "flex", gap: 10,
              borderBottom: "1px solid var(--fj-line)",
              background: n.leido ? "transparent" : "var(--fj-primary-soft)",
              opacity: n.leido ? 0.7 : 1,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: n.tipo === "vencimiento" || n.tipo === "plazo"
                  ? "var(--fj-rojo-soft)" : "var(--fj-panel2)",
                color: n.tipo === "vencimiento" || n.tipo === "plazo"
                  ? "var(--fj-rojo)" : "var(--fj-ink2)",
              }}>
                <Clock size={14} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--fj-body)", fontSize: 12.5, color: "var(--fj-ink)", lineHeight: 1.4 }}>
                  {n.texto}
                </div>
                <div style={{ fontFamily: "var(--fj-body)", fontSize: 11, color: "var(--fj-ink3)", marginTop: 2 }}>
                  {n.tiempo}
                </div>
              </div>
              {!n.leido && (
                <span style={{
                  width: 6, height: 6, borderRadius: 999,
                  background: "var(--fj-primary)", alignSelf: "center", flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function Header() {
  const { role, setRole } = useRole();
  const { abogado, clear } = useSelectedLawyer();
  const { data: notifs = [] } = useNotificaciones();
  const [notifOpen, setNotifOpen] = useState(false);

  const hasUnread = notifs.some((n) => !n.leido);

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
          title="Notificaciones"
        >
          <Bell size={16} strokeWidth={1.8} />
          {hasUnread && (
            <span style={{
              position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: 999,
              background: "var(--fj-rojo)", border: "1.5px solid var(--fj-panel)",
            }} />
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
          </div>
        </div>

        {/* Role switcher */}
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
      </div>

      {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
    </header>
  );
}
