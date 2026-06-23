import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface MyStats {
  rut: string;
  nombre: string;
  case_count: number;
  rojo: number;
  amarillo: number;
  verde: number;
  outros: number;
  stale: number;
  actividad_mes: number;
  proyeccion_mes: number;
  meta: number | null;
}

export function useMyStats(opts?: { enabled?: boolean }) {
  return useQuery<MyStats>({
    queryKey: ["myStats"],
    queryFn: () => apiGet<MyStats>("/stats/me"),
    enabled: opts?.enabled ?? true,
  });
}
