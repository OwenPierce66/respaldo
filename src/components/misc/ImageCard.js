import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ImageCard extends Component {
  constructor(props) {
    super(props);

    this.state = { spans: 0 };

    this.imageRef = React.createRef();
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;

    const spans = Math.ceil(height / 10);

    this.setState({ spans });
  };

  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
  }

  render() {
    const { img } = this.props;

    return (
      <div
        className="iu-image-container"
        style={{ gridRowEnd: `span ${this.state.spans}` }}
      >
        <button className="iu-button" onClick={() => {this.props.removeImg()}}>
          <FontAwesomeIcon icon="times-circle" className="iu-icon" />
        </button>
        <img src={img} ref={this.imageRef} alt="image" className="iu-image" />
      </div>
    );
  }
}

export default ImageCard;
