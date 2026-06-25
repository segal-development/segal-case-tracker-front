import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface LastSync {
  last_sync: string | null;
  /** Carla's most recent PJUD detail check — the true "last connection". */
  last_activity: string | null;
  status: string | null;
}

/** Last successful PJUD sync for the account's caseload (civil). Drives the
 *  sidebar "Última conexión PJUD" indicator. Refetches every minute. */
export function useLastSync() {
  return useQuery<LastSync>({
    queryKey: ["lastSync"],
    queryFn: () => apiGet<LastSync>("/sync/status", { competencia: "civil" }),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

/** Human "hace X" label. Treats naive timestamps as UTC. */
export function syncTimeAgo(iso: string | null | undefined): string {
  if (!iso) return "sin datos";
  const ts = /Z$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const mins = Math.round((Date.now() - new Date(ts).getTime()) / 60_000);
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.round(hrs / 24);
  return `hace ${days} día${days === 1 ? "" : "s"}`;
}
