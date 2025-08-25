import React, { Component } from "react";
import { Link } from "react-router-dom";

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
  faChild,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

export default class HomePrivate extends Component {
  constructor() {
    super();

    this.state = {
      activeSlider: 1,
      defaultAlreadyChecked: true,
      blogs: [],
    };
  }

  blogSquareMaker = () => {
    return this.state.blogs.map((blog) => {
      return (
        <div key={blog.id} className="landing-blog-square">
          <h2 className="landing-blog-square-header">{blog.title}</h2>

          <span className="landing-blog-square-content">{blog.summary}</span>

          <Link to={`/app/login`} className="read-more">
            Read more <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      );
    });
  };

  handleSliderChange = (number) => {
    this.setState({ activeSlider: number });
  };

  isActiveSlider = (number) => {
    if (this.state.activeSlider === number) {
      return "active";
    } else {
      return "";
    }
  };

  getLatestBlogs = () => {
    Axios.get("http://localhost:8000/api/landing/").then((response) => {
      this.setState({ ...response.data });
    });
  };

  componentDidMount() {
    this.getLatestBlogs();
  }

  render() {
    const backgroundImageUrl = "../../../static/assets/images/image2.jpg";

    const inspirationalImageUrl =
      "../../../static/assets/images/lg-tree-transparent.svg";

    return (
      <div className="landing">
        <div className="landing-icons-container">
          <input
            type="checkbox"
            name="icon-grid"
            id="icon-grid"
            defaultChecked={this.state.defaultAlreadyChecked}
          />
          <label className="icon-grid-checkbox-label" htmlFor="icon-grid">
            <FontAwesomeIcon icon={faArrowsAltV} />
          </label>
          <div className="landing-icons-grid">
            <Link to="/dashboard/YOI" className="landing-icon">
              <FontAwesomeIcon icon={faChild} />
              YOI
            </Link>
            <Link to="/dashboard/directory" className="landing-icon">
              <FontAwesomeIcon icon={faAddressBook} />
              Directory
            </Link>
            <Link to="/dashboard/petitions" className="landing-icon">
              <FontAwesomeIcon icon={faPencilAlt} />
              Petitions
            </Link>
            <Link to="/dashboard/blog" className="landing-icon">
              <FontAwesomeIcon icon={faBlog} />
              Blog
            </Link>
            <Link to="/dashboard/contact" className="landing-icon">
              <FontAwesomeIcon icon={faPhone} />
              Contact
            </Link>
            <Link to="/dashboard/exchange" className="landing-icon">
              <FontAwesomeIcon icon={faMoneyBill} />
              Exchange
            </Link>
          </div>
        </div>

        <div
          className="landing-blog-container"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="landing-blog-header">Recent Posts</div>

          {this.blogSquareMaker()}
        </div>

        <img
          // Try to use pngs with transparent backgrounds ?
          className="landing-inspirational-image"
          src={inspirationalImageUrl}
        />

        <div className="detailed-links-grid">
          <div className="detailed-links-square">
            <FontAwesomeIcon className="icon" icon={faAddressBook} />

            <h2>Business Directory</h2>

            <span className="detailed-links-square-content">
              Need to find a place or business? Check out the business directory
              for all you informational needs.
            </span>

            <Link to="/app/directory" className="read-more">
              Read more <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <div className="detailed-links-square">
            <FontAwesomeIcon className="icon" icon={faBlog} />

            <h2>Blog</h2>

            <span className="detailed-links-square-content">
              Want to keep up with the latest news from the town and community?
              <br />
              How about keeping up with the site and the crew at Whistle Coding?
              <br />
              Check out our blog below!
            </span>

            <Link to="/app/login" className="read-more">
              Read more <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>

        <div className="landing-footer">
          <img
            className="landing-grid-square footer-logo"
            src="assets/images/lg-tree-transparent.svg"
          />
          <div className="landing-grid">
            <div className="landing-grid-square footer-contact">
              <div className="landing-grid-square-header">Contact us</div>
              <a
                target="blank"
                href="https://api.whatsapp.com/send/?phone=%2B18018353995&text&app_absent=0"
              >
                WhatsApp
              </a>
              <a target="blank" href="mailto:adrianlebaron@gmail.com?subject=I%20had%20a%20question">
                Email
              </a>
            </div>

            <div className="landing-grid-square footer-about">
              <div className="landing-grid-square-header">About us</div>

              <a target="blank" href="https://anchor.fm/adrian-lebaron">
                Amistad Morning Podcast
              </a>
            </div>
          </div>

          <img className="landing-logo" />
        </div>
      </div>
    );
  }
}
