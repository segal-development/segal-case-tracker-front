import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface LawyerRosterItem {
  rut: string;
  nombre: string;
  case_count: number;
}

export function useLawyers() {
  return useQuery<LawyerRosterItem[]>({
    queryKey: ["lawyers"],
    queryFn: () => apiGet<LawyerRosterItem[]>("/lawyers"),
  });
}
