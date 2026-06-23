import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface SyncStatus {
  id: number;
  rut: string;
  name: string;
  email: string | null;
  role: string;
  case_count: number;
  last_synced_at: string | null;
  stale_count: number;
}

/** Admin/operator: per-abogado sync freshness (least-recently-synced first). */
export function useSyncStatus() {
  return useQuery<SyncStatus[]>({
    queryKey: ["syncStatus"],
    queryFn: () => apiGet<SyncStatus[]>("/lawyers/sync-status"),
  });
}
