import type { CSSProperties, ReactNode } from "react";

interface SectionHProps {
  title: string;
  kicker?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

export function SectionH({ title, kicker, action, style }: SectionHProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 14,
        ...style,
      }}
    >
      <div>
        {kicker && (
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 10.5,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--fj-ink3)",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            {kicker}
          </div>
        )}
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--fj-heading)",
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: "-.01em",
            color: "var(--fj-ink)",
          }}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
