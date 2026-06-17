import { useQuery } from "@tanstack/react-query";
import { PROD_ABOGADOS } from "@/data/mock";
import type { ProdAbogado } from "@/data/types";

export function useProductividad() {
  return useQuery<ProdAbogado[]>({
    queryKey: ["productividad"],
    queryFn: () => Promise.resolve(PROD_ABOGADOS),
  });
}
