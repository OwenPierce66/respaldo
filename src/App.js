import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "./store/actions/auth";

// Componentes
import Dashboard from "./screens/private/Dashboard";
import Landing from "./screens/public/Landing";
import RegistrationNav from "./screens/public/registration/RegistrationNav";
import Admin from "./screens/private/Admin/Admin";

// HOCs
import RequireAuth from "./components/HOC/requireAuth";
import RequireAdmin from "./components/HOC/requireAdmin";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(authActions.autoLogin());
  }, [dispatch]);

  return (
    <Routes>
      {/* Redirección de la raíz */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/app" replace />
          )
        }
      />

      {/* Pantallas públicas */}
      <Route path="/app/*" element={<Landing />} />
      <Route path="/registration" element={<RegistrationNav />} />

      {/* Pantallas privadas */}
<Route
  path="/dashboard/*"
  element={
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  }
/>


      {/* Rutas de Admin */}
      <Route
        path="/dashboard/admin/*"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />


{/* Fallback */}
<Route path="*" element={<Navigate to="/app" replace />} />

    </Routes>
  );
};

export default App;
