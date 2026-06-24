import type { CSSProperties, ReactNode } from "react";

/**
 * Public presentation page (no auth) — explains, for management, how the
 * automatic PJUD case-monitoring works. Route: /como-funciona
 */

const wrap: CSSProperties = {
  fontFamily: "var(--fj-body)",
  color: "var(--fj-ink)",
  background: "var(--fj-panel)",
  minHeight: "100vh",
};
const section: CSSProperties = {
  maxWidth: 1040,
  margin: "0 auto",
  padding: "0 28px",
};
const kicker: CSSProperties = {
  fontFamily: "var(--fj-body)", fontSize: 12, letterSpacing: ".16em",
  textTransform: "uppercase", color: "var(--fj-ink3)", fontWeight: 600,
};
const h2: CSSProperties = {
  fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 28,
  letterSpacing: "-.01em", color: "var(--fj-ink)", margin: "0 0 8px",
};
const lead: CSSProperties = {
  fontSize: 16, lineHeight: 1.6, color: "var(--fj-ink2)",
};

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: "var(--fj-panel)", border: "1px solid var(--fj-line)",
      borderRadius: 14, padding: 22, boxShadow: "0 1px 2px rgba(15,22,38,.04)", ...style,
    }}>
      {children}
    </div>
  );
}

function FlowBox({ title, sub, tone }: { title: string; sub: string; tone: string }) {
  return (
    <div style={{
      flex: 1, minWidth: 150, background: "var(--fj-panel)",
      border: `1.5px solid ${tone}`, borderRadius: 12, padding: "16px 14px", textAlign: "center",
    }}>
      <div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 15, color: "var(--fj-ink)" }}>{title}</div>
      <div style={{ fontSize: 12.5, color: "var(--fj-ink3)", marginTop: 4, lineHeight: 1.45 }}>{sub}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ display: "flex", alignItems: "center", color: "var(--fj-ink3)", fontSize: 22, padding: "0 2px" }}>
      →
    </div>
  );
}

function Frente({ n, title, auto, desc, tone }: { n: string; title: string; auto: string; desc: string; tone: string }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{
          width: 26, height: 26, borderRadius: 8, background: tone, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--fj-heading)", fontWeight: 700, fontSize: 14, flexShrink: 0,
        }}>{n}</span>
        <span style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 16 }}>{title}</span>
      </div>
      <span style={{
        display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: ".04em",
        padding: "2px 9px", borderRadius: 999, marginBottom: 10,
        background: auto.startsWith("Automático") ? "var(--fj-verde-soft)" : "var(--fj-amarillo-soft)",
        color: auto.startsWith("Automático") ? "var(--fj-verde)" : "var(--fj-amarillo)",
      }}>{auto}</span>
      <div style={{ fontSize: 13.5, color: "var(--fj-ink2)", lineHeight: 1.55 }}>{desc}</div>
    </Card>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 34, color: "var(--fj-primary)", letterSpacing: "-.02em" }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--fj-ink3)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Check({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.55, color: "var(--fj-ink2)" }}>
      <span style={{ color: "var(--fj-verde)", fontWeight: 700, flexShrink: 0 }}>✓</span>
      <span>{children}</span>
    </div>
  );
}

export function ComoFunciona() {
  return (
    <div style={wrap}>
      {/* Hero */}
      <div style={{ background: "var(--fj-ink)", color: "#fff", padding: "64px 0 56px" }}>
        <div style={section}>
          <div style={{ ...kicker, color: "rgba(255,255,255,.55)" }}>Segal Deudores · Monitoreo automático de causas</div>
          <h1 style={{
            fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 40, lineHeight: 1.12,
            letterSpacing: "-.02em", margin: "14px 0 16px", maxWidth: 760,
          }}>
            Cómo vigilamos el Poder Judicial 24/7 y mantenemos cada causa al día, sola.
          </h1>
          <p style={{ ...lead, color: "rgba(255,255,255,.78)", maxWidth: 680 }}>
            Un sistema que revisa la Oficina Judicial Virtual de forma continua, trae cada
            novedad de cada causa (movimientos, resoluciones, documentos) y le avisa al
            abogado qué necesita atención — sin que nadie tenga que buscar causa por causa.
          </p>
        </div>
      </div>

      {/* El desafío */}
      <div style={{ padding: "56px 0" }}>
        <div style={section}>
          <div style={kicker}>El desafío</div>
          <h2 style={h2}>Por qué esto no es "apretar un botón"</h2>
          <p style={{ ...lead, maxWidth: 720, marginBottom: 24 }}>
            El Poder Judicial (PJUD) no ofrece una forma oficial de descargar la información
            masivamente. Hay que ir a buscarla como lo haría una persona — y el sitio está
            protegido para evitar justamente eso.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Card>
              <div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>🛡️ Protección anti-robot</div>
              <div style={{ fontSize: 13.5, color: "var(--fj-ink2)", lineHeight: 1.55 }}>
                El PJUD detecta y bloquea programas que entran desde servidores de nube. Solo
                acepta lo que parece un computador y una conexión de una persona real.
              </div>
            </Card>
            <Card>
              <div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>🔑 Login y captcha</div>
              <div style={{ fontSize: 13.5, color: "var(--fj-ink2)", lineHeight: 1.55 }}>
                Ver las causas requiere iniciar sesión. La Clave Única no pide captcha; la
                clave del Poder Judicial sí, y ese captcha solo lo pasa una persona.
              </div>
            </Card>
            <Card>
              <div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>🔒 Causas reservadas</div>
              <div style={{ fontSize: 13.5, color: "var(--fj-ink2)", lineHeight: 1.55 }}>
                Algunas causas no aparecen en la consulta pública: solo se ven entrando como
                el abogado dueño. Para ésas se necesita su credencial.
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* El flujo */}
      <div style={{ padding: "56px 0", background: "var(--fj-panel2)" }}>
        <div style={section}>
          <div style={kicker}>Cómo funciona</div>
          <h2 style={h2}>El recorrido de la información</h2>
          <p style={{ ...lead, maxWidth: 720, marginBottom: 28 }}>
            Un equipo dedicado en el estudio corre un navegador real automatizado (lo llamamos
            "Carla") que inicia sesión y revisa las causas sin parar. Todo lo que encuentra
            queda guardado y disponible para el abogado al instante.
          </p>
          <div style={{ display: "flex", alignItems: "stretch", gap: 6, flexWrap: "wrap" }}>
            <FlowBox title="PJUD" sub="Oficina Judicial Virtual" tone="var(--fj-line-strong)" />
            <Arrow />
            <FlowBox title="Equipo del estudio" sub="Navegador real · conexión residencial · sesión automática" tone="var(--fj-primary)" />
            <Arrow />
            <FlowBox title="Base de datos segura" sub="En la nube · movimientos + documentos" tone="var(--fj-line-strong)" />
            <Arrow />
            <FlowBox title="App del abogado" sub="Desde cualquier dispositivo · siempre al día" tone="var(--fj-verde)" />
          </div>
          <p style={{ fontSize: 13, color: "var(--fj-ink3)", marginTop: 18, maxWidth: 720 }}>
            La clave: el scraping corre desde un equipo del estudio con conexión hogareña, no
            desde un servidor en la nube — así el PJUD lo ve como una persona normal y no lo bloquea.
          </p>
        </div>
      </div>

      {/* Los 4 frentes */}
      <div style={{ padding: "56px 0" }}>
        <div style={section}>
          <div style={kicker}>Cobertura</div>
          <h2 style={h2}>Cuatro frentes, casi todo automático</h2>
          <p style={{ ...lead, maxWidth: 720, marginBottom: 24 }}>
            Según el tipo de causa, la información se trae de distintas maneras — la gran
            mayoría sin intervención humana.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Frente n="1" tone="var(--fj-primary)" title="Causas del estudio" auto="Automático"
              desc="Se revisan solas con la Clave Única del estudio (sin captcha), de forma continua." />
            <Frente n="2" tone="var(--fj-primary)" title="Causas de los abogados (públicas)" auto="Automático"
              desc="Se buscan por su rol en la consulta del PJUD, también sin intervención y sin captcha." />
            <Frente n="3" tone="var(--fj-verde)" title="Causas reservadas (con Clave Única del abogado)" auto="Automático"
              desc="Si el abogado comparte su Clave Única, sus causas reservadas también se traen solas." />
            <Frente n="4" tone="var(--fj-amarillo)" title="Causas reservadas (sin Clave Única)" auto="Asistido"
              desc="Requieren un login puntual del abogado (un operador pasa el captcha); luego se sincronizan automáticamente." />
          </div>
        </div>
      </div>

      {/* Qué hace con los datos */}
      <div style={{ padding: "56px 0", background: "var(--fj-panel2)" }}>
        <div style={section}>
          <div style={kicker}>El valor</div>
          <h2 style={h2}>No solo trae datos: avisa qué importa</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 18 }}>
            <Check><strong>Plazos fatales</strong> — detecta vencimientos críticos (excepciones, apelación) antes de que se pasen.</Check>
            <Check><strong>Abandono del procedimiento</strong> — marca las causas donde se puede solicitar el abandono.</Check>
            <Check><strong>Prescripción</strong> — alerta cuando se cumplió el plazo de prescripción (pagaré, letra, cheque).</Check>
            <Check><strong>Apremio</strong> — sigue el cuaderno de apremio del juicio ejecutivo.</Check>
            <Check><strong>Semáforo de urgencia</strong> — cada causa en rojo / amarillo / verde según qué tan urgente está.</Check>
            <Check><strong>Documentos archivados</strong> — guarda automáticamente los PDF de cada causa.</Check>
          </div>
        </div>
      </div>

      {/* La experiencia del abogado */}
      <div style={{ padding: "56px 0" }}>
        <div style={section}>
          <div style={kicker}>Para el abogado</div>
          <h2 style={h2}>Entra y todo está al día</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 12 }}>
            <Card><div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, marginBottom: 6 }}>Desde cualquier lugar</div><div style={{ fontSize: 13.5, color: "var(--fj-ink2)", lineHeight: 1.55 }}>Celular, casa u oficina. Solo su email y contraseña.</div></Card>
            <Card><div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, marginBottom: 6 }}>Sin instalar nada</div><div style={{ fontSize: 13.5, color: "var(--fj-ink2)", lineHeight: 1.55 }}>No toca el PJUD ni ve captchas: el sistema lo hace por detrás.</div></Card>
            <Card><div style={{ fontFamily: "var(--fj-heading)", fontWeight: 600, marginBottom: 6 }}>Ve solo lo suyo</div><div style={{ fontSize: 13.5, color: "var(--fj-ink2)", lineHeight: 1.55 }}>Sus causas, sus plazos y sus alertas — siempre frescas.</div></Card>
          </div>
        </div>
      </div>

      {/* Capacidades */}
      <div style={{ padding: "48px 0 64px", background: "var(--fj-ink)", color: "#fff" }}>
        <div style={section}>
          <div style={{ ...kicker, color: "rgba(255,255,255,.55)", textAlign: "center", marginBottom: 28 }}>En operación</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 28 }}>
            <Stat value="+2.500" label="causas monitoreadas" />
            <Stat value="24/7" label="vigilancia en horario hábil" />
            <Stat value="4" label="frentes de obtención de datos" />
            <Stat value="100%" label="invisible para el abogado" />
          </div>
        </div>
      </div>
    </div>
  );
}
