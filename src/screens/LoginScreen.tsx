import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { Wordmark } from "@/components/primitives/Wordmark";
import { Btn } from "@/components/primitives/Btn";
import { Pill } from "@/components/primitives/Pill";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { SEMAFORO } from "@/data/mock";
import { login } from "@/lib/api";

interface LoginScreenProps {
  onLogin: () => void;
}

function SubtleGrid() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth=".5" />
        </pattern>
        <radialGradient id="rg" cx="20%" cy="20%" r="80%">
          <stop offset="0%" stopColor="white" stopOpacity=".4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#rg)" />
    </svg>
  );
}

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        display: "flex", justifyContent: "space-between",
        fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink2)", fontWeight: 500,
      }}>
        <span>{label}</span>
        {right}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  height: 44, padding: "0 14px", width: "100%", boxSizing: "border-box",
  background: "var(--fj-panel)", border: "1px solid var(--fj-line-strong)",
  borderRadius: 9, fontFamily: "var(--fj-body)", fontSize: 14,
  color: "var(--fj-ink)", outline: "none",
};

const linkStyle: React.CSSProperties = {
  color: "var(--fj-primary)", textDecoration: "none",
  fontFamily: "var(--fj-body)", fontSize: 12.5, fontWeight: 500,
  background: "none", border: "none", cursor: "pointer", padding: 0,
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Real firm semáforo counts (public, no-auth). Starts with the static values as
  // a fallback so the marquee NEVER breaks if the endpoint is slow or unavailable.
  const [sem, setSem] = useState({ rojo: SEMAFORO.rojo, amarillo: SEMAFORO.amarillo, verde: SEMAFORO.verde });
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE as string;
    fetch(`${base}/stats/public-overview`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.rojo === "number") {
          setSem({ rojo: d.rojo, amarillo: d.amarillo, verde: d.verde });
        }
      })
      .catch(() => { /* keep the fallback values */ });
  }, []);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!email.includes("@")) { setErr("Ingresa un correo válido"); return; }
    if (pwd.length < 4)       { setErr("La contraseña es demasiado corta"); return; }
    setErr("");
    setLoading(true);
    try {
      await login(email, pwd);
      onLogin(); // component unmounts on navigate — no setLoading(false) on success
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error al iniciar sesión");
      setLoading(false);
    }
  };

  const semaforoItems = [
    { s: "rojo" as const,     n: sem.rojo,     t: "Crítico"  },
    { s: "amarillo" as const, n: sem.amarillo, t: "Atención" },
    { s: "verde" as const,    n: sem.verde,    t: "Al día"   },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1.05fr",
      background: "var(--fj-paper)",
    }}>
      {/* Left: form */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "56px 72px",
      }}>
        <Wordmark size={28} />

        <form onSubmit={submit} style={{ maxWidth: 380, width: "100%", alignSelf: "center" }}>
          <div style={{
            fontFamily: "var(--fj-body)", fontSize: 11, letterSpacing: ".14em",
            textTransform: "uppercase", color: "var(--fj-ink3)", fontWeight: 600, marginBottom: 14,
          }}>
            Acceso al estudio
          </div>
          <h1 style={{
            margin: 0, fontFamily: "var(--fj-heading)", fontWeight: 500,
            fontSize: 38, letterSpacing: "-.015em", color: "var(--fj-ink)", lineHeight: 1.05,
          }}>
            Bienvenida<br />de vuelta.
          </h1>
          <p style={{
            fontFamily: "var(--fj-body)", fontSize: 14, color: "var(--fj-ink2)",
            marginTop: 14, lineHeight: 1.5, maxWidth: 320,
          }}>
            Continúa tu trabajo con las causas y plazos del estudio.
          </p>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Correo electrónico">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abogado@estudio.cl"
                style={inputStyle}
                autoFocus
              />
            </Field>
            <Field
              label="Contraseña"
              right={
                <button type="button" style={linkStyle}>¿Olvidaste?</button>
              }
            >
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </Field>

            {err && (
              <div style={{
                background: "var(--fj-rojo-soft)", color: "var(--fj-rojo)",
                padding: "10px 12px", borderRadius: 8,
                fontFamily: "var(--fj-body)", fontSize: 12.5,
                display: "flex", gap: 8, alignItems: "center",
              }}>
                <X size={14} strokeWidth={1.8} />
                {err}
              </div>
            )}

            <Btn
              kind="primary"
              size="lg"
              onClick={() => submit()}
              style={{ marginTop: 6, justifyContent: "center", width: "100%" }}
            >
              {loading ? "Verificando…" : "Iniciar sesión"}
            </Btn>

            <div style={{
              fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)",
              textAlign: "center", marginTop: 8,
            }}>
              ¿Problemas para acceder?{" "}
              <button type="button" style={linkStyle}>Contacta al admin del estudio</button>
            </div>
          </div>
        </form>

        <div style={{
          fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>© 2026 Segal Deudores</span>
          <span>Términos · Privacidad · Soporte</span>
        </div>
      </div>

      {/* Right: editorial */}
      <div style={{
        background: "var(--fj-primary)", color: "var(--fj-primary-ink)",
        position: "relative", overflow: "hidden", padding: 56,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <SubtleGrid />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Pill
            tone="neutral"
            style={{
              background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.92)",
              border: "1px solid rgba(255,255,255,.18)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#cfe6d3" }} />
            Sistema operativo · sin incidencias
          </Pill>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
          <div style={{
            fontFamily: "var(--fj-heading)", fontWeight: 500,
            fontSize: 40, letterSpacing: "-.012em", lineHeight: 1.1,
          }}>
            "Cada plazo<br />es una promesa<br />al cliente."
          </div>
          <div style={{
            marginTop: 24, fontFamily: "var(--fj-body)", fontSize: 13,
            opacity: 0.8, letterSpacing: ".01em",
          }}>
            — Manual interno del estudio
          </div>
        </div>

        {/* Semáforo strip */}
        <div style={{
          position: "relative", zIndex: 1,
          background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)",
          borderRadius: 12, padding: 16, backdropFilter: "blur(6px)",
        }}>
          <div style={{
            fontFamily: "var(--fj-body)", fontSize: 11, letterSpacing: ".14em",
            textTransform: "uppercase", opacity: 0.7, fontWeight: 600, marginBottom: 12,
          }}>
            El estudio hoy
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {semaforoItems.map((x) => (
              <div key={x.s} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <SemaforoRing status={x.s} size={26} />
                <div style={{
                  fontFamily: "var(--fj-heading)", fontSize: 28, fontWeight: 500,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {x.n}
                </div>
                <div style={{ fontFamily: "var(--fj-body)", fontSize: 12, opacity: 0.75 }}>
                  {x.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
