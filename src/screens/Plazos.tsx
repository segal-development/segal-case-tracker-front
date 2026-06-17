import { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Calendar, AlignJustify } from "lucide-react";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Btn } from "@/components/primitives/Btn";
import { Card } from "@/components/primitives/Card";
import { useCausas } from "@/hooks/useCausas";
import type { Causa } from "@/data/types";

type VistaMode = "lista" | "calendario";
type EstadoFilter = "todos" | "vencido" | "hoy" | "prox7" | "alDia";

interface PlazosProps {
  onNuevoPlazo?: () => void;
}

// ---------- Page styles ----------

const pageCss: CSSProperties = {
  padding: "36px 40px 56px",
  maxWidth: 1320,
  margin: "0 auto",
};
const pageTitleCss: CSSProperties = {
  margin: 0,
  fontFamily: "var(--fj-heading)",
  fontWeight: 500,
  fontSize: 34,
  letterSpacing: "-.015em",
  color: "var(--fj-ink)",
};
const kickerCss: CSSProperties = {
  fontFamily: "var(--fj-body)",
  fontSize: 11,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "var(--fj-ink3)",
  fontWeight: 600,
  marginBottom: 6,
  whiteSpace: "nowrap",
};

// ---------- Utility functions ----------

function diasRestantes(nextDeadlineAt: string): number {
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parts = nextDeadlineAt.split("T")[0].split("-").map(Number);
  const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
  return Math.round(
    (deadlineDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function formatDateCL(isoString: string): string {
  const parts = isoString.split("T")[0].split("-").map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function diasLabel(dias: number): string {
  if (dias < 0)
    return `Vencido hace ${Math.abs(dias)} día${Math.abs(dias) !== 1 ? "s" : ""}`;
  if (dias === 0) return "Vence hoy";
  return `${dias} día${dias !== 1 ? "s" : ""}`;
}

const ESTADO_LABEL: Record<string, string> = {
  notificado: "Plazo para oponer excepciones (art. 459 CPC)",
  excepciones: "Excepciones opuestas — en traslado",
  traslado_ejecutante: "Traslado al ejecutante (art. 466 CPC)",
  admisibilidad: "Resolución de admisibilidad de excepciones",
  auto_prueba: "Término probatorio (art. 468 CPC)",
  citacion_sentencia: "Citado a oír sentencia (art. 162/470 CPC)",
  sentencia: "Sentencia — plazo de apelación (art. 187/475 CPC)",
  rebelde: "Rebeldía — sin oposición",
  mandamiento: "Mandamiento de ejecución",
  terminada: "Causa terminada",
};

function estadoLabel(state?: string | null): string {
  if (!state) return "Plazo en seguimiento";
  return ESTADO_LABEL[state] ?? "Plazo en seguimiento";
}

// ---------- ViewToggle ----------

const viewToggleBtnStyle = (active: boolean): CSSProperties => ({
  height: 28,
  padding: "0 12px",
  borderRadius: 6,
  border: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12.5,
  fontWeight: 500,
  cursor: "pointer",
  background: active ? "var(--fj-primary-soft)" : "transparent",
  color: active ? "var(--fj-primary)" : "var(--fj-ink3)",
});

function ViewToggle({
  vista,
  setVista,
}: {
  vista: VistaMode;
  setVista: (v: VistaMode) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        border: "1px solid var(--fj-line-strong)",
        borderRadius: 8,
        padding: 3,
        gap: 2,
        background: "var(--fj-panel)",
      }}
    >
      <button onClick={() => setVista("lista")} style={viewToggleBtnStyle(vista === "lista")}>
        <AlignJustify size={13} /> Lista
      </button>
      <button
        onClick={() => setVista("calendario")}
        style={viewToggleBtnStyle(vista === "calendario")}
      >
        <Calendar size={13} /> Calendario
      </button>
    </div>
  );
}

// ---------- ResumenCard ----------

function ResumenCard({
  label,
  n,
  active,
  onClick,
  dot,
  emphasis,
}: {
  label: string;
  n: number;
  active: boolean;
  onClick: () => void;
  dot?: string;
  emphasis?: "rojo";
}) {
  const emphasisColor = emphasis === "rojo" ? "var(--fj-rojo)" : undefined;
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: 18,
        borderRadius: 12,
        background: "var(--fj-panel)",
        border: active ? "1px solid var(--fj-primary)" : "1px solid var(--fj-line)",
        outline: active ? "3px solid var(--fj-primary-soft)" : "none",
        outlineOffset: -1,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {dot && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: dot,
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".10em",
            textTransform: "uppercase",
            color: emphasisColor ?? "var(--fj-ink2)",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--fj-heading)",
          fontSize: 34,
          fontWeight: 500,
          letterSpacing: "-.02em",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          color: emphasisColor ?? "var(--fj-ink)",
        }}
      >
        {n}
      </span>
    </button>
  );
}

// ---------- FilterChip ----------

function FilterChip({
  label,
  active,
  onClick,
  abogado,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  abogado?: { iniciales: string; color: string; nombre: string };
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 999,
        padding: "5px 11px",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
        cursor: "pointer",
        background: active ? "var(--fj-primary)" : "var(--fj-panel)",
        border: `1px solid ${active ? "var(--fj-primary)" : "var(--fj-line)"}`,
        color: active ? "var(--fj-primary-ink)" : "var(--fj-ink2)",
      }}
    >
      {abogado && (
        <Avatar
          iniciales={abogado.iniciales}
          color={abogado.color}
          nombre={abogado.nombre}
          size={18}
        />
      )}
      {label}
    </button>
  );
}

// ---------- PlazosLista ----------

function PlazosLista({ causas }: { causas: Causa[] }) {
  const navigate = useNavigate();

  const groups: Array<{ title: string; list: Causa[]; titleColor?: string }> = [
    {
      title: "Vencidos",
      list: causas.filter((c) => diasRestantes(c.next_deadline_at!) < 0),
      titleColor: "var(--fj-rojo)",
    },
    {
      title: "Vence hoy",
      list: causas.filter((c) => diasRestantes(c.next_deadline_at!) === 0),
    },
    {
      title: "Próximos 7 días",
      list: causas.filter((c) => {
        const d = diasRestantes(c.next_deadline_at!);
        return d > 0 && d <= 7;
      }),
    },
    {
      title: "Próximos 30 días",
      list: causas.filter((c) => {
        const d = diasRestantes(c.next_deadline_at!);
        return d > 7 && d <= 30;
      }),
    },
    {
      title: "Al día",
      list: causas.filter((c) => diasRestantes(c.next_deadline_at!) > 30),
    },
  ].filter((g) => g.list.length > 0);

  if (causas.length === 0) {
    return (
      <Card pad={60} style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--fj-heading)",
            fontSize: 20,
            fontWeight: 500,
            color: "var(--fj-ink)",
            marginBottom: 8,
          }}
        >
          Sin plazos en este filtro.
        </div>
        <div style={{ fontFamily: "var(--fj-body)", fontSize: 14, color: "var(--fj-ink3)" }}>
          Prueba con otro estado o abogado.
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {groups.map(({ title, list, titleColor }) => (
        <div key={title}>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: titleColor ?? "var(--fj-ink3)",
              marginBottom: 8,
            }}
          >
            {title}{" "}
            <span style={{ color: "var(--fj-ink3)", fontWeight: 500 }}>({list.length})</span>
          </div>
          <Card pad={0} style={{ overflow: "hidden" }}>
            {list.map((causa, i) => {
              const dias = diasRestantes(causa.next_deadline_at!);
              const daysColor =
                dias <= 0
                  ? "var(--fj-rojo)"
                  : dias <= 7
                  ? "var(--fj-amarillo)"
                  : "var(--fj-ink2)";

              return (
                <button
                  key={causa.id}
                  onClick={() => navigate(`/causas/${causa.id}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto auto",
                    gap: 16,
                    padding: "14px 20px",
                    alignItems: "center",
                    width: "100%",
                    background: "transparent",
                    border: 0,
                    borderBottom:
                      i === list.length - 1 ? undefined : "1px solid var(--fj-line)",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--fj-panel2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Col 1: semaforo ring */}
                  <SemaforoRing status={causa.semaforo} size={22} />

                  {/* Col 2: estado label + causa info */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--fj-body)",
                        fontSize: 11,
                        color: "var(--fj-ink3)",
                        marginBottom: 3,
                      }}
                    >
                      {estadoLabel(causa.procedural_state)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "var(--fj-ink)",
                      }}
                    >
                      <code
                        style={{
                          fontFamily: "var(--fj-mono)",
                          fontSize: 12,
                          color: "var(--fj-ink2)",
                        }}
                      >
                        {causa.rol}
                      </code>
                      <span style={{ color: "var(--fj-ink3)" }}>·</span>
                      <span
                        style={{
                          maxWidth: 340,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {causa.caratula}
                      </span>
                    </div>
                  </div>

                  {/* Col 3: date + days remaining */}
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--fj-ink3)",
                        marginBottom: 2,
                      }}
                    >
                      {formatDateCL(causa.next_deadline_at!)}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                        color: daysColor,
                      }}
                    >
                      {diasLabel(dias)}
                    </div>
                  </div>

                  {/* Col 4: abogado avatar */}
                  <Avatar
                    iniciales={causa.abogado.iniciales}
                    color={causa.abogado.color}
                    nombre={causa.abogado.nombre}
                    size={26}
                  />
                </button>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}

// ---------- PlazosCalendario (grouped-by-date view) ----------

function PlazosCalendario({ causas }: { causas: Causa[] }) {
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    const map = new Map<string, Causa[]>();
    for (const c of causas) {
      const dateKey = c.next_deadline_at!.split("T")[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(c);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [causas]);

  if (causas.length === 0) {
    return (
      <Card pad={60} style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--fj-heading)",
            fontSize: 20,
            fontWeight: 500,
            color: "var(--fj-ink)",
            marginBottom: 8,
          }}
        >
          Sin plazos en este filtro.
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {grouped.map(([dateKey, list]) => {
        const dias = diasRestantes(dateKey);
        const isVencido = dias < 0;
        const isHoy = dias === 0;
        const headerBg = isVencido
          ? "var(--fj-rojo-soft)"
          : isHoy
          ? "var(--fj-amarillo-soft)"
          : "var(--fj-panel2)";
        const headerColor = isVencido
          ? "var(--fj-rojo)"
          : isHoy
          ? "var(--fj-amarillo)"
          : "var(--fj-ink3)";

        return (
          <div key={dateKey}>
            <div
              style={{
                padding: "8px 16px",
                background: headerBg,
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid var(--fj-line)",
                borderBottom: 0,
                borderRadius: "8px 8px 0 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: headerColor,
                  textTransform: "uppercase",
                  letterSpacing: ".10em",
                }}
              >
                {formatDateCL(dateKey)}
              </span>
              <span
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 11,
                  color: headerColor,
                  opacity: 0.8,
                }}
              >
                {diasLabel(dias)}
              </span>
            </div>
            <Card pad={0} style={{ borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
              {list.map((causa, i) => (
                <button
                  key={causa.id}
                  onClick={() => navigate(`/causas/${causa.id}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    padding: "12px 20px",
                    alignItems: "center",
                    width: "100%",
                    background: "transparent",
                    border: 0,
                    borderBottom:
                      i === list.length - 1 ? undefined : "1px solid var(--fj-line)",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--fj-panel2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <SemaforoRing status={causa.semaforo} size={20} />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--fj-body)",
                        fontSize: 11,
                        color: "var(--fj-ink3)",
                        marginBottom: 2,
                      }}
                    >
                      {estadoLabel(causa.procedural_state)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code
                        style={{
                          fontFamily: "var(--fj-mono)",
                          fontSize: 12,
                          color: "var(--fj-ink2)",
                        }}
                      >
                        {causa.rol}
                      </code>
                      <span style={{ color: "var(--fj-ink3)" }}>·</span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--fj-ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {causa.caratula}
                      </span>
                    </div>
                  </div>
                  <Avatar
                    iniciales={causa.abogado.iniciales}
                    color={causa.abogado.color}
                    nombre={causa.abogado.nombre}
                    size={24}
                  />
                </button>
              ))}
            </Card>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Main export ----------

export function Plazos({ onNuevoPlazo = () => {} }: PlazosProps) {
  const [vista, setVista] = useState<VistaMode>("lista");
  const [estado, setEstado] = useState<EstadoFilter>("todos");
  const [abg, setAbg] = useState("todos");

  const { data: causas = [], isLoading } = useCausas();

  // Only causas with a tracked deadline and a non-null semaforo
  const plazoCausas = useMemo(
    () => causas.filter((c) => c.next_deadline_at && c.semaforo !== null),
    [causas],
  );

  // Sorted ascending by deadline (most urgent first)
  const sorted = useMemo(
    () =>
      [...plazoCausas].sort(
        (a, b) =>
          new Date(a.next_deadline_at!).getTime() -
          new Date(b.next_deadline_at!).getTime(),
      ),
    [plazoCausas],
  );

  // Summary bucket counts
  const vencidosList = sorted.filter((c) => diasRestantes(c.next_deadline_at!) < 0);
  const venceHoyList = sorted.filter((c) => diasRestantes(c.next_deadline_at!) === 0);
  const prox7List = sorted.filter((c) => {
    const d = diasRestantes(c.next_deadline_at!);
    return d > 0 && d <= 7;
  });
  const alDiaList = sorted.filter((c) => diasRestantes(c.next_deadline_at!) > 30);

  // Unique abogados from plazoCausas for the filter chips
  const abogados = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ id: string; iniciales: string; color: string; nombre: string }> = [];
    for (const c of plazoCausas) {
      if (!seen.has(c.abogado.id)) {
        seen.add(c.abogado.id);
        result.push(c.abogado);
      }
    }
    return result;
  }, [plazoCausas]);

  // Apply abogado filter
  const abgFiltered = useMemo(
    () => (abg === "todos" ? sorted : sorted.filter((c) => c.abogado.id === abg)),
    [sorted, abg],
  );

  // Apply estado filter
  const filtered = useMemo(() => {
    switch (estado) {
      case "vencido":
        return abgFiltered.filter((c) => diasRestantes(c.next_deadline_at!) < 0);
      case "hoy":
        return abgFiltered.filter((c) => diasRestantes(c.next_deadline_at!) === 0);
      case "prox7":
        return abgFiltered.filter((c) => {
          const d = diasRestantes(c.next_deadline_at!);
          return d > 0 && d <= 7;
        });
      case "alDia":
        return abgFiltered.filter((c) => diasRestantes(c.next_deadline_at!) > 30);
      default:
        return abgFiltered;
    }
  }, [abgFiltered, estado]);

  if (isLoading) {
    return (
      <div style={pageCss}>
        <div style={{ fontFamily: "var(--fj-body)", color: "var(--fj-ink3)" }}>
          Cargando plazos…
        </div>
      </div>
    );
  }

  return (
    <div style={pageCss}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 22,
          gap: 24,
        }}
      >
        <div>
          <div style={kickerCss}>Control de plazos</div>
          <h1 style={pageTitleCss}>Plazos</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ViewToggle vista={vista} setVista={setVista} />
          <Btn
            icon={<Plus size={15} strokeWidth={1.6} />}
            kind="primary"
            onClick={onNuevoPlazo}
          >
            Nuevo plazo
          </Btn>
        </div>
      </div>

      {/* Alert banner — vencidos */}
      {vencidosList.length > 0 && (
        <div
          style={{
            background: "var(--fj-rojo-soft)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 16,
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "var(--fj-rojo)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: "var(--fj-rojo)" }}>
              {vencidosList.length} plazo{vencidosList.length === 1 ? "" : "s"} vencido
              {vencidosList.length === 1 ? "" : "s"} sin resolver
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--fj-rojo)",
                opacity: 0.85,
                marginTop: 2,
              }}
            >
              Requiere acción inmediata. Considera prorrogar, justificar o derivar.
            </div>
          </div>
          <Btn
            kind="secondary"
            style={{
              background: "#fff",
              border: "1px solid var(--fj-rojo)",
              color: "var(--fj-rojo)",
            }}
            onClick={() => setEstado("vencido")}
          >
            Revisar
          </Btn>
        </div>
      )}

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <ResumenCard
          label="Total"
          n={sorted.length}
          active={estado === "todos"}
          onClick={() => setEstado("todos")}
        />
        <ResumenCard
          label="Vencidos"
          n={vencidosList.length}
          active={estado === "vencido"}
          onClick={() => setEstado("vencido")}
          dot="var(--fj-rojo)"
          emphasis="rojo"
        />
        <ResumenCard
          label="Vence hoy"
          n={venceHoyList.length}
          active={estado === "hoy"}
          onClick={() => setEstado("hoy")}
          dot="var(--fj-amarillo)"
        />
        <ResumenCard
          label="Próximos 7d"
          n={prox7List.length}
          active={estado === "prox7"}
          onClick={() => setEstado("prox7")}
          dot="var(--fj-amarillo)"
        />
        <ResumenCard
          label="Al día"
          n={alDiaList.length}
          active={estado === "alDia"}
          onClick={() => setEstado("alDia")}
          dot="var(--fj-verde)"
        />
      </div>

      {/* Abogado filter row */}
      {abogados.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 14,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 12,
              color: "var(--fj-ink3)",
              marginRight: 4,
            }}
          >
            Abogado:
          </span>
          <FilterChip label="Todos" active={abg === "todos"} onClick={() => setAbg("todos")} />
          {abogados.map((a) => (
            <FilterChip
              key={a.id}
              label={a.nombre.split(" ").slice(0, 2).join(" ")}
              active={abg === a.id}
              onClick={() => setAbg(a.id)}
              abogado={a}
            />
          ))}
        </div>
      )}

      {/* Vista */}
      {vista === "lista" ? (
        <PlazosLista causas={filtered} />
      ) : (
        <PlazosCalendario causas={filtered} />
      )}

      {/* Disclaimer */}
      <p
        style={{
          fontSize: 12,
          color: "var(--fj-ink3)",
          marginTop: 16,
          paddingLeft: 4,
          fontFamily: "var(--fj-body)",
        }}
      >
        Los plazos son orientativos y no reemplazan el criterio del abogado.
      </p>

    </div>
  );
}
