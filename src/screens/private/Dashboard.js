import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import * as authActions from "../../store/actions/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cancel from "../../../static/assets/images/cancel.png"
import Sidebar from "../../components/navigation/Sidebar";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { AuthLinks, UnAuthLinks } from "../../components/Dashboard/AuthorizedLinks";
import Mobile from "../../components/Devices/Mobile";

const Dashboard = ({ match }) => {
  const subscription = useSelector((state) => state.auth.subscriptionStatus);
  const isAuthenticated = localStorage.getItem("userTokenLG");
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 800px)",
  });
  const [sidebarOpen, setSidebarOpen] = useState(
    isTabletOrMobileDevice ? false : true
  );
  const [optionsOpen, setOptionsOpen] = useState(false);

  const handleSidebar = () => {
    if (isTabletOrMobileDevice) {
      setSidebarOpen(false);
    }
  };

  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(authActions.logout());
  };

  if (!isAuthenticated) {
    return <Redirect to="/app/login" />;
  }

  if (!subscription) {
    return null;
  }

  if (isTabletOrMobileDevice) {
    return (
      <Mobile match={match}>
        {subscription.active ? (
          <AuthLinks match={match} />
        ) : (
          <UnAuthLinks match={match} />
        )}
      </Mobile>
    );
  }

  return (
    <div className="base-desktop">
      <div className={sidebarOpen ? "logo" : "logo collapse"}>
        Lebaron Galeana
      </div>
      <div className="header">
        <div className="header-left">
          {
            sidebarOpen ? 
              <button
                className="sidebar-icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  height: "20px",
                  width: "20px",
                  background: "url(" + Cancel + ") no-repeat",
                  backgroundSize: "35px",
                  backgroundPosition: "center",
                }}
              />
            :
              <FontAwesomeIcon
                className="sidebar-icon"
                icon="bars"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
          }
        </div>
        <div></div>

        <div
          className="header-right"
          onClick={() => setOptionsOpen(!optionsOpen)}
        >
          <FontAwesomeIcon className="user-icon" icon="user-circle" />
          <p>My Account</p>
          {optionsOpen ? (
            <FontAwesomeIcon className="account-icon" icon="caret-up" />
          ) : (
            <FontAwesomeIcon className="account-icon" icon="caret-down" />
          )}
        </div>

        {/* <div className="exchangeWrapper">
          <Exchange />
        </div> */}
      </div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        handleSidebar={() => handleSidebar()}
        match={match}
      />
      <div className="body">
        {/* Start Options */}
        {optionsOpen ? (
          <div className="options-container">
            <Link
              to="/dashboard/profile"
              className="options-link"
              onClick={() => setOptionsOpen(!optionsOpen)}
            >
              <FontAwesomeIcon className="options-icon" icon="user" />
              Profile
            </Link>
            <div className="options-link" onClick={() => handleSignOut()}>
              <FontAwesomeIcon className="options-icon" icon="sign-out-alt" />
              Logout
            </div>
          </div>
        ) : null}
        {/* End Options */}
        {subscription.active ? (
          <AuthLinks match={match} />
        ) : (
          <UnAuthLinks match={match} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
