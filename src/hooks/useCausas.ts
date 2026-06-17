import { useQuery } from "@tanstack/react-query";
import type { Causa } from "@/data/types";
import { apiGet } from "@/lib/api";
import { caseToCausa, type CaseResponse } from "@/lib/adapters";

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
  return useQuery<Causa[]>({
    queryKey: ["causas"],
    queryFn: async () => {
      // Fetch page 1 to learn total page count; criticidad sort puts the
      // most urgent cases first so we honour that across all pages.
      const first = await apiGet<CasesPage>("/cases", {
        per_page: 100,
        sort_by: "criticidad",
        page: 1,
      });

      const totalPages = Math.min(first.pages, MAX_PAGES);

      if (totalPages <= 1) {
        return first.items.map(caseToCausa);
      }

      // Fetch remaining pages in parallel; surface any per-page error via
      // the query's error boundary (Promise.all rejects on first failure).
      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          apiGet<CasesPage>("/cases", {
            per_page: 100,
            sort_by: "criticidad",
            page: i + 2,
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
