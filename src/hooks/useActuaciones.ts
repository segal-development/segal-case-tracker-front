import { useQuery } from "@tanstack/react-query";
import type { Actuacion } from "@/data/types";
import { apiGet } from "@/lib/api";
import { movementToActuacion, type MovementResponse } from "@/lib/adapters";

export function useActuaciones(causaId?: string) {
  return useQuery<Actuacion[]>({
    queryKey: ["actuaciones", causaId],
    enabled: Boolean(causaId),
    queryFn: async () => {
      const data = await apiGet<MovementResponse[]>(`/cases/${causaId}/movements`);
      return data.map(movementToActuacion);
    },
  });
}
