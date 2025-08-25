import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Axios from "axios";

class AdminDirectoryCreate extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      phone_number: "",
      latitude: "",
      longitude: "",
      category: "",
      message: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    Axios.post(
      "http://127.0.0.1:8000/api/adminDirectory/",
      {
        name: this.state.name,
        phone_number: this.state.phone_number,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        category: this.state.category,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        if (res.data.status === "Success") {
          this.setState({
            name: "",
            phone_number: "",
            latitude: "",
            longitude: "",
            category: "",
            message: "Successfully Created Directory Item.",
          });
        } else {
          this.setState({
            message: "Action Unsuccessful, please try again.",
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  render() {
    return (
      <div className="admin-directory">
        <div className="card-container">
          <div className="card-header">
            {this.state.message ? <div>{this.state.message}</div> : null}
          </div>
          <div className="card-body">
            <form className="directory-form" onSubmit={this.handleSubmit}>
              <div className="input-container">
                <div className="form-input">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-input">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={this.state.phone_number}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-input">
                  <label>Latitude:</label>
                  <input
                    type="text"
                    name="latitude"
                    value={this.state.latitude}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-input">
                  <label>Longitude:</label>
                  <input
                    type="text"
                    name="longitude"
                    value={this.state.longitude}
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-input">
                  <label>Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={this.state.category}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="button-container">
                <button className="form-button" type="submit">
                  <FontAwesomeIcon icon="plus" />
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDirectoryCreate;
