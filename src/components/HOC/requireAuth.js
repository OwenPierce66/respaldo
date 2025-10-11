// src/components/HOC/RequireAuth.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated === null) {
    // aún cargando (spinner opcional)
    return null;
  }

  if (!isAuthenticated) {
    // 🚨 no autenticado → mandar a login y recordar dónde estaba
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }

  // ✅ autenticado → renderiza lo que envuelvas
  return children;
};

export default RequireAuth;
