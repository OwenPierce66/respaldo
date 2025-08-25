import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faStar } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import ListingInfiniteScroll from "../../../../components/classifieds/ListingInfiniteScroll";

export default class ClassifiedsVehicles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      next: null,
      previous: null,
      count: null,
      hasMore: true,
    };

    this.getItems = this.getItems.bind(this);
    this.handleItems = this.handleItems.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  getItems(url) {
    Axios.get(url, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        if (res.data.next === null) {
          this.setState({
            items: this.state.items.concat(res.data.results),
            count: res.data.count,
            next: res.data.next,
            previous: res.data.previous,
            hasMore: false,
          });
        } else {
          this.setState({
            items: this.state.items.concat(res.data.results),
            count: res.data.count,
            next: res.data.next,
            previous: res.data.previous,
            hasMore: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleItems() {
    const { path, url } = this.props.match;

    if (this.state.items.length > 0) {
      return this.state.items.map((item) => {
        const thumb_nail = item.photos[0];
        return (
          <a href={`${url}/item/${item.id}`} className="item">
            <img
              src={
                thumb_nail ? thumb_nail.file : "https://via.placeholder.com/150"
              }
              alt=""
              className="item-img"
            />
            <div className="text">
              <div className="price">{item.price}</div>
              <div className="description">{item.title}</div>
              <div className="location">{item.location}</div>
            </div>
          </a>
        );
      });
    }
  }

  handleSearch(e) {
    Axios.get(
      `http://127.0.0.1:8000/api/listing/vehicles/?search=${e.target.value}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        this.setState({
          items: res.data.results,
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getItems("http://127.0.0.1:8000/api/listing/vehicles/");
  }

  render() {
    const { path, url } = this.props.match;

    return (
      <div className="classifieds">
        <div className="c-header">
          <div className="pageTitle">Classified Vehicles</div>
          <div className="filters">
            <a href={"/dashboard/classifieds/myClassifieds"} className="filter">
              <FontAwesomeIcon icon={faUser} />
            </a>
            <a href={"/dashboard/classifieds/create"} className="filter">
              Sell
            </a>
            <a href={`/dashboard/classifieds/favorites`} className="filter">
              <FontAwesomeIcon icon={faStar} />
            </a>
            <a href="/dashboard/classifieds" className="filter">
              Items
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
          <div className="banner">
            <div>Today's Picks for You</div>
          </div>
          <ListingInfiniteScroll
            classifiedType="vehicles"
            items={this.state.items}
            handleNext={() => this.getItems(this.state.next)}
            hasMore={this.state.hasMore}
            url={url}
          />
        </div>
      </div>
    );
  }
}
