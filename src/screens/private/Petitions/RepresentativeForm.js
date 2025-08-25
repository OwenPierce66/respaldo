import Axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router";
import Cookies from "js-cookie";

export default class RepresentativeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infrastructure_representative: false,
      security_representative: false,
      health_representative: false,
      law_representative: false,
      culture_representative: false,
      education_representative: false,
      sports_representative: false,
      treasury_representative: false,
      social_representative: false,
      info_tech_representative: false,
      misc_representative: false,
      error: null
    };
  }

  checkIfAlreadyExistingEntry = () => {
    const token = localStorage.getItem("userTokenLG");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    Axios.get("http://localhost:8000/api/petition/representative", options)
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
    delete data.confirmation;
    delete data.existingEntry;

    const token = localStorage.getItem("userTokenLG");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    Axios.post(
      "http://localhost:8000/api/petition/representative",
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
        <h1>Representative Form</h1>

        <h3>
          We at LebaronGaleana, with guidance from our community, our looking
          for public servants to help the growth and well being of our people.
          If you would like to become a part of our future, for the betterment
          of all, please fill out this form and become a Representative of our
          community's best interests.
          <br></br>
          <br></br>
          You may sign up to be a Representative of multiple aspects of our
          community by checking several boxes, if you wish.
        </h3>

        <div className="checkbox-container">
          <label htmlFor="infrastructureCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="infrastructureCheckbox"
              name="infrastructure_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Infrastructure
            <ul>
              <li>Parks</li>
              <li>Garbage</li>
              <li>Water</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="securityCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="securityCheckbox"
              name="security_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Security
            <ul>
              <li>Police</li>
              <li>Sheriffs</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="healthCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="healthCheckbox"
              name="health_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Health
            <ul>
              <li>Hospitals</li>
              <li>Community "FDA"</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="lawCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="lawCheckbox"
              name="law_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Law and Regulations
            <ul>
              <li>Understanding the Federal law</li>
              <li>Community Rules and Regulations</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="cultureCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="cultureCheckbox"
              name="culture_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Culture
            <ul>
              <li>Celebrations</li>
              <li>Preservation of our Culture</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="educationCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="educationCheckbox"
              name="education_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Education
            <ul>
              <li>Schools</li>
              <li>Public workshops/classes</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="sportsCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="sportsCheckbox"
              name="sports_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Sports
            <ul>
              <li>Teams</li>
              <li>Tournaments</li>
              <li>Gym's and other public services</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="treasuryCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="treasuryCheckbox"
              name="treasury_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Treasury
            <ul>
              <li>Funding</li>
              <li>Expenses</li>
              <li>Accounting</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="socialCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="socialCheckbox"
              name="social_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of Social Services
            <ul>
              <li>Community outreach and well being</li>
              <li>Social Checkups</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="infoTechCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="infoTechCheckbox"
              name="info_tech_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Representative of I.T.
            <ul>
              <li>Information</li>
              <li>Technology</li>
              <li>Public Websites and services</li>
              <li>Etc</li>
            </ul>
          </label>

          <label htmlFor="miscCheckbox" className="checkbox-wrapper">
            <input
              type="checkbox"
              id="miscCheckbox"
              name="misc_representative"
              onChange={(e) => this.handleInputChange(e)}
            />
            Miscellaneous: "I'm just here to help where I can."
          </label>
        </div>

        {this.state.error ? <div style={{color: "red"}}>{this.state.error}</div> : null}


        <label className="confirmation" htmlFor="confirmation">
          <input
            type="checkbox"
            id="confirmation"
            name="confirmation"
            onChange={(e) => this.handleInputChange(e)}
          />
          By submitting this form I agree to the responsibilites that may be
          entrusted in me, and do so with no malicious intent. I understand that
          the information on this site may not be final or binding, and that the
          people of the community have the final say.
        </label>

        <div className="submit-wrapper">
          <button
            disabled={!this.state.confirmation}
            className="submit"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    );
  }
}
