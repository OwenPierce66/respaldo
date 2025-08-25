import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import AccountDetailsForm from "./AccountDetails";
import CreateAccount from "./CreateAccount";
import * as authActions from "../../../store/actions/auth";
import { connect } from "react-redux";

class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        username: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
      },
      active: "CreateAccount",
      isLoading: false,
      stage: 1,
      redirect: false,
      userId: null,
    };

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleAccountDetails = this.handleAccountDetails.bind(this);
  }

  handleCreateAccount(data) {
    let userData = { ...this.state.data };
    userData.username = data.username;
    userData.email = data.email;
    userData.password = data.password;

    this.setState({
      active: "AccountDetails",
      stage: 2,
      data: userData,
    })
  }

  handleAccountDetails(data) {
    this.setState({
      active: "",
      isLoading: true,
    });

    let userData = {
      user: {
        email: this.state.data.email,
        username: this.state.data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        password: this.state.data.password,
      },
      profile: {
        middle_name: data.middle_name,
        phone_number: data.phone,
      },
    };

    this.props.createUser(userData).then(() => {
      this.setState({
        userId: this.props.user.id,
        redirect: true,
      });
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={`/registration/subscription/${this.props.user.id}`} />;
    }

    return (
      <div className="registration">
        <div className="header">
          <div className="left">LG</div>
          <div className="center">
            <p className={this.state.stage >= 1 ? "active" : null}>Account</p>
            <p className={this.state.stage >= 2 ? "active" : null}>Details</p>
            <p className={this.state.stage >= 3 ? "active" : null}>
              Subscription
            </p>
            <p>Start</p>
          </div>
          <div className="right">
            <p>Already using?</p>
            <Link className="link" to="/app/login">Sign In</Link>
          </div>
        </div>
        <div className="body">
          {this.state.isLoading ? (
            <div className="loadingContainer">
              <ClipLoader size={150} color={"#36D7B7"} />
            </div>
          ) : null}
          {this.state.active === "CreateAccount" ? (
            <CreateAccount handleCreateAccount={this.handleCreateAccount} />
          ) : null}
          {this.state.active === "AccountDetails" ? (
            <AccountDetailsForm
              handleAccountDetails={this.handleAccountDetails}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createUser: (userData) => dispatch(authActions.createUser(userData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
