import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface AuditedDeadline {
  id: number;
  case_id: number;
  rol: string;
  caratula: string;
  deadline_type: string;
  label: string;
  legal_basis: string | null;
  due_date: string;
  triggered_at: string;
  status: "cumplido" | "no_cumplido";
  is_manual: boolean;
  marked_at: string | null;
  abogado_nombre: string | null;
}

/**
 * Audited deadlines (cumplido / no_cumplido) for the caller's cases.
 * Backend scopes auditors to the whole firm; regular lawyers see their own.
 */
export function useAuditedDeadlines() {
  return useQuery<AuditedDeadline[]>({
    queryKey: ["audited-deadlines"],
    queryFn: () => apiGet<AuditedDeadline[]>("/cases/deadlines/audited"),
    staleTime: 60 * 1000,
  });
}
