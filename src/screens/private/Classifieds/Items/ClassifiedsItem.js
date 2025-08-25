import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import {
  faEnvelope,
  faPhone,
  faStar,
  faShare,
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faChevronCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITION,
} from "../../../../components/classifieds/listing_values";
import Axios from "axios";
import moment from "moment";

export default class ClassifiedsItem extends Component {
  constructor() {
    super();

    this.state = {
      item: null,
      backgroundImageStyle: {},
      selectedImgId: null,
      photosLength: null,
      selectedImg: null,
      infinite: false,
      showMore: false,
      favorited: false,
    };

    this.getItem = this.getItem.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.slidePrev = this.slidePrev.bind(this);
    this.slideNext = this.slideNext.bind(this);
    this.favorite = this.favorite.bind(this);
  }

  renderImages() {
    const images = this.state.item.photos;
    if (images) {
      return images.map((image) => {
        return (
          <img
            src={image.file}
            alt=""
            className={
              this.state.selectedImgId === image.id
                ? "carousel-img selectedCarouselImg"
                : "carousel-img"
            }
            onClick={() =>
              this.setState({
                selectedImg: image.file,
                selectedImgId: image.id,
              })
            }
          />
        );
      });
    }
  }

  getItem() {
    const location = this.props.history.location.pathname;
    const id = location.match(/\d+$/)[0];

    Axios.get(`http://127.0.0.1:8000/api/listing/items/?itemId=${id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        let photosLength = res.data.results[0].photos.length;
        let selectedIndex = photosLength >= 5 ? 2 : 0;
        let infinite = photosLength >= 5 ? true : false;
        this.setState({
          item: res.data.results[0],
          selectedImg: res.data.results[0].photos[selectedIndex].file,
          selectedImgId: res.data.results[0].photos[selectedIndex].id,
          photosLength: photosLength,
          infinite: infinite,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    Axios.get(`http://127.0.0.1:8000/api/listing/favorites/?listingId=${id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        this.setState({
          favorited: res.data.classified_favorites[0].listing ? true : false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  slidePrev() {
    let photosLength = this.state.photosLength;
    let currentImgIndex = this.state.item.photos.findIndex((img) => {
      return img.id === this.state.selectedImgId;
    });
    let prevImgIndex = null;
    if (currentImgIndex === 0) {
      prevImgIndex = photosLength - 1;
    } else {
      prevImgIndex = currentImgIndex - 1;
    }
    this.setState({
      selectedImg: this.state.item.photos[prevImgIndex].file,
      selectedImgId: this.state.item.photos[prevImgIndex].id,
    });
  }

  slideNext() {
    let photosLength = this.state.photosLength;
    let currentImgIndex = this.state.item.photos.findIndex((img) => {
      return img.id === this.state.selectedImgId;
    });
    let nextImgIndex = null;
    if (currentImgIndex === photosLength - 1) {
      nextImgIndex = 0;
    } else {
      nextImgIndex = currentImgIndex + 1;
    }
    this.setState({
      selectedImg: this.state.item.photos[nextImgIndex].file,
      selectedImgId: this.state.item.photos[nextImgIndex].id,
    });
  }

  favorite() {
    const location = this.props.history.location.pathname;
    const id = location.match(/\d+$/)[0];
    window.location.reload();
    if (this.state.favorited) {
      Axios.delete(
        `http://127.0.0.1:8000/api/listing/favorites/?listingId=${id}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      );
    } else {
      Axios.post(
        "http://127.0.0.1:8000/api/listing/favorites/",
        {
          vehicleId: null,
          listingId: id,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      );
    }
  }

  componentDidMount() {
    this.getItem();
  }

  render() {
    const backgroundImageStyle = {
      backgroundImage: "url(" + this.state.selectedImg + ")",
    };

    const { item } = this.state;

    if (!item) {
      return <div></div>;
    }

    const PrevArrow = ({ onClick }) => {
      return (
        <div className="arrow prev" onClick={onClick}>
          <div className="arrow prev" onClick={this.slidePrev}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          </div>
        </div>
      );
    };

    const NextArrow = ({ onClick }) => {
      return (
        <div className="arrow next" onClick={onClick}>
          <div className="arrow next" onClick={this.slideNext}>
            <FontAwesomeIcon icon={faArrowAltCircleRight} />
          </div>
        </div>
      );
    };

    const settings = {
      infinite: this.state.infinite,
      speed: 100,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      slidesToShow: 5,
    };

    return (
      <div className="classifiedsItem">
        <div className="imageDisplay" style={backgroundImageStyle}>
          <a href="/dashboard/classifieds" className="return">
            <FontAwesomeIcon className="icon" icon={faChevronCircleLeft} />
          </a>
          <div className="overlay"></div>
          <div className="content">
            <div className="imgContainer">
              <img src={this.state.selectedImg} alt="" className="item-img" />
            </div>
            <div className="carouselWrapper">
              <div className="carousel">
                <Slider {...settings}>{this.renderImages()}</Slider>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="sectionTitle">{item.title}</div>
          <div className="sectionContainer">
            <div className="quickInfo">
              <div className="price">${item.price}</div>
              <div className="category">
                {LISTING_CATEGORIES[item.category]}
              </div>
              <div className="listing">
                Listed {moment(item.created).fromNow()} in {item.location}
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="sectionTitle">Contact</div>
          <div className="sectionContainer">
            <div className="contact">
              {item.callEnabled ? (
                <a href={"tel:" + item.contact_number}>Call</a>
              ) : (
                <button disabled={true}>Call</button>
              )}

              {item.textEnabled ? (
                <a href={"sms:" + item.contact_number}>Text</a>
              ) : (
                <button disabled={true}>Text</button>
              )}

              {item.emailEnabled ? (
                <a href={"mailto:" + item.contact_email}>Email</a>
              ) : (
                <button disabled={true}>Email</button>
              )}
            </div>
            <div className="contact-info">
              <div className="info">
                <FontAwesomeIcon className="info-icon" icon={faPhone} />
                <div>{item.contact_number}</div>
              </div>
              <div className="info">
                <FontAwesomeIcon className="info-icon" icon={faEnvelope} />
                <div>{item.contact_email}</div>
              </div>
            </div>
            <div className="options">
              {this.state.favorited ? (
                <button className="favorited" onClick={this.favorite}>
                  Unfavorite <FontAwesomeIcon className="icon" icon={faStar} />
                </button>
              ) : (
                <button className="disfavorited" onClick={this.favorite}>
                  Favorite <FontAwesomeIcon className="icon" icon={faStar} />
                </button>
              )}
              <button>
                Share <FontAwesomeIcon className="icon" icon={faShare} />
              </button>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="sectionTitle">Details</div>
          <div className="sectionContainer">
            <div className="details">
              <div className="condition">
                <label htmlFor="">Condition</label>
                <div>{LISTING_CONDITION[item.condition]}</div>
              </div>
              <div className="seller-desc">
                <div className={this.state.showMore ? "desc" : "desc collapse"}>
                  {item.description}
                </div>
                <div className="seller-desc-button">
                  {this.state.showMore ? (
                    <button onClick={() => this.setState({ showMore: false })}>
                      Show Less
                    </button>
                  ) : (
                    <button onClick={() => this.setState({ showMore: true })}>
                      Show More
                    </button>
                  )}
                </div>
              </div>
              <div className="location">
                <div className="location-1">{item.location}</div>
                <div className="location-2">Location is approximate</div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="section">
          <div className="sectionTitle">Seller Information</div>
          <div className="sectionContainer">
            <div className="user">
              <img src="https://www.fillmurray.com/150/150" alt="Profile Img" />
              <p>
                {item.user.first_name} {item.user.last_name}
              </p>
            </div>
            <div className="joined">
              Joined LG in {moment(item.user.date_joined).format("YYYY")}
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
