import { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Splash } from "@/components/Splash";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginScreen } from "@/screens/LoginScreen";
import { Dashboard } from "@/screens/Dashboard";
import { Causas } from "@/screens/Causas";
import { CausaDetalle } from "@/screens/CausaDetalle";
import { Plazos } from "@/screens/Plazos";
import { Productividad } from "@/screens/Productividad";
import { Supervisor } from "@/screens/Supervisor";
import { Admin } from "@/screens/Admin";
import { PlaceholderScreen } from "@/screens/PlaceholderScreen";
import { Showcase } from "@/screens/Showcase";
import { NuevaCausaModal, SubirDocumentoModal, NuevoPlazoModal } from "@/components/modals";

function RequireAuth({ authed }: { authed: boolean }) {
  if (!authed) return <Navigate to="/login" replace />;
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
  // Persist the (mock) auth flag so direct links and refreshes keep the session.
  const [authed, setAuthed] = useState(() => localStorage.getItem("sd_authed") === "1");
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

        <Route element={<RequireAuth authed={authed} />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="causas" element={<CausasRoute />} />
            <Route path="causas/:id" element={<CausaDetalleRoute />} />
            <Route path="plazos" element={<PlazosRoute />} />
            <Route path="productividad" element={<Productividad />} />
            <Route path="supervisor" element={<Supervisor />} />
            <Route path="admin" element={<Admin />} />
            <Route path="movil" element={<PlaceholderScreen name="Móvil" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
