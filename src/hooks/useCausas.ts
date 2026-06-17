import { useQuery } from "@tanstack/react-query";
import type { Causa } from "@/data/types";
import { apiGet } from "@/lib/api";
import { caseToCausa, type CaseResponse } from "@/lib/adapters";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";

interface CasesPage {
  items: CaseResponse[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  last_sync: string;
}

const MAX_PAGES = 60;

export function useCausas() {
  const { abogado } = useSelectedLawyer();
  const rut = abogado?.rut ?? null;

  return useQuery<Causa[]>({
    queryKey: ["causas", rut],
    enabled: rut !== null,
    queryFn: async () => {
      if (!rut) return [];

      const first = await apiGet<CasesPage>("/cases", {
        per_page: 100,
        sort_by: "criticidad",
        page: 1,
        abogado_rut: rut,
      });

      const totalPages = Math.min(first.pages, MAX_PAGES);

      if (totalPages <= 1) {
        return first.items.map(caseToCausa);
      }

      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          apiGet<CasesPage>("/cases", {
            per_page: 100,
            sort_by: "criticidad",
            page: i + 2,
            abogado_rut: rut,
          }),
        ),
      );

      const allItems = [
        ...first.items,
        ...rest.flatMap((p) => p.items),
      ];

      return allItems.map(caseToCausa);
    },
  });
}
