import { useState, type CSSProperties } from "react";
import { RefreshCw } from "lucide-react";
import { Modal } from "./Modal";
import { Btn } from "@/components/primitives/Btn";
import { TRIBUNALES, MATERIAS, ABOGADOS } from "@/data/mock";

const modalInput: CSSProperties = {
  height: 40,
  padding: "0 12px",
  width: "100%",
  background: "var(--fj-panel)",
  border: "1px solid var(--fj-line-strong)",
  borderRadius: 8,
  fontFamily: "var(--fj-body)",
  fontSize: 13.5,
  color: "var(--fj-ink)",
  outline: "none",
};

const modalSelect: CSSProperties = {
  ...modalInput,
  appearance: "none",
  paddingRight: 32,
  background: `var(--fj-panel) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>") no-repeat right 12px center`,
};

const modalLabel: CSSProperties = {
  fontFamily: "var(--fj-body)",
  fontSize: 12,
  color: "var(--fj-ink2)",
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
};

interface NuevaCausaModalProps {
  onClose: () => void;
}

export function NuevaCausaModal({ onClose }: NuevaCausaModalProps) {
  const [step, setStep] = useState(1);
  const [rol, setRol] = useState("");
  const [tipoRol, setTipoRol] = useState("C");
  const [year, setYear] = useState("2026");

  return (
    <Modal
      onClose={onClose}
      kicker={`Paso ${step} de 2`}
      title="Nueva causa"
      width={580}
      footer={
        <>
          {step === 1
            ? <Btn kind="ghost" onClick={onClose}>Cancelar</Btn>
            : <Btn kind="ghost" onClick={() => setStep(1)}>Atrás</Btn>}
          {step === 1
            ? <Btn kind="primary" onClick={() => setStep(2)}>Continuar</Btn>
            : <Btn kind="primary" onClick={onClose}>Crear causa</Btn>}
        </>
      }
    >
      {step === 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)", lineHeight: 1.5 }}>
            Importa la causa desde PJUD o ingrésala manualmente. Si tienes el ROL, lo buscaremos en segundos.
          </p>

          <div>
            <label style={modalLabel}>ROL</label>
            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 110px", gap: 8 }}>
              <select
                value={tipoRol}
                onChange={(e) => setTipoRol(e.target.value)}
                style={modalSelect}
              >
                <option>C</option>
                <option>T</option>
                <option>F</option>
                <option>L</option>
              </select>
              <input
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                placeholder="1234"
                style={modalInput}
              />
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={modalInput}
              />
            </div>
          </div>

          <div>
            <label style={modalLabel}>Tribunal</label>
            <select style={modalSelect} defaultValue="">
              <option value="">Selecciona tribunal…</option>
              {TRIBUNALES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={modalLabel}>Materia</label>
            <select style={modalSelect} defaultValue="">
              <option value="">Selecciona materia…</option>
              {MATERIAS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div style={{
            display: "flex",
            gap: 12,
            padding: 14,
            borderRadius: 10,
            background: "var(--fj-primary-soft)",
            border: "1px solid transparent",
          }}>
            <RefreshCw
              size={18}
              strokeWidth={1.8}
              color="var(--fj-primary)"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <div style={{ fontFamily: "var(--fj-body)", fontSize: 12.5, color: "var(--fj-ink2)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--fj-primary)" }}>Buscar en PJUD:</strong>{" "}
              autocompletaremos carátula, partes y tribunal a partir del ROL.
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={modalLabel}>Carátula</label>
            <input style={modalInput} placeholder="DEMANDANTE / DEMANDADO" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={modalLabel}>Abogado responsable</label>
              <select style={modalSelect}>
                {ABOGADOS.map((a) => <option key={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={modalLabel}>Fecha de ingreso</label>
              <input type="date" defaultValue="2026-05-15" style={modalInput} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={modalLabel}>Cuantía (CLP)</label>
              <input style={modalInput} placeholder="$ 0" />
            </div>
            <div>
              <label style={modalLabel}>Semáforo inicial</label>
              <select style={modalSelect} defaultValue="verde">
                <option value="verde">Verde · Sin urgencia</option>
                <option value="amarillo">Amarillo · Atención</option>
                <option value="rojo">Rojo · Crítico</option>
              </select>
            </div>
          </div>

          <div>
            <label style={modalLabel}>Notas internas (opcional)</label>
            <textarea
              rows={3}
              style={{ ...modalInput, height: "auto", padding: 12, resize: "vertical" }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
