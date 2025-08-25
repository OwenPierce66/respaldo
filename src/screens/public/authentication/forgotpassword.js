import Axios from "axios";
import react from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      submitted: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:8000/api/forgot-password/", {
      email: this.state.email,
    })
      .then(() => {
        this.setState({
          submitted: true,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <div className="forgotPassword">
        <form className="forgotPasswordForm" onSubmit={(e) => this.handleSubmit(e)}>
          {this.state.submitted === true ? (
            <div>
              <h2>
                An email has been sent to {this.state.email} with information on
                resetting your password
              </h2>
            </div>
          ) : (
            <div className="emailWrapper">
              <h2>Please put the email associated with your account here.</h2>
              <input
                type="email"
                name="email"
                placeholder="email@email.com"
                required
                onChange={(e) => this.handleChange(e)}
              />
              <button type="submit"> Submit </button>
            </div>
          )}
        </form>
      </div>

      // <form className="forgotPassword" onSubmit={(e) => this.handleSubmit(e)}>
      //     {this.state.submitted === true ? (
      //         <react.Fragment>
      //             <h2>
      //                 An email has been sent to {this.state.email} with more information
      //   on resetting your password.
      // </h2>
      //             <Link to="/app/login">Back to login</Link>
      //         </react.Fragment>
      //     ) : (
      //         <react.Fragment>
      //             <h2>Please put the email associated with your account here.</h2>
      //             <input
      //                 type="email"
      //                 name="email"
      //                 placeholder="email@email.com"
      //                 required
      //                 onChange={(e) => this.handleChange(e)}
      //             />
      //             <button type="submit"> Submit </button>
      //         </react.Fragment>
      //     )}
      // </form>
    );
  }
}
