import type { CSSProperties } from "react";

/**
 * Visual stepper of the juicio-ejecutivo procedural flow (CPC · Ley 21.394),
 * mirroring the Procedimiento Ejecutivo flowchart. Highlights where the case
 * currently sits and what comes next. Driven by the backend `procedural_state`.
 */

const STEPS: ReadonlyArray<{ key: string; label: string; art?: string }> = [
  { key: "mandamiento", label: "Mandamiento de ejecución", art: "art. 442" },
  { key: "notificado", label: "Notificación de la demanda", art: "art. 459" },
  { key: "excepciones", label: "Excepciones opuestas", art: "art. 464" },
  { key: "traslado_ejecutante", label: "Traslado al ejecutante", art: "art. 466" },
  { key: "admisibilidad", label: "Admisibilidad de excepciones", art: "art. 465" },
  { key: "auto_prueba", label: "Término probatorio", art: "art. 468" },
  { key: "citacion_sentencia", label: "Citación a oír sentencia", art: "art. 470" },
  { key: "sentencia", label: "Sentencia", art: "art. 470" },
  { key: "terminada", label: "Terminada" },
];

function fmt(d?: string | null): string | null {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return null;
  return dt.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const titleCss: CSSProperties = {
  fontWeight: 600, fontFamily: "var(--fj-heading)", fontSize: 16, marginBottom: 4,
};
const subCss: CSSProperties = {
  fontSize: 12, color: "var(--fj-ink3)", marginBottom: 18,
};
const noteCss: CSSProperties = {
  fontSize: 13, color: "var(--fj-ink2)", lineHeight: 1.5,
};

export function ProcesoStepper({
  state,
  nextDeadlineAt,
  fatal,
  apremio,
}: {
  state?: string | null;
  nextDeadlineAt?: string | null;
  fatal?: boolean;
  apremio?: boolean;
}) {
  const idx = STEPS.findIndex((s) => s.key === state);
  const deadline = fmt(nextDeadlineAt);

  let body: React.ReactNode;

  if (state === "rebelde") {
    body = (
      <p style={noteCss}>
        <strong>Rebeldía — sin oposición.</strong> El deudor no opuso excepciones en plazo:
        el mandamiento de ejecución y embargo hace las veces de sentencia definitiva y se
        continúa directamente con el <strong>cuaderno de apremio</strong> (art. 472 CPC).
      </p>
    );
  } else if (idx < 0) {
    body = (
      <p style={noteCss}>
        {state === "indeterminate"
          ? "Etapa procesal indeterminada — sin plazo accionable determinable desde los movimientos."
          : "Etapa procesal aún no determinada — sin detalle sincronizado todavía."}
      </p>
    );
  } else {
    body = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {STEPS.map((step, i) => {
          const done = i < idx;
          const current = i === idx;
          const last = i === STEPS.length - 1;
          const circleColor = current
            ? "var(--fj-primary)"
            : done
            ? "var(--fj-ink3)"
            : "transparent";
          const borderColor = current || done ? circleColor : "var(--fj-line-strong)";
          return (
            <div key={step.key} style={{ display: "flex", gap: 12 }}>
              {/* rail */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    width: current ? 16 : 12,
                    height: current ? 16 : 12,
                    borderRadius: 999,
                    background: circleColor,
                    border: `2px solid ${borderColor}`,
                    boxShadow: current ? "0 0 0 3px var(--fj-primary-soft)" : "none",
                    flex: "0 0 auto",
                    marginTop: 2,
                  }}
                />
                {!last && (
                  <span
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: current ? 34 : 22,
                      background: done ? "var(--fj-ink3)" : "var(--fj-line)",
                    }}
                  />
                )}
              </div>
              {/* label */}
              <div style={{ paddingBottom: last ? 0 : 14 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: current ? 600 : 500,
                    color: current ? "var(--fj-ink)" : done ? "var(--fj-ink2)" : "var(--fj-ink3)",
                  }}
                >
                  {step.label}
                  {step.art && (
                    <span style={{ color: "var(--fj-ink3)", fontWeight: 400 }}> · {step.art}</span>
                  )}
                </div>
                {current && deadline && (
                  <div style={{ fontSize: 12, color: "var(--fj-primary)", marginTop: 2 }}>
                    Próximo plazo: {deadline}
                    {fatal && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: ".06em",
                          color: "#fff",
                          background: "var(--fj-rojo)",
                          borderRadius: 4,
                          padding: "1px 6px",
                        }}
                        title="Plazo fatal: vencerlo es irreversible (art. 459 / 475 CPC)"
                      >
                        PLAZO FATAL
                      </span>
                    )}
                  </div>
                )}
                {current && (
                  <div style={{ fontSize: 11, color: "var(--fj-ink3)", marginTop: 2 }}>
                    Etapa actual
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div style={titleCss}>Etapa del procedimiento</div>
      <div style={subCss}>Flujo del juicio ejecutivo · CPC · Ley 21.394</div>
      {body}
      {apremio && (
        <div style={{
          marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--fj-line)",
          fontSize: 13, color: "var(--fj-ink2)", lineHeight: 1.5,
        }}>
          <span style={{
            display: "inline-block", marginBottom: 6, fontSize: 10, fontWeight: 700,
            letterSpacing: ".06em", color: "var(--fj-amarillo)",
            background: "var(--fj-amarillo-soft)", borderRadius: 4, padding: "2px 7px",
          }}>CUADERNO DE APREMIO</span>
          <div>
            La causa está en <strong>fase de ejecución</strong> (embargo / realización de bienes).
            Revisá las actuaciones del cuaderno de apremio.
          </div>
        </div>
      )}
    </div>
  );
}
