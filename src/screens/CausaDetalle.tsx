import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ReactNode, CSSProperties } from "react";
import {
  ChevronLIcon,
  BuildingIcon,
  UserIcon,
  CalendarIcon,
  ScaleIcon,
  SparkleIcon,
  MoreIcon,
  PlusIcon,
  UploadIcon,
  DocIcon,
  LinkIcon,
  CheckIcon,
  EyeIcon,
  DownloadIcon,
} from "@/components/primitives/icons";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Card } from "@/components/primitives/Card";
import { Btn } from "@/components/primitives/Btn";
import { Pill } from "@/components/primitives/Pill";
import { useCausa } from "@/hooks/useCausa";
import { useActuaciones } from "@/hooks/useActuaciones";
import { PLAZOS, DOCUMENTOS_C1, ABOGADOS } from "@/data/mock";
import { fmtCLP, fmtDate } from "@/lib/format";
import type { Causa, Plazo } from "@/data/types";

/* ── page chrome ── */
const pageCss: CSSProperties = {
  padding: "36px 40px 56px",
  maxWidth: 1240,
  margin: "0 auto",
};

/* ── section sub-header ── */
function SubH({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--fj-body)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        color: "var(--fj-ink3)",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

/* ── key/value grid ── */
type GridItem = [string, ReactNode];

function DataGrid({ items }: { items: GridItem[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        rowGap: 12,
        columnGap: 24,
        alignItems: "baseline",
      }}
    >
      {items.flatMap(([k, v], i) => [
        <div
          key={`k${i}`}
          style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)" }}
        >
          {k}
        </div>,
        <div
          key={`v${i}`}
          style={{ fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)", fontWeight: 500 }}
        >
          {v}
        </div>,
      ])}
    </div>
  );
}

/* ── hero meta item ── */
function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ marginTop: 2, color: "var(--fj-ink3)", display: "inline-flex" }}>
        {icon}
      </span>
      <div>
        <div
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 10.5,
            fontWeight: 600,
            color: "var(--fj-ink3)",
            textTransform: "uppercase",
            letterSpacing: ".12em",
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{ fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ── party card ── */
function ParteCard({
  rol,
  nombre,
  rep,
  inverted = false,
}: {
  rol: string;
  nombre: string;
  rep: string;
  inverted?: boolean;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 10,
        background: inverted ? "var(--fj-panel2)" : "var(--fj-primary-soft)",
        border: `1px solid ${inverted ? "var(--fj-line)" : "transparent"}`,
      }}
    >
      <div
        style={{
          fontFamily: "var(--fj-body)",
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: inverted ? "var(--fj-ink3)" : "var(--fj-primary)",
          marginBottom: 8,
        }}
      >
        {rol}
      </div>
      <div
        style={{
          fontFamily: "var(--fj-heading)",
          fontSize: 17,
          fontWeight: 500,
          color: "var(--fj-ink)",
          lineHeight: 1.25,
        }}
      >
        {nombre}
      </div>
      <div
        style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)", marginTop: 6 }}
      >
        Patrocinio: {rep}
      </div>
    </div>
  );
}

/* ── Tab: Información ── */
function TabInfo({
  causa,
  onOpenModal,
}: {
  causa: Causa;
  onOpenModal: (modal: string) => void;
}) {
  const parts = causa.caratula.split(" / ");
  const demandante = parts[0] ?? "—";
  const adverso = parts[1] ?? "—";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card pad={22}>
          <SubH>Identificación</SubH>
          <DataGrid
            items={[
              ["ROL", <span style={{ fontFamily: "var(--fj-mono)" }}>{causa.rol}</span>],
              ["RIT", <span style={{ fontFamily: "var(--fj-mono)" }}>{causa.rit ?? "—"}</span>],
              [
                "RUC",
                <span style={{ fontFamily: "var(--fj-mono)" }}>
                  {causa.rit ? "24-9-0123456-7" : "—"}
                </span>,
              ],
              ["Materia", causa.materia],
              ["Tribunal", causa.tribunal],
              ["Cuantía", causa.cuantia ? fmtCLP(causa.cuantia) : "Sin cuantía declarada"],
            ]}
          />
        </Card>

        <Card pad={22}>
          <SubH>Partes</SubH>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ParteCard rol="Demandante" nombre={demandante} rep="Catalina Morales R." />
            <ParteCard
              rol="Demandado"
              nombre={adverso}
              rep="Sin representación informada"
              inverted
            />
          </div>
        </Card>

        <Card pad={22}>
          <SubH>Notas internas</SubH>
          <div
            style={{
              background: "var(--fj-panel2)",
              border: "1px dashed var(--fj-line-strong)",
              borderRadius: 8,
              padding: 16,
              fontFamily: "var(--fj-body)",
              fontSize: 13.5,
              color: "var(--fj-ink2)",
              lineHeight: 1.55,
            }}
          >
            Cliente solicita avanzar con embargo preventivo si no hay pago al 20/05. Coordinar con
            receptor judicial. Antecedente bancario adjunto en documentos.
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card pad={22}>
          <SubH>Acciones rápidas</SubH>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn
              kind="secondary"
              icon={<PlusIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
            >
              Agregar plazo
            </Btn>
            <Btn
              kind="secondary"
              icon={<UploadIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
              onClick={() => onOpenModal("subir-documento")}
            >
              Subir documento
            </Btn>
            <Btn
              kind="secondary"
              icon={<DocIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
            >
              Registrar escrito
            </Btn>
            <Btn
              kind="secondary"
              icon={<LinkIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
            >
              Vincular causa
            </Btn>
          </div>
        </Card>

        <Card pad={22}>
          <SubH>Última actuación</SubH>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 13,
              color: "var(--fj-ink2)",
              lineHeight: 1.5,
            }}
          >
            <Pill tone="primary" style={{ marginBottom: 10 }}>
              Hace {causa.diasUltima} día{causa.diasUltima === 1 ? "" : "s"}
            </Pill>
            <p style={{ margin: 0, color: "var(--fj-ink)" }}>
              <strong>Resolución:</strong> Téngase presente. Notifíquese.
            </p>
            <p style={{ margin: "8px 0 0", color: "var(--fj-ink3)", fontSize: 12 }}>
              Registrada por el tribunal el {fmtDate(causa.ultimaActuacion)}.
            </p>
          </div>
        </Card>

        <Card pad={22}>
          <SubH>Acceso</SubH>
          <div style={{ display: "flex", marginTop: 4 }}>
            {[ABOGADOS[0]!, ABOGADOS[2]!, ABOGADOS[5]!].map((a, i) => (
              <span key={a.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                <Avatar iniciales={a.iniciales} color={a.color} nombre={a.nombre} size={32} />
              </span>
            ))}
            <button
              style={{
                marginLeft: -8,
                width: 32,
                height: 32,
                borderRadius: 999,
                background: "var(--fj-panel2)",
                border: "2px solid var(--fj-panel)",
                color: "var(--fj-ink2)",
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              +2
            </button>
          </div>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 12,
              color: "var(--fj-ink3)",
              marginTop: 10,
            }}
          >
            5 personas con acceso · 3 con permisos de edición
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── Tab: Plazos ── */
function TabPlazos({
  plazos,
  onOpenModal,
}: {
  plazos: Plazo[];
  onOpenModal: (modal: string) => void;
}) {
  if (plazos.length === 0) {
    return (
      <Card
        pad={40}
        style={{ textAlign: "center", color: "var(--fj-ink3)", fontFamily: "var(--fj-body)" }}
      >
        Esta causa no tiene plazos registrados.
      </Card>
    );
  }

  return (
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
        <SubH>Plazos asociados</SubH>
        <Btn
          size="sm"
          kind="primary"
          icon={<PlusIcon size={13} strokeWidth={1.6} />}
          onClick={() => onOpenModal("nuevo-plazo")}
        >
          Agregar plazo
        </Btn>
      </div>
      {plazos.map((p, i) => (
        <div
          key={p.id}
          style={{
            padding: "16px 20px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto",
            gap: 16,
            alignItems: "center",
            borderBottom: i === plazos.length - 1 ? "none" : "1px solid var(--fj-line)",
          }}
        >
          <SemaforoRing status={p.semaforo} size={28} />
          <div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 14,
                color: "var(--fj-ink)",
                fontWeight: 500,
              }}
            >
              {p.descripcion}
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 11.5,
                color: "var(--fj-ink3)",
                marginTop: 3,
              }}
            >
              {p.dias} días {p.tipoDias} · {fmtDate(p.fechaInicio)} → {fmtDate(p.fechaVencimiento)}
            </div>
          </div>
          <Pill
            tone={
              p.estado === "vencido"
                ? "rojo"
                : p.estado === "proximo"
                ? "amarillo"
                : p.estado === "cumplido"
                ? "verde"
                : "neutral"
            }
          >
            {p.estado}
          </Pill>
          {p.estado === "cumplido" ? (
            <Pill tone="verde" subtle>
              <CheckIcon size={11} strokeWidth={2} />
              Cumplido
            </Pill>
          ) : (
            <Btn size="sm" kind="ghost" icon={<CheckIcon size={13} strokeWidth={1.8} />}>
              Marcar cumplido
            </Btn>
          )}
        </div>
      ))}
    </Card>
  );
}

/* ── Tab: Documentos ── */
const iconBtnCss: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 6,
  border: "none",
  background: "transparent",
  color: "var(--fj-ink3)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

function TabDocumentos({ onOpenModal }: { onOpenModal: (modal: string) => void }) {
  return (
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
        <SubH>Documentos y escritos</SubH>
        <Btn
          size="sm"
          kind="primary"
          icon={<UploadIcon size={13} strokeWidth={1.6} />}
          onClick={() => onOpenModal("subir-documento")}
        >
          Subir documento
        </Btn>
      </div>
      {DOCUMENTOS_C1.map((d, i) => (
        <div
          key={d.id}
          style={{
            padding: "14px 20px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto auto",
            gap: 14,
            alignItems: "center",
            borderBottom: i === DOCUMENTOS_C1.length - 1 ? "none" : "1px solid var(--fj-line)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 44,
              background: "var(--fj-panel2)",
              border: "1px solid var(--fj-line-strong)",
              borderRadius: 4,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fj-ink3)",
              flex: "0 0 auto",
            }}
          >
            <DocIcon size={16} strokeWidth={1.6} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 13.5,
                color: "var(--fj-ink)",
                fontWeight: 500,
              }}
            >
              {d.nombre}
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 11.5,
                color: "var(--fj-ink3)",
                marginTop: 2,
              }}
            >
              {d.peso} · subido por {d.autor}
            </div>
          </div>
          <span style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)" }}>
            {fmtDate(d.fecha)}
          </span>
          <button style={iconBtnCss}>
            <EyeIcon size={15} strokeWidth={1.6} />
          </button>
          <button style={iconBtnCss}>
            <DownloadIcon size={15} strokeWidth={1.6} />
          </button>
        </div>
      ))}
    </Card>
  );
}

/* ── Timeline tone helper ── */
type TimelineTone = "primary" | "neutral" | "amarillo" | "verde";

function toneByType(tipo: string): { tone: TimelineTone; bg: string; fg: string } {
  if (tipo === "Resolución")
    return { tone: "primary", bg: "var(--fj-primary-soft)", fg: "var(--fj-primary)" };
  if (tipo === "Escrito")
    return { tone: "neutral", bg: "var(--fj-panel2)", fg: "var(--fj-ink2)" };
  if (tipo === "Notificación")
    return { tone: "amarillo", bg: "var(--fj-amarillo-soft)", fg: "var(--fj-amarillo)" };
  if (tipo === "Ingreso")
    return { tone: "verde", bg: "var(--fj-verde-soft)", fg: "var(--fj-verde)" };
  return { tone: "neutral", bg: "var(--fj-panel2)", fg: "var(--fj-ink2)" };
}

/* ── Tab: Timeline ── */
function TabTimeline({ causaId }: { causaId: string }) {
  const { data: evs = [] } = useActuaciones(causaId);
  return (
    <Card pad={28}>
      <SubH>Línea de tiempo</SubH>
      <div style={{ position: "relative", paddingLeft: 32 }}>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 8,
            bottom: 8,
            width: 1,
            background: "var(--fj-line-strong)",
          }}
        />
        {evs.map((e, i) => {
          const t = toneByType(e.tipo);
          return (
            <div key={i} style={{ position: "relative", paddingBottom: 24 }}>
              <span
                style={{
                  position: "absolute",
                  left: -27,
                  top: 4,
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: t.bg,
                  border: `2px solid ${t.fg}`,
                }}
              />
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <Pill tone={t.tone}>{e.tipo}</Pill>
                <span
                  style={{ fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)" }}
                >
                  {fmtDate(e.fecha)}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--fj-heading)",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--fj-ink)",
                  marginTop: 6,
                }}
              >
                {e.titulo}
              </div>
              <div
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 12.5,
                  color: "var(--fj-ink3)",
                  marginTop: 3,
                }}
              >
                {e.actor}
                {e.adjuntos > 0
                  ? ` · ${e.adjuntos} adjunto${e.adjuntos === 1 ? "" : "s"}`
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Tab bar ── */
type TabId = "info" | "plazos" | "documentos" | "timeline";

/* ── Main export ── */
export function CausaDetalle({ onSubirDoc = () => {} }: { onSubirDoc?: () => void }) {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("info");
  const { data: causa } = useCausa(id);

  if (!causa) {
    return (
      <div style={pageCss}>
        <div
          style={{
            fontFamily: "var(--fj-body)",
            color: "var(--fj-ink3)",
            fontSize: 14,
            paddingTop: 40,
          }}
        >
          Cargando...
        </div>
      </div>
    );
  }

  const causaPlazos = PLAZOS.filter((p) => p.causaId === causa.id);

  const stripeColor =
    causa.semaforo === "rojo"
      ? "var(--fj-rojo)"
      : causa.semaforo === "amarillo"
      ? "var(--fj-amarillo)"
      : causa.semaforo === "verde"
      ? "var(--fj-verde)"
      : "var(--fj-line)";

  const semLabel =
    causa.semaforo === "rojo" ? "Crítica"
    : causa.semaforo === "amarillo" ? "Atención"
    : causa.semaforo === "verde" ? "Al día"
    : "Sin seguimiento";

  const handleOpenModal = (modal: string) => {
    if (modal === "subir-documento") onSubirDoc();
  };

  const tabs: Array<{ id: TabId; label: string; badge?: number }> = [
    { id: "info", label: "Información" },
    { id: "plazos", label: "Plazos", badge: causaPlazos.length },
    { id: "documentos", label: "Documentos", badge: DOCUMENTOS_C1.length },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <div style={pageCss}>
      {/* Back link */}
      <button
        onClick={() => navigate("/causas")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "none",
          color: "var(--fj-ink3)",
          fontFamily: "var(--fj-body)",
          fontSize: 13,
          cursor: "pointer",
          padding: 0,
          marginBottom: 18,
        }}
      >
        <ChevronLIcon size={14} strokeWidth={1.6} />
        Causas
      </button>

      {/* Hero card */}
      <Card pad={28} style={{ marginBottom: 22, position: "relative", overflow: "hidden" }}>
        {/* Left color stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 4,
            background: stripeColor,
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24 }}>
          {/* Left: labels + title + meta */}
          <div>
            <div
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
            >
              <span
                style={{
                  fontFamily: "var(--fj-mono)",
                  fontSize: 13,
                  color: "var(--fj-ink)",
                  fontWeight: 600,
                  background: "var(--fj-panel2)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {causa.rol}
              </span>
              {causa.rit && (
                <span
                  style={{ fontFamily: "var(--fj-mono)", fontSize: 12, color: "var(--fj-ink3)" }}
                >
                  RIT {causa.rit}
                </span>
              )}
              <Pill tone="neutral">{causa.materia}</Pill>
              <Pill tone={causa.semaforo ?? "neutral"}>
                <SemaforoRing status={causa.semaforo} size={12} variant="dot" />
                {semLabel}
              </Pill>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--fj-heading)",
                fontSize: 30,
                fontWeight: 500,
                letterSpacing: "-.01em",
                color: "var(--fj-ink)",
                lineHeight: 1.15,
              }}
            >
              {causa.caratula}
            </h1>
            <div style={{ display: "flex", gap: 28, marginTop: 18, flexWrap: "wrap" }}>
              <MetaItem
                icon={<BuildingIcon size={16} strokeWidth={1.6} />}
                label="Tribunal"
                value={causa.tribunal}
              />
              <MetaItem
                icon={<UserIcon size={16} strokeWidth={1.6} />}
                label="Abogado"
                value={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Avatar
                      iniciales={causa.abogado.iniciales}
                      color={causa.abogado.color}
                      nombre={causa.abogado.nombre}
                      size={20}
                    />
                    {causa.abogado.nombre}
                  </span>
                }
              />
              <MetaItem
                icon={<CalendarIcon size={16} strokeWidth={1.6} />}
                label="Ingreso"
                value={fmtDate(causa.fechaIngreso)}
              />
              {causa.cuantia != null && (
                <MetaItem
                  icon={<ScaleIcon size={16} strokeWidth={1.6} />}
                  label="Cuantía"
                  value={fmtCLP(causa.cuantia)}
                />
              )}
            </div>
          </div>
          {/* Right: big ring + action buttons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}
          >
            <SemaforoRing status={causa.semaforo} size={64} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                kind="secondary"
                icon={<SparkleIcon size={14} strokeWidth={1.6} />}
                size="sm"
              >
                Asistente IA
              </Btn>
              <Btn
                kind="ghost"
                size="sm"
                style={{ width: 34, padding: "0", justifyContent: "center" }}
              >
                <MoreIcon size={15} strokeWidth={1.6} />
              </Btn>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 2,
          borderBottom: "1px solid var(--fj-line)",
          marginBottom: 20,
          paddingLeft: 4,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "12px 18px",
              position: "relative",
              fontFamily: "var(--fj-body)",
              fontSize: 13.5,
              fontWeight: tab === t.id ? 600 : 500,
              color: tab === t.id ? "var(--fj-ink)" : "var(--fj-ink3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
            {t.badge != null && (
              <span
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: "1px 7px",
                  borderRadius: 999,
                  background: "var(--fj-panel2)",
                  color: "var(--fj-ink3)",
                }}
              >
                {t.badge}
              </span>
            )}
            {tab === t.id && (
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

      {/* Tab content */}
      {tab === "info" && <TabInfo causa={causa} onOpenModal={handleOpenModal} />}
      {tab === "plazos" && (
        <TabPlazos plazos={causaPlazos} onOpenModal={handleOpenModal} />
      )}
      {tab === "documentos" && <TabDocumentos onOpenModal={handleOpenModal} />}
      {tab === "timeline" && <TabTimeline causaId={causa.id} />}
    </div>
  );
}
