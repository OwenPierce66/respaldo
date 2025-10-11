import React, { Component } from "react";
import Sidebar from "../../src/components/layout/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

class Base extends Component {
  constructor() {
    super();

    this.state = {
      sidebarOpen: false,
      menuOpen: false,
      optionsOpen: false,
      width: window.innerWidth,
    };
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  // --- Logout handler ---
  handleLogout = () => {
    localStorage.removeItem("userTokenLG"); // borra token
    window.location.href = "/app"; // redirige al login/landing
  };

  render() {
    const { width } = this.state;
    const isMobile = width <= 500;

    if (isMobile) {
      return (
        <div className="base-mobile">
          <div className="header">
            <div className="header-left">
              <FontAwesomeIcon
                className="header-icon"
                icon="bars"
                onClick={() => {
                  this.setState({
                    menuOpen: !this.state.menuOpen,
                    optionsOpen: false,
                  });
                }}
              />
            </div>
            <div className="header-center">
              <p>Lebaron Galeana</p>
            </div>
            <div className="header-right">
              <FontAwesomeIcon
                className="header-icon"
                icon="ellipsis-v"
                onClick={() => {
                  this.setState({
                    optionsOpen: !this.state.optionsOpen,
                    menuOpen: false,
                  });
                }}
              />
            </div>
          </div>

          <div className="body">
            {/* Opciones (Perfil + Logout) */}
            <div
              className={
                this.state.optionsOpen ? "options display" : "options hide"
              }
            >
              <div className="options-title">Options</div>
              <Link to="/dashboard/profile" className="options-link">
                Profile
              </Link>
              <button className="options-link" onClick={this.handleLogout}>
                Logout
              </button>
            </div>

            {/* Menú de navegación */}
            <div
              className={this.state.menuOpen ? "menu display" : "menu hide"}
            >
              <div className="menu-title">Menu</div>
              <Link to="/dashboard" className="menu-link">Dashboard</Link>
              <Link to="/dashboard/blog" className="menu-link">Blog</Link>
              <Link to="/dashboard/petitions" className="menu-link">Petitions</Link>
              <Link to="/dashboard/contact" className="menu-link">Contact</Link>
            </div>

            <p>Dashboard</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="base-desktop">
          <div className={this.state.sidebarOpen ? "logo" : "logo collapse"}>
            Lebaron Galeana
          </div>

          <div className="header">
            <div className="header-left">
              <FontAwesomeIcon
                className="sidebar-icon"
                icon="bars"
                onClick={() => {
                  this.setState({
                    sidebarOpen: !this.state.sidebarOpen,
                  });
                }}
              />
            </div>
            <div>{/* Header */}</div>
            <div
              className="header-right"
              onClick={() => {
                this.setState({ optionsOpen: !this.state.optionsOpen });
              }}
            >
              <FontAwesomeIcon className="user-icon" icon="user-circle" />
              <p>My Account</p>
              {this.state.optionsOpen ? (
                <FontAwesomeIcon className="account-icon" icon="caret-up" />
              ) : (
                <FontAwesomeIcon className="account-icon" icon="caret-down" />
              )}
            </div>
          </div>

          <Sidebar sidebarOpen={this.state.sidebarOpen} />

          <div className="body">
            {this.state.optionsOpen ? (
              <div className="">
                <Link to="/dashboard/profile" className="options-link">
                  <FontAwesomeIcon className="options-icon" icon="user" />
                  Edit Profile
                </Link>
                <button
                  className="options-link"
                  onClick={this.handleLogout}
                >
                  <FontAwesomeIcon
                    className="options-icon"
                    icon="sign-out-alt"
                  />
                  Logout
                </button>
              </div>
            ) : null}
            Body
          </div>
        </div>
      );
    }
  }
}

export default Base;
