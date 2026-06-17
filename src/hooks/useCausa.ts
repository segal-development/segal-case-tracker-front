import { useQuery } from "@tanstack/react-query";
import type { Causa } from "@/data/types";
import { apiGet } from "@/lib/api";
import { caseToCausa, type CaseResponse } from "@/lib/adapters";

interface CaseDetail {
  case: CaseResponse;
}

export function useCausa(id: string) {
  return useQuery<Causa | undefined>({
    queryKey: ["causa", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await apiGet<CaseDetail>(`/cases/${id}`);
      return caseToCausa(data.case);
    },
  });
}
