import { useQuery } from "@tanstack/react-query";
import type { Abogado, Causa } from "@/data/types";
import { apiGet } from "@/lib/api";
import { caseToCausa, type CaseResponse } from "@/lib/adapters";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";

interface CaseDetail {
  case: CaseResponse;
}

export function useCausa(id: string) {
  const { abogado } = useSelectedLawyer();
  const derivedAbogado: Abogado | undefined = abogado
    ? {
        id: abogado.rut,
        nombre: abogado.nombre,
        iniciales: (() => {
          const parts = abogado.nombre.split(/\s+/).filter(Boolean);
          return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "SD";
        })(),
        color: "#6366f1",
      }
    : undefined;

  return useQuery<Causa | undefined>({
    queryKey: ["causa", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await apiGet<CaseDetail>(`/cases/${id}`);
      return caseToCausa(data.case, derivedAbogado);
    },
  });
}
