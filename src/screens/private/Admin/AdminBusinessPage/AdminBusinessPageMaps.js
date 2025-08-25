import React, { Component } from "react";
import { GoogleMaps } from "../../BusinessPage/Maps";
import Axios from "axios";
import Modal from "react-modal";

class AdminBusinessPageMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      latitude: "",
      longitude: "",
    };

    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    Axios.put(
      "http://127.0.0.1:8000/api/businessPageAdmin/",
      {
        type: "Map",
        page: this.props.page.id,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
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

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleClosedModal() {
    this.setState({ showModal: false });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount() {
    Modal.setAppElement("body");
    this.setState({
      latitude: this.props.page.latitude,
      longitude: this.props.page.longitude,
    });
  }

  render() {
    const { page } = this.props;
    return (
      <div className="map-container">
        <div className="section-label map-label">MAPS</div>
        <div className="map">
          <GoogleMaps latitude={page.latitude} longitude={page.longitude} />
        </div>
        <button
          className="bp-edit-button"
          onClick={() => {
            this.handleOpenModal("profile-modal");
          }}
        >
          Edit Maps Location
        </button>
        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
        >
          <div className="modal-header maps-modal-header">
            <button
              className="bp-modal-button"
              onClick={this.handleClosedModal}
            >
              Cancel
            </button>
            <div className="modal-title">Edit Location</div>
            <button
              type="submit"
              className="bp-modal-button"
              disabled={this.state.formChanged}
              form="maps-form"
            >
              Save
            </button>
          </div>
          <div className="modal-body maps-modal-body">
            <form
              className="maps-form"
              id="maps-form"
              onSubmit={this.handleSubmit}
            >
              <div className="maps-input-container">
                <label>Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={this.state.latitude}
                  onChange={this.handleChange}
                />
              </div>
              <div className="maps-input-container">
                <label>Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={this.state.longitude}
                  onChange={this.handleChange}
                />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AdminBusinessPageMaps;
