import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Avatar } from "@/components/primitives/Avatar";
import { Spinner } from "@/components/Spinner";
import { Wordmark } from "@/components/primitives/Wordmark";
import { useLawyers } from "@/hooks/useLawyers";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
import type { LawyerRosterItem } from "@/hooks/useLawyers";

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

export function SelectLawyer() {
  const { data: lawyers = [], isLoading, isError } = useLawyers();
  const { setAbogado } = useSelectedLawyer();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = lawyers.filter((l) =>
    l.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePick = (item: LawyerRosterItem) => {
    setAbogado(item);
    navigate("/", { replace: true });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--fj-paper)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 32,
    }}>
      <div style={{ marginBottom: 32 }}>
        <Wordmark size={28} />
      </div>

      <div style={{
        width: "100%", maxWidth: 540,
        background: "var(--fj-panel)", border: "1px solid var(--fj-line)",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 8px 32px rgba(15,22,38,.1)",
      }}>
        {/* Card header */}
        <div style={{
          padding: "24px 24px 16px",
          borderBottom: "1px solid var(--fj-line)",
        }}>
          <h2 style={{
            margin: 0, fontFamily: "var(--fj-heading)", fontSize: 22,
            fontWeight: 500, color: "var(--fj-ink)", letterSpacing: "-.012em",
          }}>
            ¿Quién sos?
          </h2>
          <p style={{
            margin: "6px 0 0", fontFamily: "var(--fj-body)", fontSize: 13,
            color: "var(--fj-ink3)", lineHeight: 1.5,
          }}>
            Seleccioná tu perfil para ver tus causas asignadas.
          </p>
          {/* Search box */}
          <div style={{
            marginTop: 16, display: "flex", alignItems: "center", gap: 8,
            height: 38, padding: "0 12px",
            background: "var(--fj-panel2)", borderRadius: 8,
            border: "1px solid var(--fj-line)",
          }}>
            <Search size={14} strokeWidth={1.8} color="var(--fj-ink3)" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por nombre…"
              autoFocus
              style={{
                flex: 1, border: 0, background: "transparent", outline: "none",
                fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)",
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ maxHeight: 440, overflowY: "auto" }}>
          {isLoading && (
            <div style={{
              display: "flex", justifyContent: "center",
              alignItems: "center", padding: 48,
            }}>
              <Spinner size={40} />
            </div>
          )}
          {isError && !isLoading && (
            <div style={{
              padding: 32, textAlign: "center",
              fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-rojo)",
            }}>
              No se pudo cargar la lista. Recargá la página.
            </div>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <div style={{
              padding: 32, textAlign: "center",
              fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)",
            }}>
              No hay abogados que coincidan.
            </div>
          )}
          {filtered.map((lawyer, idx) => (
            <button
              key={lawyer.rut}
              onClick={() => handlePick(lawyer)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 12, padding: "12px 24px",
                background: "transparent", border: 0, cursor: "pointer",
                borderBottom: idx < filtered.length - 1
                  ? "1px solid var(--fj-line)" : "none",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--fj-primary-soft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Avatar
                iniciales={getInitials(lawyer.nombre)}
                color={colorFromName(lawyer.nombre)}
                nombre={lawyer.nombre}
                size={36}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--fj-body)", fontSize: 14, fontWeight: 600,
                  color: "var(--fj-ink)", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {lawyer.nombre}
                </div>
                <div style={{
                  fontFamily: "var(--fj-body)", fontSize: 12,
                  color: "var(--fj-ink3)", marginTop: 2,
                }}>
                  {lawyer.case_count} causa{lawyer.case_count !== 1 ? "s" : ""}
                </div>
              </div>
              <div style={{
                fontFamily: "var(--fj-mono)", fontSize: 13, fontWeight: 600,
                color: "var(--fj-primary)", flexShrink: 0,
              }}>
                {lawyer.case_count}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
