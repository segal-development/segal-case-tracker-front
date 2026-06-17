import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  filteredCount: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}

const PAGE_SIZES = [25, 50, 100] as const;

const wrapCss: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 4px",
  fontFamily: "var(--fj-body)",
  fontSize: 12.5,
  color: "var(--fj-ink2)",
  flexWrap: "wrap",
};

function navBtnCss(disabled: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 7,
    border: "1px solid var(--fj-line-strong)",
    background: "var(--fj-panel)",
    color: disabled ? "var(--fj-ink3)" : "var(--fj-ink2)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
  };
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  filteredCount,
  onPage,
  onPageSize,
}: PaginationProps) {
  const from = filteredCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, filteredCount);

  return (
    <div style={wrapCss}>
      <span style={{ color: "var(--fj-ink3)", whiteSpace: "nowrap" }}>
        {filteredCount === 0
          ? "Sin resultados"
          : `Mostrando ${from}–${to} de ${filteredCount}`}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "var(--fj-ink3)", whiteSpace: "nowrap" }}>
          Filas por página:
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          style={{
            height: 30,
            padding: "0 8px",
            borderRadius: 7,
            border: "1px solid var(--fj-line-strong)",
            background: "var(--fj-panel)",
            color: "var(--fj-ink2)",
            fontFamily: "var(--fj-body)",
            fontSize: 12.5,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            style={navBtnCss(page <= 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft size={14} strokeWidth={1.8} />
          </button>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 10px",
              height: 30,
              borderRadius: 7,
              border: "1px solid var(--fj-line)",
              background: "transparent",
              color: "var(--fj-ink2)",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
              fontSize: 12.5,
            }}
          >
            {totalPages === 0 ? "—" : `${page} / ${totalPages}`}
          </div>

          <button
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            style={navBtnCss(page >= totalPages)}
            aria-label="Página siguiente"
          >
            <ChevronRight size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
