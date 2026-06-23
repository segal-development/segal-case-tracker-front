import { useState } from "react";
import { Card } from "@/components/primitives/Card";
import { KPI } from "@/components/primitives/KPI";
import { Avatar } from "@/components/primitives/Avatar";
import { Splash } from "@/components/Splash";
import { useFirmStats } from "@/hooks/useFirmStats";
import type { FirmLawyerItem, FirmMateriaItem } from "@/hooks/useFirmStats";
import { useMe } from "@/hooks/useMe";
import type { CSSProperties } from "react";

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

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "equipo",   label: "Equipo" },
  { id: "materias", label: "Por materia" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── RankingEquipo ────────────────────────────────────────────────────────────

function RankingEquipo({ data }: { data: FirmLawyerItem[] }) {
  const sorted = [...data].sort((a, b) => b.case_count - a.case_count);
  const maxCases = Math.max(...sorted.map((a) => a.case_count), 1);

  if (sorted.length === 0) {
    return (
      <Card pad={24} elevated>
        <div
          style={{
            textAlign: "center",
            color: "var(--fj-ink3)",
            padding: "48px 0",
          }}
        >
          Sin abogados registrados
        </div>
      </Card>
    );
  }

  return (
    <Card pad={24} elevated>
      <div
        style={{
          fontWeight: 600,
          fontFamily: "var(--fj-heading)",
          fontSize: 16,
          marginBottom: 20,
        }}
      >
        Equipo
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {sorted.map((a, idx) => (
          <div
            key={a.rut}
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto 1fr auto auto",
              gap: 16,
              alignItems: "center",
              padding: "12px 0",
              borderBottom:
                idx < sorted.length - 1
                  ? "1px solid var(--fj-line)"
                  : "none",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--fj-ink3)",
                fontVariantNumeric: "tabular-nums",
                width: 20,
                textAlign: "right",
              }}
            >
              {idx + 1}
            </span>
            <Avatar
              iniciales={getInitials(a.nombre)}
              color={rutToColor(a.rut)}
              nombre={a.nombre}
              size={36}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{a.nombre}</div>
              <div style={{ fontSize: 12, color: "var(--fj-ink3)" }}>
                {a.case_count} causas · {a.stale} estancadas
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                display: "flex",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "var(--fj-rojo)" }}>● {a.rojo}</span>
              <span style={{ color: "var(--fj-amarillo)" }}>● {a.amarillo}</span>
              <span style={{ color: "var(--fj-verde)" }}>● {a.verde}</span>
            </div>
            <div
              style={{
                width: 120,
                height: 6,
                background: "var(--fj-panel2)",
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(a.case_count / maxCases) * 100}%`,
                  background: "var(--fj-primary)",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── MateriasPanel ────────────────────────────────────────────────────────────

function MateriasPanel({ data }: { data: FirmMateriaItem[] }) {
  const max = Math.max(...data.map((m) => m.count), 1);

  if (data.length === 0) {
    return (
      <Card pad={24} elevated>
        <div
          style={{
            textAlign: "center",
            color: "var(--fj-ink3)",
            padding: "48px 0",
          }}
        >
          Sin datos de materias
        </div>
      </Card>
    );
  }

  return (
    <Card pad={24} elevated>
      <div
        style={{
          fontWeight: 600,
          fontFamily: "var(--fj-heading)",
          fontSize: 16,
          marginBottom: 20,
        }}
      >
        Por materia
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((m) => (
          <div
            key={m.materia}
            style={{
              display: "grid",
              gridTemplateColumns: "240px 1fr 80px",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, color: "var(--fj-ink)" }}>
              {m.materia}
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
                  width: `${(m.count / max) * 100}%`,
                  background: "var(--fj-primary)",
                  borderRadius: 4,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 13,
                fontVariantNumeric: "tabular-nums",
                color: "var(--fj-ink2)",
                textAlign: "right",
              }}
            >
              {m.count} causas
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Productividad ────────────────────────────────────────────────────────────

function normalizeRut(r: string): string {
  return (r || "").replace(/[.\-\s]/g, "").toLowerCase();
}

/** Lawyer-scoped view: a lawyer sees ONLY their own productivity (no team ranking). */
function MiProductividad({ mine, name }: { mine?: FirmLawyerItem; name: string }) {
  const kicker: CSSProperties = {
    fontSize: 12, color: "var(--fj-ink3)", textTransform: "uppercase",
    letterSpacing: "0.08em", marginBottom: 4,
  };
  const semaforo = [
    { label: "Crítico", n: mine?.rojo ?? 0, bg: "var(--fj-rojo-soft)", c: "var(--fj-rojo)" },
    { label: "Atención", n: mine?.amarillo ?? 0, bg: "var(--fj-amarillo-soft)", c: "var(--fj-amarillo)" },
    { label: "Al día", n: mine?.verde ?? 0, bg: "var(--fj-verde-soft)", c: "var(--fj-verde)" },
  ];
  return (
    <div style={{ padding: "32px 40px", fontFamily: "var(--fj-body)" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={kicker}>Mi productividad</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--fj-heading)", margin: 0, color: "var(--fj-ink)" }}>
          {name}
        </h1>
      </div>
      {!mine ? (
        <Card pad={40} style={{ textAlign: "center", color: "var(--fj-ink3)", fontSize: 14 }}>
          Todavía no tenés causas asignadas.
        </Card>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            <Card pad={20}><KPI label="Mis causas" value={mine.case_count} /></Card>
            <Card pad={20} style={mine.rojo > 0 ? { background: "var(--fj-rojo-soft)" } : undefined}>
              <KPI label="En rojo" value={mine.rojo} />
            </Card>
            <Card pad={20}><KPI label="Estancadas" value={mine.stale} /></Card>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {semaforo.map((x) => (
              <Card key={x.label} pad={20} style={{ background: x.bg }}>
                <div style={{ fontFamily: "var(--fj-heading)", fontSize: 32, fontWeight: 600, color: x.c, fontVariantNumeric: "tabular-nums" }}>
                  {x.n}
                </div>
                <div style={{ fontSize: 13, color: "var(--fj-ink2)", marginTop: 4 }}>{x.label}</div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Productividad() {
  const [tab, setTab] = useState<TabId>("equipo");
  const { data: stats, isLoading } = useFirmStats();
  const { data: me, isLoading: meLoading } = useMe();

  if (isLoading || meLoading || !stats || !me) {
    return <Splash inline label="Cargando productividad" />;
  }

  // Lawyers see only their own productivity; admins see the firm-wide analysis.
  if (me.role !== "admin") {
    const mine = stats.by_lawyer.find((l) => normalizeRut(l.rut) === normalizeRut(me.rut));
    return <MiProductividad mine={mine} name={me.name} />;
  }

  return (
    <div style={{ padding: "32px 40px", fontFamily: "var(--fj-body)" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 12,
            color: "var(--fj-ink3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          Análisis del estudio
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
          Productividad
        </h1>
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
          <KPI label="Causas activas" value={stats.totals.cases} />
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
          <KPI label="Causas estancadas" value={stats.totals.stale} />
        </Card>
        <Card pad={20}>
          <KPI label="Abogados" value={stats.by_lawyer.length} />
        </Card>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--fj-line)",
          marginBottom: 24,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontFamily: "var(--fj-body)",
              fontWeight: tab === t.id ? 600 : 400,
              color:
                tab === t.id ? "var(--fj-primary)" : "var(--fj-ink2)",
              background: "none",
              border: "none",
              borderBottom:
                tab === t.id
                  ? "2px solid var(--fj-primary)"
                  : "2px solid transparent",
              cursor: "pointer",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "equipo" && <RankingEquipo data={stats.by_lawyer} />}
      {tab === "materias" && <MateriasPanel data={stats.totals.by_materia} />}
    </div>
  );
}
