import { useState, type CSSProperties } from "react";
import { Modal } from "./Modal";
import { Btn } from "@/components/primitives/Btn";
import { useDeadlineCatalog } from "@/hooks/useDeadlineCatalog";
import { useAddDeadline } from "@/hooks/useAddDeadline";

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
  boxSizing: "border-box",
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

interface Props {
  caseId: string;
  onClose: () => void;
}

export function AgregarPlazoModal({ caseId, onClose }: Props) {
  const { data: catalog = [], isLoading: loadingCatalog } = useDeadlineCatalog();
  const addDeadline = useAddDeadline();
  const [deadlineType, setDeadlineType] = useState("");
  const [dueDate, setDueDate] = useState("");

  const canSubmit = deadlineType !== "" && dueDate !== "" && !addDeadline.isPending;

  const handleCreate = () => {
    if (!canSubmit) return;
    addDeadline.mutate(
      { caseId, deadline_type: deadlineType, due_date: dueDate },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      onClose={onClose}
      title="Agregar plazo"
      width={480}
      footer={
        <>
          <Btn kind="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn kind="primary" disabled={!canSubmit} onClick={handleCreate}>
            {addDeadline.isPending ? "Creando…" : "Crear plazo"}
          </Btn>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={modalLabel}>Tipo de plazo</label>
          {loadingCatalog ? (
            <div style={{ fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink3)" }}>
              Cargando catálogo…
            </div>
          ) : (
            <select
              style={{ ...modalSelect, appearance: "auto" as CSSProperties["appearance"] }}
              value={deadlineType}
              onChange={(e) => setDeadlineType(e.target.value)}
            >
              <option value="">Selecciona tipo de plazo…</option>
              {catalog.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} ({item.dias} días{item.is_fatal ? " · fatal" : ""})
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label style={modalLabel}>Fecha de vencimiento</label>
          <input
            type="date"
            style={modalInput}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {addDeadline.isError && (
          <div style={{
            fontFamily: "var(--fj-body)",
            fontSize: 12.5,
            color: "var(--fj-rojo)",
            padding: "8px 12px",
            borderRadius: 8,
            background: "var(--fj-rojo-soft)",
          }}>
            Error al crear el plazo. Intenta de nuevo.
          </div>
        )}
      </div>
    </Modal>
  );
}
