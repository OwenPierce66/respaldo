import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./screens/private/Dashboard";
import Landing from "./screens/public/Landing";
import requireAuth from "./components/HOC/requireAuth";
import { connect } from "react-redux";
import * as authActions from "./store/actions/auth";
import RegistrationNav from "./screens/public/registration/RegistrationNav";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.autoLogin();
  }

  render() {
    const isAuthenticated = localStorage.getItem("userTokenLG");

    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return isAuthenticated ? (
                <Redirect to="/dashboard" />
              ) : (
                <Redirect to="/app" />
              );
            }}
          />
          <Route path="/app" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/registration" component={RegistrationNav} />
        </Switch>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    autoLogin: () => dispatch(authActions.autoLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
