import { SDMark } from "@/components/primitives/SDMark";

interface WordmarkProps {
  size?: number;
}

export function Wordmark({ size = 24 }: WordmarkProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <SDMark size={size} />
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span
          style={{
            fontFamily: "var(--fj-heading)",
            fontWeight: 500,
            fontSize: size * 0.75,
            color: "var(--fj-ink)",
            letterSpacing: "-.01em",
            lineHeight: 1.1,
          }}
        >
          Segal Deudores
        </span>
        <span
          style={{
            fontFamily: "var(--fj-body)",
            fontWeight: 600,
            fontSize: size * 0.35,
            color: "var(--fj-ink3)",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          DEFENSA LEGAL
        </span>
      </div>
    </div>
  );
}
