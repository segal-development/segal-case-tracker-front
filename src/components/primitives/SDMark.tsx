interface SDMarkProps {
  size?: number;
}

export function SDMark({ size = 24 }: SDMarkProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--fj-heading)",
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-.02em",
      }}
    >
      <span style={{ color: "var(--fj-accent)" }}>S</span>
      <span style={{ color: "var(--fj-primary)", marginLeft: `${-size * 0.18}px` }}>D</span>
    </span>
  );
}
