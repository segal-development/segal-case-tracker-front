import { useState, type CSSProperties } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Btn } from "@/components/primitives/Btn";
import { TRIBUNALES, MATERIAS } from "@/data/mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export interface FilterDrawerProps {
  onClose: () => void;
  trib: string;
  setTrib: (v: string) => void;
  mat: string;
  setMat: (v: string) => void;
  onReset: () => void;
}

const kickerCss: CSSProperties = {
  fontFamily: "var(--fj-body)", fontSize: 11, letterSpacing: ".14em",
  textTransform: "uppercase", color: "var(--fj-ink3)", fontWeight: 600, marginBottom: 4,
};

const filterInputCss: CSSProperties = {
  height: 38, padding: "0 12px", borderRadius: 8,
  background: "var(--fj-panel)", border: "1px solid var(--fj-line-strong)",
  fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)", outline: "none",
  width: "100%", boxSizing: "border-box",
};

const labelCss: CSSProperties = {
  fontFamily: "var(--fj-body)", fontSize: 12, fontWeight: 600,
  color: "var(--fj-ink2)", marginBottom: 8, display: "block",
};

const iconBtn: CSSProperties = {
  width: 32, height: 32, borderRadius: 6, border: 0, background: "transparent",
  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
  color: "var(--fj-ink3)",
};

function FilterSelect({
  label, value, onChange, options, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<[string, string]>;
  placeholder: string;
}) {
  return (
    <div>
      <label style={labelCss}>{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {options.map(([v, t]) => (
            <SelectItem key={v} value={v}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DateField({
  date, onSelect,
}: {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal">
          <CalendarIcon className="mr-2 size-4 opacity-60" />
          {date ? format(date, "dd/MM/yyyy") : <span className="text-muted-foreground">Elegir fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[100] w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} locale={es} autoFocus />
      </PopoverContent>
    </Popover>
  );
}

export function FilterDrawer({
  onClose, trib, setTrib, mat, setMat, onReset,
}: FilterDrawerProps) {
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(new Date(2025, 0, 1));
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(new Date(2026, 4, 15));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(15,22,38,.32)", zIndex: 60,
        }}
      />

      {/* Drawer */}
      <aside style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 380, zIndex: 61,
        background: "var(--fj-panel)", borderLeft: "1px solid var(--fj-line)",
        display: "flex", flexDirection: "column",
        boxShadow: "-10px 0 30px rgba(15,22,38,.10)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--fj-line)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={kickerCss}>Filtros avanzados</div>
            <h2 style={{
              margin: 0, fontFamily: "var(--fj-heading)", fontSize: 22,
              fontWeight: 500, color: "var(--fj-ink)",
            }}>
              Refinar resultados
            </h2>
          </div>
          <button onClick={onClose} style={iconBtn}>
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <FilterSelect
            label="Tribunal"
            value={trib}
            onChange={setTrib}
            placeholder="Todos los tribunales"
            options={[
              ["todos", "Todos los tribunales"],
              ...TRIBUNALES.map((t): [string, string] => [t, t]),
            ]}
          />
          <FilterSelect
            label="Materia"
            value={mat}
            onChange={setMat}
            placeholder="Todas las materias"
            options={[
              ["todas", "Todas las materias"],
              ...MATERIAS.map((m): [string, string] => [m, m]),
            ]}
          />

          <div>
            <label style={labelCss}>Fecha de ingreso</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <DateField date={fechaDesde} onSelect={setFechaDesde} />
              <DateField date={fechaHasta} onSelect={setFechaHasta} />
            </div>
          </div>

          <div>
            <label style={labelCss}>Cuantía estimada (CLP)</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input placeholder="Mínima" style={filterInputCss} />
              <input placeholder="Máxima" style={filterInputCss} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--fj-line)",
          display: "flex", gap: 10, justifyContent: "space-between",
        }}>
          <Btn kind="ghost" onClick={onReset}>Limpiar todo</Btn>
          <Btn kind="primary" onClick={onClose}>Aplicar filtros</Btn>
        </div>
      </aside>
    </>
  );
}
