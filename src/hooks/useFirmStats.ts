import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface FirmSemaforo {
  rojo: number;
  amarillo: number;
  verde: number;
  otros: number;
}

export interface FirmMateriaItem {
  materia: string;
  count: number;
}

export interface FirmStageItem {
  stage: string;
  count: number;
}

export interface FirmLawyerItem {
  rut: string;
  nombre: string;
  case_count: number;
  rojo: number;
  amarillo: number;
  verde: number;
  otros: number;
  stale: number;
}

export interface FirmStats {
  totals: {
    cases: number;
    semaforo: FirmSemaforo;
    stale: number;
    by_materia: FirmMateriaItem[];
    by_procedural_state: FirmStageItem[];
  };
  by_lawyer: FirmLawyerItem[];
}

export function useFirmStats() {
  return useQuery<FirmStats>({
    queryKey: ["firmStats"],
    queryFn: () => apiGet<FirmStats>("/stats/firm"),
  });
}
