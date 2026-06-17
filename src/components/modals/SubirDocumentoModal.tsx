import { type CSSProperties } from "react";
import { Upload } from "lucide-react";
import { Modal } from "./Modal";
import { Btn } from "@/components/primitives/Btn";

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

interface SubirDocumentoModalProps {
  onClose: () => void;
}

export function SubirDocumentoModal({ onClose }: SubirDocumentoModalProps) {
  return (
    <Modal
      onClose={onClose}
      title="Subir documento"
      kicker="Causa C-2847-2025"
      footer={
        <>
          <Btn kind="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn kind="primary" onClick={onClose}>Subir</Btn>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Drop zone */}
        <div style={{
          border: "2px dashed var(--fj-line-strong)",
          borderRadius: 12,
          padding: 28,
          textAlign: "center",
          background: "var(--fj-panel2)",
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "var(--fj-primary-soft)",
            color: "var(--fj-primary)",
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Upload size={20} strokeWidth={1.8} />
          </div>
          <div style={{ fontFamily: "var(--fj-heading)", fontSize: 16, fontWeight: 500, color: "var(--fj-ink)" }}>
            Arrastra tus archivos aquí
          </div>
          <div style={{ fontFamily: "var(--fj-body)", fontSize: 12.5, color: "var(--fj-ink3)", marginTop: 4 }}>
            o{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ color: "var(--fj-primary)" }}
            >
              elige desde tu equipo
            </a>
            {" "}· PDF, DOCX, JPG hasta 25MB
          </div>
        </div>

        <div>
          <label style={modalLabel}>Tipo de documento</label>
          <select style={modalSelect}>
            <option>Escrito</option>
            <option>Resolución</option>
            <option>Notificación</option>
            <option>Antecedente / Prueba</option>
            <option>Mandato</option>
          </select>
        </div>

        <div>
          <label style={modalLabel}>Descripción (opcional)</label>
          <input
            style={modalInput}
            placeholder="Ej: Pagaré protestado de fecha 12-03-2025"
          />
        </div>
      </div>
    </Modal>
  );
}
