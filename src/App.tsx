import { Suspense, useState, useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Splash } from "@/components/Splash";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginScreen } from "@/screens/LoginScreen";
import { PlaceholderScreen } from "@/screens/PlaceholderScreen";

// Lazy-loaded route screens — each becomes its own chunk (smaller initial bundle).
const Dashboard = lazy(() => import("@/screens/Dashboard").then((m) => ({ default: m.Dashboard })));
const Causas = lazy(() => import("@/screens/Causas").then((m) => ({ default: m.Causas })));
const CausaDetalle = lazy(() => import("@/screens/CausaDetalle").then((m) => ({ default: m.CausaDetalle })));
const Plazos = lazy(() => import("@/screens/Plazos").then((m) => ({ default: m.Plazos })));
const Productividad = lazy(() => import("@/screens/Productividad").then((m) => ({ default: m.Productividad })));
const Supervisor = lazy(() => import("@/screens/Supervisor").then((m) => ({ default: m.Supervisor })));
const Admin = lazy(() => import("@/screens/Admin").then((m) => ({ default: m.Admin })));
const Novedades = lazy(() => import("@/screens/Novedades").then((m) => ({ default: m.Novedades })));
const Showcase = lazy(() => import("@/screens/Showcase").then((m) => ({ default: m.Showcase })));
const ComoFunciona = lazy(() => import("@/screens/ComoFunciona").then((m) => ({ default: m.ComoFunciona })));
import { NuevaCausaModal, SubirDocumentoModal, NuevoPlazoModal } from "@/components/modals";
import { SelectLawyer } from "@/screens/SelectLawyer";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
import { useMe } from "@/hooks/useMe";

function RequireAuth({
  authed, hasAbogado, isAuditor, meLoading,
}: {
  authed: boolean; hasAbogado: boolean; isAuditor: boolean; meLoading: boolean;
}) {
  if (!authed) return <Navigate to="/login" replace />;
  // Wait for the role before deciding (avoids a flash to /select-lawyer for auditors).
  if (meLoading) return <Splash />;
  // The auditor is transversal: it never picks a lawyer (sees the whole study).
  if (!hasAbogado && !isAuditor) return <Navigate to="/select-lawyer" replace />;
  return <Outlet />;
}

function CausasRoute() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Causas onNuevaCausa={() => setOpen(true)} />
      {open && <NuevaCausaModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CausaDetalleRoute() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CausaDetalle onSubirDoc={() => setOpen(true)} />
      {open && <SubirDocumentoModal onClose={() => setOpen(false)} />}
    </>
  );
}

function PlazosRoute() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Plazos onNuevoPlazo={() => setOpen(true)} />
      {open && <NuevoPlazoModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("sd_authed") === "1");
  const { abogado, setAbogado } = useSelectedLawyer();
  const { data: me, isLoading: meLoading } = useMe({ enabled: authed });
  const isAuditor = me?.role === "auditor";

  // The auditor never picks a lawyer — auto-select a stub (its own rut) so the
  // case fetch activates; the backend scopes the auditor to the whole study.
  useEffect(() => {
    if (authed && isAuditor && !abogado && me) {
      setAbogado({ rut: me.rut, nombre: me.name, case_count: 0 });
    }
  }, [authed, isAuditor, abogado, me, setAbogado]);

  const login = () => {
    localStorage.setItem("sd_authed", "1");
    setAuthed(true);
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<Splash />}>
        <Routes>
          <Route
            path="/login"
            element={authed ? <Navigate to="/" replace /> : <LoginScreen onLogin={login} />}
          />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route
            path="/select-lawyer"
            element={
              !authed
                ? <Navigate to="/login" replace />
                : (abogado || isAuditor)
                  ? <Navigate to="/" replace />
                  : <SelectLawyer />
            }
          />

          <Route element={<RequireAuth authed={authed} hasAbogado={!!abogado} isAuditor={!!isAuditor} meLoading={authed && meLoading} />}>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="causas" element={<CausasRoute />} />
              <Route path="causas/:id" element={<CausaDetalleRoute />} />
              <Route
                path="plazos"
                element={
                  authed && meLoading
                    ? <Splash />
                    : (me?.role === "admin" || me?.role === "auditor")
                      ? <PlazosRoute />
                      : <Navigate to="/" replace />
                }
              />
              <Route path="productividad" element={<Productividad />} />
              <Route path="supervisor" element={<Supervisor />} />
              <Route path="admin" element={<Admin />} />
              <Route path="movil" element={<PlaceholderScreen name="Móvil" />} />
              <Route path="novedades" element={<Novedades />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
