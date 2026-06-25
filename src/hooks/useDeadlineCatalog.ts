import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface DeadlineCatalogItem {
  value: string;
  label: string;
  dias: number;
  legal_basis: string;
  is_fatal: boolean;
}

export function useDeadlineCatalog() {
  return useQuery<DeadlineCatalogItem[]>({
    queryKey: ["deadlineCatalog"],
    queryFn: () => apiGet<DeadlineCatalogItem[]>("/cases/deadlines/catalog"),
    staleTime: 60 * 60 * 1000,
  });
}
