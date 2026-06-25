import { useQuery } from "@tanstack/react-query";
import type { Abogado, Causa } from "@/data/types";
import { apiGet } from "@/lib/api";
import { caseToCausa, type CaseResponse } from "@/lib/adapters";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
import { useMe } from "@/hooks/useMe";

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
  const { data: me } = useMe();
  const isAuditor = me?.role === "auditor";
  const rut = abogado?.rut ?? null;

  // The auditor is transversal: show EVERY study case with its REAL lawyer, and
  // do NOT filter by the selected-lawyer stub (it would match no cases).
  const derivedAbogado: Abogado | undefined = (abogado && !isAuditor)
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

  const fetchPage = (page: number) =>
    apiGet<CasesPage>("/cases", {
      per_page: 100,
      sort_by: "criticidad",
      page,
      // auditor: no abogado_rut → all study cases (backend already scopes to the firm)
      ...(!isAuditor && rut ? { abogado_rut: rut } : {}),
    });

  return useQuery<Causa[]>({
    queryKey: ["causas", isAuditor ? "_auditor_all" : rut],
    enabled: isAuditor ? !!me : rut !== null,
    queryFn: async () => {
      const first = await fetchPage(1);
      const totalPages = Math.min(first.pages, MAX_PAGES);

      if (totalPages <= 1) {
        return first.items.map((item) => caseToCausa(item, derivedAbogado));
      }

      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)),
      );

      const allItems = [...first.items, ...rest.flatMap((p) => p.items)];

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
