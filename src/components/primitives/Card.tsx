import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  pad?: number;
  elevated?: boolean;
}

export function Card({ children, style, pad = 18, elevated = false }: CardProps) {
  return (
    <div
      style={{
        background: "var(--fj-panel)",
        border: "1px solid var(--fj-line)",
        borderRadius: 12,
        padding: pad,
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
