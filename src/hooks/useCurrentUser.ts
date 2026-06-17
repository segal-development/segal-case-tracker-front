import { useQuery } from "@tanstack/react-query";
import { USUARIOS } from "@/data/mock";
import { useRole } from "./useRole";
import type { Usuario } from "@/data/types";

export function useCurrentUser() {
  const { role } = useRole();
  return useQuery<Usuario>({
    queryKey: ["currentUser", role],
    queryFn: () => Promise.resolve(USUARIOS[role]),
  });
}
