import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/primitives/Card";
import { KPI } from "@/components/primitives/KPI";
import { Btn } from "@/components/primitives/Btn";
import { Pill } from "@/components/primitives/Pill";
import { Avatar } from "@/components/primitives/Avatar";
import { useProductividad } from "@/hooks/useProductividad";
import { useTrends } from "@/hooks/useTrends";
import { useTokenColors } from "@/hooks/useTokenColors";
import { ABOGADOS } from "@/data/mock";
import type { ProdAbogado, TrendDay } from "@/data/types";

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

// ---------- SubH ----------

function SubH({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        color: "var(--fj-ink3)",
        marginBottom: 14,
        fontFamily: "var(--fj-body)",
      }}
    >
      {children}
    </div>
  );
}

// ---------- PeriodSelect ----------

const PERIODS = ["7d", "30d", "90d", "Año"] as const;

function PeriodSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
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
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            height: 28,
            padding: "0 10px",
            borderRadius: 6,
            border: 0,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            background: value === p ? "var(--fj-primary-soft)" : "transparent",
            color: value === p ? "var(--fj-primary)" : "var(--fj-ink3)",
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// ---------- BigChart ----------

const SERIES = [
  { key: "causasNuevas", label: "Causas nuevas", colorKey: "primary", dash: undefined },
  { key: "causasCerradas", label: "Causas cerradas", colorKey: "amarillo", dash: "4 3" },
  { key: "plazosCumplidos", label: "Plazos cumplidos", colorKey: "verde", dash: undefined },
] as const;

function BigChart({ trend }: { trend: TrendDay[] }) {
  const colors = useTokenColors();

  const tickFormatter = (v: string): string => {
    const d = new Date(v + "T12:00:00");
    return d
      .toLocaleDateString("es-CL", { day: "2-digit", month: "short" })
      .replace(".", "");
  };

  const seriesColors: Record<string, string> = {
    primary: colors.primary,
    amarillo: colors.amarillo,
    verde: colors.verde,
  };

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 18, marginBottom: 12 }}>
        {SERIES.map((s) => (
          <div
            key={s.key}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 14,
                height: 2,
                background: seriesColors[s.colorKey],
                borderRadius: 1,
              }}
            />
            <span
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 260, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart
            data={trend}
            margin={{ top: 16, right: 12, left: 0, bottom: 32 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke={colors.line}
              vertical={false}
            />
            <XAxis
              dataKey="fecha"
              tickFormatter={tickFormatter}
              tick={{
                fontFamily: "var(--fj-body)",
                fontSize: 10,
                fill: colors.ink3,
              }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{
                fontFamily: "var(--fj-body)",
                fontSize: 10,
                fill: colors.ink3,
              }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                background: "var(--fj-panel)",
                border: "1px solid var(--fj-line)",
                borderRadius: 8,
              }}
              labelFormatter={(label) => tickFormatter(String(label ?? ""))}
            />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={seriesColors[s.colorKey]}
                strokeDasharray={s.dash}
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 4 }}
                strokeLinecap="round"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------- RankingEquipo ----------

function RankingEquipo({
  tasaPromedio,
  data,
}: {
  tasaPromedio: number;
  data: ProdAbogado[];
}) {
  const ranked = [...data].sort(
    (a, b) => b.tasaCumplimiento - a.tasaCumplimiento
  );
  const maxActivas = Math.max(...data.map((a) => a.causasActivas), 1);

  const getTasaColor = (tasa: number) =>
    tasa >= 95
      ? "var(--fj-verde)"
      : tasa >= 90
      ? "var(--fj-amarillo)"
      : "var(--fj-rojo)";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 20,
      }}
    >
      {/* Left: ranking table */}
      <Card pad={0} style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--fj-line)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--fj-heading)",
              fontSize: 17,
              fontWeight: 500,
              color: "var(--fj-ink)",
              marginBottom: 4,
            }}
          >
            Ranking por cumplimiento
          </div>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 12,
              color: "var(--fj-ink3)",
            }}
          >
            % de plazos cumplidos a tiempo en los últimos 30 días
          </div>
        </div>

        {ranked.map((a, i) => {
          const ab = ABOGADOS.find((x) => x.id === a.abogadoId);
          const tasaColor = getTasaColor(a.tasaCumplimiento);

          return (
            <div
              key={a.abogadoId}
              style={{
                display: "grid",
                gridTemplateColumns: "30px auto 1fr auto auto auto",
                gap: 16,
                padding: "16px 20px",
                alignItems: "center",
                borderBottom:
                  i < ranked.length - 1 ? "1px solid var(--fj-line)" : 0,
              }}
            >
              {/* Col 1: rank */}
              <div
                style={{
                  fontFamily: "var(--fj-heading)",
                  fontSize: 18,
                  fontWeight: 500,
                  color: i < 3 ? "var(--fj-ink)" : "var(--fj-ink3)",
                }}
              >
                {i + 1}
              </div>

              {/* Col 2: avatar */}
              <Avatar
                iniciales={ab?.iniciales ?? "?"}
                color={ab?.color ?? "var(--fj-ink3)"}
                nombre={ab?.nombre}
                size={36}
              />

              {/* Col 3: name + stats */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--fj-body)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--fj-ink)",
                  }}
                >
                  {ab?.nombre ?? a.abogadoId}
                </div>
                <div
                  style={{
                    fontFamily: "var(--fj-body)",
                    fontSize: 11.5,
                    color: "var(--fj-ink3)",
                    marginTop: 3,
                  }}
                >
                  {a.causasActivas} activas · {a.causasCerradas} cerradas ·{" "}
                  {a.plazosCumplidos} plazos cumplidos
                </div>
              </div>

              {/* Col 4: workload bar */}
              <div style={{ width: 140 }}>
                <div
                  style={{
                    height: 6,
                    background: "var(--fj-panel2)",
                    borderRadius: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(a.causasActivas / maxActivas) * 100}%`,
                      background: "var(--fj-primary)",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "var(--fj-body)",
                    fontSize: 10.5,
                    color: "var(--fj-ink3)",
                    marginTop: 4,
                  }}
                >
                  Carga {a.causasActivas} causas
                </div>
              </div>

              {/* Col 5: vencidos pill */}
              <Pill
                tone={
                  a.plazosVencidos === 0
                    ? "verde"
                    : a.plazosVencidos > 2
                    ? "rojo"
                    : "amarillo"
                }
              >
                {a.plazosVencidos} vencidos
              </Pill>

              {/* Col 6: tasa % */}
              <div
                style={{
                  fontFamily: "var(--fj-heading)",
                  fontSize: 22,
                  fontWeight: 500,
                  fontVariantNumeric: "tabular-nums",
                  color: tasaColor,
                }}
              >
                {a.tasaCumplimiento}%
              </div>
            </div>
          );
        })}
      </Card>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Cumplimiento promedio */}
        <Card
          pad={24}
          style={{
            background: "var(--fj-primary)",
            color: "var(--fj-primary-ink)",
            border: "1px solid var(--fj-primary)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 11,
              fontWeight: 600,
              opacity: 0.75,
              textTransform: "uppercase",
              letterSpacing: ".14em",
            }}
          >
            CUMPLIMIENTO PROMEDIO
          </div>
          <div
            style={{
              fontFamily: "var(--fj-heading)",
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1,
              marginTop: 8,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-.02em",
            }}
          >
            {tasaPromedio}%
          </div>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 13,
              opacity: 0.85,
              marginTop: 12,
            }}
          >
            ▲ 3 puntos vs. periodo anterior
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,.18)",
              borderRadius: 4,
              marginTop: 16,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${tasaPromedio}%`,
                background: "rgba(255,255,255,.85)",
                borderRadius: 4,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--fj-body)",
              fontSize: 11,
              opacity: 0.7,
              marginTop: 6,
            }}
          >
            <span>Meta 92%</span>
            <span>Objetivo 98%</span>
          </div>
        </Card>

        {/* Distribución de carga */}
        <Card pad={20}>
          <SubH>Distribución de carga</SubH>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ranked.map((a) => {
              const ab = ABOGADOS.find((x) => x.id === a.abogadoId);
              const barColor = ab?.color ?? "var(--fj-primary)";
              const name =
                ab?.nombre.split(" ").slice(0, 2).join(" ") ?? a.abogadoId;

              return (
                <div
                  key={a.abogadoId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--fj-body)",
                        fontSize: 12,
                        color: "var(--fj-ink2)",
                      }}
                    >
                      {name}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        height: 4,
                        background: "var(--fj-panel2)",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(a.causasActivas / maxActivas) * 100}%`,
                          background: barColor,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--fj-body)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--fj-ink)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {a.causasActivas}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- TendenciasPanel ----------

function TendenciasPanel({ trend }: { trend: TrendDay[] }) {
  return (
    <Card pad={24}>
      <SubH>Movimiento de causas y plazos</SubH>
      <BigChart trend={trend} />
    </Card>
  );
}

// ---------- MateriasPanel ----------

const MATERIAS = [
  { name: "Civil — Cobranza ejecutiva", n: 28, tasa: 96 },
  { name: "Civil — Indemnización", n: 18, tasa: 91 },
  { name: "Laboral — Despido injustificado", n: 14, tasa: 88 },
  { name: "Laboral — Tutela", n: 7, tasa: 100 },
  { name: "Comercial — Cumplimiento", n: 12, tasa: 93 },
  { name: "Familia — Pensión alimentos", n: 9, tasa: 95 },
  { name: "Tributario — Reclamación", n: 4, tasa: 85 },
] as const;

function MateriasPanel() {
  const max = Math.max(...MATERIAS.map((m) => m.n));

  const getTasaColor = (tasa: number) =>
    tasa >= 95
      ? "var(--fj-verde)"
      : tasa >= 90
      ? "var(--fj-amarillo)"
      : "var(--fj-rojo)";

  return (
    <Card pad={24}>
      <SubH>Volumen y tasa de cumplimiento por materia</SubH>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {MATERIAS.map((m) => (
          <div
            key={m.name}
            style={{
              display: "grid",
              gridTemplateColumns: "240px 1fr 80px 60px",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--fj-ink)",
              }}
            >
              {m.name}
            </div>
            <div
              style={{
                height: 8,
                background: "var(--fj-panel2)",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(m.n / max) * 100}%`,
                  background: "var(--fj-primary)",
                  borderRadius: 4,
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--fj-ink2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {m.n} causas
            </div>
            <div
              style={{
                fontFamily: "var(--fj-heading)",
                fontSize: 16,
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
                textAlign: "right",
                color: getTasaColor(m.tasa),
              }}
            >
              {m.tasa}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------- Main export ----------

const TABS = [
  { id: "equipo", label: "Equipo" },
  { id: "tendencias", label: "Tendencias" },
  { id: "materias", label: "Por materia" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Productividad() {
  const [periodo, setPeriodo] = useState("30d");
  const [tab, setTab] = useState<TabId>("equipo");
  const { data: prodData = [] } = useProductividad();
  const { data: trend = [] } = useTrends();

  const totalNuevas = trend.reduce((a, b) => a + b.causasNuevas, 0);
  const totalCerradas = trend.reduce((a, b) => a + b.causasCerradas, 0);
  const totalPlazos = trend.reduce((a, b) => a + b.plazosCumplidos, 0);
  const totalIncump = prodData.reduce((a, b) => a + b.plazosVencidos, 0);
  const tasaPromedio =
    prodData.length > 0
      ? Math.round(
          prodData.reduce((a, b) => a + b.tasaCumplimiento, 0) / prodData.length
        )
      : 0;

  return (
    <div style={pageCss}>
      {/* Demo banner */}
      <div style={{
        width: "100%", padding: "10px 16px", marginBottom: 16, borderRadius: 10,
        background: "var(--fj-amarillo-soft)", color: "var(--fj-amarillo)",
        fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
        fontFamily: "var(--fj-body)",
      }}>
        <span>⚠</span>
        <span>Vista de demostración · datos de ejemplo — integración pendiente (requiere asignación de causas por abogado)</span>
      </div>

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
          <div style={kickerCss}>Análisis del estudio · Últimos 30 días</div>
          <h1 style={pageTitleCss}>Productividad</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <PeriodSelect value={periodo} onChange={setPeriodo} />
          <Btn
            kind="secondary"
            icon={<Download size={15} strokeWidth={1.6} />}
          >
            Exportar reporte
          </Btn>
        </div>
      </div>

      {/* KPI grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card pad={20} elevated>
          <KPI
            label="Causas nuevas"
            value={totalNuevas}
            trend={12}
            sub="vs. periodo anterior"
          />
        </Card>
        <Card pad={20} elevated>
          <KPI
            label="Causas cerradas"
            value={totalCerradas}
            trend={4}
            sub="vs. periodo anterior"
          />
        </Card>
        <Card pad={20} elevated>
          <KPI
            label="Plazos cumplidos"
            value={totalPlazos}
            trend={8}
            sub="vs. periodo anterior"
          />
        </Card>
        <Card
          pad={20}
          elevated
          style={{
            background:
              totalIncump > 5 ? "var(--fj-rojo-soft)" : "var(--fj-panel)",
          }}
        >
          <KPI
            label="Plazos vencidos"
            value={totalIncump}
            trend={-22}
            sub="vs. periodo anterior"
          />
        </Card>
      </div>

      {/* Sub-tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          borderBottom: "1px solid var(--fj-line)",
          marginBottom: 20,
          paddingLeft: 4,
        }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background: "transparent",
              border: 0,
              cursor: "pointer",
              padding: "12px 18px",
              position: "relative",
              fontFamily: "var(--fj-body)",
              fontSize: 13.5,
              fontWeight: tab === id ? 600 : 500,
              color: tab === id ? "var(--fj-ink)" : "var(--fj-ink3)",
            }}
          >
            {label}
            {tab === id && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 2,
                  background: "var(--fj-primary)",
                  borderRadius: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tab === "equipo" && (
        <RankingEquipo tasaPromedio={tasaPromedio} data={prodData} />
      )}
      {tab === "tendencias" && <TendenciasPanel trend={trend} />}
      {tab === "materias" && <MateriasPanel />}
    </div>
  );
}
