import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { Card } from "@/components/primitives/Card";
import { Skeleton } from "@/components/Skeleton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function ProyeccionProductividad({ actual, proyeccion, meta, isLoading }: {
  actual: number;
  proyeccion: number;
  meta: number | null;
  isLoading: boolean;
}) {
  // Monthly target (meta) is configured by the administrator (Admin → Metas).
  const pct = meta != null && meta > 0 ? Math.min(100, Math.round((proyeccion / meta) * 100)) : 0;
  const onTrack = meta != null ? proyeccion >= meta : null;
  const accent = onTrack ? "#3a8a5e" : "#b08214"; // fj-verde / fj-amarillo (canvas needs a concrete color)
  const ink = cssVar("--fj-ink", "#0a0e1a");
  const ink3 = cssVar("--fj-ink3", "#6b7686");
  const chartData = {
    labels: ["Este mes", "Proyección", "Meta"],
    datasets: [
      {
        data: [actual, proyeccion, meta ?? 0],
        backgroundColor: [accent, `${accent}99`, "#cabfb0"],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 64,
      },
    ],
  };
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 22 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(10,14,26,0.92)",
        titleColor: "#ffffff",
        bodyColor: "#e6e8ee",
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        titleFont: { family: cssVar("--fj-heading", "Georgia, serif"), size: 13 },
        bodyFont: { size: 13 },
        callbacks: {
          title: (items: any) => items[0]?.label ?? "",
          label: (ctx: any) => `${ctx.parsed.y} causas`,
        },
      },
      datalabels: {
        anchor: "end",
        align: "end",
        offset: 2,
        color: ink,
        font: { family: cssVar("--fj-heading", "Georgia, serif"), size: 17, weight: 600 },
        formatter: (v: number) => v,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: ink3, font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grace: "12%",
        border: { display: false },
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: ink3, font: { size: 11 }, maxTicksLimit: 6, padding: 6 },
      },
    },
  };

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
            {/* Comparative bars (Chart.js): este mes / proyección / meta */}
            <div style={{ height: 210, marginTop: 4 }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div style={{ marginTop: 8, textAlign: "center", fontSize: 13, fontWeight: 600, color: accent }}>
              {onTrack ? `✓ En camino a la meta · ${pct}%` : `Por debajo de la meta · ${pct}%`}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
