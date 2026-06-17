import { useQuery } from "@tanstack/react-query";
import { PLAZOS } from "@/data/mock";
import type { Plazo } from "@/data/types";

export function usePlazos() {
  return useQuery<Plazo[]>({
    queryKey: ["plazos"],
    queryFn: () => Promise.resolve(PLAZOS),
  });
}
