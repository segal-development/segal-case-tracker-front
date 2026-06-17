import { useQuery } from "@tanstack/react-query";
import { TENDENCIA } from "@/data/mock";
import type { TrendDay } from "@/data/types";

export function useTrends() {
  return useQuery<TrendDay[]>({
    queryKey: ["trends"],
    queryFn: () => Promise.resolve(TENDENCIA),
  });
}
