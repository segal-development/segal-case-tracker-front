import type { CSSProperties, ReactNode } from "react";
import { Pill } from "@/components/primitives/Pill";
import { Btn } from "@/components/primitives/Btn";
import { Card } from "@/components/primitives/Card";
import {
  UploadIcon,
  PlusIcon,
  SyncIcon,
  SettingsIcon,
  CausasIcon,
  DocIcon,
  PlazosIcon,
  BellIcon,
  UserIcon,
  DownloadIcon,
  CheckIcon,
} from "@/components/primitives/icons";
import { ADMIN } from "@/data/mock";

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

/* ─── Sync status cell ─── */
function SyncStatusCell({
  title,
  children,
  highlight = false,
}: {
  title?: string;
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: 22,
        borderRight: "1px solid var(--fj-line)",
        background: highlight ? "var(--fj-primary-soft)" : "transparent",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: highlight ? "var(--fj-primary)" : "var(--fj-ink3)",
            marginBottom: 10,
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─── Op card ─── */
function OpCard({ label, n, icon }: { label: string; n: number; icon: ReactNode }) {
  return (
    <Card pad={18}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "var(--fj-primary-soft)",
            color: "var(--fj-primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".10em",
            textTransform: "uppercase",
            color: "var(--fj-ink3)",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--fj-heading)",
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: "-.02em",
          color: "var(--fj-ink)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {n}
      </span>
    </Card>
  );
}

/* ─── Admin dashboard ─── */
export function Admin() {
  const ops = ADMIN.OPERACIONES_HOY;
  const dq = ADMIN.DATA_QUALITY;
  const events = ADMIN.SYNC_EVENTS;
  const sinAsignar = ADMIN.SIN_ASIGNAR;

  const dqTotal = dq.reduce((a, b) => a + b.n, 0);

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
          marginBottom: 26,
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={kickerCss}>centro operativo · viernes 15 may, 09:47</div>
          <h1 style={pageTitleCss}>Hola, Paula.</h1>
          <p
            style={{
              margin: "6px 0 0",
              fontFamily: "var(--fj-body)",
              fontSize: 14,
              color: "var(--fj-ink3)",
              maxWidth: 580,
            }}
          >
            Hay{" "}
            <strong style={{ color: "var(--fj-rojo)" }}>
              {sinAsignar.length} causas nuevas sin asignar
            </strong>{" "}
            y {dqTotal} elementos con calidad de datos baja.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn icon={<UploadIcon size={15} strokeWidth={1.6} />} kind="secondary">
            Importar lote
          </Btn>
          <Btn icon={<PlusIcon size={15} strokeWidth={1.6} />} kind="primary">
            Ingresar causa
          </Btn>
        </div>
      </div>

      {/* Sync status hero */}
      <Card pad={0} style={{ marginBottom: 20, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
            borderBottom: "1px solid var(--fj-line)",
          }}
        >
          <SyncStatusCell title="Estado" highlight>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "var(--fj-verde)",
                  boxShadow: "0 0 0 4px var(--fj-verde-soft)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--fj-heading)",
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--fj-ink)",
                }}
              >
                Operativo
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              Todos los servicios respondiendo
            </div>
          </SyncStatusCell>

          <SyncStatusCell title="Última sincronización PJUD">
            <div
              style={{
                fontFamily: "var(--fj-heading)",
                fontSize: 20,
                fontWeight: 500,
                color: "var(--fj-ink)",
              }}
            >
              hace 5 min
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              09:42 · 23 cambios
            </div>
          </SyncStatusCell>

          <SyncStatusCell title="Próxima sincronización">
            <div
              style={{
                fontFamily: "var(--fj-heading)",
                fontSize: 20,
                fontWeight: 500,
                color: "var(--fj-ink)",
              }}
            >
              en 25 min
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              cada 30 min · auto
            </div>
          </SyncStatusCell>

          <SyncStatusCell>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
              <Btn
                size="sm"
                kind="primary"
                icon={<SyncIcon size={13} strokeWidth={1.6} />}
                style={{ justifyContent: "center" }}
              >
                Sincronizar ahora
              </Btn>
              <Btn
                size="sm"
                kind="ghost"
                icon={<SettingsIcon size={13} strokeWidth={1.6} />}
                style={{ justifyContent: "center" }}
              >
                Configurar
              </Btn>
            </div>
          </SyncStatusCell>
        </div>
      </Card>

      {/* Operations today */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <OpCard
          label="Causas ingresadas hoy"
          n={ops.causasIngresadas}
          icon={<CausasIcon size={14} strokeWidth={1.6} />}
        />
        <OpCard
          label="Documentos subidos"
          n={ops.documentosSubidos}
          icon={<DocIcon size={14} strokeWidth={1.6} />}
        />
        <OpCard
          label="Plazos creados"
          n={ops.plazosCreados}
          icon={<PlazosIcon size={14} strokeWidth={1.6} />}
        />
        <OpCard
          label="Notificaciones enviadas"
          n={ops.notificacionesEnviadas}
          icon={<BellIcon size={14} strokeWidth={1.6} />}
        />
      </div>

      {/* Two-column: Sin asignar + Data quality — 1.4fr / 1fr */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Causas sin asignar */}
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
              <SubH2 noMargin>Causas sin asignar</SubH2>
              <div
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 12,
                  color: "var(--fj-ink3)",
                  marginTop: 4,
                }}
              >
                Ingresadas en las últimas 48h
              </div>
            </div>
            <Btn
              size="sm"
              kind="secondary"
              icon={<UserIcon size={13} strokeWidth={1.6} />}
            >
              Asignar lote
            </Btn>
          </div>
          {sinAsignar.map((c, i) => (
            <div
              key={c.rol}
              style={{
                padding: "14px 20px",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                gap: 14,
                alignItems: "center",
                borderBottom:
                  i === sinAsignar.length - 1 ? 0 : "1px solid var(--fj-line)",
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  background: "var(--fj-panel2)",
                  border: "1px dashed var(--fj-line-strong)",
                  color: "var(--fj-ink3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--fj-body)",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                ?
              </span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--fj-mono)",
                      fontSize: 11.5,
                      color: "var(--fj-ink)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.rol}
                  </span>
                  <Pill
                    tone={c.ingreso === "hoy" ? "primary" : "neutral"}
                    style={{ fontSize: 10 }}
                  >
                    {c.ingreso}
                  </Pill>
                </div>
                <div
                  style={{
                    fontFamily: "var(--fj-body)",
                    fontSize: 13,
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
                    fontFamily: "var(--fj-body)",
                    fontSize: 11,
                    color: "var(--fj-ink3)",
                    marginTop: 2,
                  }}
                >
                  {c.tribunal}
                </div>
              </div>
              <Btn size="sm" kind="ghost">Revisar</Btn>
              <Btn size="sm" kind="primary">Asignar</Btn>
            </div>
          ))}
        </Card>

        {/* Calidad de datos */}
        <Card pad={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fj-line)" }}>
            <SubH2 noMargin>Calidad de datos</SubH2>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              Registros con campos incompletos
            </div>
          </div>
          {dq.map((d, i) => {
            const barColor =
              d.severidad === "rojo"
                ? "var(--fj-rojo)"
                : d.severidad === "amarillo"
                  ? "var(--fj-amarillo)"
                  : "var(--fj-verde)";
            return (
              <div
                key={i}
                style={{
                  padding: "14px 20px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  borderBottom: i === dq.length - 1 ? 0 : "1px solid var(--fj-line)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 32,
                    borderRadius: 4,
                    background: barColor,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--fj-body)",
                      fontSize: 13,
                      color: "var(--fj-ink)",
                      fontWeight: 500,
                    }}
                  >
                    {d.titulo}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      height: 4,
                      background: "var(--fj-panel2)",
                      borderRadius: 4,
                      overflow: "hidden",
                      width: 140,
                    }}
                  >
                    <div
                      style={{
                        width: `${(d.n / d.total) * 100}%`,
                        height: "100%",
                        background: barColor,
                      }}
                    />
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--fj-heading)",
                    fontSize: 22,
                    fontWeight: 500,
                    color: d.severidad === "rojo" ? "var(--fj-rojo)" : "var(--fj-ink)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {d.n}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Event log */}
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
            <SubH2 noMargin>Bitácora del día</SubH2>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              Eventos de sistema · sincronización · imports
            </div>
          </div>
          <Btn
            size="sm"
            kind="ghost"
            icon={<DownloadIcon size={13} strokeWidth={1.6} />}
          >
            Exportar log
          </Btn>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--fj-body)",
            fontSize: 13,
          }}
        >
          <tbody>
            {events.map((e, i) => (
              <tr
                key={i}
                style={{
                  borderBottom:
                    i === events.length - 1 ? undefined : "1px solid var(--fj-line)",
                }}
              >
                <td
                  style={{
                    padding: "12px 20px",
                    fontFamily: "var(--fj-mono)",
                    fontSize: 12,
                    color: "var(--fj-ink3)",
                    width: 80,
                  }}
                >
                  {e.hora}
                </td>
                <td style={{ padding: "12px 14px", width: 130 }}>
                  <Pill tone="neutral" style={{ fontSize: 10.5 }}>
                    {e.origen}
                  </Pill>
                </td>
                <td style={{ padding: "12px 14px", color: "var(--fj-ink)" }}>
                  {e.evento}
                </td>
                <td style={{ padding: "12px 20px", width: 80, textAlign: "right" }}>
                  {e.estado === "ok" ? (
                    <Pill tone="verde">
                      <CheckIcon size={10} /> OK
                    </Pill>
                  ) : (
                    <Pill tone="amarillo">Aviso</Pill>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
