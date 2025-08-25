import React, { Component } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Spinner from "../../../components/misc/Spinner";

export default class AdminUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      previous: null,
      next: null,
      count: 0,
      pages: 0,
      currentPage: 1,
      showModal: "",
      createError: null,
      createProcessing: false,
      createProcessingFinished: false,
      selectedUser: null,

      editError: null,
      editProcessing: false,
      editProcessingFinished: false,

      delete: "",
      deleteError: null,
      deleteProcessing: false,
      deleteProcessingFinished: false,
    };

    this.getUsers = this.getUsers.bind(this);
    this.handleUsers = this.handleUsers.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditUser = this.handleEditUser.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
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

  handleDelete(userId) {
    const user = this.state.users.filter((obj) => {
      return obj.id === userId;
    });

    this.setState({
      showModal: "Delete-Modal",
      selectedUser: user[0],
    });
  }

  handleEdit(userId) {
    const user = this.state.users.filter((obj) => {
      return obj.id === userId;
    });

    this.setState({
      showModal: "Edit-Modal",
      selectedUser: user[0],
    });
  }

  handlePageChange(key) {
    switch (key) {
      case "next":
        this.getUsers(this.state.next);
        this.setState({
          currentPage: this.state.currentPage + 1,
        });
        break;
      case "previous":
        this.getUsers(this.state.previous);
        this.setState({
          currentPage: this.state.currentPage - 1,
        });
        break;
      default:
        break;
    }
  }

  handleUsers() {
    const { users } = this.state;
    if (users) {
      return users.map((user) => {
        return (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.profile.role}</td>
            <td>{user.profile.subscriptionActive ? "Active" : "Inactive"}</td>
            <td>
              <button
                className="rowButton"
                onClick={() => this.handleEdit(user.id)}
              >
                Edit
              </button>
            </td>
            <td>
              <button
                className="rowButton"
                onClick={() => this.handleDelete(user.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      });
    }
  }

  handleSearch(e) {
    let url = "http://127.0.0.1:8000/api/admin/users/?search=" + e.target.value;
    this.getUsers(url);
  }

  handleDeleteUser() {
    const user = this.state.selectedUser;
    this.setState({
      deleteError: null,
      deleteProcessing: true,
    });

    Axios.post(
      "http://127.0.0.1:8000/api/admin/users/",
      {
        post_type: "DELETE",
        id: user.id,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((response) => {
      if (response.data.Success) {
        this.setState({
          deleteProcessingFinished: true,
        });
        this.getUsers("http://127.0.0.1:8000/api/admin/users/");
      } else if (response.data.Error) {
        this.setState({
          deleteProcessing: false,
          deleteError: response.data.Error,
        });
      }
    });
  }

  handleEditUser() {
    this.setState({
      editError: null,
      editProcessing: true,
    });

    const re = /\S+@\S+\.\S+/;

    if (!re.test(this.state.selectedUser.email)) {
      this.setState({
        editError: "Email Not Valid",
        editProcessing: false,
      });
      return;
    }

    if (
      !this.state.selectedUser.profile.role ||
      this.state.selectedUser.profile.role === ""
    ) {
      this.setState({
        editError: "User Role Can't Be Empty",
        editProcessing: false,
      });
      return;
    }

    const user = this.state.selectedUser;
    Axios.post(
      "http://127.0.0.1:8000/api/admin/users/",
      {
        post_type: "EDIT",
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        middle_name: user.profile.middle_name,
        last_name: user.last_name,
        email: user.email,
        role: user.profile.role,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((response) => {
      if (response.data.Success) {
        this.setState({
          editProcessingFinished: true,
        });
        this.getUsers("http://127.0.0.1:8000/api/admin/users/");
      } else if (response.data.Error) {
        this.setState({
          editProcessing: false,
          editError: response.data.Error,
        });
      }
    });
  }

  handleCreate() {
    this.setState({
      createError: null,
      createProcessing: true,
    });

    const re = /\S+@\S+\.\S+/;
    if (this.state.password1 !== this.state.password2) {
      this.setState({
        createError: "Passwords Don't Match",
      });
      return;
    }

    if (!re.test(this.state.email)) {
      this.setState({
        createError: "Email Not Valid",
      });
      return;
    }

    if (!this.state.user_role || this.state.user_role === "") {
      this.setState({
        createError: "User Role Can't Be Empty",
      });
    }

    Axios.post(
      "http://127.0.0.1:8000/api/admin/users/",
      {
        post_type: "CREATE",
        username: this.state.username,
        first_name: this.state.first_name,
        middle_name: this.state.middle_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password1,
        role: this.state.user_role,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((response) => {
      this.setState({
        createProcessingFinished: true,
      });
      this.getUsers("http://127.0.0.1:8000/api/admin/users/");
    });
  }

  handleSubmit(e, type) {
    e.preventDefault();

    switch (type) {
      case "create":
        this.handleCreate();
        break;
      case "edit":
        this.handleEditUser();
        break;
      case "delete":
        this.handleDeleteUser();
        break;
      default:
        break;
    }
  }

  handleEditChange(e) {
    let prevState = Object.assign({}, this.state.selectedUser);
    let targetName = e.target.name;
    let names = targetName.split(" ");
    if (names.length === 2) {
      prevState.profile[names[1]] = e.target.value;
    } else {
      prevState[targetName] = e.target.value;
    }
    this.setState({
      selectedUser: prevState,
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  componentWillMount() {
    this.getUsers("http://127.0.0.1:8000/api/admin/users/?search=");
  }

  render() {
    return (
      <div className={this.props.className}>
        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal === "Delete-Modal"}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
          ariaHideApp={false}
        >
          {this.state.selectedUser ? (
            <div className="adminModal">
              <div className="adminModal-header">
                <div className="modal-title">
                  Delete User {this.state.selectedUser.username}
                </div>
                <button
                  className="modal-close"
                  onClick={() =>
                    this.setState({
                      showModal: "",
                      deleteProcessing: false,
                      deleteProcessingFinished: false,
                      delete: "",
                    })
                  }
                >
                  x
                </button>
              </div>
              <div className="adminModal-body">
                {this.state.deleteError ? (
                  <div>{this.state.deleteError}</div>
                ) : null}
                {this.state.deleteProcessing ? (
                  <div>
                    {this.state.deleteProcessingFinished ? (
                      <div className="successful">
                        User Successfully Deleted
                      </div>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => this.handleSubmit(e, "delete")}
                    className="adminDeleteForm"
                  >
                    <div className="input-container">
                      <label htmlFor="">
                        Type "Confirm Delete User" To Delete{" "}
                        {this.state.selectedUser.username}:
                      </label>
                      <input
                        type="text"
                        name="delete"
                        placeholder="Confirm Delete User"
                        onChange={(e) =>
                          this.setState({
                            delete: e.target.value,
                          })
                        }
                        value={this.state.delete}
                        required
                      />
                    </div>
                    <div className="adminModal-button-container">
                      {this.state.delete === "Confirm Delete User" ? (
                        <button type="submit">Delete User</button>
                      ) : (
                        <button type="submit" disabled>
                          Delete User
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : null}
        </Modal>

        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal === "Edit-Modal"}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
          ariaHideApp={false}
        >
          {this.state.selectedUser ? (
            <div className="adminModal">
              <div className="adminModal-header">
                <div className="modal-title">
                  Edit User {this.state.selectedUser.username}
                </div>
                <button
                  className="modal-close"
                  onClick={() =>
                    this.setState({
                      showModal: "",
                      editProcessing: false,
                      editProcessingFinished: false,
                    })
                  }
                >
                  x
                </button>
              </div>
              <div className="adminModal-body">
                {this.state.editError ? (
                  <div>{this.state.editError}</div>
                ) : null}
                {this.state.editProcessing ? (
                  <div>
                    {this.state.editProcessingFinished ? (
                      <div className="successful">User Successfully Edited</div>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => this.handleSubmit(e, "edit")}
                    className="adminCreateForm"
                  >
                    <div className="input-container">
                      <label htmlFor="">Username:</label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        onChange={(e) => this.handleEditChange(e)}
                        value={this.state.selectedUser.username}
                        required
                      />
                    </div>
                    <div className="input-container">
                      <label htmlFor="">First Name:</label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Enter First Name"
                        onChange={(e) => this.handleEditChange(e)}
                        value={this.state.selectedUser.first_name}
                        required
                      />
                    </div>
                    <div className="input-container">
                      <label htmlFor="">Middle Name:</label>
                      <input
                        type="text"
                        name="profile middle_name"
                        placeholder="Enter Middle Name"
                        onChange={(e) => this.handleEditChange(e)}
                        value={this.state.selectedUser.profile.middle_name}
                        required
                      />
                    </div>
                    <div className="input-container">
                      <label htmlFor="">Last Name:</label>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Enter Last Name"
                        onChange={(e) => this.handleEditChange(e)}
                        value={this.state.selectedUser.last_name}
                        required
                      />
                    </div>
                    <div className="input-container">
                      <label htmlFor="">Email:</label>
                      <input
                        type="text"
                        name="email"
                        placeholder="Enter Email"
                        onChange={(e) => this.handleEditChange(e)}
                        value={this.state.selectedUser.email}
                        required
                      />
                    </div>
                    <div className="input-container">
                      <label htmlFor="">User Role:</label>
                      {this.state.selectedUser.profile.role === "Admin" ? (
                        <select
                          name="profile role"
                          onChange={(e) => this.handleEditChange(e)}
                          value="Admin"
                          required
                        >
                          <option value="" selected disabled>
                            Select User Role
                          </option>
                          <option value="User">User</option>
                          <option value="Editor">Editor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : null}
                      {this.state.selectedUser.profile.role === "Editor" ? (
                        <select
                          name="profile role"
                          onChange={(e) => this.handleEditChange(e)}
                          value="Editor"
                          required
                        >
                          <option value="" selected disabled>
                            Select User Role
                          </option>
                          <option value="User">User</option>
                          <option value="Editor">Editor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : null}
                      {this.state.selectedUser.profile.role === "User" ? (
                        <select
                          name="profile role"
                          onChange={(e) => this.handleEditChange(e)}
                          value="User"
                          required
                        >
                          <option value="" selected disabled>
                            Select User Role
                          </option>
                          <option value="User">User</option>
                          <option value="Editor">Editor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : null}
                    </div>
                    <div className="adminModal-button-container">
                      <button type="submit">Edit User</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : null}
        </Modal>

        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal === "Create-Modal"}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
          ariaHideApp={false}
        >
          <div className="adminModal">
            <div className="adminModal-header">
              <div className="modal-title">Create New User</div>
              <button
                className="modal-close"
                onClick={() =>
                  this.setState({
                    showModal: "",
                    createProcessing: false,
                    createProcessingFinished: false,
                  })
                }
              >
                x
              </button>
            </div>
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
                      placeholder="Enter Middle Name"
                      onChange={(e) => this.handleChange(e)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Last Name:</label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Enter Last Name"
                      onChange={(e) => this.handleChange(e)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Email:</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter Email"
                      onChange={(e) => this.handleChange(e)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">User Role:</label>
                    <select
                      name="user_role"
                      onChange={(e) => this.handleChange(e)}
                      required
                    >
                      <option value="" selected disabled>
                        Select User Role
                      </option>
                      <option value="1">User</option>
                      <option value="2">Editor</option>
                      <option value="3">Admin</option>
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Password:</label>
                    <input
                      type="password"
                      name="password1"
                      placeholder="Enter Password"
                      onChange={(e) => this.handleChange(e)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Confirm Password:</label>
                    <input
                      type="password"
                      name="password2"
                      placeholder="Confirm Password"
                      onChange={(e) => this.handleChange(e)}
                      required
                    />
                  </div>
                  <div className="adminModal-button-container">
                    <button type="submit">Create User</button>
                  </div>
                </form>
              )}
              {this.state.createError ? (
                <div>{this.state.createError}</div>
              ) : null}
            </div>
          </div>
        </Modal>
        <div className="createButtonWrapper">
          <button
            className="createButton"
            onClick={() => this.setState({ showModal: "Create-Modal" })}
          >
            Create User
          </button>
        </div>
        <div className="adminTable">
          <div className="adminTableHeader">
            <div className="adminTableHeader-title">User List</div>
            <input
              className="adminTableHeader-search"
              type="text"
              placeholder="Search User"
              onChange={(e) => this.handleSearch(e)}
            />
          </div>
          <div className="adminTableBody">
            <table>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Account Status</th>
                <th></th>
                <th></th>
              </tr>
              <tbody>{this.handleUsers()}</tbody>
            </table>
            <div className="adminTableFooter">
              <div className="pages">Rows per page: 10</div>
              <div className="pageNav">
                <div className="itemsShowing">
                  {this.state.currentPage * 10 - 10}-{this.state.currentPage * 10 > this.state.count ? this.state.count : this.state.currentPage * 10}{" "} of {this.state.count}
                </div>
                <div className="changePage">
                  {this.state.previous ? (
                    <FontAwesomeIcon
                      className="changePage-icon"
                      icon={faChevronLeft}
                      onClick={() => this.handlePageChange("previous")}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="changePage-icon disabled"
                      icon={faChevronLeft}
                    />
                  )}
                  {this.state.next ? (
                    <FontAwesomeIcon
                      className="changePage-icon"
                      icon={faChevronRight}
                      onClick={() => this.handlePageChange("next")}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="changePage-icon disabled"
                      icon={faChevronRight}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
