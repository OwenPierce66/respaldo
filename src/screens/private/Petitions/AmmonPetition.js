import Axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router";

export default class AreYouVotingForAmmonForm extends Component {
  constructor(props) {
    super(props);

    this.state = { voting_for_ammon: true, comment: null, error: null };
  }

  checkIfAlreadyExistingEntry = () => {
    const token = localStorage.getItem("userTokenLG");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    Axios.get(
      "http://localhost:8000/api/petition/are-you-voting-for-ammon",
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
    delete data.lettersLeft;

    const token = localStorage.getItem("userTokenLG");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    Axios.post(
      "http://localhost:8000/api/petition/are-you-voting-for-ammon",
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

    this.checkLettersLeft(event);
  };

  checkLettersLeft = (event) => {
    if (event.target.type === "text" && event.target.name === "comment") {
      const result = event.target.maxLength - event.target.value.length;

      this.setState({
        lettersLeft: result,
      });
    }
  };

  componentDidMount() {
    this.checkIfAlreadyExistingEntry();
  }

  render() {
    return (
      <form className="representative-form" onSubmit={this.handleSubmit}>
        <h1>Are you voting for Ammon?</h1>

        <h3>
          We at LebaronGaleana, with guidance from our community, our looking to
          ask our community where we stand and why regarding the current
          political state.
          <br></br>
          <br></br>Please help us by letting us know whether or not you will
          vote for Ammon for Presidente Municipal if he runs again next year.
        </h3>

        {this.state.error ? <div style={{color: "red"}}>{this.state.error}</div> : null}

        <div className="checkbox-container">
          <label htmlFor="votingForAmmonCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="votingForAmmonCheckbox"
              name="voting_for_ammon"
              checked={this.state.voting_for_ammon}
              onChange={(e) => this.handleInputChange(e)}
            />
            Please check this box if you are planning to vote for Ammon this
            next electorial period.
          </label>
        </div>
        {this.state.voting_for_ammon === false ? (
          <div className="input-container">
            <label htmlFor="comment" className="input-wrapper">
              Please let us know why you aren't going to vote for Ammon:
              <input
                type="text"
                id="comment"
                name="comment"
                maxLength="300"
                onChange={(e) => this.handleInputChange(e)}
              />
              {this.state.lettersLeft ? (
                <h6>You have {this.state.lettersLeft} letters left.</h6>
              ) : null}
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
