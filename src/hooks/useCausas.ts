import { useQuery } from "@tanstack/react-query";
import type { Abogado, Causa } from "@/data/types";
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
        return first.items.map((item) => caseToCausa(item, derivedAbogado));
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

      // Paginating by a non-unique sort (criticidad) can return the same case on
      // more than one page → dedupe by id to avoid duplicate React keys, doubled
      // cards, and inflated counts. (Backend follow-up: stable secondary sort.)
      const seen = new Set<string>();
      const unique: Causa[] = [];
      for (const item of allItems) {
        const causa = caseToCausa(item, derivedAbogado);
        if (!seen.has(causa.id)) {
          seen.add(causa.id);
          unique.push(causa);
        }
      }
      return unique;
    },
  });
}
