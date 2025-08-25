import React, { useState } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Login from "./authentication/Login";
import Home from "./Home";
import TheButton from "../../components/navigation/Button";
import Directory from "./directory/Directory";
import Exchange from "./Exchange";
import { useSelector } from "react-redux";
import ForgotPassword from "./authentication/forgotpassword";
import ResetPassword from "./authentication/resetPassword";

const Landing = ({ match }) => {
  const { path, url } = match;
  const user = useSelector(state => state.auth.isAuthenticated);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [toggleSidebarView, seToggleSidebarView] = useState(false);

  if (user) {
    return <Redirect to="/dashboard" />
  }

  return (
    <div>
      <div className="navbar">
        <div className="navbar-top">
          <TheButton toggleSidebarView={() => setIsSideBarOpen(!isSideBarOpen)} />

          <div className="brand">
            <span className="desktop-only">Lebaron</span>
            <img
              className="brand-logo"
              src={require("../../../static/assets/images/lg-tree-transparent.svg")}
            />
            <span className="desktop-only">Galeana</span>
          </div>
        </div>

        <div
          className={
            isSideBarOpen == true
              ? "navbar-bottom  navbar-active"
              : "navbar-bottom"
          }
        >
          <div className="navlinks-container">
            <Link className="link" to={`${url}`}>
              Home
            </Link>
            <Link className="link" to={`${url}/directory`}>
              Directory
            </Link>
            <Link className="link" to={`${url}/exchange`}>
              Exchange
            </Link>
            <Link className="link" to="/registration">
              Sign Up
            </Link>
            <Link className="link" to={`${url}/login`}>
              Login
            </Link>
          </div>
        </div>
      </div>
      <div style={{ background: '#7b113e', color: 'white', padding: '40px', fontSize: '1.5em' }}>
        FREE ACCESS <button style={{ padding: '10px', fontWeight: 'bold', borderRadius: '10px', fontSize: '1em', background: 'black' }}><a href="https://lebarontoday.com/" target="_blank" style={{ color: '#1ae5da' }}>LEBARONTODAY.COM</a></button> FOR CURRENT EVENTS
      </div>
      <div className="component-wrapper">
        <Switch>
          <Route exact path={`${path}`} component={Home} />
          <Route path={`${path}/login`} component={Login} />
          <Route path={`${path}/directory`} component={Directory} />
          <Route path={`${path}/exchange`} component={Exchange} />
          <Route exact path={`${path}/forgotpassword`} component={ForgotPassword} />
          <Route path={`${path}/forgot-password/:tokenId`} component={ResetPassword} />
        </Switch>
      </div>
    </div>
  );
};

export default Landing;
