import { useQuery } from "@tanstack/react-query";
import type { DeadlineResponse, Plazo } from "@/data/types";
import { apiGet } from "@/lib/api";
import { deadlineItemToPlazo } from "@/lib/adapters";

export function useDeadlines(causaId?: string) {
  return useQuery<Plazo[]>({
    queryKey: ["deadlines", causaId],
    enabled: Boolean(causaId),
    queryFn: async () => {
      const data = await apiGet<DeadlineResponse>(`/cases/${causaId}/deadlines`);
      return data.active_deadlines.map((item) =>
        deadlineItemToPlazo(item, data.case_id)
      );
    },
  });
}
