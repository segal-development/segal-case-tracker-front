import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  pad?: number;
  elevated?: boolean;
  onClick?: () => void;
}

export function Card({ children, style, pad = 18, elevated = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--fj-panel)",
        border: "1px solid var(--fj-line)",
        borderRadius: 12,
        padding: pad,
        cursor: onClick ? "pointer" : undefined,
        boxShadow: elevated
          ? "0 1px 0 rgba(255,255,255,.7) inset, 0 4px 14px rgba(15,22,38,.06)"
          : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
