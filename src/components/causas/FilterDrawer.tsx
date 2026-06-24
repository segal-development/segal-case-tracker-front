import { useState, type CSSProperties } from "react";
import { X, Calendar as CalendarIcon, ChevronsUpDown, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Btn } from "@/components/primitives/Btn";
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
  /** Real tribunals/materias derived from the loaded cases (not a fixed list). */
  tribunales: string[];
  materias: string[];
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

/** Like FilterSelect but with a search box — for long option lists (tribunals). */
function SearchableSelect({
  label, value, onChange, options, placeholder, searchPlaceholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<[string, string]>;
  placeholder: string;
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find(([v]) => v === value);
  const filtered = query.trim()
    ? options.filter(([, t]) => t.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  const itemCss: CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    width: "100%", padding: "8px 12px", border: 0, background: "transparent",
    cursor: "pointer", textAlign: "left", fontFamily: "var(--fj-body)", fontSize: 13,
    color: "var(--fj-ink)",
  };

  return (
    <div>
      <label style={labelCss}>{label}</label>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal">
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selected ? selected[1] : placeholder}
            </span>
            <ChevronsUpDown size={15} style={{ opacity: 0.5, flexShrink: 0 }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 z-[100]"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <div style={{ padding: 8, borderBottom: "1px solid var(--fj-line)" }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: "100%", height: 32, padding: "0 10px", borderRadius: 6,
                border: "1px solid var(--fj-line-strong)", background: "var(--fj-panel)",
                fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto", padding: 4 }}>
            {filtered.map(([v, t]) => (
              <button
                key={v}
                onClick={() => { onChange(v); setOpen(false); setQuery(""); }}
                style={{ ...itemCss, borderRadius: 6, background: v === value ? "var(--fj-panel2)" : "transparent" }}
                onMouseEnter={(e) => { if (v !== value) e.currentTarget.style.background = "var(--fj-panel2)"; }}
                onMouseLeave={(e) => { if (v !== value) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>
                {v === value && <Check size={15} style={{ flexShrink: 0, color: "var(--fj-primary)" }} />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "12px", fontSize: 12.5, color: "var(--fj-ink3)", textAlign: "center" }}>
                Sin resultados
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
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
  onClose, trib, setTrib, mat, setMat, onReset, tribunales, materias,
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
          <SearchableSelect
            label="Tribunal"
            value={trib}
            onChange={setTrib}
            placeholder="Todos los tribunales"
            searchPlaceholder="Buscar tribunal…"
            options={[
              ["todos", "Todos los tribunales"],
              ...tribunales.map((t): [string, string] => [t, t]),
            ]}
          />
          <FilterSelect
            label="Materia"
            value={mat}
            onChange={setMat}
            placeholder="Todas las materias"
            options={[
              ["todas", "Todas las materias"],
              ...materias.map((m): [string, string] => [m, m]),
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
