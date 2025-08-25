import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

class AddParticipants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupDataID: null,
      group: null,
      groupLeader: null,
      users: [],
      previous: null,
      next: null,
      count: 0,
      pages: 0,
      members: null,
    };
    this.getGroup = this.getGroup.bind(this);
    this.handleUsers = this.handleUsers.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleAddParticipants = this.handleAddParticipants.bind(this);
  }

  getGroup() {
    Axios.get("http://127.0.0.1:8000/api/my_group/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((res) => {
      if (res.data.error) {
      } else {
        this.setState({
          groupDataID: res.data.group.id,
          group: res.data,
          // groupLeader:
        });
      }
    });
  }

  handleSearch(e) {
    let url = "http://127.0.0.1:8000/api/admin/users/?search=" + e.target.value;
    this.getUsers(url);
  }

  getUsers(URL) {
    Axios.get(URL, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      this.setState({
        previous: response.data.previous,
        next: response.data.next,
        users: response.data.results,
        count: response.data.count,
        pages: Math.ceil(response.data.count / 10),
      });
    });
  }

  handleUsers() {
    const users = this.state.users;
    if (users) {
      return users.map((user) => {
        if ((user.profile.subscriptionActive = "Inactive")) {
          return (
            <div>
              <tr key={user.id} className="handleUserWrapper">
                <td className="handleUser">{user.username}</td>
                <td className="handleUser">{/* {user.first_name} */} </td>
                <td className="DoNotDisplay">-</td>
                <div className="handleUserButton">
                  {/* <button> */}
                  <FontAwesomeIcon
                    className="buttonadduser"
                    icon={faPlus}
                    onClick={() => {
                      this.handleAddParticipants(user);
                    }}
                  />
                  {/* </button> */}
                </div>
              </tr>
            </div>
          );
        } else return;
      });
    }
  }

  handleSearch(e) {
    let url = "http://127.0.0.1:8000/api/admin/users/?search=" + e.target.value;
    this.getUsers(url);
  }

  handleAddParticipants(user) {
    Axios.post(
      `http://127.0.0.1:8000/api/my_group/`,
      {
        post_type: "addUser",
        user: user.id,
        group: this.state.groupDataID,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      window.location.reload();
    });
  }

  handleSearch(e) {
    let url = "http://127.0.0.1:8000/api/admin/users/?search=" + e.target.value;
    this.getUsers(url);
  }

  componentDidMount() {
    this.getGroup();
    this.getUsers();
    this.handleUsers();
  }

  render() {
    return (
      <div className="modal-wrapper">
        <div className="adminModal-body">
          {this.state.createProcessing ? (
            <div>
              {this.state.createProcessingFinished ? (
                <div className="successful">User Successfully Created</div>
              ) : (
                <Spinner />
              )}
            </div>
          ) : (
            <form
              onSubmit={(e) => this.handleSubmit(e, "create")}
              className="adminCreateForm"
            >
              <div className="input-container">
                <label htmlFor="">Username:</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  onChange={(e) => this.handleChange(e)}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="">First Name:</label>
                <input
                  className="DoNotDisplay"
                  type="text"
                  name="first_name"
                  placeholder="Enter First Name"
                  onChange={(e) => this.handleChange(e)}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="">Middle Name:</label>
                <input
                  type="text"
                  name="middle_name"
                  className="DoNotDisplay"
                  placeholder="Enter Middle Name"
                  onChange={(e) => this.handleChange(e)}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="">Last Name:</label>
                <input
                  className="DoNotDisplay"
                  type="text"
                  name="last_name"
                  placeholder="Enter Last Name"
                  onChange={(e) => this.handleChange(e)}
                  required
                />
              </div>
              <div className="adminModal-button-container">
                <button type="submit">Create User</button>
              </div>
            </form>
          )}
          {this.state.createError ? <div>{this.state.createError}</div> : null}
        </div>
        <div className="modal-box">
          <div className="modal-header">Add User To Group Participants</div>
          <div className="flex-center">
            <button>
              <div className="SearchUserParticipantsWrapper">
                <div className="SearchUserParticipantsTitle">Search User</div>
                <input
                  className="SearchUserParticipants"
                  type="text"
                  placeholder="Search User"
                  onChange={(e) => this.handleSearch(e)}
                />
              </div>
            </button>

            {/* <div className="handleUserWrapperNames">
                            <td className="handleUser">username</td>
                            <td className="handleUser">first_name{" "}last_name</td>
                            
                            <td className="handleUserButton">add member</td>
                        </div> */}
            {this.handleUsers()}
          </div>
        </div>
      </div>
    );
  }
}

export default AddParticipants;
