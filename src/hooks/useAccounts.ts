import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut } from "@/lib/api";

export interface Account {
  id: number;
  rut: string;
  name: string;
  email: string | null;
  role: string;
  has_password: boolean;
}

/** Admin-only: list lawyer accounts (email, role, whether a password is set). */
export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: () => apiGet<Account[]>("/lawyers/accounts"),
  });
}

export interface AccountUpdate {
  id: number;
  email?: string;
  role?: string;
  new_password?: string;
}

export function useSetAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: AccountUpdate) =>
      apiPut<Account>(`/lawyers/${id}/account`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}
