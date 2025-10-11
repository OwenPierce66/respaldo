// src/components/HOC/RequireAdmin.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (isAuthenticated === null) {
    // 🚀 aún cargando
    return null;
  }

  if (!isAuthenticated) {
    // 🚨 no autenticado → mandar a login
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }

  if (!user || !user.isAdmin) {
    // 🚨 autenticado pero no admin → mandar al dashboard o donde quieras
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ autenticado y admin
  return children;
};

export default RequireAdmin;
