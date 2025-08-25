import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import ReactTooltip from "react-tooltip";
import AdminDirectoryCreate from "./AdminDirectoryCreate";

class AdminDirectory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      activeItem: null,
      showModal: "",
      redirect: false,
      redirectId: "",
    };
    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleBusinessPage = this.handleBusinessPage.bind(this);
    this.createBusinessPage = this.createBusinessPage.bind(this);
  }

  handleRedirect() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={`/dashboard/admin/businessPage/${this.state.redirectId}`}
        />
      );
    }
  }

  createBusinessPage() {
    Axios.post(
      "http://127.0.0.1:8000/api/businessPageAdmin/",
      {
        directoryItem: this.state.activeItem.id,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.status === "Success") {
        this.setState({
          redirect: true,
          redirectId: res.data.pageId,
        });
      }
    });
  }

  handleBusinessPage() {
    const item = this.state.activeItem;
    if (item) {
      if (item.businessPage) {
        this.setState({
          redirect: true,
          redirectId: this.state.activeItem.businessPage.id,
        });
      } else {
        this.handleOpenModal("Create");
      }
    }
  }

  handleSearch(event) {
    Axios.get("http://127.0.0.1:8000/api/directory/", {
      params: {
        name: event.target.value,
      },
    })
      .then((res) => {
        this.setState({ items: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubmit(event) {
    Axios.put(
      "http://127.0.0.1:8000/api/adminDirectory/",
      {
        id: this.state.activeItem.id,
        name: this.state.name ? this.state.name : null,
        phone_number: this.state.phone_number ? this.state.phone_number : null,
        latitude: this.state.latitude ? this.state.latitude : null,
        longitude: this.state.longitude ? this.state.longitude : null,
        category: this.state.category ? this.state.category : null,
        status: this.state.status ? this.state.status : null,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        if (res.data.status === "Success") {
          window.location.reload();
        } else {
        }
      })
      .catch((e) => {
        console.log(e);
      });
    event.preventDefault();
  }

  handleDelete() {
    const item = this.state.activeItem;
    if (item) {
      if (confirm("Are you sure?") == true) {
        if (this.state.activeItem) {
          Axios.delete("http://127.0.0.1:8000/api/adminDirectory/", {
            headers: {
              Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
            },
            data: {
              id: this.state.activeItem.id,
            },
          })
            .then((res) => {
              window.location.reload();
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          return;
        }
      }
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleOpenModal(action) {
    const item = this.state.activeItem;
    if (item) {
      switch (action) {
        case "Edit":
          this.setState({
            showModal: "Edit-Modal",
          });
          return;
        case "Create":
          this.setState({
            showModal: "Create-Modal",
          });
          return;
      }
    }
  }

  handleClosedModal() {
    this.setState({
      showModal: "",
    });
  }

  displayDirectoryItems() {
    if (this.state.items) {
      return this.state.items.map((item) => {
        return (
          <tr key={item.id}>
            <td>
              <input
                type="checkbox"
                checked={this.state.activeItem == item ? true : false}
                onClick={() => this.setState({ activeItem: item })}
              />
            </td>
            <td>{item.name}</td>
            <td>{item.latitude}</td>
            <td>{item.longitude}</td>
            <td>{item.phone_number}</td>
            <td>{item.category}</td>
            <td>{item.businessPage ? item.businessPage.status : "No Page"}</td>
          </tr>
        );
      });
    }
  }

  componentDidMount() {
    Modal.setAppElement("body");

    Axios.get("http://127.0.0.1:8000/api/directory/")
      .then((res) => {
        this.setState({ items: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="admin-directory">
          {/* {this.handleRedirect()} */}
          <div className="ad-header">
            <div></div>
            <button
              onClick={() => {
                this.setState({
                  showModal: "Add-Modal",
                });
              }}
              className="header-button"
            >
              <FontAwesomeIcon className="table-icon" icon="plus" />
              Add
            </button>
          </div>
          <div className="ad-body">
            <div className="card-container">
              <div className="card-header">
                <div className="card-title">Directory Items</div>
                <div className="options">
                  <FontAwesomeIcon
                    data-tip
                    data-for="editTip"
                    className="card-icon"
                    icon="edit"
                    onClick={() => {
                      this.handleOpenModal("Edit");
                    }}
                  />
                  <ReactTooltip id="editTip" place="top" effect="solid">
                    Edit
                  </ReactTooltip>
                  <FontAwesomeIcon
                    data-tip
                    data-for="deleteTip"
                    className="card-icon"
                    icon="trash"
                    onClick={this.handleDelete}
                  />
                  <ReactTooltip id="deleteTip" place="top" effect="solid">
                    Delete
                  </ReactTooltip>
                  <FontAwesomeIcon
                    data-tip
                    data-for="businessPage"
                    className="card-icon"
                    icon="building"
                    onClick={this.handleBusinessPage}
                  />
                  <ReactTooltip id="businessPage" place="top" effect="solid">
                    Go To Business Page
                  </ReactTooltip>
                </div>
                <div className="search">
                  <label>Search:</label>
                  <input
                    type="text"
                    onChange={(event) => this.handleSearch(event)}
                  />
                </div>
              </div>
              <div className="card-body">
                <table className="directory-table">
                  <thead>
                    <tr role="row">
                      <th>Select</th>
                      <th>Name</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Contact</th>
                      <th>Category</th>
                      <th>Business Page</th>
                    </tr>
                  </thead>
                  <tbody>{this.displayDirectoryItems()}</tbody>
                </table>
              </div>
            </div>
          </div>
          <Modal
            className="Modal"
            overlayClassName="Overlay"
            isOpen={this.state.showModal === "Add-Modal"}
            shouldCloseOnOverlayClick={true}
            onRequestClose={this.handleClosedModal}
          >
            <div className="modal-header">
              <p className="modal-title">Add Directory Item</p>
              <button className="modal-close" onClick={this.handleClosedModal}>
                x
              </button>
            </div>
            <div className="modal-body">
              <AdminDirectoryCreate />
            </div>
          </Modal>
          <Modal
            className="Modal Modal-sm"
            overlayClassName="Overlay"
            isOpen={this.state.showModal === "Create-Modal"}
            shouldCloseOnOverlayClick={true}
            onRequestClose={this.handleClosedModal}
          >
            <div className="modal-header">
              <p className="modal-title">
                Do you want to create a page for{" "}
                {this.state.activeItem ? this.state.activeItem.name : null}?
              </p>
              <button className="modal-close" onClick={this.handleClosedModal}>
                x
              </button>
            </div>
            <div className="modal-body">
              <div className="bp-button-container">
                <button
                  className="bp-btn bp-btn--1"
                  onClick={this.createBusinessPage}
                >
                  Yes
                </button>
                <button
                  className="bp-btn bp-btn--2"
                  onClick={this.handleClosedModal}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            className="Modal"
            overlayClassName="Overlay"
            isOpen={this.state.showModal === "Edit-Modal"}
            shouldCloseOnOverlayClick={true}
            onRequestClose={this.handleClosedModal}
          >
            <div className="modal-header">
              <p className="modal-title">
                Edit {this.state.activeItem ? this.state.activeItem.name : null}
              </p>
              <button className="modal-close" onClick={this.handleClosedModal}>
                x
              </button>
            </div>
            <div className="modal-body">
              {this.state.activeItem ? (
                <div>
                  <form className="directory-form" onSubmit={this.handleSubmit}>
                    <div className="input-container">
                      <div className="form-input">
                        <label>Name:</label>
                        <input
                          type="text"
                          name="name"
                          value={
                            this.state.name
                              ? this.state.name
                              : this.state.activeItem.name
                          }
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="form-input">
                        <label>Phone Number:</label>
                        <input
                          type="text"
                          name="phone_number"
                          value={
                            this.state.phone_number
                              ? this.state.phone_number
                              : this.state.activeItem.phone_number
                          }
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="form-input">
                        <label>Latitude:</label>
                        <input
                          type="text"
                          name="latitude"
                          value={
                            this.state.latitude
                              ? this.state.latitude
                              : this.state.activeItem.latitude
                          }
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="form-input">
                        <label>Longitude:</label>
                        <input
                          type="text"
                          name="longitude"
                          value={
                            this.state.longitude
                              ? this.state.longitude
                              : this.state.activeItem.longitude
                          }
                          onChange={this.handleChange}
                        />
                      </div>

                      <div className="form-input">
                        <label>Category:</label>
                        <input
                          type="text"
                          name="category"
                          value={
                            this.state.category
                              ? this.state.category
                              : this.state.activeItem.category
                          }
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="form-input">
                        <label>Business Page</label>
                        {this.state.activeItem.businessPage ? null : (
                          <select name="status">
                            <option>No Page</option>
                          </select>
                        )}
                        {this.state.activeItem.businessPage ? (
                          <select name="status" onChange={this.handleChange}>
                            <option
                              value="1"
                              selected={
                                this.state.activeItem.businessPage.status ==
                                "Pending"
                              }
                            >
                              Pending
                            </option>
                            <option
                              value="2"
                              selected={
                                this.state.activeItem.businessPage.status ==
                                "Live"
                              }
                            >
                              Live
                            </option>
                          </select>
                        ) : null}
                      </div>
                    </div>
                    <div className="button-container">
                      <button className="form-button" type="submit">
                        <FontAwesomeIcon icon="plus" />
                        Edit
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default AdminDirectory;
