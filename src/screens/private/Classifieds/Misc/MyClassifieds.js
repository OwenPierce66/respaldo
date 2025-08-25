import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

export default class MyClassifieds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {
        listings: [],
        vehicles: [],
      },
      next: null,
      previous: null,
      count: null,
    };

    this.getItems = this.getItems.bind(this);
    this.handleItems = this.handleItems.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleVehicles = this.handleVehicles.bind(this);
    this.deleteListing = this.deleteListing.bind(this);
  }

  deleteListing(type, listingId) {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      Axios.delete(`http://127.0.0.1:8000/api/listing/${type}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
        data: {
          listing: listingId,
        },
      })
        .then((res) => {
          location.reload();
        })
        .catch((err) => {
          console.log("Delete Listing Error:", err);
        });
    }
  }

  getItems() {
    Axios.get("http://127.0.0.1:8000/api/myListings/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        this.setState({
          items: {
            listings: res.data.items,
            vehicles: res.data.vehicles,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSearch(e) {
    Axios.get(
      `http://127.0.0.1:8000/api/myListings/?search=${e.target.value}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        this.setState({
          items: {
            listings: res.data.items,
            vehicles: res.data.vehicles,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleItems() {
    if (this.state.items.listings.length > 0) {
      return this.state.items.listings.map((item) => {
        const thumb_nail = item.photos[0];
        return (
          <div className="item">
            <a
              href={`/dashboard/classifieds/edit-listing/classified/${item.id}`}
              className="editButton"
            >
              Edit
            </a>
            <button
              type="button"
              onClick={() => this.deleteListing("items", item.id)}
              className="deleteButton"
            >
              Delete
            </button>
            <img
              onClick={() =>
                this.props.history.push(
                  `/dashboard/classifieds/item/${item.id}`
                )
              }
              src={
                thumb_nail ? thumb_nail.file : "https://via.placeholder.com/150"
              }
              alt=""
              className="item-img"
            />
            <a href={`/dashboard/classifieds/item/${item.id}`} className="text">
              <div className="price">{item.price}</div>
              <div className="description">{item.title}</div>
              <div className="location">{item.location}</div>
            </a>
          </div>
        );
      });
    }
  }

  handleVehicles() {
    if (this.state.items.vehicles.length > 0) {
      return this.state.items.vehicles.map((item) => {
        const thumb_nail = item.photos[0];
        return (
          <div className="item">
            <a
              href={`/dashboard/classifieds/edit-listing/vehicle/${item.id}`}
              className="editButton"
            >
              Edit
            </a>
            <button
              type="button"
              onClick={() => this.deleteListing("vehicles", item.id)}
              className="deleteButton"
            >
              Delete
            </button>
            <img
              onClick={() =>
                this.props.history.push(
                  `/dashboard/classifieds/vehicles/${item.id}`
                )
              }
              src={
                thumb_nail ? thumb_nail.file : "https://via.placeholder.com/150"
              }
              alt=""
              className="item-img"
            />
            <a
              href={`/dashboard/classifieds/vehicles/${item.id}`}
              className="text"
            >
              <div className="price">{item.price}</div>
              <div className="description">{item.title}</div>
              <div className="location">{item.location}</div>
            </a>
          </div>
        );
      });
    }
  }

  componentDidMount() {
    this.getItems();
  }

  render() {
    return (
      <div className="classifieds">
        <div className="c-header">
          <div className="pageTitle">My Classifieds</div>
          <div className="filters">
            <a href={`/dashboard/classifieds/create`} className="filter">
              Sell
            </a>
            <a href={`/dashboard/classifieds/favorites`} className="filter">
              <FontAwesomeIcon icon={faStar} />
            </a>
            <a href={`/dashboard/classifieds`} className="filter">
              Items
            </a>
            <a href={`/dashboard/classifieds/vehicles`} className="filter">
              Vehicles
            </a>
          </div>
          <div className="search">
            <div className="wrapper">
              <FontAwesomeIcon icon={faSearch} className="searchIcon" />
              <input
                type="text"
                placeholder="Search Classifieds"
                className="searchInput"
                onChange={(e) => this.handleSearch(e)}
              />
            </div>
          </div>
        </div>
        <div className="c-body">
          <div className="items">
            {this.handleVehicles()}
            {this.handleItems()}
          </div>
        </div>
      </div>
    );
  }
}
