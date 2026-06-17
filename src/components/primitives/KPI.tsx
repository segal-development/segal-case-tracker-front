import type { CSSProperties, ReactNode } from "react";

interface KPIProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  spark?: ReactNode;
  style?: CSSProperties;
}

export function KPI({ label, value, sub, trend, spark, style }: KPIProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <div
        style={{
          fontFamily: "var(--fj-body)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: ".12em",
          color: "var(--fj-ink3)",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div
          style={{
            fontFamily: "var(--fj-heading)",
            fontWeight: 500,
            fontSize: 36,
            letterSpacing: "-.02em",
            color: "var(--fj-ink)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {trend != null && (
          <span
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 12,
              fontWeight: 600,
              color: trend >= 0 ? "var(--fj-verde)" : "var(--fj-rojo)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && (
        <div style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)" }}>
          {sub}
        </div>
      )}
      {spark && <div style={{ marginTop: 4 }}>{spark}</div>}
    </div>
  );
}
