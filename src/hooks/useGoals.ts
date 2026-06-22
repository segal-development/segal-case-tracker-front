import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/lib/api";

/** Firm-wide goals (metas), key → integer value. e.g. { monthly_productivity: 120 }. */
export type Goals = Record<string, number>;

export function useGoals() {
  return useQuery<Goals>({
    queryKey: ["goals"],
    queryFn: () => apiGet<Goals>("/goals"),
  });
}

export function useSetGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: number }) =>
      apiPut<{ key: string; value: number }>(`/goals/${key}`, { value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
