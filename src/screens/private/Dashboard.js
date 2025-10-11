import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import * as authActions from "../../store/actions/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cancel from "../../../static/assets/images/cancel.png";
import Sidebar from "../../components/navigation/Sidebar";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthLinks, UnAuthLinks } from "../../components/Dashboard/AuthorizedLinks";
import Mobile from "../../components/Devices/Mobile";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux
  const subscription = useSelector((state) => state.auth.subscriptionStatus);

  // Token de autenticación
  const isAuthenticated = !!localStorage.getItem("userTokenLG");

  // Ruta actual
  const location = useLocation();
  const url = location.pathname;

  // Media query
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 800px)",
  });

  // Estados locales
  const [sidebarOpen, setSidebarOpen] = useState(!isTabletOrMobileDevice);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const handleSidebar = () => {
    if (isTabletOrMobileDevice) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleSignOut = () => {
    dispatch(authActions.logout());
  };

  // Protege la ruta
  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }

  if (!subscription) {
    return null; // Aquí podrías meter un spinner
  }

  // Vista móvil
  if (isTabletOrMobileDevice) {
    return (
      <Mobile url={url}>
        {subscription.active ? <AuthLinks /> : <UnAuthLinks />}
      </Mobile>
    );
  }

  // Vista escritorio
  return (
    <div className="base-desktop">
      {/* Logo */}
      <div className={sidebarOpen ? "logo" : "logo collapse"}>Lebaron Galeana</div>

      {/* Header */}
      <div className="header">
        <div className="header-left">
          {sidebarOpen ? (
            <button
              className="sidebar-icon"
              onClick={handleSidebar}
              style={{
                height: "20px",
                width: "20px",
                background: `url(${Cancel}) no-repeat`,
                backgroundSize: "35px",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <FontAwesomeIcon
              className="sidebar-icon"
              icon="bars"
              onClick={handleSidebar}
            />
          )}
        </div>

        <div className="header-right" onClick={() => setOptionsOpen(!optionsOpen)}>
          <FontAwesomeIcon className="user-icon" icon="user-circle" />
          <p>My Account</p>
          <FontAwesomeIcon
            className="account-icon"
            icon={optionsOpen ? "caret-up" : "caret-down"}
          />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} handleSidebar={handleSidebar} url={url} />

      {/* Body */}
      <div className="body">
        {/* Opciones de usuario */}
        {optionsOpen && (
          <div className="options-container">
            <Link
              to="/dashboard/profile"
              className="options-link"
              onClick={() => setOptionsOpen(false)}
            >
              <FontAwesomeIcon className="options-icon" icon="user" />
              Profile
            </Link>
            <div className="options-link" onClick={handleSignOut}>
              <FontAwesomeIcon className="options-icon" icon="sign-out-alt" />
              Logout
            </div>
          </div>
        )}

        {/* Contenido central */}
        {subscription.active ? <AuthLinks /> : <UnAuthLinks />}
      </div>
    </div>
  );
};

export default Dashboard;
