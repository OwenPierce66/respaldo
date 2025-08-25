import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITION,
  VEHICLE_CONDITION,
  BODY_STYLE,
  COLOR_OPTIONS,
  FUEL_TYPE,
  VEHICLE_MAKE,
  TRANSMISSION_TYPE,
} from "../../../../components/classifieds/listing_values";
import Axios from "axios";
import { connect } from "react-redux";
import ListingImgUploader from "../../../../components/classifieds/ListingImgUploader";
import { Link } from "react-router-dom";

class ClassifiedsCreateListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: null,
      ImgData: [],
      classified: {
        title: null,
        price: null,
        category: null,
        condition: null,
        location: null,
        description: null,
        callEnabled: true,
        textEnabled: true,
        emailEnabled: true,
        contact_email: null,
        contact_number: null,
        body_style: null,
        exterior_color: null,
        exterior_condition: null,
        interior_color: null,
        interior_condition: null,
        make: null,
        fuel_type: null,
        model: null,
        trim: null,
        year: null,
        transmission: null,
        mileage: null,
        vin: null,
      },
      imgLimit: 12,
      isSubmitting: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleImgData = this.handleImgData.bind(this);
  }

  handleImageUpload(listingId) {
    Axios.post(
      "http://127.0.0.1:8000/api/listing/image-upload/",
      {
        images: this.state.ImgData,
        listingId: listingId,
        type: this.state.type,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    );
  }

  handleSubmit(e) {
    this.setState({ isSubmitting: true });
    e.preventDefault();
    let classifiedType = null;
    if (this.state.type === "classified") {
      classifiedType = "items";
    } else if (this.state.type === "vehicle") {
      classifiedType = "vehicles";
    }
    Axios.post(
      `http://127.0.0.1:8000/api/listing/${classifiedType}/`,
      {
        listingData: {
          ...this.state.classified,
        },
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        this.handleImageUpload(res.data.listing.id);
        this.props.history.push(`/dashboard/classifieds/myClassifieds`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(e) {
    this.setState({
      classified: {
        ...this.state.classified,
        [e.target.name]: e.target.value,
      },
    });
  }

  handleOption(options) {
    let items = [];

    for (const [key, value] of Object.entries(options)) {
      items.push(<option value={key}>{value}</option>);
    }

    return items;
  }

  handleImgData(ImgData) {
    this.setState({
      ImgData,
    });
  }

  componentDidMount() {
    let location = this.props.history.location.pathname.split("/");
    let type = location[location.length - 1];

    this.setState({
      type,
    });
  }

  render() {
    if (this.state.type === "classified") {
      return (
        <div className="create-listing">
          <div className="listing-wrapper">
            <div className="section">
              <div className="header-section">
                <Link to="/dashboard/classifieds" className="backBtnWrapper">
                  <FontAwesomeIcon
                    className="backIcon"
                    icon={faArrowCircleLeft}
                  />
                  <div className="title">Classifieds</div>
                </Link>
                <div className="sub-title">Item For Sale</div>
              </div>
            </div>
            <form onSubmit={(e) => this.handleSubmit(e)}>
              {/* <div className="section">
                <div className="user">
                  <div className="profile">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="profile img"
                    />
                    <div>
                      <div className="name">Jaxson Mansouri</div>
                      <div className="info">Listing to public market.</div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="section">
                <ListingImgUploader
                  max="12"
                  Photos={[]}
                  ImgData={this.state.ImgData}
                  handleImgData={(data) => this.handleImgData(data)}
                />
              </div>
              <div className="section">
                <div className="section-name">Listing Info</div>
                <div className="listing-info">
                  <div className="input-container">
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Price</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="100.00"
                      step=".01"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Category</label>
                    <select
                      name="category"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(LISTING_CATEGORIES)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Condition</label>
                    <select
                      name="condition"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(LISTING_CONDITION)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="SLC, UT"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Description</label>
                    <textarea
                      name="description"
                      onChange={this.handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-name">Contact Info</div>
                <div className="listing-info">
                  <div className="enabledWrapper">
                    <div className="enabled-input">
                      <input
                        type="checkbox"
                        checked={this.state.classified.callEnabled}
                        onChange={() =>
                          this.setState({
                            classified: {
                              ...this.state.classified,
                              callEnabled: !this.state.classified.callEnabled,
                            },
                          })
                        }
                      />
                      <label htmlFor="">Calls Enabled</label>
                    </div>
                    <div className="enabled-input">
                      <input
                        type="checkbox"
                        checked={this.state.classified.textEnabled}
                        onChange={() =>
                          this.setState({
                            classified: {
                              ...this.state.classified,
                              textEnabled: !this.state.classified.textEnabled,
                            },
                          })
                        }
                      />
                      <label htmlFor="">Texts Enabled</label>
                    </div>
                    <div className="enabled-input">
                      <input
                        type="checkbox"
                        checked={this.state.classified.emailEnabled}
                        onChange={() =>
                          this.setState({
                            classified: {
                              ...this.state.classified,
                              emailEnabled: !this.state.classified.emailEnabled,
                            },
                          })
                        }
                      />
                      <label htmlFor="">Emails Enabled</label>
                    </div>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Email</label>
                    <input
                      type="text"
                      name="contact_email"
                      placeholder="JohnDoe@mail.com"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Phone Number</label>
                    <input
                      type="text"
                      name="contact_number"
                      placeholder="801-555-5555"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="section">
                <button
                  className="listing-submit"
                  type="submit"
                  disabled={this.state.isSubmitting}
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    } else if (this.state.type === "vehicle") {
      return (
        <div className="create-listing">
          <div className="listing-wrapper">
            <div className="section">
              <div className="header-section">
                <Link to="/dashboard/classifieds" className="backBtnWrapper">
                  <FontAwesomeIcon
                    className="backIcon"
                    icon={faArrowCircleLeft}
                  />
                  <div className="title">Classifieds</div>
                </Link>
                <div className="sub-title">Vehicle For Sale</div>
              </div>
            </div>
            <form onSubmit={(e) => this.handleSubmit(e)}>
              {/* <div className="section">
                <div className="user">
                  <div className="profile">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="profile img"
                    />
                    <div>
                      <div className="name">Jaxson Mansouri</div>
                      <div className="info">Listing to public market.</div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="section">
                <ListingImgUploader
                  max="12"
                  Photos={[]}
                  ImgData={this.state.ImgData}
                  handleImgData={(data) => this.handleImgData(data)}
                />
              </div>
              <div className="section">
                <div className="section-name">Vehicle Info</div>
                <div className="listing-info">
                  <div className="input-container">
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      maxLength="200"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Price</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="100.00"
                      step=".01"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Body Style</label>
                    <select
                      name="body_style"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(BODY_STYLE)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Exterior Color</label>
                    <select
                      name="exterior_color"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(COLOR_OPTIONS)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Exterior Condition</label>
                    <select
                      name="exterior_condition"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(VEHICLE_CONDITION)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Interior Color</label>
                    <select
                      name="interior_color"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(COLOR_OPTIONS)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Interior Condition</label>
                    <select
                      name="interior_condition"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(VEHICLE_CONDITION)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Make</label>
                    <select name="make" onChange={this.handleChange} required>
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(VEHICLE_MAKE)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Fuel Type</label>
                    <select
                      name="fuel_type"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(FUEL_TYPE)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Model</label>
                    <input
                      type="text"
                      name="model"
                      placeholder="Volkswagen Atlas"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Trim</label>
                    <input
                      type="text"
                      name="trim"
                      maxLength="1500"
                      placeholder="EX-T"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Year</label>
                    <input
                      type="number"
                      name="year"
                      placeholder="2021"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Transmission</label>
                    <select
                      name="transmission"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Choose...
                      </option>
                      {this.handleOption(TRANSMISSION_TYPE)}
                    </select>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Mileage</label>
                    <input
                      type="number"
                      name="mileage"
                      placeholder="90000"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Vin</label>
                    <input
                      type="text"
                      name="vin"
                      maxLength="20"
                      placeholder="5YJSA1DG9DFP14705"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="SLC, UT"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Description</label>
                    <textarea
                      name="description"
                      onChange={this.handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-name">Contact Info</div>
                <div className="listing-info">
                  <div className="enabledWrapper">
                    <div className="enabled-input">
                      <input
                        type="checkbox"
                        checked={this.state.classified.callEnabled}
                        onChange={() =>
                          this.setState({
                            classified: {
                              ...this.state.classified,
                              callEnabled: !this.state.classified.callEnabled,
                            },
                          })
                        }
                      />
                      <label htmlFor="">Calls Enabled</label>
                    </div>
                    <div className="enabled-input">
                      <input
                        type="checkbox"
                        checked={this.state.classified.textEnabled}
                        onChange={() =>
                          this.setState({
                            classified: {
                              ...this.state.classified,
                              textEnabled: !this.state.classified.textEnabled,
                            },
                          })
                        }
                      />
                      <label htmlFor="">Texts Enabled</label>
                    </div>
                    <div className="enabled-input">
                      <input
                        type="checkbox"
                        checked={this.state.classified.emailEnabled}
                        onChange={() =>
                          this.setState({
                            classified: {
                              ...this.state.classified,
                              emailEnabled: !this.state.classified.emailEnabled,
                            },
                          })
                        }
                      />
                      <label htmlFor="">Emails Enabled</label>
                    </div>
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Email</label>
                    <input
                      type="text"
                      name="contact_email"
                      placeholder="JohnDoe@mail.com"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="">Phone Number</label>
                    <input
                      type="text"
                      name="contact_number"
                      placeholder="801-555-5555"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="section">
                <button
                  className="listing-submit"
                  type="submit"
                  disabled={this.state.isSubmitting}
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

function mapStateToProps(state) {
  return {
    userId: state.auth.user.id,
  };
}

export default connect(mapStateToProps)(ClassifiedsCreateListing);
