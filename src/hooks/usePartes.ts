import { useQuery } from "@tanstack/react-query";
import type { Parte } from "@/data/types";
import { apiGet } from "@/lib/api";

interface DetailEntities {
  litigantes: Parte[];
}

export function usePartes(causaId?: string) {
  return useQuery<Parte[]>({
    queryKey: ["partes", causaId],
    enabled: Boolean(causaId),
    queryFn: async () => {
      const data = await apiGet<DetailEntities>(`/cases/${causaId}/detail-entities`);
      return data.litigantes;
    },
  });
}
