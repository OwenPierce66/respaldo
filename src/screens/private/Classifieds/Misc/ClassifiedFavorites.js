import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

export default class ClassifiedFavorites extends Component {
  constructor() {
    super();

    this.state = {
      listingsQuerySet: null,
      listings: null,
    };

    this.getListings = this.getListings.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.showListings = this.showListings.bind(this);
  }

  getListings() {
    Axios.get("http://127.0.0.1:8000/api/listing/favorites/", {
      headers: {
        Authorization: `Token ${localStorage.getItem('userTokenLG')}`,
      },
    })
      .then((res) => {
        this.setState({
          listingsQuerySet: res.data.classified_favorites,
          listings: res.data.classified_favorites,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleSearch(e) {
    let listingsQuerySet = this.state.listingsQuerySet;

    let searched = listingsQuerySet.filter(function (listing) {
      if (listing.vehicle_listing) {
        return listing.vehicle_listing.title.toLowerCase().includes(e.target.value.toLowerCase())
      } else if (listing.listing) {
        return listing.listing.title.toLowerCase().includes(e.target.value.toLowerCase())
      }
    })
    
    this.setState({
      listings: searched
    })
  }

  showListings() {
    if (this.state.listings) {
      return this.state.listings.map((listing) => {
        if (listing.vehicle_listing) {
          const thumb_nail = listing.vehicle_listing.photos[0];
          return (
            <a href={`/dashboard/classifieds/vehicles/${listing.vehicle_listing.id}`} className="item">
              <img
                src={
                  thumb_nail ? thumb_nail.file : "https://via.placeholder.com/150"
                }
                alt=""
                className="item-img"
              />
              <div className="text">
                <div className="price">{listing.vehicle_listing.price}</div>
                <div className="description">{listing.vehicle_listing.title}</div>
                <div className="location">{listing.vehicle_listing.location}</div>
              </div>
            </a>
          );
        } else if (listing.listing) {
          const thumb_nail = listing.listing.photos[0];
          return (
            <a href={`/dashboard/classifieds/item/${listing.listing.id}`} className="item">
              <img
                src={
                  thumb_nail ? thumb_nail.file : "https://via.placeholder.com/150"
                }
                alt=""
                className="item-img"
              />
              <div className="text">
                <div className="price">{listing.listing.price}</div>
                <div className="description">{listing.listing.title}</div>
                <div className="location">{listing.listing.location}</div>
              </div>
            </a>
          );
        }
      })
    }
  }

  componentDidMount() {
    this.getListings()
  }

  render() {
    return (
      <div className="classifieds">
        <div className="c-header">
          <div className="pageTitle">My Favorites</div>
          <div className="filters">
            <a href={`/dashboard/classifieds/myClassifieds`} className="filter">
                <FontAwesomeIcon icon={faUser} />
              </a>
            <a href={`/dashboard/classifieds/create`} className="filter">
              Sell
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
            {this.showListings()}
          </div>
        </div>
      </div>
    )
  }
}