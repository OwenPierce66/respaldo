import React, { Component } from "react";
import banner from "../../../../../static/assets/images/Group 1@2x.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";
import Modal from "react-modal";
import BusinessPost from "../../BusinessPage/BusinessPost";
import BusinessPageInfo from "./AdminBusinessPageInfo";
import BusinessPagePhotos from "./AdminBusinessPagePhotos";
import ImageUploader from "../../../../components/misc/ImageUploader";
import AdminBusinessPageMaps from "./AdminBusinessPageMaps";

class AdminBusinessPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showBannerModal: false,
      spinner: false,
      activeImage: 0,
    };

    this.handlePosts = this.handlePosts.bind(this);
    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUploadData = this.handleImageUploadData.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleOpenModal(action) {
    switch (action) {
      case "picture-modal":
        this.setState({
          showModal: "picture-modal",
        });
      case "add-picture":
        this.setState({
          showModal: "add-picture-modal",
        });
      case "profile-modal":
        this.setState({
          showModal: "profile-modal",
        });
    }
  }

  handleClosedModal() {
    this.setState({
      showModal: false,
      showBannerModal: false,
    });
  }

  handleImageUploadData(value) {
    this.setState({ spinner: true });
    Axios.put(
      "http://127.0.0.1:8000/api/businessPageAdmin/",
      {
        type: "Banner",
        page: this.state.page.id,
        image: value,
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
      .catch((err) => {});
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
              <div className="bp-icon-container">
                <FontAwesomeIcon
                  className="edit-banner-icon"
                  icon="camera"
                  onClick={() => {
                    this.setState({ showBannerModal: true });
                  }}
                />
              </div>
              <ImageUploader
                isOpen={this.state.showBannerModal}
                close={() => {
                  this.handleClosedModal();
                }}
                imageData={this.handleImageUploadData}
                imgLimit={1}
                spinner={this.state.spinner}
              />
            </div>
            <div className="business-page-body">
              <BusinessPageInfo page={page} />
              <BusinessPagePhotos page={page} />
              {/* <div className="news-container">
                <div className="section-label">NEWS</div>
                {this.handlePosts()}
                <div className="news-post-options">
                  <Link to={`/PostTimeline/${page.id}`} className="section-label-more">See More</Link>
                </div>
              </div> */}
              <AdminBusinessPageMaps page={page} />
            </div>
          </div>
          <Modal
            className="Modal"
            overlayClassName="Overlay"
            isOpen={this.state.showModal === "add-picture-modal" ? true : false}
            shouldCloseOnOverlayClick={true}
            onRequestClose={this.handleClosedModal}
          >
            Add Picture
          </Modal>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default AdminBusinessPage;
