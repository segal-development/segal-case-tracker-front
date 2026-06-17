interface SpinnerProps {
  /** Bounding box in px (border width scales with it). */
  size?: number;
  /** Show the "SD" monogram in the center (splash style). */
  mark?: boolean;
  label?: string;
}

/**
 * Cobalt ring spinner — the `#fj-splash` design, token-driven so it adapts to
 * the active palette / dark mode. Reused for any async (TanStack Query) state.
 */
export function Spinner({ size = 56, mark = false, label = "Cargando" }: SpinnerProps) {
  const border = Math.max(2, Math.round(size / 14)); // 56 → 4px
  return (
    <div
      role="status"
      aria-label={label}
      style={{ position: "relative", width: size, height: size }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${border}px solid var(--fj-line)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${border}px solid transparent`,
          borderTopColor: "var(--fj-primary)",
          animation: "fj-rot .8s linear infinite",
        }}
      />
      {mark && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--fj-body)",
            fontWeight: 600,
            fontSize: Math.round(size * 0.27),
            letterSpacing: ".04em",
            color: "var(--fj-primary)",
          }}
        >
          SD
        </div>
      )}
    </div>
  );
}
