import type { CSSProperties, MouseEvent, ReactNode } from "react";

type BtnKind = "primary" | "secondary" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps {
  children?: ReactNode;
  kind?: BtnKind;
  size?: BtnSize;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  style?: CSSProperties;
  disabled?: boolean;
}

const SIZE_MAP: Record<BtnSize, { h: number; px: number; fs: number }> = {
  sm: { h: 28, px: 10, fs: 12.5 },
  md: { h: 34, px: 14, fs: 13 },
  lg: { h: 44, px: 18, fs: 14 },
};

const KIND_MAP: Record<BtnKind, { bg: string; fg: string; bd: string; sh: string }> = {
  primary:   { bg: "var(--fj-primary)",      fg: "var(--fj-primary-ink)", bd: "transparent",         sh: "inset 0 -1px 0 rgba(0,0,0,.18), 0 1px 2px rgba(15,22,38,.16)" },
  secondary: { bg: "var(--fj-panel)",         fg: "var(--fj-ink)",         bd: "var(--fj-line-strong)", sh: "0 1px 1px rgba(0,0,0,.03)" },
  ghost:     { bg: "transparent",             fg: "var(--fj-ink2)",        bd: "transparent",         sh: "none" },
  danger:    { bg: "var(--fj-rojo-soft)",     fg: "var(--fj-rojo)",        bd: "transparent",         sh: "none" },
};

export function Btn({ children, kind = "ghost", size = "md", onClick, icon, style, disabled }: BtnProps) {
  const s = SIZE_MAP[size];
  const k = KIND_MAP[kind];

  function handleMouseEnter(e: MouseEvent<HTMLButtonElement>) {
    if (kind === "ghost") e.currentTarget.style.background = "var(--fj-panel2)";
  }
  function handleMouseLeave(e: MouseEvent<HTMLButtonElement>) {
    if (kind === "ghost") e.currentTarget.style.background = "transparent";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.fs,
        background: k.bg,
        color: k.fg,
        border: `1px solid ${k.bd}`,
        borderRadius: 8,
        fontFamily: "var(--fj-body)",
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: k.sh,
        letterSpacing: ".005em",
        opacity: disabled ? 0.55 : 1,
        whiteSpace: "nowrap",
        flex: "0 0 auto",
        transition: "background .12s ease, transform .08s ease",
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
