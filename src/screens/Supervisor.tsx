import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Pill } from "@/components/primitives/Pill";
import { Btn } from "@/components/primitives/Btn";
import { Card } from "@/components/primitives/Card";
import { KPI } from "@/components/primitives/KPI";
import {
  DownloadIcon,
  BriefcaseIcon,
  ChevronIcon,
} from "@/components/primitives/icons";
import { useTokenColors } from "@/hooks/useTokenColors";
import {
  ABOGADOS,
  CAUSAS,
  PROD_ABOGADOS,
  FINANCIERO,
  SEMAFORO,
} from "@/data/mock";
import { fmtCLP } from "@/lib/format";

/* ─── Shared page styles ─── */
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

/* ─── SubH2 ─── */
function SubH2({ children, noMargin = false }: { children: ReactNode; noMargin?: boolean }) {
  return (
    <div
      style={{
        fontFamily: "var(--fj-heading)",
        fontSize: 17,
        fontWeight: 500,
        color: "var(--fj-ink)",
        marginBottom: noMargin ? 0 : 16,
        letterSpacing: "-.005em",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Donut chart — Recharts PieChart ─── */
function DonutChart({ sem }: { sem: typeof SEMAFORO }) {
  const colors = useTokenColors();
  const data = [
    { value: sem.rojo,     fill: colors.rojo },
    { value: sem.amarillo, fill: colors.amarillo },
    { value: sem.verde,    fill: colors.verde },
  ];
  return (
    <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
      <PieChart width={160} height={160} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          cx={80}
          cy={80}
          innerRadius={50}
          outerRadius={64}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="none" />
          ))}
        </Pie>
      </PieChart>
      {/* Center label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--fj-heading)",
            fontSize: 32,
            fontWeight: 500,
            lineHeight: 1,
            color: "var(--fj-ink)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-.02em",
          }}
        >
          {sem.total}
        </span>
        <span
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 11,
            color: "var(--fj-ink3)",
            marginTop: 4,
            textTransform: "uppercase",
            letterSpacing: ".10em",
            fontWeight: 600,
          }}
        >
          causas
        </span>
      </div>
    </div>
  );
}

/* ─── Trimester bar chart — div-based ─── */
function FacturacionChart() {
  const fin = FINANCIERO;
  const data = fin.facturacionTrimestre;
  const max = Math.max(...data.map((x) => x.v));
  return (
    <>
      <SubH2>Facturación trimestral</SubH2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
          height: 180,
          gap: 32,
          padding: "0 16px",
        }}
      >
        {data.map((m, i, arr) => {
          const h = (m.v / max) * 160;
          const isLast = i === arr.length - 1;
          const pctChange =
            isLast && i > 0
              ? Math.round((m.v / arr[i - 1].v - 1) * 100)
              : 0;
          return (
            <div
              key={m.mes}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 11,
                  color: "var(--fj-ink3)",
                }}
              >
                ${(m.v / 1_000_000).toFixed(1)}M
              </span>
              <div
                style={{
                  width: "100%",
                  maxWidth: 56,
                  height: h,
                  borderRadius: "6px 6px 0 0",
                  background: isLast ? "var(--fj-primary)" : "var(--fj-primary-soft)",
                  border: isLast ? "0" : "1px solid var(--fj-line)",
                  position: "relative",
                }}
              >
                {isLast && (
                  <span
                    style={{
                      position: "absolute",
                      top: -22,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: "var(--fj-body)",
                      fontSize: 10,
                      color: "var(--fj-verde)",
                      fontWeight: 600,
                      background: "var(--fj-verde-soft)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ▲ {pctChange}%
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 12,
                  color: "var(--fj-ink2)",
                  fontWeight: 500,
                }}
              >
                {m.mes}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 8,
          background: "var(--fj-panel2)",
          fontFamily: "var(--fj-body)",
          fontSize: 12,
          color: "var(--fj-ink2)",
        }}
      >
        <strong style={{ color: "var(--fj-ink)" }}>Proyección Q2 cierre:</strong>{" "}
        ${(fin.honorariosProyeccion / 1_000_000).toFixed(0)}M · supera meta trimestral en 14 puntos
      </div>
    </>
  );
}

/* ─── Segmented materia bar ─── */
const MATERIAS_DATA = [
  { name: "Civil — Cobranza",      n: 28, color: "var(--fj-primary)" },
  { name: "Civil — Indemnización", n: 18, color: "#5a7a9f" },
  { name: "Laboral",               n: 21, color: "#6c7abf" },
  { name: "Comercial",             n: 12, color: "#9b7e5a" },
  { name: "Familia",               n: 14, color: "#7a8a6e" },
  { name: "Tributario",            n: 4,  color: "#a89880" },
  { name: "Otros",                 n: 25, color: "#bdb29a" },
];

function ComposicionMaterias() {
  const total = MATERIAS_DATA.reduce((a, b) => a + b.n, 0);
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 28,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--fj-line)",
        }}
      >
        {MATERIAS_DATA.map((d, i) => (
          <div
            key={i}
            title={`${d.name} · ${d.n}`}
            style={{
              width: `${(d.n / total) * 100}%`,
              background: d.color,
              borderRight:
                i === MATERIAS_DATA.length - 1 ? 0 : "1px solid rgba(255,255,255,.18)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 10,
          marginTop: 14,
        }}
      >
        {MATERIAS_DATA.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: d.color,
              }}
            />
            <span
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12.5,
                color: "var(--fj-ink2)",
              }}
            >
              {d.name}
            </span>
            <span
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {d.n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Supervisor dashboard ─── */
export function Supervisor() {
  const navigate = useNavigate();
  const sem = SEMAFORO;
  const fin = FINANCIERO;

  const tasaPromedio = Math.round(
    PROD_ABOGADOS.reduce((a, b) => a + b.tasaCumplimiento, 0) / PROD_ABOGADOS.length,
  );
  const totalActivas = PROD_ABOGADOS.reduce((a, b) => a + b.causasActivas, 0);
  const equipo = [...PROD_ABOGADOS].sort((a, b) => b.tasaCumplimiento - a.tasaCumplimiento);

  const criticas = CAUSAS.filter(
    (c) => c.semaforo === "rojo" || c.semaforo === "amarillo",
  )
    .sort((a, b) => (b.cuantia ?? 0) - (a.cuantia ?? 0))
    .slice(0, 5);

  const rojoCuantia = CAUSAS.filter((c) => c.semaforo === "rojo").reduce(
    (a, c) => a + (c.cuantia ?? 0),
    0,
  );

  /* Risk distribution rows */
  const riskRows = [
    { s: "rojo" as const,     label: "Crítico",  n: sem.rojo },
    { s: "amarillo" as const, label: "Atención", n: sem.amarillo },
    { s: "verde" as const,    label: "Al día",   n: sem.verde },
  ];

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
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={kickerCss}>vista de estudio · viernes 15 may 2026</div>
          <h1 style={pageTitleCss}>Buen día, Felipe.</h1>
          <p
            style={{
              margin: "6px 0 0",
              fontFamily: "var(--fj-body)",
              fontSize: 14,
              color: "var(--fj-ink3)",
              maxWidth: 620,
            }}
          >
            El estudio cierra mayo con{" "}
            <strong style={{ color: "var(--fj-ink)" }}>{totalActivas} causas activas</strong>{" "}
            y un cumplimiento del{" "}
            <strong style={{ color: "var(--fj-verde)" }}>{tasaPromedio}%</strong>.{" "}
            Hay {sem.rojo} causas críticas con exposición financiera por{" "}
            {fmtCLP(rojoCuantia)}.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn icon={<DownloadIcon size={15} strokeWidth={1.6} />} kind="secondary">
            Reporte ejecutivo
          </Btn>
          <Btn
            icon={<BriefcaseIcon size={15} strokeWidth={1.6} />}
            kind="primary"
            onClick={() => navigate("/productividad")}
          >
            Ver equipo
          </Btn>
        </div>
      </div>

      {/* Hero KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card pad={22} elevated>
          <KPI
            label="Causas activas"
            value={totalActivas}
            trend={6}
            sub={`${PROD_ABOGADOS.length} abogados`}
          />
        </Card>
        <Card pad={22} elevated>
          <KPI
            label="Cuantía en gestión"
            value={`$${(fin.cuantiaTotal / 1_000_000).toFixed(0)}M`}
            trend={11}
            sub={`${fmtCLP(fin.cuantiaRiesgo)} en riesgo`}
          />
        </Card>
        <Card pad={22} elevated>
          <KPI
            label="Cumplimiento"
            value={`${tasaPromedio}%`}
            trend={3}
            sub="Promedio del estudio"
          />
        </Card>
        {/* Custom KPI card — primary background */}
        <Card
          pad={22}
          elevated
          style={{
            background: "var(--fj-primary)",
            color: "var(--fj-primary-ink)",
            borderColor: "var(--fj-primary)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 11,
              fontWeight: 600,
              opacity: 0.75,
              textTransform: "uppercase",
              letterSpacing: ".12em",
            }}
          >
            Honorarios proyectados Q2
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span
              style={{
                fontFamily: "var(--fj-heading)",
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: "-.02em",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              ${(fin.honorariosProyeccion / 1_000_000).toFixed(0)}M
            </span>
            <span
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                fontWeight: 600,
                opacity: 0.85,
              }}
            >
              ▲ 18%
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 12,
              opacity: 0.8,
              marginTop: 6,
            }}
          >
            ${(fin.honorariosMes / 1_000_000).toFixed(1)}M cobrado este mes
          </div>
        </Card>
      </div>

      {/* Risk distribution + Trimester chart — 1.1fr / 1fr */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <Card pad={24}>
          <SubH2>Distribución de riesgo</SubH2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 28,
              alignItems: "center",
            }}
          >
            <DonutChart sem={sem} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {riskRows.map((x) => {
                const exposicion = CAUSAS.filter((c) => c.semaforo === x.s).reduce(
                  (a, c) => a + (c.cuantia ?? 0),
                  0,
                );
                const pct = Math.round((x.n / sem.total) * 100);
                return (
                  <div
                    key={x.s}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto auto",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <SemaforoRing status={x.s} size={20} />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--fj-body)",
                          fontSize: 13,
                          color: "var(--fj-ink)",
                          fontWeight: 500,
                        }}
                      >
                        {x.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--fj-body)",
                          fontSize: 11.5,
                          color: "var(--fj-ink3)",
                        }}
                      >
                        Exposición {fmtCLP(exposicion)}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--fj-heading)",
                        fontSize: 20,
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {x.n}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--fj-body)",
                        fontSize: 11,
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
            </div>
          </div>
        </Card>

        <Card pad={24}>
          <FacturacionChart />
        </Card>
      </div>

      {/* Critical exposure + team — 1fr / 1fr */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Mayor exposición financiera */}
        <Card pad={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fj-line)" }}>
            <SubH2 noMargin>Mayor exposición financiera</SubH2>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              Top 5 causas con riesgo activo por cuantía
            </div>
          </div>
          {criticas.map((c, i) => (
            <button
              key={c.id}
              onClick={() => navigate(`/causas/${c.id}`)}
              style={{
                width: "100%",
                textAlign: "left",
                border: 0,
                background: "transparent",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                gap: 14,
                padding: "14px 20px",
                borderBottom: i === criticas.length - 1 ? 0 : "1px solid var(--fj-line)",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--fj-panel2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <SemaforoRing status={c.semaforo} size={20} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--fj-body)",
                    fontSize: 13.5,
                    color: "var(--fj-ink)",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.caratula}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    fontFamily: "var(--fj-body)",
                    fontSize: 11.5,
                    color: "var(--fj-ink3)",
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--fj-mono)",
                      color: "var(--fj-ink2)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.rol}
                  </span>
                  <span>·</span>
                  <span>{c.abogado.nombre.split(" ").slice(0, 2).join(" ")}</span>
                </div>
              </div>
              <Avatar
                iniciales={c.abogado.iniciales}
                color={c.abogado.color}
                nombre={c.abogado.nombre}
                size={26}
              />
              <span
                style={{
                  fontFamily: "var(--fj-heading)",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--fj-ink)",
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {c.cuantia ? `$${(c.cuantia / 1_000_000).toFixed(0)}M` : "—"}
              </span>
            </button>
          ))}
        </Card>

        {/* Performance del equipo */}
        <Card pad={0} style={{ overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--fj-line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <SubH2 noMargin>Performance del equipo</SubH2>
              <div
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 12,
                  color: "var(--fj-ink3)",
                  marginTop: 4,
                }}
              >
                Cumplimiento · últimos 30 días
              </div>
            </div>
            <Btn
              size="sm"
              kind="ghost"
              onClick={() => navigate("/productividad")}
              icon={<ChevronIcon size={14} strokeWidth={1.6} />}
              style={{ flexDirection: "row-reverse" }}
            >
              Ver detalle
            </Btn>
          </div>
          {equipo.map((a, i) => {
            const ab = ABOGADOS.find((x) => x.id === a.abogadoId);
            return (
              <div
                key={a.abogadoId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto 1fr auto auto",
                  gap: 12,
                  padding: "12px 20px",
                  borderBottom: i === equipo.length - 1 ? 0 : "1px solid var(--fj-line)",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: 18,
                    fontFamily: "var(--fj-heading)",
                    fontSize: 13,
                    color: "var(--fj-ink3)",
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  {i + 1}
                </span>
                {ab && (
                  <Avatar
                    iniciales={ab.iniciales}
                    color={ab.color}
                    nombre={ab.nombre}
                    size={28}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--fj-body)",
                      fontSize: 13,
                      color: "var(--fj-ink)",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {a.nombre}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--fj-body)",
                      fontSize: 11,
                      color: "var(--fj-ink3)",
                    }}
                  >
                    {a.causasActivas} causas activas
                  </div>
                </div>
                {a.plazosVencidos > 0 ? (
                  <Pill tone={a.plazosVencidos > 2 ? "rojo" : "amarillo"} style={{ fontSize: 10.5 }}>
                    {a.plazosVencidos} venc.
                  </Pill>
                ) : (
                  <Pill tone="verde" style={{ fontSize: 10.5 }}>
                    perfecto
                  </Pill>
                )}
                <span
                  style={{
                    fontFamily: "var(--fj-heading)",
                    fontSize: 18,
                    fontWeight: 500,
                    fontVariantNumeric: "tabular-nums",
                    color:
                      a.tasaCumplimiento >= 95
                        ? "var(--fj-verde)"
                        : a.tasaCumplimiento >= 90
                          ? "var(--fj-amarillo)"
                          : "var(--fj-rojo)",
                    width: 50,
                    textAlign: "right",
                  }}
                >
                  {a.tasaCumplimiento}%
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Composición por materia */}
      <Card pad={24}>
        <SubH2>Composición por materia</SubH2>
        <ComposicionMaterias />
      </Card>
    </div>
  );
}
