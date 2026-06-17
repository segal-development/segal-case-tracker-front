import { Spinner } from "@/components/Spinner";

interface SplashProps {
  label?: string;
  /** Fill the parent instead of the whole viewport (for in-page loading). */
  inline?: boolean;
}

/**
 * Full-screen loading splash (mirrors the static `#fj-splash` in index.html).
 * Used as the Suspense fallback / loading boundary, and inline for screens that
 * are entirely loading. Token-driven (adapts to palette + dark mode).
 */
export function Splash({ label = "Cargando gestión judicial", inline = false }: SplashProps) {
  return (
    <div
      style={{
        position: inline ? "relative" : "fixed",
        inset: inline ? undefined : 0,
        minHeight: inline ? "60vh" : undefined,
        width: "100%",
        zIndex: inline ? undefined : 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        background: "var(--fj-paper)",
      }}
    >
      <Spinner size={56} mark label={label} />
      <div
        style={{
          fontFamily: "var(--fj-body)",
          fontSize: 12.5,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--fj-ink3)",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}
