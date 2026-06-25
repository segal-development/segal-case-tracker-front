import { useState, type CSSProperties } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Modal } from "./Modal";
import { Btn } from "@/components/primitives/Btn";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDeadlineCatalog } from "@/hooks/useDeadlineCatalog";
import { useAddDeadline } from "@/hooks/useAddDeadline";
import { useComputeDue } from "@/hooks/useComputeDue";

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
  // Date the deadline starts running (default today). due_date is derived by the
  // backend = start + N días hábiles; we preview it via useComputeDue.
  const [startDate, setStartDate] = useState<Date>(new Date());
  const startStr = format(startDate, "yyyy-MM-dd");
  const { data: preview } = useComputeDue(deadlineType, startStr);

  const canSubmit = deadlineType !== "" && !addDeadline.isPending;

  const handleCreate = () => {
    if (!canSubmit) return;
    addDeadline.mutate(
      { caseId, deadline_type: deadlineType, start_date: startStr },
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
          <label style={modalLabel}>Fecha de inicio (desde cuándo corre el plazo)</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start font-normal">
                <CalendarIcon className="mr-2 size-4 opacity-60" />
                {format(startDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[200] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(d) => d && setStartDate(d)}
                locale={es}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          {preview && (
            <div style={{
              marginTop: 8, fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink2)",
              padding: "8px 12px", borderRadius: 8, background: "var(--fj-panel2)",
            }}>
              Vence el{" "}
              <strong style={{ color: "var(--fj-ink)" }}>
                {format(new Date(`${preview.due_date}T00:00:00`), "dd/MM/yyyy")}
              </strong>{" "}
              <span style={{ color: "var(--fj-ink3)" }}>
                ({preview.dias_habiles} días hábiles{preview.is_fatal ? " · fatal" : ""})
              </span>
            </div>
          )}
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
