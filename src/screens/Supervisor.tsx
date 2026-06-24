import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Pill } from "@/components/primitives/Pill";
import { Btn } from "@/components/primitives/Btn";
import { Card } from "@/components/primitives/Card";
import { KPI } from "@/components/primitives/KPI";
import { BriefcaseIcon } from "@/components/primitives/icons";
import { useTokenColors } from "@/hooks/useTokenColors";
import { Splash } from "@/components/Splash";
import { useFirmStats } from "@/hooks/useFirmStats";
import type { FirmSemaforo, FirmLawyerItem } from "@/hooks/useFirmStats";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getInitials(nombre: string): string {
  const parts = nombre.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "#4a6fa5", "#6a7abf", "#5a8a6e", "#9b6a5a", "#7a6a9b",
  "#5a8a9b", "#9b8a5a", "#6a9b6a", "#8a5a7a", "#5a7a8a",
];

function rutToColor(rut: string): string {
  let hash = 0;
  for (let i = 0; i < rut.length; i++) {
    hash = (hash * 31 + rut.charCodeAt(i)) & 0xfffffff;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const MATERIA_COLORS = [
  "#4a6fa5", "#6a7abf", "#5a8a6e", "#9b6a5a", "#7a6a9b",
  "#5a8a9b", "#9b8a5a", "#6a9b6a", "#8a5a7a", "#5a7a8a",
  "#6a5a9b", "#9b5a6a",
];

// Legal labels for the juicio-ejecutivo procedural stages (CPC · Ley 21.394).
// Keys match the backend procedural_state / by_procedural_state stages.
const STAGE_LABELS: Record<string, string> = {
  mandamiento: "Mandamiento de ejecución",
  notificado: "Notificado — plazo excepciones (art. 459)",
  excepciones: "Excepciones opuestas (en traslado)",
  traslado_ejecutante: "Traslado al ejecutante (art. 466)",
  admisibilidad: "Admisibilidad de excepciones",
  auto_prueba: "Término probatorio (art. 468)",
  citacion_sentencia: "Citación a oír sentencia (art. 470)",
  sentencia: "Sentencia — plazo apelación (art. 475)",
  rebelde: "Rebeldía — sin oposición",
  terminada: "Terminada",
  indeterminate: "Sin plazo accionable (indeterminado)",
  sin_clasificar: "Sin clasificar (sin detalle)",
};

// ─── DonutChart ───────────────────────────────────────────────────────────────

function DonutChart({ sem, total }: { sem: FirmSemaforo; total: number }) {
  const colors = useTokenColors();
  const data = [
    { value: sem.rojo,     fill: colors.rojo },
    { value: sem.amarillo, fill: colors.amarillo },
    { value: sem.verde,    fill: colors.verde },
    { value: sem.otros,    fill: colors.ink3 ?? "#aaa" },
  ];
  return (
    <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
      <PieChart width={160} height={160}>
        <Pie
          data={data}
          cx={80}
          cy={80}
          innerRadius={55}
          outerRadius={75}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "var(--fj-heading)",
            lineHeight: 1,
          }}
        >
          {total}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--fj-ink3)",
            fontFamily: "var(--fj-body)",
            marginTop: 2,
          }}
        >
          causas
        </div>
      </div>
    </div>
  );
}

// ─── Supervisor ───────────────────────────────────────────────────────────────

// ─── RankingRiesgo: carga y riesgo por abogado (orden riesgo/carga + paginado) ──
function RankingRiesgo({ data }: { data: FirmLawyerItem[] }) {
  const [orden, setOrden] = useState<"riesgo" | "carga">("riesgo");
  const [page, setPage] = useState(0);
  const PAGE = 10;

  if (data.length === 0) {
    return (
      <Card pad={24} elevated style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontFamily: "var(--fj-heading)", fontSize: 16, marginBottom: 20 }}>
          Carga y riesgo por abogado
        </div>
        <div style={{ textAlign: "center", color: "var(--fj-ink3)", padding: "32px 0" }}>
          Sin abogados registrados
        </div>
      </Card>
    );
  }

  const sorted = [...data].sort((a, b) =>
    orden === "riesgo" ? b.rojo - a.rojo || b.case_count - a.case_count : b.case_count - a.case_count,
  );
  const metric = (a: FirmLawyerItem) => (orden === "riesgo" ? a.rojo : a.case_count);
  const maxVal = Math.max(...sorted.map(metric), 1);
  const barColor = orden === "riesgo" ? "var(--fj-rojo)" : "var(--fj-primary)";

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE;
  const pageItems = sorted.slice(start, start + PAGE);

  const tab = (key: "riesgo" | "carga", label: string) => (
    <button
      onClick={() => { setOrden(key); setPage(0); }}
      style={{
        padding: "5px 12px", borderRadius: 999, cursor: "pointer", fontSize: 12.5,
        fontFamily: "var(--fj-body)", fontWeight: 500,
        border: `1px solid ${orden === key ? "var(--fj-line-strong)" : "var(--fj-line)"}`,
        background: orden === key ? "var(--fj-panel)" : "transparent",
        color: orden === key ? "var(--fj-ink)" : "var(--fj-ink3)",
      }}
    >
      {label}
    </button>
  );

  return (
    <Card pad={24} elevated style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontFamily: "var(--fj-heading)", fontSize: 16 }}>
          Carga y riesgo por abogado
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontSize: 11.5, color: "var(--fj-ink3)", alignSelf: "center", marginRight: 2 }}>Ordenar por</span>
          {tab("riesgo", "Riesgo")}
          {tab("carga", "Carga")}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {pageItems.map((lawyer, i) => (
          <div
            key={lawyer.rut}
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto 1fr auto auto auto",
              gap: 16,
              alignItems: "center",
              padding: "10px 0",
              borderBottom: i < pageItems.length - 1 ? "1px solid var(--fj-line)" : "none",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--fj-ink3)", fontVariantNumeric: "tabular-nums", width: 20, textAlign: "right" }}>
              {start + i + 1}
            </span>
            <Avatar iniciales={getInitials(lawyer.nombre)} color={rutToColor(lawyer.rut)} nombre={lawyer.nombre} size={36} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{lawyer.nombre}</div>
              <div style={{ fontSize: 12, color: "var(--fj-ink3)" }}>{lawyer.case_count} causas</div>
            </div>
            <Pill tone={lawyer.rojo > 0 ? "rojo" : "verde"}>{lawyer.rojo} en rojo</Pill>
            <div style={{ fontSize: 12, color: "var(--fj-ink3)", textAlign: "right", whiteSpace: "nowrap" }}>
              {lawyer.stale} estancadas
            </div>
            <div style={{ width: 100, height: 6, background: "var(--fj-panel2)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${(metric(lawyer) / maxVal) * 100}%`, background: barColor, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--fj-line)" }}>
          <span style={{ fontSize: 12.5, color: "var(--fj-ink3)" }}>
            {start + 1}–{Math.min(start + PAGE, sorted.length)} de {sorted.length} abogados
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Btn kind="secondary" size="sm" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Anterior</Btn>
            <span style={{ fontSize: 12.5, color: "var(--fj-ink2)", minWidth: 48, textAlign: "center" }}>{safePage + 1} / {totalPages}</span>
            <Btn kind="secondary" size="sm" disabled={safePage >= totalPages - 1} onClick={() => setPage(safePage + 1)}>Siguiente</Btn>
          </div>
        </div>
      )}
    </Card>
  );
}

export function Supervisor() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useFirmStats();

  if (isLoading || !stats) return <Splash inline label="Cargando métricas del estudio" />;

  const riskRows = [
    { s: "rojo" as const,     label: "Crítico",  n: stats.totals.semaforo.rojo },
    { s: "amarillo" as const, label: "Atención", n: stats.totals.semaforo.amarillo },
    { s: "verde" as const,    label: "Al día",   n: stats.totals.semaforo.verde },
  ];

  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ padding: "32px 40px", fontFamily: "var(--fj-body)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              color: "var(--fj-ink3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Vista del estudio
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "var(--fj-heading)",
              margin: 0,
              color: "var(--fj-ink)",
            }}
          >
            Gestión judicial
          </h1>
          <div
            style={{
              fontSize: 13,
              color: "var(--fj-ink2)",
              marginTop: 4,
              textTransform: "capitalize",
            }}
          >
            {today}
          </div>
        </div>
        <Btn onClick={() => navigate("/productividad")}>
          <BriefcaseIcon size={16} />
          Ver equipo
        </Btn>
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card pad={20}>
          <KPI
            label="Causas activas"
            value={stats.totals.cases}
            sub={`${stats.by_lawyer.length} abogados`}
          />
        </Card>
        <Card
          pad={20}
          style={
            stats.totals.semaforo.rojo > 0
              ? { background: "var(--fj-rojo-soft)" }
              : undefined
          }
        >
          <KPI label="Causas en rojo" value={stats.totals.semaforo.rojo} />
        </Card>
        <Card pad={20}>
          <KPI
            label="Causas estancadas"
            value={stats.totals.stale}
            sub="sin movimiento >30d"
          />
        </Card>
        <Card pad={20}>
          <KPI label="Abogados" value={stats.by_lawyer.length} />
        </Card>
      </div>

      {/* Semáforo del estudio */}
      <Card pad={24} elevated style={{ marginBottom: 24 }}>
        <div
          style={{
            fontWeight: 600,
            fontFamily: "var(--fj-heading)",
            fontSize: 16,
            marginBottom: 20,
          }}
        >
          Semáforo del estudio
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <DonutChart sem={stats.totals.semaforo} total={stats.totals.cases} />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {riskRows.map(({ s, label, n }) => {
              const pct =
                stats.totals.cases > 0
                  ? Math.round((n / stats.totals.cases) * 100)
                  : 0;
              return (
                <div
                  key={s}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <SemaforoRing status={s} size={20} />
                  <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {n}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--fj-ink3)",
                      width: 36,
                      textAlign: "right",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
            {stats.totals.semaforo.otros > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--fj-ink3)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, fontSize: 14 }}>Otros</span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {stats.totals.semaforo.otros}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--fj-ink3)",
                    width: 36,
                    textAlign: "right",
                  }}
                >
                  {stats.totals.cases > 0
                    ? Math.round(
                        (stats.totals.semaforo.otros / stats.totals.cases) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Carga y riesgo por abogado */}
      <RankingRiesgo data={stats.by_lawyer} />

      {/* Composición por materia */}
      {stats.totals.by_materia.length > 0 && (
        <Card pad={24} elevated>
          <div
            style={{
              fontWeight: 600,
              fontFamily: "var(--fj-heading)",
              fontSize: 16,
              marginBottom: 20,
            }}
          >
            Composición por materia
          </div>
          {/* Segmented bar */}
          <div
            style={{
              display: "flex",
              height: 16,
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            {stats.totals.by_materia.map((m, i) => {
              const pct =
                stats.totals.cases > 0
                  ? (m.count / stats.totals.cases) * 100
                  : 0;
              return (
                <div
                  key={m.materia}
                  style={{
                    width: `${pct}%`,
                    background: MATERIA_COLORS[i % MATERIA_COLORS.length],
                  }}
                  title={`${m.materia}: ${m.count}`}
                />
              );
            })}
          </div>
          {/* Legend grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "8px 24px",
            }}
          >
            {stats.totals.by_materia.map((m, i) => (
              <div
                key={m.materia}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: MATERIA_COLORS[i % MATERIA_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, color: "var(--fj-ink2)" }}>
                  {m.materia}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {m.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Distribución por etapa procesal — flujo del juicio ejecutivo */}
      {stats.totals.by_procedural_state.length > 0 && (
        <Card pad={24} elevated>
          <div
            style={{
              fontWeight: 600,
              fontFamily: "var(--fj-heading)",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Distribución por etapa procesal
          </div>
          <div style={{ fontSize: 12, color: "var(--fj-ink3)", marginBottom: 20 }}>
            Cartera a lo largo del flujo del juicio ejecutivo (CPC · Ley 21.394)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(() => {
              const maxN = Math.max(
                ...stats.totals.by_procedural_state.map((s) => s.count),
                1,
              );
              return stats.totals.by_procedural_state.map((s) => (
                <div
                  key={s.stage}
                  style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}
                >
                  <span style={{ width: 240, color: "var(--fj-ink2)", flexShrink: 0 }}>
                    {STAGE_LABELS[s.stage] ?? s.stage}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 14,
                      background: "var(--fj-panel2)",
                      borderRadius: 7,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(s.count / maxN) * 100}%`,
                        height: "100%",
                        background: "var(--fj-primary)",
                        borderRadius: 7,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      width: 40,
                      textAlign: "right",
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {s.count}
                  </span>
                </div>
              ));
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}
