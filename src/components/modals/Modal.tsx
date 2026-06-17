import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export function Modal({ onClose, title, kicker, children, footer, width = 520 }: ModalProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      {/* Overlay — click-outside closes */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,22,38,.36)",
          zIndex: 80,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width,
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100vh - 60px)",
          zIndex: 81,
          background: "var(--fj-panel)",
          border: "1px solid var(--fj-line)",
          borderRadius: 14,
          boxShadow: "0 16px 60px rgba(15,22,38,.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          borderBottom: "1px solid var(--fj-line)",
        }}>
          <div>
            {kicker && (
              <div style={{
                fontFamily: "var(--fj-body)",
                fontSize: 10.5,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--fj-ink3)",
                fontWeight: 600,
                marginBottom: 4,
              }}>
                {kicker}
              </div>
            )}
            <h2 style={{
              margin: 0,
              fontFamily: "var(--fj-heading)",
              fontWeight: 500,
              fontSize: 22,
              color: "var(--fj-ink)",
              letterSpacing: "-.01em",
            }}>
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: 0,
              background: "transparent",
              color: "var(--fj-ink3)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--fj-line)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            background: "var(--fj-panel2)",
          }}>
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
