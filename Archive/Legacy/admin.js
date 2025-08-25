import React, { Component } from "react";
import Axios from "axios";
import User from "../../src/components/pages/admin/user";
import RegistrationRow from "../../src/components/pages/admin/registration";
import PetitionRow from "../../src/components/pages/admin/petition";
import BlogDashboard from "../../src/components/pages/admin/blog/blogDashboard";
import Cookies from "js-cookie";

export default class Admin extends Component {
  constructor() {
    super();
    this.state = {
      activeTable: "user-table",
      selected: "blog",
      isLoaded: false,
      data: [],
      display: "user_list",
    };

    this.handleSidebar = this.handleSidebar.bind(this);
  }

  GetUsers() {
    Axios.get("http://127.0.0.1:8000/api/user-list/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      this.setState({
        users: response.data.users,
        registrations: response.data.registrations,
        petition_entries: response.data.petition_entries,
        agreementSubmissions: response.data.agreementSubmissions,
        isLoaded: true,
      });
    });
  }

  handleSidebar(name) {
    this.setState({
      selected: name,
    });
  }

  displayUsers() {
    if (this.state.users) {
      return this.state.users.map((user) => {
        return <User key={user.id} item={user} />;
      });
    }
  }

  displayRegistrations() {
    if (this.state.registrations) {
      return this.state.registrations.map((item) => {
        return <RegistrationRow key={item.id} item={item} />;
      });
    }
  }

  displayPetitionEntries() {
    if (this.state.petition_entries) {
      return this.state.petition_entries.map((item) => {
        return <PetitionRow key={item.id} item={item} />;
      });
    }
  }

  displayAgreementSubmissions() {
    if (this.state.agreementSubmissions) {
      return this.state.agreementSubmissions.map((item) => {
        return <AgreementSubmission key={item.id} item={item} />;
      });
    }
  }

  componentDidMount() {
    this.GetUsers();
  }

  render() {
    return (
      <div className="admin">
        <div className="sidebar">
          <div className="sidebar-body">
            <div
              className={
                this.state.selected === "users"
                  ? "sidebar-link selected"
                  : "sidebar-link"
              }
              onClick={() => this.handleSidebar("users")}
            >
              Users List
            </div>
            <div
              className={
                this.state.selected === "registration"
                  ? "sidebar-link selected"
                  : "sidebar-link"
              }
              onClick={() => this.handleSidebar("registration")}
            >
              Registration
            </div>
            <div
              className={
                this.state.selected === "petition"
                  ? "sidebar-link selected"
                  : "sidebar-link"
              }
              onClick={() => this.handleSidebar("petition")}
            >
              Petitions
            </div>
            <div
              className={
                this.state.selected === "blog"
                  ? "sidebar-link selected"
                  : "sidebar-link"
              }
              onClick={() => this.handleSidebar("blog")}
            >
              Blog
            </div>
          </div>
        </div>
        <div className="admin-wrapper">
          {this.state.selected === "users" ? (
            <div className="table-wrapper">
              <h2 className="admin-title">User List</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th className="table-status">Status</th>
                  </tr>
                </thead>
                <tbody>{this.displayUsers()}</tbody>
              </table>
            </div>
          ) : null}
          {this.state.selected === "registration" ? (
            <div className="table-wrapper-2">
              <h2 className="admin-title">Registrations List</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Child</th>
                    <th>Shirt Size</th>
                    <th>Allergies</th>
                    <th>Birth Date</th>
                    <th>Parent</th>
                    <th>Parent's Number</th>
                    <th>Submission DateTime</th>
                  </tr>
                </thead>
                <tbody>{this.displayRegistrations()}</tbody>
              </table>
            </div>
          ) : null}
          {this.state.selected === "petition" ? (
            <div className="table-wrapper-2">
              <h2 className="admin-title">Petition List</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Petition</th>
                    <th>Name</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>{this.displayPetitionEntries()}</tbody>
              </table>
            </div>
          ) : null}
          {this.state.selected === "blog" ? <BlogDashboard /> : null}
        </div>
      </div>
    );
  }
}
