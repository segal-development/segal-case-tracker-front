import type { CSSProperties, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Pill } from "@/components/primitives/Pill";
import { Card } from "@/components/primitives/Card";
import { Btn } from "@/components/primitives/Btn";
import { SectionH } from "@/components/primitives/SectionH";
import { Splash } from "@/components/Splash";
import { fmtDate } from "@/lib/format";
import { useNovedades } from "@/novedades/useNovedades";

const pageCss: CSSProperties = {
  padding: "36px 40px 56px",
  maxWidth: 1320,
  margin: "0 auto",
};

export function Novedades() {
  const navigate = useNavigate();
  const { novedades, count, markAllSeen, isLoading } = useNovedades();

  if (isLoading) {
    return <Splash inline label="Cargando novedades" />;
  }

  return (
    <div style={pageCss}>
      <SectionH
        title="Novedades"
        kicker="Actividad reciente"
        action={
          count > 0 ? (
            <Btn
              kind="secondary"
              size="sm"
              icon={<Bell size={13} strokeWidth={1.8} />}
              onClick={markAllSeen}
            >
              Marcar todo como visto
            </Btn>
          ) : undefined
        }
        style={{ marginBottom: 24 }}
      />

      {count === 0 ? (
        <Card pad={40} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
          <div style={{
            fontFamily: "var(--fj-body)",
            fontSize: 15,
            color: "var(--fj-ink2)",
            fontWeight: 500,
          }}>
            Sin novedades — estás al día.
          </div>
          <div style={{
            fontFamily: "var(--fj-body)",
            fontSize: 13,
            color: "var(--fj-ink3)",
            marginTop: 6,
          }}>
            Acá verás los casos con nuevas actuaciones desde tu última visita.
          </div>
        </Card>
      ) : (
        <Card pad={0} style={{ overflow: "hidden" }}>
          {novedades.map((nov, idx) => {
            const { causa, ultima, isNew } = nov;
            const isLast = idx === novedades.length - 1;
            return (
              <button
                key={causa.id}
                onClick={() => navigate(`/causas/${causa.id}`)}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.background = "var(--fj-panel2)";
                }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.background = "transparent";
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  padding: "14px 18px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: isLast ? "none" : "1px solid var(--fj-line)",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: 0,
                }}
              >
                <SemaforoRing status={causa.semaforo} size={22} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                    <span style={{
                      fontFamily: "var(--fj-mono, monospace)",
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: "var(--fj-ink2)",
                      flexShrink: 0,
                    }}>
                      {causa.rol}
                    </span>
                    <span style={{
                      fontFamily: "var(--fj-body)",
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "var(--fj-ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {causa.caratula}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--fj-body)",
                      fontSize: 12,
                      color: "var(--fj-ink3)",
                    }}>
                      Última actuación: {fmtDate(ultima)}
                    </span>
                    {causa.procedural_state && (
                      <span style={{
                        fontFamily: "var(--fj-body)",
                        fontSize: 11.5,
                        color: "var(--fj-ink3)",
                        padding: "1px 7px",
                        borderRadius: 4,
                        background: "var(--fj-panel2)",
                        border: "1px solid var(--fj-line)",
                        lineHeight: 1.5,
                      }}>
                        {causa.procedural_state}
                      </span>
                    )}
                  </div>
                </div>

                {isNew && (
                  <Pill tone="primary" style={{ fontSize: 10.5, padding: "1px 7px", flexShrink: 0 }}>
                    nuevo
                  </Pill>
                )}
              </button>
            );
          })}
        </Card>
      )}
    </div>
  );
}
