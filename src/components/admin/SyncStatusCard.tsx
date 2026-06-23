import { Card } from "@/components/primitives/Card";
import { useSyncStatus } from "@/hooks/useSyncStatus";

function fmtSync(iso: string | null): { label: string; color: string } {
  if (!iso) return { label: "Nunca sincronizado", color: "var(--fj-rojo)" };
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  const date = d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
  const color = days > 7 ? "var(--fj-rojo)" : days > 2 ? "var(--fj-amarillo)" : "var(--fj-verde)";
  return { label: `${date} · hace ${days}d`, color };
}

export function SyncStatusCard() {
  const { data: rows = [], isLoading } = useSyncStatus();

  return (
    <Card pad={0} style={{ marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fj-line)" }}>
        <div style={{ fontFamily: "var(--fj-heading)", fontSize: 16, fontWeight: 600, color: "var(--fj-ink)" }}>
          Sincronización per-abogado
        </div>
        <div style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)", marginTop: 2 }}>
          Última sincronización por abogado · los más atrasados primero (a quién re-sincronizar)
        </div>
      </div>
      {isLoading ? (
        <div style={{ padding: 20, fontSize: 13, color: "var(--fj-ink3)" }}>Cargando…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: 20, fontSize: 13, color: "var(--fj-ink3)" }}>
          Aún no hay abogados con causas propias sincronizadas.
        </div>
      ) : (
        rows.map((r, i) => {
          const sync = fmtSync(r.last_synced_at);
          return (
            <div key={r.id} style={{
              display: "grid", gridTemplateColumns: "1.4fr 0.8fr 1.4fr 1fr", gap: 12,
              alignItems: "center", padding: "13px 20px", fontSize: 13,
              borderBottom: i === rows.length - 1 ? undefined : "1px solid var(--fj-line)",
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--fj-ink)" }}>{r.name}</div>
                <div style={{ fontFamily: "var(--fj-mono)", fontSize: 11, color: "var(--fj-ink3)" }}>{r.rut}</div>
              </div>
              <div style={{ color: "var(--fj-ink2)", fontVariantNumeric: "tabular-nums" }}>{r.case_count} causas</div>
              <div style={{ color: sync.color, fontWeight: 500 }}>{sync.label}</div>
              <div style={{ color: r.stale_count > 0 ? "var(--fj-amarillo)" : "var(--fj-verde)", fontVariantNumeric: "tabular-nums" }}>
                {r.stale_count > 0 ? `${r.stale_count} desactualizadas` : "al día"}
              </div>
            </div>
          );
        })
      )}
    </Card>
  );
}
