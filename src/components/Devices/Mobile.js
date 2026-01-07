import {
  faBars,
  faSignOutAlt,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Cancel from "../../../static/assets/images/cancel.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import MobileSidebar from "../navigation/MobileSidebar";
import * as authActions from "../../store/actions/auth";

const Mobile = (props) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ NUEVO: hide/show header en Reels
  const [headerHidden, setHeaderHidden] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  // ✅ detecta ruta reels (ajusta si tu path exacto es otro)
  const isReelsRoute = useMemo(() => {
    const p = String(location?.pathname || "").toLowerCase();
    // funciona si tu ruta contiene "reelspch" o "reels"
    return p.includes("reelspch") || p.includes("/reels");
  }, [location?.pathname]);

  const handleSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSignOut = () => {
    dispatch(authActions.logout());
  };

  // ✅ 1) Al entrar a ReelsPCH => header oculto desde el inicio
  useEffect(() => {
    if (isReelsRoute) {
      setHeaderHidden(true);
      // opcional: si no quieres que se abran menús sobre reels al entrar
      setOptionsOpen(false);
      setSidebarOpen(false);
    } else {
      setHeaderHidden(false);
    }
  }, [isReelsRoute]);

  // ✅ 2) Auto-hide por scroll del contenedor de reels (.reels-container)
  useEffect(() => {
    if (!isReelsRoute) return;

    let cancelled = false;
    let cleanup = null;

    const attach = (tries = 0) => {
      if (cancelled) return;

      const el = document.querySelector(".reels-container");
      if (!el) {
        // espera a que ReelsPCH monte el contenedor
        if (tries < 25) setTimeout(() => attach(tries + 1), 80);
        return;
      }

      let last = el.scrollTop;

      const onScroll = () => {
        const st = el.scrollTop;
        const delta = st - last;

        // umbral para evitar parpadeo
        if (Math.abs(delta) < 6) return;

        // swipe up => scroll down => ocultar
        if (delta > 0) setHeaderHidden(true);
        else setHeaderHidden(false);

        last = st;
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => el.removeEventListener("scroll", onScroll);
    };

    attach();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [isReelsRoute]);

  return (
    <div
      className={[
        "base-mobile",
        isReelsRoute ? "is-reels" : "",
        isReelsRoute && headerHidden ? "header-hidden" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="header">
        <div className="left">
          {sidebarOpen ? (
            <button
              className="icon-left"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                height: "20px",
                width: "20px",
                background: "url(" + Cancel + ") no-repeat",
                backgroundSize: "35px",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <FontAwesomeIcon
              className="icon-left"
              icon={faBars}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          )}
        </div>

        <div className="right">
          <FontAwesomeIcon
            className="user-icon"
            icon={faUserCircle}
            onClick={() => setOptionsOpen(!optionsOpen)}
          />
        </div>
      </div>

      <div className="body">
        <MobileSidebar
          isOpen={sidebarOpen}
          match={props.match}
          handleSidebar={handleSidebar}
        />

        <div className={optionsOpen ? "mobileOptions" : "mobileOptions collapse"}>
          <Link to="/dashboard/profile" onClick={() => setOptionsOpen(!optionsOpen)}>
            <div className="options-link">
              <FontAwesomeIcon className="options-icon" icon={faUser} />
              Profile
            </div>
          </Link>

          <div className="options-link" onClick={() => handleSignOut()}>
            <FontAwesomeIcon className="options-icon" icon={faSignOutAlt} />
            Logout
          </div>
        </div>

        {props.children}
      </div>
    </div>
  );
};

export default Mobile;
