import { useQuery } from "@tanstack/react-query";
import type { Documento } from "@/data/types";
import { apiGet } from "@/lib/api";
import { docToDocumento, type DocumentResponse } from "@/lib/adapters";

export function useDocumentos(causaId?: string) {
  return useQuery<Documento[]>({
    queryKey: ["documentos", causaId],
    enabled: Boolean(causaId),
    queryFn: async () => {
      const data = await apiGet<DocumentResponse[]>(`/cases/${causaId}/documents`);
      return data.map(docToDocumento);
    },
  });
}
