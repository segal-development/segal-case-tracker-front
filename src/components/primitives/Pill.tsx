import type { CSSProperties, ReactNode } from "react";

type PillTone = "neutral" | "primary" | "rojo" | "amarillo" | "verde";

interface PillProps {
  children: ReactNode;
  tone?: PillTone;
  subtle?: boolean;
  style?: CSSProperties;
}

const TONE_COLORS: Record<PillTone, { bg: string; fg: string }> = {
  neutral:  { bg: "var(--fj-panel2)",         fg: "var(--fj-ink2)" },
  primary:  { bg: "var(--fj-primary-soft)",    fg: "var(--fj-primary)" },
  rojo:     { bg: "var(--fj-rojo-soft)",       fg: "var(--fj-rojo)" },
  amarillo: { bg: "var(--fj-amarillo-soft)",   fg: "var(--fj-amarillo)" },
  verde:    { bg: "var(--fj-verde-soft)",      fg: "var(--fj-verde)" },
};

export function Pill({ children, tone = "neutral", subtle = false, style }: PillProps) {
  const c = TONE_COLORS[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px",
        borderRadius: 999,
        fontFamily: "var(--fj-body)",
        fontSize: 11.5,
        fontWeight: 500,
        letterSpacing: ".01em",
        whiteSpace: "nowrap",
        background: subtle ? "transparent" : c.bg,
        color: c.fg,
        border: subtle ? "1px solid var(--fj-line)" : "none",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
