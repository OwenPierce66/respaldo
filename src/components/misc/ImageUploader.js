import React, { Component } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageCard from "./ImageCard";
import Spinner from "./Spinner";

class ImageUploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ImgData: [],
      imgLimit: 100,
    };

    this.hiddenFileInput = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImgData = this.handleImgData.bind(this);
    this.handleImgs = this.handleImgs.bind(this);
    this.handleRemoveImg = this.handleRemoveImg.bind(this);
    // # of images or if not specified then unlimited
    // return list/array of base64 images
  }

  handleRemoveImg(img) {
    const ImgData = [...this.state.ImgData];
    const index = ImgData.indexOf(img);
    ImgData.splice(index, 1);
    this.setState({ ImgData });
  }

  handleImgs() {
    return this.state.ImgData.map((img) => {
      return (
        <ImageCard img={img.data} removeImg={() => this.handleRemoveImg(img)} />
      );
    });
  }

  handleImgData() {
    this.props.imageData(this.state.ImgData);
  }

  handleClick = () => {
    this.hiddenFileInput.current.click();
  };

  handleChange(event) {
    if (
      event.target.files.length + this.state.ImgData.length >
      this.state.imgLimit
    ) {
      alert(
        `You are only allowed to upload a maximum of ${this.state.imgLimit} Images at a time.`
      );
    } else {
      const files = [...event.target.files];
      files.map((file) => {
        const fileUploaded = file;
        let reader = new FileReader();
        reader.readAsDataURL(fileUploaded);
        reader.onload = () =>
          this.setState({
            ImgData: [
              ...this.state.ImgData,
              { name: file.name, data: reader.result },
            ],
          });
      });
    }
  }

  componentDidMount() {
    Modal.setAppElement("body");
    if (this.props.imgLimit) {
      this.setState({ imgLimit: this.props.imgLimit });
    }
  }

  render() {
    const { isOpen } = this.props;
    if (isOpen) {
      return (
        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={true}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.props.close}
        >
          <div className="image-uploader">
            <div className="im-header">
              <div className="header-text">
                <div className="im-title">IMAGES</div>
                <div>
                  {this.state.ImgData.length} of {this.state.imgLimit} Images
                </div>
              </div>
              <button className="im-add-button" onClick={this.handleImgData} disabled={this.props.spinner}>
                <FontAwesomeIcon icon="arrow-right" className="im-add-icon" />
              </button>
            </div>
            <div className="im-body">
              <div className="uploader-container">
                {this.props.spinner ? (
                  <Spinner />
                ) : (
                  <div>
                    <div className="images-container">{this.handleImgs()}</div>
                    <button
                      className="upload-button"
                      onClick={this.handleClick}
                    >
                      <FontAwesomeIcon icon="camera" className="im-icon" />
                      Choose Image(s)
                    </button>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      ref={this.hiddenFileInput}
                      onChange={this.handleChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      );
    } else {
      return <div></div>;
    }
  }
}

export default ImageUploader;
