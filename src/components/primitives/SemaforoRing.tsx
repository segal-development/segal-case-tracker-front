import { Flag } from "lucide-react";

export type SemaforoStatus = "rojo" | "amarillo" | "verde" | "gris" | null;
export type SemaforoVariant = "ring" | "dot" | "bar" | "flag";

interface SemaforoRingProps {
  status: SemaforoStatus;
  size?: number;
  label?: string;
  variant?: SemaforoVariant;
}

const STATUS_MAP = {
  rojo:     { color: "var(--fj-rojo)",     soft: "var(--fj-rojo-soft)",     arc: 0.20, txt: "Crítico" },
  amarillo: { color: "var(--fj-amarillo)", soft: "var(--fj-amarillo-soft)", arc: 0.55, txt: "Atención" },
  verde:    { color: "var(--fj-verde)",    soft: "var(--fj-verde-soft)",    arc: 0.92, txt: "Al día" },
  // Indeterminate (backend "gris"): case IS tracked but no actionable deadline
  // could be determined from its movements. Solid gray center dot (arc 0) so it
  // reads as a defined state, not a broken/empty ring.
  gris:     { color: "var(--fj-ink3)",     soft: "var(--fj-line)",          arc: 0,    txt: "Sin plazo accionable" },
} as const;

/** Neutral config used when status is null — "sin seguimiento de plazos". */
const NEUTRAL = {
  color: "var(--fj-ink3)" as string,
  soft: "var(--fj-line)" as string,
  txt: "Sin seguimiento de plazos",
} as const;

export function SemaforoRing({ status, size = 22, label, variant = "ring" }: SemaforoRingProps) {
  const isNeutral = status === null || status === undefined;
  const m = isNeutral ? null : STATUS_MAP[status];
  const color = m?.color ?? NEUTRAL.color;
  const soft  = m?.soft  ?? NEUTRAL.soft;
  const displayLabel = label ?? (m?.txt ?? NEUTRAL.txt);

  const r = size / 2 - 2;
  const c = 2 * Math.PI * r;

  if (variant === "dot") {
    return (
      <span
        title={displayLabel}
        aria-label={displayLabel}
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          // Neutral dots have no glow ring
          boxShadow: isNeutral ? "none" : `0 0 0 3px ${soft}`,
          opacity: isNeutral ? 0.45 : 1,
          flex: "0 0 auto",
        }}
      />
    );
  }

  if (variant === "bar") {
    return (
      <span
        title={displayLabel}
        aria-label={displayLabel}
        style={{
          display: "inline-block",
          width: 4,
          height: size,
          borderRadius: 2,
          background: isNeutral ? soft : color,
          opacity: isNeutral ? 0.5 : 1,
          flex: "0 0 auto",
        }}
      />
    );
  }

  if (variant === "flag") {
    return (
      <span
        title={displayLabel}
        aria-label={displayLabel}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          flex: "0 0 auto",
          opacity: isNeutral ? 0.4 : 1,
        }}
      >
        <Flag
          size={size - 4}
          strokeWidth={1.6}
          stroke={color}
          fill={isNeutral ? "none" : soft}
        />
      </span>
    );
  }

  // ring (default)
  // Neutral: hollow gray ring (only track, no arc, no center dot)
  return (
    <span
      title={displayLabel}
      aria-label={displayLabel}
      style={{ display: "inline-flex", flex: "0 0 auto", opacity: isNeutral ? 0.5 : 1 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={soft} strokeWidth="2.5"
        />
        {!isNeutral && m && (
          <>
            <circle
              cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke={color} strokeWidth="2.5"
              strokeDasharray={`${m.arc * c} ${c}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <circle cx={size / 2} cy={size / 2} r={r * 0.34} fill={color} />
          </>
        )}
      </svg>
    </span>
  );
}
