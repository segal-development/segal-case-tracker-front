import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Pill } from "@/components/primitives/Pill";
import { Btn } from "@/components/primitives/Btn";
import { Card } from "@/components/primitives/Card";
import { SectionH } from "@/components/primitives/SectionH";
import { KPI } from "@/components/primitives/KPI";
import { Sparkline } from "@/components/primitives/Sparkline";
import { Wordmark } from "@/components/primitives/Wordmark";
import { SDMark } from "@/components/primitives/SDMark";
import { useTheme } from "@/theme/ThemeProvider";
import type { Palette, Density, FontSet } from "@/theme/ThemeProvider";
import { Plus, Download } from "lucide-react";
import type { ReactNode } from "react";

const SPARK_DATA = [12, 18, 14, 22, 19, 28, 24, 30, 26, 35];

const PALETTES: Palette[] = ["segal", "tribunal", "toga", "notario", "codex"];
const DENSITIES: Density[] = ["compact", "regular", "comfortable"];
const FONT_SETS: FontSet[] = ["classic", "contemporary", "grotesk"];

const AVATAR_SAMPLES = [
  { iniciales: "MA", color: "#1e4dbb", nombre: "María Alvarado" },
  { iniciales: "JR", color: "#3a8a5e", nombre: "Juan Reyes" },
  { iniciales: "CV", color: "#b08214", nombre: "Claudia Vidal" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: "var(--fj-body)", fontSize: 10.5, fontWeight: 600,
        letterSpacing: ".14em", textTransform: "uppercase", color: "var(--fj-ink3)", marginBottom: 12,
      }}>
        {title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

export function Showcase() {
  const { palette, setPalette, dark, toggleDark, density, setDensity, fontSet, setFontSet } = useTheme();

  return (
    <div style={{ minHeight: "100vh", background: "var(--fj-paper)", padding: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <Wordmark size={28} />
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Btn kind="ghost" size="sm" onClick={toggleDark}>
            {dark ? "☀ Light" : "☾ Dark"}
          </Btn>
        </div>
      </div>

      {/* Controls */}
      <Card pad={20} style={{ marginBottom: 40 }}>
        <SectionH kicker="Theme Controls" title="Foundation Controls" style={{ marginBottom: 20 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fj-ink3)", marginBottom: 8 }}>Palette</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PALETTES.map((p) => (
                <Btn key={p} kind={palette === p ? "primary" : "secondary"} size="sm" onClick={() => setPalette(p)}>
                  {p}
                </Btn>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fj-ink3)", marginBottom: 8 }}>Density</div>
            <div style={{ display: "flex", gap: 6 }}>
              {DENSITIES.map((d) => (
                <Btn key={d} kind={density === d ? "primary" : "secondary"} size="sm" onClick={() => setDensity(d)}>
                  {d}
                </Btn>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fj-ink3)", marginBottom: 8 }}>Font Set</div>
            <div style={{ display: "flex", gap: 6 }}>
              {FONT_SETS.map((f) => (
                <Btn key={f} kind={fontSet === f ? "primary" : "secondary"} size="sm" onClick={() => setFontSet(f)}>
                  {f}
                </Btn>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Semáforo */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Semáforo" title="Status Indicators" style={{ marginBottom: 20 }} />

        <Section title="Ring (default)">
          {(["rojo", "amarillo", "verde"] as const).map((s) => (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <SemaforoRing status={s} />
              <span style={{ fontSize: 11, color: "var(--fj-ink3)" }}>{s} / 22px</span>
            </div>
          ))}
          {(["rojo", "amarillo", "verde"] as const).map((s) => (
            <div key={`${s}-32`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <SemaforoRing status={s} size={32} />
              <span style={{ fontSize: 11, color: "var(--fj-ink3)" }}>{s} / 32px</span>
            </div>
          ))}
        </Section>

        <Section title="Dot">
          {(["rojo", "amarillo", "verde"] as const).map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SemaforoRing status={s} variant="dot" />
              <span style={{ fontSize: 12, color: "var(--fj-ink2)" }}>{s}</span>
            </div>
          ))}
        </Section>

        <Section title="Bar">
          {(["rojo", "amarillo", "verde"] as const).map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SemaforoRing status={s} variant="bar" size={28} />
              <span style={{ fontSize: 12, color: "var(--fj-ink2)" }}>{s}</span>
            </div>
          ))}
        </Section>

        <Section title="Flag">
          {(["rojo", "amarillo", "verde"] as const).map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SemaforoRing status={s} variant="flag" size={22} />
              <span style={{ fontSize: 12, color: "var(--fj-ink2)" }}>{s}</span>
            </div>
          ))}
        </Section>
      </Card>

      {/* Avatars */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Avatars" title="Avatars" style={{ marginBottom: 20 }} />
        <Section title="Sizes">
          {AVATAR_SAMPLES.map((a) => (
            <Avatar key={a.iniciales} {...a} size={28} />
          ))}
          {AVATAR_SAMPLES.map((a) => (
            <Avatar key={`${a.iniciales}-40`} {...a} size={40} />
          ))}
          {AVATAR_SAMPLES.map((a) => (
            <Avatar key={`${a.iniciales}-56`} {...a} size={56} />
          ))}
        </Section>
      </Card>

      {/* Pills */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Pills" title="Pills" style={{ marginBottom: 20 }} />
        <Section title="Filled">
          {(["neutral", "primary", "rojo", "amarillo", "verde"] as const).map((t) => (
            <Pill key={t} tone={t}>{t}</Pill>
          ))}
        </Section>
        <Section title="Subtle">
          {(["neutral", "primary", "rojo", "amarillo", "verde"] as const).map((t) => (
            <Pill key={t} tone={t} subtle>{t} subtle</Pill>
          ))}
        </Section>
      </Card>

      {/* Buttons */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Buttons" title="Buttons" style={{ marginBottom: 20 }} />
        <Section title="Kinds">
          <Btn kind="primary">Primary</Btn>
          <Btn kind="secondary">Secondary</Btn>
          <Btn kind="ghost">Ghost</Btn>
          <Btn kind="danger">Danger</Btn>
          <Btn kind="primary" disabled>Disabled</Btn>
        </Section>
        <Section title="Sizes">
          <Btn kind="primary" size="sm">Small</Btn>
          <Btn kind="primary" size="md">Medium</Btn>
          <Btn kind="primary" size="lg">Large</Btn>
        </Section>
        <Section title="With Icons">
          <Btn kind="primary" icon={<Plus size={15} strokeWidth={1.6} />}>Nueva Causa</Btn>
          <Btn kind="secondary" icon={<Download size={15} strokeWidth={1.6} />}>Exportar</Btn>
        </Section>
      </Card>

      {/* Cards */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Cards" title="Cards" style={{ marginBottom: 20 }} />
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card pad={16} style={{ flex: "1 1 200px", minWidth: 200 }}>
            <div style={{ fontSize: 13, color: "var(--fj-ink2)" }}>Default card</div>
          </Card>
          <Card pad={16} elevated style={{ flex: "1 1 200px", minWidth: 200 }}>
            <div style={{ fontSize: 13, color: "var(--fj-ink2)" }}>Elevated card</div>
          </Card>
        </div>
      </Card>

      {/* KPI */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="KPI" title="Key Performance Indicators" style={{ marginBottom: 20 }} />
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <KPI label="Causas Activas" value="142" sub="Actualizadas hoy" trend={12} spark={<Sparkline data={SPARK_DATA} />} />
          <KPI label="Plazos Críticos" value="7" sub="Vencen en 3 días" trend={-5} />
          <KPI label="Monto Total" value="$48M" sub="CLP en seguimiento" />
          <KPI label="Al día" value="89%" trend={3} />
        </div>
      </Card>

      {/* Sparkline standalone */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Sparkline" title="Sparklines" style={{ marginBottom: 20 }} />
        <Section title="Variations">
          <Sparkline data={SPARK_DATA} />
          <Sparkline data={SPARK_DATA} color="var(--fj-verde)" w={160} h={40} />
          <Sparkline data={[35, 28, 20, 15, 10, 8, 12, 18, 14, 9]} color="var(--fj-rojo)" fillSoft={false} />
        </Section>
      </Card>

      {/* Section Header */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Section Headers" title="Section Headers" style={{ marginBottom: 20 }} />
        <SectionH kicker="Expedientes" title="Causas en seguimiento" action={<Btn kind="primary" size="sm">+ Nueva</Btn>} />
        <SectionH title="Sin kicker" />
      </Card>

      {/* Wordmark + SDMark */}
      <Card pad={20} style={{ marginBottom: 24 }}>
        <SectionH kicker="Brand" title="Brand" style={{ marginBottom: 20 }} />
        <Section title="SDMark">
          <SDMark size={16} />
          <SDMark size={24} />
          <SDMark size={36} />
          <SDMark size={48} />
        </Section>
        <Section title="Wordmark">
          <Wordmark size={20} />
          <Wordmark size={28} />
          <Wordmark size={36} />
        </Section>
      </Card>
    </div>
  );
}
