import { createElement, createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Role = "abogado" | "supervisor" | "admin";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("abogado");
  return createElement(
    RoleContext.Provider,
    { value: { role, setRole } },
    children,
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
