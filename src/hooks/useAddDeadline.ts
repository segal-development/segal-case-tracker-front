import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";

interface AddDeadlineVars {
  caseId: string;
  deadline_type: string;
  due_date: string;
}

export function useAddDeadline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, deadline_type, due_date }: AddDeadlineVars) =>
      apiPost<unknown>(`/cases/${caseId}/deadlines`, { deadline_type, due_date }),
    onSuccess: (_data, { caseId }) => {
      qc.invalidateQueries({ queryKey: ["deadlines", caseId] });
      qc.invalidateQueries({ queryKey: ["causas"] });
    },
  });
}
