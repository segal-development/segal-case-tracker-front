import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";

interface AddDeadlineVars {
  caseId: string;
  deadline_type: string;
  /** Date the deadline starts running; the backend derives due_date = start + N días hábiles. */
  start_date: string;
}

export function useAddDeadline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, deadline_type, start_date }: AddDeadlineVars) =>
      apiPost<unknown>(`/cases/${caseId}/deadlines`, { deadline_type, start_date }),
    onSuccess: (_data, { caseId }) => {
      qc.invalidateQueries({ queryKey: ["deadlines", caseId] });
      qc.invalidateQueries({ queryKey: ["causas"] });
    },
  });
}
