import { useState, useMemo, useEffect } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download, Plus, Search, X, User, LayoutList, LayoutGrid,
  MoreHorizontal, Check,
} from "lucide-react";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Card } from "@/components/primitives/Card";
import { Btn } from "@/components/primitives/Btn";
import { Pill } from "@/components/primitives/Pill";
import { FilterDrawer } from "@/components/causas/FilterDrawer";
import { Pagination } from "@/components/causas/Pagination";
import { Splash } from "@/components/Splash";
import { useCausas } from "@/hooks/useCausas";
import { fmtCLP } from "@/lib/format";
import type { Causa, SemaforoColor, SemaforoValue } from "@/data/types";

/* ─── Page-level style constants (match Dashboard convention) ─── */
const pageCss: CSSProperties = {
  padding: "36px 40px 56px",
  maxWidth: 1320,
  margin: "0 auto",
};

const pageTitleCss: CSSProperties = {
  margin: 0, fontFamily: "var(--fj-heading)", fontWeight: 500,
  fontSize: 34, letterSpacing: "-.015em", color: "var(--fj-ink)",
};

const kickerCss: CSSProperties = {
  fontFamily: "var(--fj-body)", fontSize: 11, letterSpacing: ".14em",
  textTransform: "uppercase", color: "var(--fj-ink3)", fontWeight: 600, marginBottom: 6,
  whiteSpace: "nowrap",
};

/* ─── Table cell helpers ─── */
const thCss: CSSProperties = {
  padding: "12px 14px", fontSize: 11,
  fontWeight: 600, color: "var(--fj-ink3)", textTransform: "uppercase",
  letterSpacing: ".10em", whiteSpace: "nowrap", textAlign: "left",
};

const tdCss: CSSProperties = { padding: "12px 14px", verticalAlign: "middle" };

const iconBtnCss: CSSProperties = {
  width: 28, height: 28, borderRadius: 6, border: 0, background: "transparent",
  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
};

/* ─── Semáforo quick-filter chip ─── */
function SemChip({
  label, n, active, onClick, tone,
}: {
  label: string;
  n: number;
  active: boolean;
  onClick: () => void;
  /** null = neutral/sin-seguimiento; undefined = no ring shown (e.g. "Todas") */
  tone?: SemaforoValue;
}) {
  const toneFg = tone === "rojo" ? "var(--fj-rojo)"
               : tone === "amarillo" ? "var(--fj-amarillo)"
               : tone === "verde" ? "var(--fj-verde)"
               : tone === null ? "var(--fj-ink3)"
               : "var(--fj-ink)";

  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 12px", borderRadius: 999, cursor: "pointer",
        background: active ? "var(--fj-panel)" : "transparent",
        border: `1px solid ${active ? "var(--fj-line-strong)" : "var(--fj-line)"}`,
        color: active ? "var(--fj-ink)" : "var(--fj-ink2)",
        fontFamily: "var(--fj-body)", fontSize: 12.5, fontWeight: 500,
        whiteSpace: "nowrap",
        boxShadow: active ? "0 1px 2px rgba(15,22,38,.04)" : "none",
      }}
    >
      {tone !== undefined && <SemaforoRing status={tone} size={14} variant="ring" />}
      <span>{label}</span>
      <span style={{ color: toneFg, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{n}</span>
    </button>
  );
}

/* ─── Checkbox ─── */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 16, height: 16, borderRadius: 4,
        background: checked ? "var(--fj-primary)" : "var(--fj-panel)",
        border: `1px solid ${checked ? "var(--fj-primary)" : "var(--fj-line-strong)"}`,
        cursor: "pointer", color: "#fff",
        flexShrink: 0,
      }}
    >
      {checked && <Check size={11} strokeWidth={3} color="#fff" />}
    </span>
  );
}

/* ─── Table view ─── */
function CausasTable({
  causas, selected, toggle, toggleAll, onNavigate,
}: {
  causas: Causa[];
  selected: Set<string>;
  toggle: (id: string) => void;
  toggleAll: () => void;
  onNavigate: (id: string) => void;
}) {
  const allSel = causas.length > 0 && selected.size === causas.length;

  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--fj-body)", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--fj-panel2)" }}>
              <th style={thCss}>
                <Checkbox checked={allSel} onChange={toggleAll} />
              </th>
              <th style={thCss}>Sem.</th>
              <th style={thCss}>ROL / RIT</th>
              <th style={thCss}>Carátula</th>
              <th style={thCss}>Tribunal</th>
              <th style={thCss}>Materia</th>
              <th style={thCss}>Abogado</th>
              <th style={{ ...thCss, textAlign: "right" }}>Últ. actuación</th>
              <th style={thCss} />
            </tr>
          </thead>
          <tbody>
            {causas.map((c) => (
              <CausaRow
                key={c.id}
                causa={c}
                isSelected={selected.has(c.id)}
                toggle={toggle}
                onNavigate={onNavigate}
              />
            ))}
            {causas.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{ padding: "60px 20px", textAlign: "center", color: "var(--fj-ink3)" }}
                >
                  Sin resultados para los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CausaRow({
  causa: c, isSelected, toggle, onNavigate,
}: {
  causa: Causa;
  isSelected: boolean;
  toggle: (id: string) => void;
  onNavigate: (id: string) => void;
}) {
  function handleMouseEnter(e: MouseEvent<HTMLTableRowElement>) {
    if (!isSelected) e.currentTarget.style.background = "var(--fj-panel2)";
  }
  function handleMouseLeave(e: MouseEvent<HTMLTableRowElement>) {
    if (!isSelected) e.currentTarget.style.background = "transparent";
  }

  return (
    <tr
      style={{
        borderTop: "1px solid var(--fj-line)",
        cursor: "pointer",
        background: isSelected ? "var(--fj-primary-soft)" : "transparent",
      }}
      onClick={() => onNavigate(c.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td style={tdCss} onClick={(e) => { e.stopPropagation(); toggle(c.id); }}>
        <Checkbox checked={isSelected} onChange={() => toggle(c.id)} />
      </td>

      <td style={tdCss}>
        <SemaforoRing status={c.semaforo} size={20} variant="ring" />
      </td>

      <td style={tdCss}>
        <div style={{
          fontFamily: "var(--fj-mono)", fontSize: 12, color: "var(--fj-ink)",
          fontWeight: 500, whiteSpace: "nowrap",
        }}>
          {c.rol}
        </div>
        {c.rit && (
          <div style={{
            fontFamily: "var(--fj-mono)", fontSize: 10.5,
            color: "var(--fj-ink3)", whiteSpace: "nowrap",
          }}>
            {c.rit}
          </div>
        )}
      </td>

      <td style={tdCss}>
        <div style={{
          color: "var(--fj-ink)", fontWeight: 500,
          maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {c.caratula}
        </div>
        {c.cuantia != null && (
          <div style={{ fontSize: 11, color: "var(--fj-ink3)", fontVariantNumeric: "tabular-nums" }}>
            Cuantía {fmtCLP(c.cuantia)}
          </div>
        )}
      </td>

      <td style={{
        ...tdCss, color: "var(--fj-ink2)",
        maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {c.tribunal}
      </td>

      <td style={tdCss}>
        <Pill tone="neutral">{c.materia.split(" — ")[0]}</Pill>
      </td>

      <td style={tdCss}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            iniciales={c.abogado.iniciales}
            color={c.abogado.color}
            nombre={c.abogado.nombre}
            size={24}
          />
          <span style={{ color: "var(--fj-ink2)", fontSize: 12.5, whiteSpace: "nowrap" }}>
            {c.abogado.nombre.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>
      </td>

      <td style={{ ...tdCss, textAlign: "right", color: "var(--fj-ink3)", fontVariantNumeric: "tabular-nums" }}>
        hace {c.diasUltima}d
      </td>

      <td style={tdCss}>
        <button style={{ ...iconBtnCss, color: "var(--fj-ink3)" }} onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal size={16} strokeWidth={1.8} />
        </button>
      </td>
    </tr>
  );
}

/* ─── Cards view ─── */
function CausasCards({
  causas, onNavigate,
}: {
  causas: Causa[];
  onNavigate: (id: string) => void;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: 14,
    }}>
      {causas.map((c) => (
        <CausaCard key={c.id} causa={c} onNavigate={onNavigate} />
      ))}
      {causas.length === 0 && (
        <p style={{ color: "var(--fj-ink3)", fontFamily: "var(--fj-body)", fontSize: 13, gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
          Sin resultados para los filtros actuales.
        </p>
      )}
    </div>
  );
}

function CausaCard({ causa: c, onNavigate }: { causa: Causa; onNavigate: (id: string) => void }) {
  const accentColor = c.semaforo === "rojo" ? "var(--fj-rojo)"
                    : c.semaforo === "amarillo" ? "var(--fj-amarillo)"
                    : c.semaforo === "verde" ? "var(--fj-verde)"
                    : "var(--fj-line)";

  function handleMouseEnter(e: MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.borderColor = "var(--fj-line-strong)";
  }
  function handleMouseLeave(e: MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.borderColor = "var(--fj-line)";
  }

  return (
    <button
      onClick={() => onNavigate(c.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        textAlign: "left", padding: 18, borderRadius: 12,
        background: "var(--fj-panel)", border: "1px solid var(--fj-line)",
        cursor: "pointer", display: "flex", flexDirection: "column", gap: 12,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: accentColor,
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontFamily: "var(--fj-mono)", fontSize: 12,
          color: "var(--fj-ink)", fontWeight: 600,
        }}>
          {c.rol}
        </span>
        <SemaforoRing status={c.semaforo} size={22} variant="ring" />
      </div>

      <div style={{
        fontFamily: "var(--fj-body)", fontSize: 14, color: "var(--fj-ink)",
        fontWeight: 500, lineHeight: 1.35, minHeight: 38,
      }}>
        {c.caratula}
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 4,
        fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)",
      }}>
        <span>{c.tribunal}</span>
        <span>{c.materia}</span>
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 8, borderTop: "1px solid var(--fj-line)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            iniciales={c.abogado.iniciales}
            color={c.abogado.color}
            nombre={c.abogado.nombre}
            size={22}
          />
          <span style={{ fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink2)" }}>
            {c.abogado.nombre.split(" ")[0]}
          </span>
        </div>
        <span style={{ fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)" }}>
          hace {c.diasUltima}d
        </span>
      </div>
    </button>
  );
}

type ViewMode = "table" | "cards";

/* ─── Main screen ─── */
export interface CausasProps {
  onNuevaCausa?: () => void;
}

export function Causas({ onNuevaCausa = () => undefined }: CausasProps) {
  const navigate = useNavigate();
  const { data: allCausas = [], isLoading, error } = useCausas();

  const [view, setView] = useState<ViewMode>("table");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [sem, setSem] = useState("todas");
  const [trib, setTrib] = useState("todos");
  const [mat, setMat] = useState("todas");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const semCount = useMemo(() => ({
    rojo:           allCausas.filter((c) => c.semaforo === "rojo").length,
    amarillo:       allCausas.filter((c) => c.semaforo === "amarillo").length,
    verde:          allCausas.filter((c) => c.semaforo === "verde").length,
    sinSeguimiento: allCausas.filter((c) => c.semaforo === null).length,
    total:          allCausas.length,
  }), [allCausas]);

  const filtered = useMemo(() => {
    return allCausas.filter((c) => {
      if (sem !== "todas") {
        if (sem === "sin-seguimiento") {
          if (c.semaforo !== null) return false;
        } else if (c.semaforo !== (sem as SemaforoColor)) return false;
      }
      if (trib !== "todos" && c.tribunal !== trib) return false;
      if (mat !== "todas" && c.materia !== mat) return false;
      if (q && !(`${c.rol} ${c.caratula}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [allCausas, q, sem, trib, mat]);

  // Reset to page 1 whenever any filter, search term, or page size changes.
  useEffect(() => {
    setPage(1);
  }, [q, sem, trib, mat, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((c) => c.id)));
  }

  const hasActiveFilters = trib !== "todos" || mat !== "todas";

  return (
    <div style={pageCss}>
      {/* Page header */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        marginBottom: 22, gap: 24,
      }}>
        <div>
          <div style={kickerCss}>
            {isLoading
              ? "Cargando causas…"
              : `Listado · ${filtered.length} de ${allCausas.length}`}
          </div>
          <h1 style={pageTitleCss}>Causas</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn icon={<Download size={15} strokeWidth={1.6} />} kind="secondary">
            Exportar
          </Btn>
          <Btn icon={<Plus size={15} strokeWidth={1.6} />} kind="primary" onClick={onNuevaCausa}>
            Nueva causa
          </Btn>
        </div>
      </div>

      {/* Semáforo chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <SemChip
          label="Todas" n={semCount.total}
          active={sem === "todas"} onClick={() => setSem("todas")}
        />
        <SemChip
          label="Críticas" n={semCount.rojo} tone="rojo"
          active={sem === "rojo"} onClick={() => setSem("rojo")}
        />
        <SemChip
          label="Atención" n={semCount.amarillo} tone="amarillo"
          active={sem === "amarillo"} onClick={() => setSem("amarillo")}
        />
        <SemChip
          label="Al día" n={semCount.verde} tone="verde"
          active={sem === "verde"} onClick={() => setSem("verde")}
        />
        <SemChip
          label="Sin seguimiento" n={semCount.sinSeguimiento} tone={null}
          active={sem === "sin-seguimiento"} onClick={() => setSem("sin-seguimiento")}
        />
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          height: 36, padding: "0 12px", borderRadius: 8, flex: 1,
          background: "var(--fj-panel)", border: "1px solid var(--fj-line-strong)",
        }}>
          <Search size={15} strokeWidth={1.6} color="var(--fj-ink3)" style={{ flexShrink: 0 }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ROL, RIT, carátula o parte…"
            style={{
              border: 0, background: "transparent", outline: "none", flex: 1,
              fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)",
            }}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              style={{ background: "transparent", border: 0, color: "var(--fj-ink3)", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <X size={14} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* Filters trigger */}
        <Btn
          kind="secondary"
          icon={<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>}
          onClick={() => setFilterOpen(true)}
        >
          Filtros{hasActiveFilters && (
            <Pill tone="primary" style={{ fontSize: 10 }}>activos</Pill>
          )}
        </Btn>

        {/* View toggle */}
        <div style={{
          display: "flex", border: "1px solid var(--fj-line-strong)",
          borderRadius: 8, padding: 3, gap: 2,
        }}>
          {(["table", "cards"] as ViewMode[]).map((id) => (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                width: 32, height: 28, borderRadius: 6, border: 0, cursor: "pointer",
                background: view === id ? "var(--fj-primary-soft)" : "transparent",
                color: view === id ? "var(--fj-primary)" : "var(--fj-ink3)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {id === "table"
                ? <LayoutList size={14} strokeWidth={1.8} />
                : <LayoutGrid size={14} strokeWidth={1.8} />}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{
          marginBottom: 12, padding: "10px 16px", borderRadius: 10,
          background: "var(--fj-primary-soft)", color: "var(--fj-primary)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--fj-body)", fontSize: 13, fontWeight: 600 }}>
            {selected.size} {selected.size === 1 ? "causa seleccionada" : "causas seleccionadas"}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn size="sm" kind="ghost" icon={<User size={13} strokeWidth={1.8} />} style={{ color: "var(--fj-primary)" }}>
              Reasignar abogado
            </Btn>
            <Btn size="sm" kind="ghost" icon={<Download size={13} strokeWidth={1.8} />} style={{ color: "var(--fj-primary)" }}>
              Exportar selección
            </Btn>
            <Btn size="sm" kind="ghost" icon={<X size={13} strokeWidth={1.8} />} style={{ color: "var(--fj-primary)" }} onClick={() => setSelected(new Set())}>
              Cancelar
            </Btn>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{
          marginBottom: 12,
          padding: "10px 16px",
          borderRadius: 10,
          background: "var(--fj-rojo-soft, #fff0f0)",
          color: "var(--fj-rojo)",
          fontFamily: "var(--fj-body)",
          fontSize: 13,
          border: "1px solid var(--fj-rojo)",
        }}>
          Error al cargar las causas. Por favor recargá la página.
        </div>
      )}

      {/* Results */}
      {isLoading && allCausas.length === 0 ? (
        <Splash inline label="Cargando causas" />
      ) : view === "table" ? (
        <CausasTable
          causas={paginated}
          selected={selected}
          toggle={toggle}
          toggleAll={toggleAll}
          onNavigate={(id) => navigate(`/causas/${id}`)}
        />
      ) : (
        <CausasCards
          causas={paginated}
          onNavigate={(id) => navigate(`/causas/${id}`)}
        />
      )}

      {/* Pagination bar */}
      {filtered.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          filteredCount={filtered.length}
          onPage={setPage}
          onPageSize={setPageSize}
        />
      )}

      {/* Filter drawer */}
      {filterOpen && (
        <FilterDrawer
          onClose={() => setFilterOpen(false)}
          trib={trib} setTrib={setTrib}
          mat={mat} setMat={setMat}
          onReset={() => { setTrib("todos"); setMat("todas"); }}
        />
      )}
    </div>
  );
}
