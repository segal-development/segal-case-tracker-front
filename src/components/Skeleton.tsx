import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: number;
  style?: CSSProperties;
}

/**
 * Shimmer skeleton block — token-driven, adapts to active palette / dark mode.
 * Use while async data is loading to avoid layout shift and false "0" values.
 */
export function Skeleton({ width = "100%", height = 16, radius = 6, style }: SkeletonProps) {
  return (
    <div
      aria-hidden
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundImage:
          "linear-gradient(90deg, var(--fj-panel2) 25%, var(--fj-line) 50%, var(--fj-panel2) 75%)",
        backgroundSize: "400% 100%",
        animation: "fj-shimmer 1.6s ease-in-out infinite",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
