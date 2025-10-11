import React, { useState } from "react";
import { Link, Routes, Route, Navigate, useResolvedPath } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./authentication/Login";
import Home from "./Home";
import TheButton from "../../components/navigation/Button";
import Directory from "./directory/Directory";
import Exchange from "./Exchange";
import ForgotPassword from "./authentication/forgotpassword";
import ResetPassword from "./authentication/resetPassword";

const Landing = () => {
  const resolved = useResolvedPath(""); // ruta base
  const baseUrl = resolved.pathname;

  const user = useSelector((state) => state.auth.isAuthenticated);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <div className="navbar">
        <div className="navbar-top">
          <TheButton toggleSidebarView={() => setIsSideBarOpen(!isSideBarOpen)} />

          <div className="brand">
            <span className="desktop-only">Lebaron</span>
            {/* <img
              className="brand-logo"
              src={require("../../../static/assets/images/lg-tree-transparent.svg")}
            /> */}
            <span className="desktop-only">Galeana</span>
          </div>
        </div>

        <div className={isSideBarOpen ? "navbar-bottom  navbar-active" : "navbar-bottom"}>
          <div className="navlinks-container">
            <Link className="link" to="/app">
  Home
</Link>
<Link className="link" to="/app/directory">
  Directory
</Link>
<Link className="link" to="/app/exchange">
  Exchange
</Link>
<Link className="link" to="/registration">
  Sign Up
</Link>
<Link className="link" to="/app/login">
  Login
</Link>

          </div>
        </div>
      </div>

      <div style={{ background: '#7b113e', color: 'white', padding: '40px', fontSize: '1.5em' }}>
        FREE ACCESS{" "}
        <button style={{ padding: '10px', fontWeight: 'bold', borderRadius: '10px', fontSize: '1em', background: 'black' }}>
          <a href="https://lebarontoday.com/" target="_blank" style={{ color: '#1ae5da' }}>LEBARONTODAY.COM</a>
        </button>{" "}
        FOR CURRENT EVENTS
      </div>

      <div className="component-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/forgot-password/:tokenId" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  );
};

export default Landing;
