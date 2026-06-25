import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPut } from "@/lib/api";

interface MarkDeadlineVars {
  caseId: string;
  deadlineId: number;
  status: "cumplido" | "no_cumplido" | "active";
}

export function useMarkDeadline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, deadlineId, status }: MarkDeadlineVars) =>
      apiPut<unknown>(`/cases/${caseId}/deadlines/${deadlineId}/status`, { status }),
    onSuccess: (_data, { caseId }) => {
      qc.invalidateQueries({ queryKey: ["deadlines", caseId] });
      qc.invalidateQueries({ queryKey: ["causas"] });
    },
  });
}
