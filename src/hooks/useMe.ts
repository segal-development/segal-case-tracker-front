import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface Me {
  rut: string;
  name: string;
  email: string | null;
  role: string;
}

/** Current authenticated user (incl. role) — drives admin-only UI gating. */
export function useMe(opts?: { enabled?: boolean }) {
  return useQuery<Me>({
    queryKey: ["me"],
    queryFn: () => apiGet<Me>("/auth/me"),
    staleTime: 5 * 60 * 1000,
    enabled: opts?.enabled ?? true,
  });
}
