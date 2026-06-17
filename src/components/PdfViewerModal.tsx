import { useEffect } from "react";
import { X, Download } from "lucide-react";
import { Spinner } from "@/components/Spinner";

interface PdfViewerModalProps {
  name: string;
  /** Object URL of the fetched PDF blob; null while still loading. */
  url: string | null;
  onClose: () => void;
  onDownload?: () => void;
}

/**
 * In-page PDF viewer: renders the PDF blob in an <iframe> (the browser's native
 * PDF viewer) inside a large modal. No external PDF library required.
 */
export function PdfViewerModal({ name, url, onClose, onDownload }: PdfViewerModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const iconBtn: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid var(--fj-line)",
    background: "var(--fj-panel)",
    color: "var(--fj-ink2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(15,22,38,.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1000px, 92vw)",
          height: "92vh",
          background: "var(--fj-panel)",
          borderRadius: 14,
          boxShadow: "0 16px 60px rgba(15,22,38,.32)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 16px",
            borderBottom: "1px solid var(--fj-line)",
          }}
        >
          <span
            title={name}
            style={{
              fontFamily: "var(--fj-heading)",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--fj-ink)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
          <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
            {onDownload && (
              <button style={iconBtn} title="Descargar" onClick={onDownload}>
                <Download size={15} strokeWidth={1.6} />
              </button>
            )}
            <button style={iconBtn} title="Cerrar (Esc)" onClick={onClose}>
              <X size={16} strokeWidth={1.8} />
            </button>
          </div>
        </header>
        <div style={{ flex: 1, background: "var(--fj-panel2)", position: "relative" }}>
          {url ? (
            <iframe
              src={url}
              title={name}
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spinner size={44} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
