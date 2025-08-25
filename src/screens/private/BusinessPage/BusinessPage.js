import React, { Component } from "react";
import banner from "../../../../static/assets/images/Group 1@2x.jpg";
import PicturePlaceholder from "../../../../static/assets/images/Group 3.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleMaps } from "./Maps";
import Axios from "axios";
import Cookies from "js-cookie";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import BusinessPost from "./BusinessPost";
import ScrollContainer from "react-indiana-drag-scroll";

class BusinessPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      activeImage: 0,
    };

    this.handlePosts = this.handlePosts.bind(this);
    this.handlePictures = this.handlePictures.bind(this);
    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handlePictureForward = this.handlePictureForward.bind(this);
    this.handlePictureBackward = this.handlePictureBackward.bind(this);
  }

  handleOpenModal() {
    this.setState({
      showModal: "picture-modal",
    });
  }

  handleClosedModal() {
    this.setState({
      showModal: "",
    });
  }

  handlePictureForward() {
    if (this.state.page) {
      let num_of_photos = this.state.page.photos.length - 1;
      if (num_of_photos > this.state.activeImage) {
        this.setState({ activeImage: this.state.activeImage + 1 });
      }
    }
  }

  handlePictureBackward() {
    if (this.state.page) {
      if (this.state.activeImage > 0) {
        this.setState({ activeImage: this.state.activeImage - 1 });
      }
    }
  }

  handlePictureModal() {
    if (this.state.page) {
      return this.state.page.photos.map((photo, index) => {
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

  handlePictures() {
    if (this.state.page) {
      let photos = this.state.page.photos;
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
              <p>ADD PHOTOS</p>
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
              <p>ADD PHOTOS</p>
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
              <p>ADD PHOTOS</p>
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
                this.setState({ showModal: true });
              }}
            />
            <img
              src={photos[1].file}
              alt="Page Pictures"
              className="business-photo"
              onClick={() => {
                this.setState({ showModal: true });
              }}
            />
            <div
              className="see-more-photos"
              onClick={() => {
                this.setState({ showModal: true });
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

  handlePosts() {
    if (this.state.posts) {
      return this.state.posts.slice(0, 2).map((post) => {
        return <BusinessPost post={post} page={this.state.page} />;
      });
    } else {
      return <div>No Post Found</div>;
    }
  }

  componentDidMount() {
    Modal.setAppElement("body");

    Axios.get(
      `http://127.0.0.1:8000/api/businessPage/${this.props.match.params.pageId}/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        this.setState({ page: res.data.page, posts: res.data.posts });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { page } = this.state;
    if (page) {
      return (
        <div className="business-page-container">
          <div className="business-page">
            <div className="business-page-header">
              {page.banner ? (
                <img
                  src={page.banner.file}
                  alt="banner img"
                  className="banner-img"
                />
              ) : (
                <img src={banner} alt="banner img" className="banner-img" />
              )}
            </div>
            <div className="business-page-body">
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
              </div>
              <div className="photos-container">
                <div className="section-label">PHOTOS</div>
                {this.handlePictures()}
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
                      {this.state.page.photos.length > 0 ? (
                        <img
                          src={
                            this.state.page.photos[this.state.activeImage].file
                          }
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
              {/* <div className="news-container">
                <div className="section-label">NEWS</div>
                {this.handlePosts()}
                <div className="news-post-options">
                  <Link to={`/PostTimeline/${page.id}`} className="section-label-more">See More</Link>
                </div>
              </div> */}
              <div className="map-container">
                <div className="section-label map-label">MAPS</div>
                <div className="map">
                  <GoogleMaps
                    latitude={page.latitude}
                    longitude={page.longitude}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default BusinessPage;
