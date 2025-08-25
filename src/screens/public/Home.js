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

export default class Home extends Component {
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
            <Link to="/app/login" className="landing-icon">
              <FontAwesomeIcon icon={faChild} />
              YOI
            </Link>
            {/* <Link className="landing-icon">
              <FontAwesomeIcon icon={faCalendarAlt} />
              Events
            </Link> */}
            <Link to="/app/directory" className="landing-icon">
              <FontAwesomeIcon icon={faAddressBook} />
              Directory
            </Link>
            <Link to="/app/login" className="landing-icon">
              <FontAwesomeIcon icon={faPencilAlt} />
              Petitions
            </Link>
            <Link to="/app/login" className="landing-icon">
              <FontAwesomeIcon icon={faBlog} />
              Blog
            </Link>
            <Link to="/app/login" className="landing-icon">
              <FontAwesomeIcon icon={faPhone} />
              Contact
            </Link>
            <Link to="/app/exchange" className="landing-icon">
              <FontAwesomeIcon icon={faMoneyBill} />
              Exchange
            </Link>
            {/* <Link className="landing-icon">
              <FontAwesomeIcon icon={faSign} />
              Property
            </Link> */}
          </div>
        </div>

        <div
          className="landing-blog-container"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="landing-blog-header">Recent Posts</div>

          {this.blogSquareMaker()}
        </div>

        {/* <div className="landing-local-news-slider"> 
           <span className="local-news-slider-header">Local news</span> 

          <div className="landing-local-news-slider-grid">
            <div
              className={`landing-local-news-slider-square ${this.isActiveSlider(
                1
              )}`}
            >
               <img
                className="local-news-slider-transitioning-img"
                src="assets/images/conference_1.jpeg"
              /> 
              <h2 className="local-news-slider-transitioning-description">
                Welcome everyone! We're happy you could make it to conference
                this year.
              </h2> 
               <Link to={localNewsLink} className="read-more">
                Read more <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>

            <div
              className={`landing-local-news-slider-square ${this.isActiveSlider(
                2
              )}`}
            >
              <img
                className="local-news-slider-transitioning-img"
                src={"assets/images/conference_2.jpeg"}
              />
              <h2 className="local-news-slider-transitioning-description">
                Join us at the Alma Dayer school from 3:00 PM to 6:00 PM for
                games, <br /> and from 6:00 PM to 10:00 PM for our dance and
                talent show.
              </h2>

              <Link to={localNewsLink} className="read-more">
                Read more <FontAwesomeIcon icon={faArrowRight} />
              </Link> 
            </div>

            <div
              className={`landing-local-news-slider-square ${this.isActiveSlider(
                3
              )}`}
            >
              <img
                className="local-news-slider-transitioning-img"
                src="assets/images/conference_3.jpeg"
              />
              <h2 className="local-news-slider-transitioning-description">
                Oct 25th: <br />
                Men's and Women's meeting start at 6 AM, followed by by the
                first session at 10 AM and the second session at 3PM.
              </h2>
            <Link to={localNewsLink} className="read-more">
                Read more <FontAwesomeIcon icon={faArrowRight} />
              </Link> 
            </div>

            <div
              className={`landing-local-news-slider-square ${this.isActiveSlider(
                4
              )}`}
            >
              <img
                className="local-news-slider-transitioning-img"
                src={"assets/images/conference_4.jpeg"}
              />
              <h2 className="local-news-slider-transitioning-description">
                Oct 26th: <br />
                Men's and Women's meeting start at 6 AM, followed by by the
                first session at 10 AM and the second session at 3PM.
              </h2>
              <Link to={localNewsLink} className="read-more">
                Read more <FontAwesomeIcon icon={faArrowRight} />
              </Link> 
            </div>
          </div>

          <div className="local-news-dots">
            <span
              onClick={() => this.handleSliderChange(1)}
              className={`local-news-dot ${this.isActiveSlider(1)}`}
            />
            <span
              onClick={() => this.handleSliderChange(2)}
              className={`local-news-dot ${this.isActiveSlider(2)}`}
            />
            <span
              onClick={() => this.handleSliderChange(3)}
              className={`local-news-dot ${this.isActiveSlider(3)}`}
            />
            <span
              onClick={() => this.handleSliderChange(4)}
              className={`local-news-dot ${this.isActiveSlider(4)}`}
            />
          </div>
        </div> */}

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

          {/* <div className="detailed-links-square">
            <FontAwesomeIcon className="icon" icon={faCalendarAlt} />

            <h2>Events Calendar</h2>

            <span className="detailed-links-square-content">
              Need to know when something is scheduled? Lost your itenirary?
              <br />
              No worries, we got you covered! Check out our events calendar to
              see all the events happening in your town.
            </span>

            <Link to="/" className="read-more">
              Read more <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div> */}

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
              {/* <Link to="/contact">More contact information</Link> */}
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
