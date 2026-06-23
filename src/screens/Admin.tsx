import type { CSSProperties, ReactNode } from "react";
import { useState, useEffect } from "react";
import { Btn } from "@/components/primitives/Btn";
import { Card } from "@/components/primitives/Card";
import {
  UploadIcon,
  PlusIcon,
  SyncIcon,
  SettingsIcon,
} from "@/components/primitives/icons";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useGoals, useSetGoal } from "@/hooks/useGoals";
import { useMe } from "@/hooks/useMe";
import { AccountsCard } from "@/components/admin/AccountsCard";
import { SyncStatusCard } from "@/components/admin/SyncStatusCard";
import { fmtDate } from "@/lib/format";

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

/* ─── Stat card for document pills ─── */
function DocStatCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: number;
  valueColor?: string;
}) {
  return (
    <div style={{ padding: "18px 22px" }}>
      <div
        style={{
          fontFamily: "var(--fj-body)",
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--fj-ink3)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--fj-heading)",
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: "-.02em",
          color: valueColor ?? "var(--fj-ink)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─── Quality progress row ─── */
function QualityRow({
  label,
  value,
  total,
  danger = false,
}: {
  label: string;
  value: number;
  total: number;
  danger?: boolean;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      style={{
        padding: "14px 20px",
        borderBottom: "1px solid var(--fj-line)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 13,
            fontWeight: 500,
            color: danger ? "var(--fj-rojo)" : "var(--fj-ink)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--fj-heading)",
            fontSize: 13,
            fontVariantNumeric: "tabular-nums",
            color: "var(--fj-ink3)",
          }}
        >
          {value} / {total}
        </div>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--fj-panel2)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: danger ? "var(--fj-rojo)" : "var(--fj-primary)",
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Relative time ─── */
function fmtRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (isNaN(diffMs)) return "—";
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  return `hace ${Math.floor(diffH / 24)} d`;
}

/* ─── Admin dashboard ─── */
export function Admin() {
  const { data, isLoading, error } = useAdminStats();
  const { data: goals } = useGoals();
  const setGoal = useSetGoal();
  const { data: me } = useMe();
  const isAdmin = me?.role === "admin";
  const [metaInput, setMetaInput] = useState("");
  useEffect(() => {
    if (goals?.monthly_productivity != null) setMetaInput(String(goals.monthly_productivity));
  }, [goals?.monthly_productivity]);

  if (isLoading) {
    return (
      <div
        style={{
          ...pageCss,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 14,
            color: "var(--fj-ink3)",
          }}
        >
          Cargando datos...
        </div>
      </div>
    );
  }

  if (error != null || data == null) {
    return (
      <div
        style={{
          ...pageCss,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 14,
            color: "var(--fj-rojo)",
          }}
        >
          {error instanceof Error
            ? error.message
            : "Error al cargar datos del panel."}
        </div>
      </div>
    );
  }

  const { sync, documents, quality } = data;

  return (
    <div style={pageCss}>
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
          <div style={kickerCss}>centro operativo</div>
          <h1 style={pageTitleCss}>Panel de administracion</h1>
          <p
            style={{
              margin: "6px 0 0",
              fontFamily: "var(--fj-body)",
              fontSize: 14,
              color: "var(--fj-ink3)",
              maxWidth: 580,
            }}
          >
            {quality.sin_asignar > 0 && (
              <>
                <strong style={{ color: "var(--fj-rojo)" }}>
                  {quality.sin_asignar} causas sin asignar
                </strong>
                {" · "}
              </>
            )}
            {quality.total_cases} causas en el sistema
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

      {isAdmin && <SyncStatusCard />}
      {isAdmin && <AccountsCard />}

      {/* Metas del estudio */}
      <Card pad={0} style={{ marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fj-line)" }}>
          <SubH2 noMargin>Metas del estudio</SubH2>
        </div>
        <div style={{ padding: "18px 20px", display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--fj-body)", fontSize: 12, fontWeight: 600, color: "var(--fj-ink2)", marginBottom: 6 }}>
              Meta mensual de productividad (causas accionadas)
            </label>
            <input
              type="number"
              min={0}
              value={metaInput}
              onChange={(e) => setMetaInput(e.target.value)}
              placeholder="ej. 120"
              style={{
                height: 38, width: 160, padding: "0 12px", borderRadius: 8,
                background: "var(--fj-panel)", border: "1px solid var(--fj-line-strong)",
                fontFamily: "var(--fj-body)", fontSize: 14, color: "var(--fj-ink)", outline: "none",
              }}
            />
          </div>
          <Btn
            kind="primary"
            onClick={() => {
              const v = Number(metaInput);
              if (Number.isFinite(v) && v >= 0) {
                setGoal.mutate({ key: "monthly_productivity", value: Math.round(v) });
              }
            }}
          >
            {setGoal.isPending ? "Guardando…" : "Guardar meta"}
          </Btn>
          {setGoal.isSuccess && <span style={{ fontSize: 13, color: "var(--fj-verde)" }}>✓ Guardada</span>}
          {setGoal.isError && <span style={{ fontSize: 13, color: "var(--fj-rojo)" }}>Error al guardar</span>}
        </div>
        <div style={{ padding: "0 20px 16px", fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)" }}>
          Se usa en el KPI de proyección de productividad del Dashboard (actual + proyección a fin de mes vs esta meta).
        </div>
      </Card>

      {/* Section A: Estado de sincronizacion */}
      <Card pad={0} style={{ marginBottom: 20, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--fj-line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SubH2 noMargin>Estado de sincronizacion</SubH2>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              size="sm"
              kind="primary"
              icon={<SyncIcon size={13} strokeWidth={1.6} />}
            >
              Sincronizar ahora
            </Btn>
            <Btn
              size="sm"
              kind="ghost"
              icon={<SettingsIcon size={13} strokeWidth={1.6} />}
            >
              Configurar
            </Btn>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          }}
        >
          <SyncStatusCell title="Ultima verificacion" highlight>
            <div
              style={{
                fontFamily: "var(--fj-heading)",
                fontSize: 20,
                fontWeight: 500,
                color: "var(--fj-ink)",
              }}
            >
              {sync.last_checked_at != null
                ? fmtRelative(sync.last_checked_at)
                : "Nunca"}
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              {sync.last_checked_at != null
                ? fmtDate(sync.last_checked_at)
                : "Sin sincronizacion registrada"}
            </div>
          </SyncStatusCell>

          <SyncStatusCell title="Verificadas 24h">
            <div
              style={{
                fontFamily: "var(--fj-heading)",
                fontSize: 28,
                fontWeight: 500,
                color: "var(--fj-ink)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {sync.checked_24h}
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              causas verificadas
            </div>
          </SyncStatusCell>

          <SyncStatusCell title="Sin detalle">
            <div
              style={{
                fontFamily: "var(--fj-heading)",
                fontSize: 28,
                fontWeight: 500,
                color:
                  sync.pending_detail > 0
                    ? "var(--fj-amarillo)"
                    : "var(--fj-ink)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {sync.pending_detail}
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              causas pendientes
            </div>
          </SyncStatusCell>

          <SyncStatusCell title="Sin movimiento +30d">
            <div
              style={{
                fontFamily: "var(--fj-heading)",
                fontSize: 28,
                fontWeight: 500,
                color:
                  sync.stale_30d > 0 ? "var(--fj-rojo)" : "var(--fj-ink)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {sync.stale_30d}
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 12,
                color: "var(--fj-ink3)",
                marginTop: 4,
              }}
            >
              causas estancadas
            </div>
          </SyncStatusCell>
        </div>
      </Card>

      {/* Section B: Documentos */}
      <Card pad={0} style={{ marginBottom: 20, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--fj-line)",
          }}
        >
          <SubH2 noMargin>Documentos</SubH2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          <DocStatCard
            label="Almacenados"
            value={documents.stored}
            valueColor="var(--fj-verde)"
          />
          <div style={{ borderLeft: "1px solid var(--fj-line)" }}>
            <DocStatCard
              label="Pendientes"
              value={documents.pending}
              valueColor="var(--fj-amarillo)"
            />
          </div>
          <div style={{ borderLeft: "1px solid var(--fj-line)" }}>
            <DocStatCard
              label="Con error"
              value={documents.failed}
              valueColor="var(--fj-rojo)"
            />
          </div>
          <div style={{ borderLeft: "1px solid var(--fj-line)" }}>
            <DocStatCard label="No disponibles" value={documents.unavailable} />
          </div>
        </div>
      </Card>

      {/* Section C: Calidad de datos */}
      <Card pad={0} style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--fj-line)",
          }}
        >
          <SubH2 noMargin>Calidad de datos</SubH2>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 12,
              color: "var(--fj-ink3)",
              marginTop: 4,
            }}
          >
            Cobertura sobre {quality.total_cases} causas
          </div>
        </div>
        <QualityRow
          label="Con semaforo"
          value={quality.with_semaforo}
          total={quality.total_cases}
        />
        <QualityRow
          label="Con movimientos registrados"
          value={quality.with_movements}
          total={quality.total_cases}
        />
        <QualityRow
          label="Con litigantes identificados"
          value={quality.with_litigantes}
          total={quality.total_cases}
        />
        <QualityRow
          label="Sin asignar"
          value={quality.sin_asignar}
          total={quality.total_cases}
          danger
        />
      </Card>
    </div>
  );
}
