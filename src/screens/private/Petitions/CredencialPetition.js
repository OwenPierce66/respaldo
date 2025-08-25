import Axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router";
import Cookies from "js-cookie";

export default class DoYouHaveACredencial extends Component {
  constructor(props) {
    super(props);

    this.state = { has_credencial: false, expiration_date: null, error: null };
  }

  checkIfAlreadyExistingEntry = () => {
    const token = localStorage.getItem("userTokenLG");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    Axios.get(
      "http://localhost:8000/api/petition/do-you-have-a-credencial",
      options
    )
      .then((res) => {
        this.setState({
          existingEntry: res.data.existingEntry,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.existingEntry) {
      this.setState({
        error: "You have already responded to this petition"
      })
      return;
    }

    const data = {
      ...this.state,
    };
    delete data.existingEntry;

    const token = localStorage.getItem("userTokenLG");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    Axios.post(
      "http://localhost:8000/api/petition/do-you-have-a-credencial",
      data,
      options
    )
      .then(() => {
        this.checkIfAlreadyExistingEntry();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  componentDidMount() {
    this.checkIfAlreadyExistingEntry();
  }

  render() {
    return (
      <form className="representative-form" onSubmit={this.handleSubmit}>
        <h1>Do you have a credencial?</h1>

        <h3>
          We at LebaronGaleana, with guidance from our community, our looking to
          find out who in our community has a Mexican Credencial so we can help
          everyone be involved in our communities future.
          <br></br>
          <br></br>Please help us by letting us know whether or not you have a
          credencial, and when it expires so we can help remind you when to
          renew and vote.
        </h3>

        {this.state.error ? <div style={{color: "red"}}>{this.state.error}</div> : null}


        <div className="checkbox-container">
          <label htmlFor="hasCredencialCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="hasCredencialCheckbox"
              name="has_credencial"
              checked={this.state.has_credencial}
              onChange={(e) => this.handleInputChange(e)}
            />
            Please check this box if you have a credencial.
          </label>
        </div>
        {this.state.has_credencial === true ? (
          <div className="input-container">
            <label htmlFor="expirationDate" className="input-wrapper">
              Please let us know what year your credencial will expire: {"  "}
              <input
                type="number"
                id="expirationDate"
                name="expiration_date"
                min="2000"
                max="2099"
                step="1"
                onChange={(e) => this.handleInputChange(e)}
              />
            </label>
          </div>
        ) : null}

        <div className="submit-wrapper">
          <button className="submit" type="submit">
            Submit
          </button>
        </div>
      </form>
    );
  }
}
