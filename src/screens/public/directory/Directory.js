import React, { Component } from "react";
import { MapContainer } from "./GoogleMaps";
import Axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsAltV,
  faArrowRight,
  faNewspaper,
  faPhone,
  faBlog,
  faPencilAlt,
  faAddressBook,
  faMoneyBill,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

class Directory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 40.520776,
      long: -111.9470577,
      displayItem: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
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

  displayDirectoryItems() {
    if (this.state.items) {
      return this.state.items.map((item) => {
        return (
          <div className="results-container" key={item.id}>
            <div
              className="result-inner"
              onClick={() => {
                this.setState({ displayItem: item });
              }}
            >
              <div className="loc-name">{item.name}</div>
              <a href={`tel:${item.phone_number}`} className="loc-phone">
                {item.phone_number}
              </a>
              <div className="loc-category">{item.category}</div>
              <div className="loc-links">
                {this.props.isAuthenticated &&
                item.businessPage &&
                item.businessPage.status == "Live" ? (
                  <Link
                    to={`/dashboard/businessPage/${item.businessPage.id}`}
                    className="loc-link"
                  >
                    Go To Buisness Page
                  </Link>
                ) : null}
                <a
                  href={`https://www.google.com/maps/@${item.latitude},${item.longitude},18z`}
                  className="loc-link"
                  target="blank"
                >
                  Open With Google
                </a>
              </div>
            </div>
          </div>
        );
      });
    }
  }

  componentDidMount() {
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
      <div className="directory-wrapper">
        <div className="directory">
          <div className="directory-header">
            <div className="directory-title">Business Directory</div>
            <div className="filter">
              <div className="search">
                <label htmlFor=""></label>

                <div className="business-search-wrapper">
                  <div className="font-awesome-icon-search">
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                  <input
                    className="business-input"
                    type="text"
                    placeholder="Search"
                    onChange={(event) => this.handleSearch(event)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="directory-body">
            <div className="google-maps">
              <MapContainer item={this.state.displayItem} />
            </div>
            <div className="directory-list">{this.displayDirectoryItems()}</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(Directory);
