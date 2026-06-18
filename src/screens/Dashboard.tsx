import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Search, Plus } from "lucide-react";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Card } from "@/components/primitives/Card";
import { KPI } from "@/components/primitives/KPI";
import { Btn } from "@/components/primitives/Btn";
import { useCausas } from "@/hooks/useCausas";
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
function ProgressBar({ value, status }: { value: number; status: SemaforoColor }) {
  const color = status === "rojo" ? "var(--fj-rojo)"
              : status === "amarillo" ? "var(--fj-amarillo)"
              : "var(--fj-verde)";
  return (
    <div style={{ height: 4, background: "var(--fj-panel2)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${value * 100}%`, height: "100%", background: color, borderRadius: 4 }} />
    </div>
  );
}

/* ─── Semáforo cluster ─── */
function SemaforoCluster() {
  const { data: allCausas = [] } = useCausas();

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
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.map((x) => (
          <Card key={x.s} pad={20} elevated style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
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
            <ProgressBar value={classified > 0 ? x.n / classified : 0} status={x.s} />
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
      width: 48, padding: "6px 6px", textAlign: "center", borderRadius: 8,
      background: bg, color: fg, lineHeight: 1.05,
    }}>
      <div style={{ fontFamily: "var(--fj-heading)", fontSize: 18, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{dd}</div>
      <div style={{ fontFamily: "var(--fj-body)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".10em" }}>{mm}</div>
    </div>
  );
}

/* ─── Próximos plazos ─── */
function ProximosPlazosWidget({ plazos, onViewAll }: {
  plazos: Causa[];
  onViewAll: () => void;
}) {
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
        {plazos.map((causa, i) => {
          const dias = calcDiasRestantes(causa.next_deadline_at!);
          const vencido = dias < 0;
          return (
            <div key={causa.id} style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14,
              padding: "14px 20px",
              borderBottom: i === plazos.length - 1 ? 0 : "1px solid var(--fj-line)",
              alignItems: "center",
            }}>
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

/* ─── Actividad reciente ─── */
function ActividadReciente({ causas, onViewCausa }: {
  causas: Causa[];
  onViewCausa: (id: string) => void;
}) {
  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fj-line)" }}>
        <div style={{ fontFamily: "var(--fj-heading)", fontSize: 17, fontWeight: 500, color: "var(--fj-ink)" }}>
          Actividad reciente
        </div>
        <div style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)", marginTop: 2 }}>
          Causas con última actuación esta semana
        </div>
      </div>
      <div>
        {causas.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onViewCausa(c.id)}
            style={{
              width: "100%", textAlign: "left", border: 0, background: "transparent", cursor: "pointer",
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14,
              padding: "14px 20px",
              borderBottom: i === causas.length - 1 ? 0 : "1px solid var(--fj-line)",
              alignItems: "center",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fj-panel2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <Avatar iniciales={c.abogado.iniciales} color={c.abogado.color} nombre={c.abogado.nombre} size={32} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontFamily: "var(--fj-mono)", fontSize: 11.5, color: "var(--fj-ink3)", whiteSpace: "nowrap" }}>
                  {c.rol}
                </span>
                <SemaforoRing status={c.semaforo} size={14} variant="dot" />
              </div>
              <div style={{
                fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)", fontWeight: 500,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {c.caratula}
              </div>
            </div>
            <span style={{ fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)", whiteSpace: "nowrap" }}>
              hace {c.diasUltima}d
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ─── Dashboard default layout ─── */
function DashboardDefault({ plazos, recientes, onViewCausa, onViewPlazos }: {
  plazos: Causa[];
  recientes: Causa[];
  onViewCausa: (id: string) => void;
  onViewPlazos: () => void;
}) {
  return (
    <>
      <SemaforoCluster />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginTop: 24 }}>
        <ProximosPlazosWidget plazos={plazos} onViewAll={onViewPlazos} />
        <ActividadReciente causas={recientes} onViewCausa={onViewCausa} />
      </div>
    </>
  );
}

/* ─── KPI row ─── */
function KPIRow({ causasCount, urgentes, rojoCount }: { causasCount: number; urgentes: number; rojoCount: number }) {
  return (
    <Card pad={20} style={{ marginBottom: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
        <KPI
          label="Causas activas"
          value={causasCount}
          sub="En seguimiento"
        />
        <KPI
          label="Plazos urgentes"
          value={urgentes}
          sub="Próximos y vencidos"
        />
        <KPI
          label="Estado crítico"
          value={rojoCount}
          sub="Causas con semáforo rojo"
        />
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
  const { data: causas = [] } = useCausas();
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

  const recientes = [...causas]
    .sort((a, b) => a.diasUltima - b.diasUltima)
    .slice(0, 4);

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
          <p style={{
            margin: "6px 0 0", fontFamily: "var(--fj-body)", fontSize: 14,
            color: "var(--fj-ink3)", maxWidth: 580,
          }}>
            Tienes{" "}
            <strong style={{ color: "var(--fj-rojo)" }}>{urgentes} plazos</strong>{" "}
            que requieren tu atención esta semana y {rojoCount} causa{rojoCount === 1 ? "" : "s"} en estado crítico.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn icon={<Search size={15} strokeWidth={1.6} />} kind="secondary">Buscar causa</Btn>
          <Btn icon={<RefreshCw size={15} strokeWidth={1.6} />} kind="secondary">Sincronizar</Btn>
          <Btn icon={<Plus size={15} strokeWidth={1.6} />} kind="primary">Nueva causa</Btn>
        </div>
      </div>

      {/* KPI row */}
      <KPIRow causasCount={causas.length} urgentes={urgentes} rojoCount={rojoCount} />

      {/* Default layout */}
      <DashboardDefault
        plazos={proximosPlazos}
        recientes={recientes}
        onViewCausa={(id) => navigate(`/causas/${id}`)}
        onViewPlazos={() => navigate("/plazos")}
      />
    </div>
  );
}
