import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface AdminStats {
  sync: {
    last_checked_at: string | null;
    checked_24h: number;
    pending_detail: number;
    stale_30d: number;
  };
  documents: {
    stored: number;
    pending: number;
    failed: number;
    unavailable: number;
  };
  quality: {
    total_cases: number;
    with_semaforo: number;
    with_movements: number;
    with_litigantes: number;
    sin_asignar: number;
  };
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: () => apiGet<AdminStats>("/stats/admin"),
  });
}
