import React, { Component } from "react";
import PicturePlaceholder from "../../../../../static/assets/images/Group 3.jpg";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageUploader from "../../../../components/misc/ImageUploader";
import Axios from "axios";
import ScrollContainer from "react-indiana-drag-scroll";

class BusinessPagePhotos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showPhotoModal: false,
      activeImage: 0,
      spinner: false,
    };

    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handlePictureForward = this.handlePictureForward.bind(this);
    this.handlePictureBackward = this.handlePictureBackward.bind(this);
    this.handleImageUploadData = this.handleImageUploadData.bind(this);
  }

  handlePictureForward() {
    if (this.props.page) {
      let num_of_photos = this.props.page.photos.length - 1;
      if (num_of_photos > this.state.activeImage) {
        this.setState({ activeImage: this.state.activeImage + 1 });
      }
    }
  }

  handlePictureBackward() {
    if (this.props.page) {
      if (this.state.activeImage > 0) {
        this.setState({ activeImage: this.state.activeImage - 1 });
      }
    }
  }

  handlePictureModal() {
    if (this.props.page) {
      return this.props.page.photos.map((photo, index) => {
        return (
          <img
            src={photo.file}
            alt=""
            className="scroll-img"
            onClick={() => {
              this.setState({ activeImage: index });
            }}
          />
        );
      });
    }
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleClosedModal() {
    this.setState({
      showModal: false,
      showPhotoModal: false,
    });
  }

  handlePictures() {
    if (this.props.page) {
      let photos = this.props.page.photos;
      let num_of_photos = photos.length;
      if (num_of_photos == 0) {
        return (
          <div className="photo-list-container">
            <img
              src={PicturePlaceholder}
              alt="Page Pictures"
              className="business-photo"
            />
            <img
              src={PicturePlaceholder}
              alt="Page Pictures"
              className="business-photo"
            />
            <div className="see-more-photos">
              <div className="see-more-text">
                <p>{num_of_photos} PHOTOS</p>
              </div>
              <img
                src={PicturePlaceholder}
                alt="Page Pictures"
                className="business-photo"
              />
            </div>
          </div>
        );
      } else if (num_of_photos == 1) {
        return (
          <div className="photo-list-container">
            <img
              src={photos[0].file}
              alt="Page Pictures"
              className="business-photo"
            />
            <img
              src={PicturePlaceholder}
              alt="Page Pictures"
              className="business-photo"
            />
            <div className="see-more-photos">
              <div className="see-more-text">
                <p>{num_of_photos} PHOTOS</p>
              </div>
              <img
                src={PicturePlaceholder}
                alt="Page Pictures"
                className="business-photo"
              />
            </div>
          </div>
        );
      } else if (num_of_photos == 2) {
        return (
          <div className="photo-list-container">
            <img
              src={photos[0].file}
              alt="Page Pictures"
              className="business-photo"
            />
            <img
              src={photos[1].file}
              alt="Page Pictures"
              className="business-photo"
            />
            <div className="see-more-photos">
              <div className="see-more-text">
                <p>{num_of_photos} PHOTOS</p>
              </div>
              <img
                src={PicturePlaceholder}
                alt="Page Pictures"
                className="business-photo"
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className="photo-list-container">
            <img
              src={photos[0].file}
              alt="Page Pictures"
              className="business-photo"
              onClick={() => {
                this.handleOpenModal("picture-modal");
              }}
            />
            <img
              src={photos[1].file}
              alt="Page Pictures"
              className="business-photo"
              onClick={() => {
                this.handleOpenModal("picture-modal");
              }}
            />
            <div
              className="see-more-photos"
              onClick={() => {
                this.handleOpenModal("picture-modal");
              }}
            >
              <div className="see-more-text">
                <p>{num_of_photos} PHOTOS</p>
              </div>
              <img
                src={photos[2].file}
                alt="Page Pictures"
                className="business-photo"
              />
            </div>
          </div>
        );
      }
    }
  }

  handleImageUploadData(value) {
    this.setState({ spinner: true });
    Axios.put(
      "http://127.0.0.1:8000/api/businessPageAdmin/",
      {
        type: "Images",
        page: this.props.page.id,
        images: value,
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

  componentDidMount() {
    Modal.setAppElement("body");
  }

  render() {
    return (
      <div className="photos-container">
        <div className="section-label">PHOTOS</div>
        {this.handlePictures()}
        <button
          className="bp-edit-button"
          onClick={() => {
            this.setState({ showPhotoModal: true });
          }}
        >
          Add Photos
        </button>
        <ImageUploader
          isOpen={this.state.showPhotoModal}
          close={() => {
            this.handleClosedModal();
          }}
          imageData={this.handleImageUploadData}
          imgLimit={20}
          spinner={this.state.spinner}
        />
        <Modal
          className="Picture-Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
        >
          <div className="photo-modal-conatiner">
            <div className="photo-display-container">
              <FontAwesomeIcon
                className="post-icon"
                icon="arrow-left"
                className="display-img-icons"
                onClick={() => {
                  this.handlePictureBackward();
                }}
              />
              {this.props.page.photos.length > 0 ? (
                <img
                  src={this.props.page.photos[this.state.activeImage].file}
                  alt="image"
                  className="display-img"
                />
              ) : null}

              <FontAwesomeIcon
                className="post-icon"
                icon="arrow-right"
                className="display-img-icons"
                onClick={() => {
                  this.handlePictureForward();
                }}
              />
            </div>
            <ScrollContainer
              className="photo-scroll-container"
              horizontal={true}
            >
              {this.handlePictureModal()}
            </ScrollContainer>
          </div>
        </Modal>
      </div>
    );
  }
}

export default BusinessPagePhotos;
