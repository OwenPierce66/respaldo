import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faSearch,
  faUser,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import Modal from "react-modal";
import { LISTING_CATEGORIES } from "../../../../components/classifieds/listing_values";
import ListingInfiniteScroll from "../../../../components/classifieds/ListingInfiniteScroll";

export default class Classifieds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      next: null,
      previous: null,
      count: null,
      showFilter: false,
      categoryFilters: [],
      hasMore: true,
    };

    this.getItems = this.getItems.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleCategoryFilter = this.toggleCategoryFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
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

  toggleCategoryFilter(e) {
    let filters = [...this.state.categoryFilters];
    let item = e.target.value;

    if (e.target.checked) {
      filters.push(item);
    } else {
      const index = filters.indexOf(item);
      filters.splice(index, 1);
    }

    this.setState({ categoryFilters: filters });
  }

  handleFilter() {
    let categories = this.state.categoryFilters.join(",");

    Axios.get(
      `http://127.0.0.1:8000/api/listing/items/?categories=${categories}`,
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
        this.toggleModal();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCategories() {
    return Object.keys(LISTING_CATEGORIES).map((key) => {
      return (
        <div className="category">
          <input
            type="checkbox"
            value={key}
            onClick={this.toggleCategoryFilter}
            checked={this.state.categoryFilters.includes(key) ? true : false}
          />
          <label>{LISTING_CATEGORIES[key]}</label>
        </div>
      );
    });
  }

  handleSearch(e) {
    Axios.get(
      `http://127.0.0.1:8000/api/listing/items/?search=${e.target.value}`,
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

  toggleModal() {
    this.setState({ showFilter: !this.state.showFilter });
  }

  componentDidMount() {
    Modal.setAppElement("body");
    this.getItems("http://127.0.0.1:8000/api/listing/items/");
  }

  render() {
    const { path, url } = this.props.match;

    return (
      <div className="classifieds">
        <div className="c-header">
          <div className="pageTitle">Classifieds</div>
          <div className="filters">
            <a href={`${url}/myClassifieds`} className="filter">
              <FontAwesomeIcon icon={faUser} />
            </a>
            <a href={`${url}/create`} className="filter">
              Sell
            </a>
            <a href={`/dashboard/classifieds/favorites`} className="filter">
              <FontAwesomeIcon icon={faStar} />
            </a>
            <div className="filter" onClick={this.toggleModal}>
              Categories
            </div>
            <a href={`${url}/vehicles`} className="filter">
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
          <div className="banner">
            <div>Today's Picks for You</div>
          </div>
          <ListingInfiniteScroll
            classifiedType="item"
            items={this.state.items}
            handleNext={() => this.getItems(this.state.next)}
            hasMore={this.state.hasMore}
            url={url}
          />
        </div>
        <Modal
          className="FilterModal"
          overlayClassName="FilterOverlay"
          isOpen={this.state.showFilter}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.toggleModal}
          ariaHideApp={false}
        >
          <div className="filtersContainer">
            <div className="top">
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="backIcon"
                onClick={this.toggleModal}
              />
            </div>
            <div className="main">
              <div className="categories">{this.handleCategories()}</div>
            </div>
            <div className="footer">
              <button onClick={this.handleFilter}>Filter</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
