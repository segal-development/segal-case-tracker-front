import { type CSSProperties } from "react";
import { Clock } from "lucide-react";
import { Modal } from "./Modal";
import { Btn } from "@/components/primitives/Btn";
import { CAUSAS } from "@/data/mock";

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

interface NuevoPlazoModalProps {
  onClose: () => void;
}

export function NuevoPlazoModal({ onClose }: NuevoPlazoModalProps) {
  return (
    <Modal
      onClose={onClose}
      title="Nuevo plazo"
      kicker="Asociar a una causa"
      footer={
        <>
          <Btn kind="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn kind="primary" onClick={onClose}>Crear plazo</Btn>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={modalLabel}>Causa</label>
          <select style={modalSelect}>
            {CAUSAS.slice(0, 6).map((c) => (
              <option key={c.id}>{c.rol} — {c.caratula}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={modalLabel}>Descripción del plazo</label>
          <input style={modalInput} placeholder="Ej: Contestación de demanda" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={modalLabel}>Días</label>
            <input style={modalInput} type="number" defaultValue={5} />
          </div>
          <div>
            <label style={modalLabel}>Tipo</label>
            <select style={modalSelect}>
              <option value="habiles">Días hábiles</option>
              <option value="corridos">Días corridos</option>
            </select>
          </div>
        </div>

        <div>
          <label style={modalLabel}>Fecha de inicio</label>
          <input type="date" defaultValue="2026-05-15" style={modalInput} />
        </div>

        {/* Deadline preview */}
        <div style={{
          padding: 12,
          borderRadius: 8,
          background: "var(--fj-amarillo-soft)",
          fontFamily: "var(--fj-body)",
          fontSize: 12.5,
          color: "var(--fj-amarillo)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}>
          <Clock size={15} strokeWidth={1.8} />
          Vence el <strong>22 may 2026</strong> (5 días hábiles)
        </div>
      </div>
    </Modal>
  );
}
