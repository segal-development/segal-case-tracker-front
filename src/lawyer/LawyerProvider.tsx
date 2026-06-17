import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { LawyerRosterItem } from "@/hooks/useLawyers";

const STORAGE_KEY = "sd_abogado";

interface LawyerContextValue {
  abogado: LawyerRosterItem | null;
  setAbogado: (item: LawyerRosterItem) => void;
  clear: () => void;
}

const LawyerContext = createContext<LawyerContextValue | null>(null);

export function LawyerProvider({ children }: { children: ReactNode }) {
  const [abogado, setAbogadoState] = useState<LawyerRosterItem | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LawyerRosterItem) : null;
    } catch {
      return null;
    }
  });

  const setAbogado = (item: LawyerRosterItem) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    setAbogadoState(item);
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAbogadoState(null);
  };

  return (
    <LawyerContext.Provider value={{ abogado, setAbogado, clear }}>
      {children}
    </LawyerContext.Provider>
  );
}

export function useSelectedLawyer(): LawyerContextValue {
  const ctx = useContext(LawyerContext);
  if (!ctx) throw new Error("useSelectedLawyer must be used inside LawyerProvider");
  return ctx;
}
