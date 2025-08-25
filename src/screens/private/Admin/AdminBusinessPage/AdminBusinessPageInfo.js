import React, { Component } from "react";
import Axios from "axios";
import Modal from "react-modal";

class BusinessPageInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      characterLimit: 150,
      formChanged: false,
    };

    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    Axios.put(
      "http://127.0.0.1:8000/api/businessPageAdmin/",
      {
        type: "Info",
        id: this.state.id,
        name: this.state.name,
        location: this.state.location,
        description: this.state.description,
        hours: this.state.hours,
        phone_number: this.state.phone_number,
        email: this.state.email,
        website: this.state.website,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.status === "Success") {
        window.location.reload();
      }
    });
    event.preventDefault();
  }

  handleData() {
    this.setState({
      ...this.props.page,
    });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleClosedModal() {
    this.setState({ showModal: false, formChanged: true });
    this.handleData();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      formChanged: false,
    });
  };

  handleTextAreaChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      characterLimit: 150 - event.target.value.length,
      formChanged: false,
    });
  };

  componentDidMount() {
    Modal.setAppElement("body");
    this.handleData();
  }

  render() {
    const { page } = this.props;
    return (
      <div className="info-container">
        <div className="info-header">
          <div className="info-name">{page.name}</div>
          <div className="info-location">{page.location}</div>
        </div>
        <div className="info-description">{page.description}</div>
        <div className="section-label">INFO</div>
        <div className="info-misc-container">
          <div className="misc-info">{page.hours}</div>
          <div className="misc-info-seperator">•</div>
          <div className="misc-info">{page.phone_number}</div>
          <div className="misc-info-seperator">•</div>
          <div className="misc-info">{page.email}</div>
          <div className="misc-info-seperator">•</div>
          <div className="misc-info">{page.website}</div>
        </div>
        <button
          className="bp-edit-button"
          onClick={() => {
            this.handleOpenModal("profile-modal");
          }}
        >
          Edit Profile
        </button>
        <Modal
          className="Modal-BP"
          overlayClassName="Overlay"
          isOpen={this.state.showModal}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
        >
          <div className="modal-header">
            <button
              className="bp-modal-button"
              onClick={this.handleClosedModal}
            >
              Cancel
            </button>
            <div className="modal-title">Edit Profile</div>
            <button
              type="submit"
              className="bp-modal-button"
              disabled={this.state.formChanged}
              form="info-form"
            >
              Save
            </button>
          </div>
          <div className="modal-body">
            <form
              className="info-form"
              id="info-form"
              onSubmit={this.handleSubmit}
            >
              <div className="info-input-container">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter Business Name"
                  value={this.state.name}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </div>
              <div className="info-input-container">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter Business Location"
                  name="location"
                  value={this.state.location}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </div>
              <div className="info-input-container">
                <label>Description</label>
                <div className="textarea-container">
                  <textarea
                    type="text"
                    maxLength="150"
                    placeholder="Enter Business Description"
                    name="description"
                    value={this.state.description}
                    onChange={(e) => {
                      this.handleTextAreaChange(e);
                    }}
                  />
                  <div className="textarea-counter">
                    {this.state.characterLimit} of 150 Remaining
                  </div>
                </div>
              </div>
              <div className="info-input-container">
                <label>Hours</label>
                <input
                  type="text"
                  placeholder="Enter Business Hours"
                  name="hours"
                  value={this.state.hours}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </div>
              <div className="info-input-container">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="Enter Business Phone Number"
                  name="phone_number"
                  value={this.state.phone_number}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </div>
              <div className="info-input-container">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter Business Email"
                  name="email"
                  value={this.state.email}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </div>
              <div className="info-input-container">
                <label>Website</label>
                <input
                  type="text"
                  placeholder="Enter Business Website Address"
                  name="website"
                  value={this.state.website}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default BusinessPageInfo;
