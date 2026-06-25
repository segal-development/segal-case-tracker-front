import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface ComputeDue {
  deadline_type: string;
  label: string;
  legal_basis: string;
  dias_habiles: number;
  is_fatal: boolean;
  start_date: string;
  due_date: string;
}

/** Preview a manual deadline's due_date = start_date + N días hábiles (CL holidays-aware).
 *  Only runs when both a deadline type and a start date are set. */
export function useComputeDue(deadlineType: string, startDate: string | null) {
  return useQuery<ComputeDue>({
    queryKey: ["computeDue", deadlineType, startDate],
    enabled: deadlineType !== "" && !!startDate,
    queryFn: () =>
      apiGet<ComputeDue>("/cases/deadlines/compute-due", {
        deadline_type: deadlineType,
        start_date: startDate as string,
      }),
  });
}
