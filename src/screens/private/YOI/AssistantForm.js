import React, { Component } from "react";
import moment from "moment";
import Axios from "axios";

class AssistantForm extends Component {
  constructor() {
    super();

    this.state = {
      formData: {
        attended: null,
        years: null,
        reasonOne: null,
        reasonTwo: null,
        giftOne: null,
        giftTwo: null,
        giftThree: null,
        suggestionOne: null,
        suggestionTwo: null,
        suggestionThree: null,
        classOne: null,
        classTwo: null,
        signature: null,
        date: moment().format("mm/dd/yyyy"),
      },
      errors: null,
      success: false,
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    Axios.post(
      "http://127.0.0.1:8000/api/YOI_Assistant/",
      {
        data: this.state.data,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.success) {
        this.setState({
          success: true,
        });
      } else {
        this.setState({
          errors: "Something Went Wrong, Try Again",
          submitted: false,
        });
      }
    });
  }

  render() {
    if (this.state.success) {
      return (
        <div className="success">
          <p>Successful Submission</p>
        </div>
      );
    }
    return (
      <div className="assistantForm">
        <div className="formWrapper">
          {this.state.errors ? (
            <p className="error">{this.state.errors}</p>
          ) : null}
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <p className="pageHeader">
                The Youth of Israel Assistant Commitment
              </p>
            </div>
            <div className="row">
              <p>
                <b>We take this calling very seriously,</b> therefore please
                take your time to read and fill out this application thoughtfully
                and prayerfully. Thank you!
              </p>
            </div>
            <div className="row">
              <ol className="formList" type="1">
                <li>
                  <div className="inputWrapper">
                    <label htmlFor="">
                      Have You attended the Youth of Israel before?
                    </label>
                    <select
                      name="attended"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Please Choose...
                      </option>
                      <option value="yes">Yes</option>
                      <option value="yes">No</option>
                    </select>
                  </div>
                  <div className="inputWrapper">
                    <label htmlFor="">How many years?</label>
                    <input
                      type="text"
                      name="years"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </li>
                <li>
                  <div className="inputWrapper">
                    <label htmlFor="">
                      List two reasons why you want to be a volunteer:
                    </label>
                    <ol type="1">
                      <li>
                        <input
                          type="text"
                          name="reasonOne"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          name="reasonTwo"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                    </ol>
                  </div>
                </li>
                <li>
                  <div className="inputWrapper">
                    <label htmlFor="">
                      What spiritual gifts and/or strengths do you have that can
                      add to The Youth of Israel?
                    </label>
                    <ol type="1">
                      <li>
                        <input
                          type="text"
                          name="giftOne"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          name="giftTwo"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          name="giftThree"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                    </ol>
                  </div>
                </li>
                <li>
                  <div className="inputWrapper">
                    <label htmlFor="">
                      List 3 things that we can change/add to YOI to make it
                      better:
                    </label>
                    <ol type="1">
                      <li>
                        <input
                          type="text"
                          name="suggestionOne"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          name="suggestionTwo"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          name="suggestionThree"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                    </ol>
                  </div>
                </li>
                <li>
                  <div className="inputWrapper">
                    <label htmlFor="">
                      What classes/activities +/or message do you feel should be
                      given to our youth this year?
                    </label>
                    <ol type="1">
                      <li>
                        <input
                          type="text"
                          name="classOne"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          name="classTwo"
                          onChange={this.handleChange}
                          required
                        />
                      </li>
                    </ol>
                  </div>
                </li>
              </ol>
            </div>
            <div className="row">
              <div className="quoteBox">
                <p>
                  Be a light not a judge. Be a model not a critic. – Stephen
                  Covey
                </p>
                <p>
                  By becoming an assistant at The Youth of Israel you become a
                  great example to the youth. So remember to continue being that
                  even after the retreat is over.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="agreement">
                <p>
                  I agree to be on time and attend ALL of the classes and
                  activities. I understand how important my presence and
                  participation are to this program. If something comes up that
                  prevents me from attending, I will notify a “Youth of Israel”
                  leader. I am committed to giving my best towards making “Youth
                  of Israel” a great experience.
                </p>

                <div className="input">
                  <label htmlFor="">Signature (printed):</label>
                  <input
                    type="text"
                    name="signature"
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="input">
                  <label htmlFor="">Current date here:</label>
                  <input />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="submitButton">
                <button type="submit" disabled={this.state.submitted}>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AssistantForm;
