import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Search, Plus } from "lucide-react";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Card } from "@/components/primitives/Card";
import { KPI } from "@/components/primitives/KPI";
import { Btn } from "@/components/primitives/Btn";
import { Skeleton } from "@/components/Skeleton";
import { useCausas } from "@/hooks/useCausas";
import { useGoals } from "@/hooks/useGoals";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
import type { Causa } from "@/data/types";
import type { SemaforoColor, SemaforoValue } from "@/data/types";

/* ─── Shared page styles ─── */
const pageCss: React.CSSProperties = {
  padding: "36px 40px 56px",
  maxWidth: 1320,
  margin: "0 auto",
};

const pageTitleCss: React.CSSProperties = {
  margin: 0, fontFamily: "var(--fj-heading)", fontWeight: 500,
  fontSize: 34, letterSpacing: "-.015em", color: "var(--fj-ink)",
};

const kickerCss: React.CSSProperties = {
  fontFamily: "var(--fj-body)", fontSize: 11, letterSpacing: ".14em",
  textTransform: "uppercase", color: "var(--fj-ink3)", fontWeight: 600, marginBottom: 6,
  whiteSpace: "nowrap",
};

/* ─── Progress bar ─── */
/* ─── Semáforo cluster ─── */
function SemaforoCluster() {
  const navigate = useNavigate();
  const { data: allCausas = [], isLoading } = useCausas();

  const rojo           = allCausas.filter((c) => c.semaforo === "rojo").length;
  const amarillo       = allCausas.filter((c) => c.semaforo === "amarillo").length;
  const verde          = allCausas.filter((c) => c.semaforo === "verde").length;
  const sinSeguimiento = allCausas.filter((c) => c.semaforo === null).length;
  const classified     = rojo + amarillo + verde;

  const items: Array<{ s: SemaforoColor; n: number; t: string; desc: string }> = [
    { s: "rojo",     n: rojo,     t: "Crítico",  desc: "Plazo vencido o inminente" },
    { s: "amarillo", n: amarillo, t: "Atención", desc: "Acción esta semana" },
    { s: "verde",    n: verde,    t: "Al día",   desc: "Sin urgencia inmediata" },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {(["rojo", "amarillo", "verde"] as SemaforoColor[]).map((s) => (
          <Card key={s} pad={20} elevated style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Skeleton width={38} height={38} radius={19} />
              <Skeleton width={80} height={12} />
            </div>
            <Skeleton width={64} height={44} radius={8} />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <Skeleton width="55%" height={16} />
              <Skeleton width="85%" height={12} />
            </div>
            <Skeleton width="100%" height={4} radius={4} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.map((x) => (
          <Card key={x.s} pad={20} elevated onClick={() => navigate(`/causas?sem=${x.s}`)} style={{
            display: "flex", flexDirection: "column", gap: 12, overflow: "hidden",
            borderLeft: `4px solid ${x.s === "rojo" ? "var(--fj-rojo)" : x.s === "amarillo" ? "var(--fj-amarillo)" : "var(--fj-verde)"}`,
            background: x.s === "rojo" ? "var(--fj-rojo-soft)" : x.s === "amarillo" ? "var(--fj-amarillo-soft)" : "var(--fj-verde-soft)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SemaforoRing status={x.s} size={38} />
              <span style={{
                fontFamily: "var(--fj-body)", fontSize: 11, color: "var(--fj-ink3)",
                textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 600,
              }}>
                {classified > 0 ? ((x.n / classified) * 100).toFixed(0) : "0"}% clasificadas
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{
                fontFamily: "var(--fj-heading)", fontWeight: 500, fontSize: 48,
                letterSpacing: "-.02em", color: "var(--fj-ink)", lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}>
                {x.n}
              </span>
              <span style={{ fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)" }}>causas</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--fj-heading)", fontSize: 16, fontWeight: 500, color: "var(--fj-ink)" }}>{x.t}</div>
              <div style={{ fontFamily: "var(--fj-body)", fontSize: 12.5, color: "var(--fj-ink3)", marginTop: 2 }}>{x.desc}</div>
            </div>
          </Card>
        ))}
      </div>
      {sinSeguimiento > 0 && (
        <div style={{
          marginTop: 12, padding: "10px 16px", borderRadius: 10,
          background: "var(--fj-panel2)", border: "1px solid var(--fj-line)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <SemaforoRing status={null} size={20} />
          <span style={{ fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)" }}>
            <strong style={{ color: "var(--fj-ink2)", fontVariantNumeric: "tabular-nums" }}>{sinSeguimiento}</strong>
            {" "}causa{sinSeguimiento === 1 ? "" : "s"} sin seguimiento de plazos
            {" "}<span style={{ fontSize: 11 }}>(excluidas del cálculo)</span>
          </span>
        </div>
      )}
    </>
  );
}

/* ─── Plazo helpers ─── */
function calcDiasRestantes(nextDeadlineAt: string): number {
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parts = nextDeadlineAt.split("T")[0].split("-").map(Number);
  const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
  return Math.round(
    (deadlineDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

const ESTADO_LABEL_MAP: Record<string, string> = {
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

function estadoLabelDash(state?: string | null): string {
  if (!state) return "Plazo en seguimiento";
  return ESTADO_LABEL_MAP[state] ?? "Plazo en seguimiento";
}

/* ─── Day pill for plazos ─── */
function DayPill({ date, status }: { date: string; status: SemaforoValue }) {
  const parts = date.split("T")[0].split("-").map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const dd = d.toLocaleDateString("es-CL", { day: "2-digit" });
  const mm = d.toLocaleDateString("es-CL", { month: "short" }).replace(".", "");
  const bg = status === "rojo" ? "var(--fj-rojo-soft)"
           : status === "amarillo" ? "var(--fj-amarillo-soft)"
           : "var(--fj-verde-soft)";
  const fg = status === "rojo" ? "var(--fj-rojo)"
           : status === "amarillo" ? "var(--fj-amarillo)"
           : "var(--fj-verde)";
  return (
    <div style={{
      width: 48, borderRadius: 8, overflow: "hidden", textAlign: "center",
      border: `1px solid ${fg}`, lineHeight: 1,
      boxShadow: "0 1px 2px rgba(15,22,38,.08)",
    }}>
      {/* Month header — colored strip, like a tear-off calendar page */}
      <div style={{
        background: fg, color: "#fff", fontFamily: "var(--fj-body)",
        fontSize: 9.5, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: ".10em", padding: "2px 0",
      }}>{mm}</div>
      {/* Day number — light body */}
      <div style={{
        background: bg, color: "var(--fj-ink)", fontFamily: "var(--fj-heading)",
        fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums",
        padding: "4px 0",
      }}>{dd}</div>
    </div>
  );
}

/* ─── Skeleton row helpers ─── */
const SKEL_ROW_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  gap: 14,
  padding: "14px 20px",
  alignItems: "center",
};

/* ─── Próximos plazos ─── */
function ProximosPlazosWidget({ plazos, onViewAll, isLoading }: {
  plazos: Causa[];
  onViewAll: () => void;
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--fj-line)",
      }}>
        <div>
          <div style={{ fontFamily: "var(--fj-heading)", fontSize: 17, fontWeight: 500, color: "var(--fj-ink)" }}>
            Plazos próximos
          </div>
          <div style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)", marginTop: 2 }}>
            Próximos 7 días · vencidos incluidos
          </div>
        </div>
        <Btn size="sm" kind="ghost" onClick={onViewAll}>Ver todos</Btn>
      </div>
      <div>
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                style={{
                  ...SKEL_ROW_STYLE,
                  borderBottom: i === 3 ? undefined : "1px solid var(--fj-line)",
                }}
              >
                <Skeleton width={48} height={52} radius={8} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Skeleton width="72%" height={13} />
                  <Skeleton width="48%" height={11} />
                </div>
                <Skeleton width={52} height={12} />
              </div>
            ))
          : plazos.map((causa, i) => {
              const dias = calcDiasRestantes(causa.next_deadline_at!);
              const vencido = dias < 0;
              return (
                <div
                  key={causa.id}
                  onClick={() => navigate(`/causas/${causa.id}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fj-panel2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  style={{
                    display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14,
                    padding: "14px 20px",
                    borderBottom: i === plazos.length - 1 ? undefined : "1px solid var(--fj-line)",
                    alignItems: "center", cursor: "pointer",
                  }}
                >
                  <DayPill date={causa.next_deadline_at!} status={causa.semaforo} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: "var(--fj-body)", fontSize: 13.5, color: "var(--fj-ink)",
                      fontWeight: 500, marginBottom: 3,
                    }}>
                      {estadoLabelDash(causa.procedural_state)}
                    </div>
                    <div style={{
                      display: "flex", gap: 8, alignItems: "center",
                      fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)",
                    }}>
                      <span style={{ fontFamily: "var(--fj-mono)", color: "var(--fj-ink2)", whiteSpace: "nowrap" }}>
                        {causa.rol}
                      </span>
                      <span>·</span>
                      <span style={{
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280,
                      }}>
                        {causa.caratula}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "var(--fj-body)", fontSize: 12, fontWeight: 600,
                    color: vencido ? "var(--fj-rojo)"
                         : causa.semaforo === "amarillo" ? "var(--fj-amarillo)"
                         : "var(--fj-ink2)",
                    fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
                  }}>
                    {vencido ? `${Math.abs(dias)}d atraso`
                     : dias === 0 ? "Hoy"
                     : dias === 1 ? "Mañana"
                     : `en ${dias}d`}
                  </span>
                </div>
              );
            })}
      </div>
    </Card>
  );
}

/* ─── Proyección de productividad ─── */
function ProyeccionProductividad({ actual, proyeccion, meta, isLoading }: {
  actual: number;
  proyeccion: number;
  meta: number | null;
  isLoading: boolean;
}) {
  // Monthly target (meta) is configured by the administrator (Admin → Metas).
  const pct = meta != null && meta > 0 ? Math.min(100, Math.round((proyeccion / meta) * 100)) : 0;
  const onTrack = meta != null ? proyeccion >= meta : null;
  const gaugeColor = onTrack ? "#3a8a5e" : "#b08214"; // fj-verde / fj-amarillo (recharts needs a concrete color)

  const stat = (l: string, v: number, c: string) => (
    <div key={l} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--fj-heading)", fontSize: 22, fontWeight: 600, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
      <div style={{ fontFamily: "var(--fj-body)", fontSize: 10.5, color: "var(--fj-ink3)", textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
    </div>
  );

  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fj-line)" }}>
        <div style={{ fontFamily: "var(--fj-heading)", fontSize: 17, fontWeight: 500, color: "var(--fj-ink)" }}>
          Proyección de productividad
        </div>
        <div style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)", marginTop: 2 }}>
          Causas accionadas este mes vs meta
        </div>
      </div>
      <div style={{ padding: 20 }}>
        {isLoading ? (
          <Skeleton width="100%" height={180} />
        ) : meta == null ? (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{
                fontFamily: "var(--fj-heading)", fontWeight: 500, fontSize: 44,
                letterSpacing: "-.02em", color: "var(--fj-ink)", lineHeight: 1, fontVariantNumeric: "tabular-nums",
              }}>{actual}</span>
              <span style={{ fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)" }}>causas accionadas este mes</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--fj-ink2)" }}>
              Proyección a fin de mes: <strong style={{ color: "var(--fj-ink)" }}>{proyeccion}</strong>
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--fj-line)", fontSize: 12.5, color: "var(--fj-ink3)" }}>
              Meta mensual: <strong style={{ color: "var(--fj-ink2)" }}>—</strong> · la administradora la configurará.
            </div>
          </>
        ) : (
          <>
            {/* Gauge: projection toward the monthly target */}
            <div style={{ position: "relative", height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="74%" outerRadius="100%" data={[{ value: pct }]}
                  startAngle={180} endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    dataKey="value" angleAxisId={0} fill={gaugeColor} cornerRadius={10}
                    background={{ fill: "var(--fj-panel2)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "flex-end", paddingBottom: 6,
              }}>
                <span style={{ fontFamily: "var(--fj-heading)", fontSize: 36, fontWeight: 600, color: gaugeColor, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
                <span style={{ fontFamily: "var(--fj-body)", fontSize: 11, color: "var(--fj-ink3)" }}>de la meta</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 6 }}>
              {stat("Este mes", actual, "var(--fj-ink)")}
              {stat("Proyección", proyeccion, "var(--fj-ink)")}
              {stat("Meta", meta, "var(--fj-ink3)")}
            </div>
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 13, fontWeight: 600, color: gaugeColor }}>
              {onTrack ? "✓ En camino a la meta" : "Por debajo de la meta"}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/* ─── Dashboard default layout ─── */
function DashboardDefault({ plazos, proyActual, proyEstimada, proyMeta, onViewPlazos, isLoading }: {
  plazos: Causa[];
  proyActual: number;
  proyEstimada: number;
  proyMeta: number | null;
  onViewPlazos: () => void;
  isLoading: boolean;
}) {
  return (
    <>
      <SemaforoCluster />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginTop: 24 }}>
        <ProximosPlazosWidget plazos={plazos} onViewAll={onViewPlazos} isLoading={isLoading} />
        <ProyeccionProductividad actual={proyActual} proyeccion={proyEstimada} meta={proyMeta} isLoading={isLoading} />
      </div>
    </>
  );
}

/* ─── KPI row ─── */
function KPIRow({ causasCount, urgentes, rojoCount, isLoading }: {
  causasCount: number;
  urgentes: number;
  rojoCount: number;
  isLoading: boolean;
}) {
  return (
    <Card pad={20} style={{ marginBottom: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
        {isLoading ? (
          <>
            {(["Causas activas", "Plazos urgentes", "Estado crítico"] as const).map((label) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{
                  fontFamily: "var(--fj-body)", fontSize: 11, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: ".12em", color: "var(--fj-ink3)",
                }}>
                  {label}
                </div>
                <Skeleton width={72} height={36} radius={8} />
                <Skeleton width="60%" height={12} />
              </div>
            ))}
          </>
        ) : (
          <>
            <KPI label="Causas activas" value={causasCount} sub="En seguimiento" />
            <KPI label="Plazos urgentes" value={urgentes} sub="Próximos y vencidos" />
            <KPI label="Estado crítico" value={rojoCount} sub="Causas con semáforo rojo" />
          </>
        )}
      </div>
    </Card>
  );
}

function fmtDashboardDate(d: Date): string {
  const weekday = d.toLocaleDateString("es-CL", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("es-CL", { month: "short" }).replace(".", "");
  const year = d.getFullYear();
  return `${weekday} · ${day} ${month} ${year}`;
}

/* ─── Main Dashboard component ─── */
export function Dashboard() {
  const { data: causas = [], isLoading } = useCausas();
  const { data: goals } = useGoals();
  const navigate = useNavigate();
  const { abogado } = useSelectedLawyer();
  const firstName = abogado ? abogado.nombre.split(/\s+/)[0] ?? "—" : "—";
  const todayLabel = fmtDashboardDate(new Date());

  const rojoCount = useMemo(() => causas.filter((c) => c.semaforo === "rojo").length, [causas]);

  const proximosPlazos = useMemo(
    () =>
      causas
        .filter((c) => c.next_deadline_at && c.semaforo !== null)
        .sort(
          (a, b) =>
            new Date(a.next_deadline_at!).getTime() -
            new Date(b.next_deadline_at!).getTime(),
        )
        .slice(0, 5),
    [causas],
  );

  const urgentes = useMemo(
    () =>
      causas.filter((c) => {
        if (!c.next_deadline_at || c.semaforo === null) return false;
        return calcDiasRestantes(c.next_deadline_at) <= 7;
      }).length,
    [causas],
  );

  // Productivity projection: cases actioned this calendar month, linearly
  // projected to month-end. Compared against the admin-configured meta (later).
  const now = new Date();
  const actividadMes = causas.filter((c) => {
    if (!c.ultimaActuacion) return false;
    const d = new Date(c.ultimaActuacion);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const _domToday = now.getDate();
  const _daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const proyeccionMes =
    _domToday > 0 ? Math.round((actividadMes / _domToday) * _daysInMonth) : actividadMes;

  const hr = new Date().getHours();
  const saludo = hr < 12 ? "Buenos días" : hr < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div style={pageCss}>
      {/* Header strip */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        marginBottom: 28, gap: 24,
      }}>
        <div>
          <div style={kickerCss}>{todayLabel}</div>
          <h1 style={pageTitleCss}>{saludo}, {firstName}.</h1>
          {isLoading ? (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
              <Skeleton width={340} height={14} />
            </div>
          ) : (
            <p style={{
              margin: "6px 0 0", fontFamily: "var(--fj-body)", fontSize: 14,
              color: "var(--fj-ink3)", maxWidth: 580,
            }}>
              Tienes{" "}
              <strong
                onClick={() => navigate("/plazos")}
                style={{ color: "var(--fj-rojo)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}
              >{urgentes} plazos</strong>{" "}
              que requieren tu atención esta semana y {rojoCount} causa{rojoCount === 1 ? "" : "s"} en estado crítico.
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn icon={<Search size={15} strokeWidth={1.6} />} kind="secondary">Buscar causa</Btn>
          <Btn icon={<RefreshCw size={15} strokeWidth={1.6} />} kind="secondary">Sincronizar</Btn>
          <Btn icon={<Plus size={15} strokeWidth={1.6} />} kind="primary">Nueva causa</Btn>
        </div>
      </div>

      {/* KPI row */}
      <KPIRow causasCount={causas.length} urgentes={urgentes} rojoCount={rojoCount} isLoading={isLoading} />

      {/* Default layout */}
      <DashboardDefault
        plazos={proximosPlazos}
        proyActual={actividadMes}
        proyEstimada={proyeccionMes}
        proyMeta={goals?.monthly_productivity ?? null}
        onViewPlazos={() => navigate("/plazos")}
        isLoading={isLoading}
      />
    </div>
  );
}
