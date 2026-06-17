import { useQuery } from "@tanstack/react-query";
import { NOTIFICACIONES } from "@/data/mock";
import type { Notificacion } from "@/data/types";

export function useNotificaciones() {
  return useQuery<Notificacion[]>({
    queryKey: ["notificaciones"],
    queryFn: () => Promise.resolve(NOTIFICACIONES),
  });
}
