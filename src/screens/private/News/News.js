import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class News extends Component {


  render() {
    return (
      <div className="columns-container">

        <div className="tempColumn-wrapper">

          <h1 className="title-column">
            BLOG
        </h1> <br />
          <div className="button-container">
            <NavLink to="/dashboard/news/Chantelle" className="columns-link">
              CHANTELLE

            <div className="columns-content">
                chantelle column
            </div>
            </NavLink>
            <NavLink to="/dashboard/news/Yandri" className="columns-link">
              YANDRI
            <div className="columns-content">
                yandri column
            </div>
            </NavLink>
            <NavLink to="/dashboard/news/FBT" className="columns-link">
              FIRST BORN TRIBE
            <div className="columns-content">
                first born tribe references
            </div>
            </NavLink>

            <NavLink to="/dashboard/news/Business" className="columns-link">
              BUSINESS
            <div className="columns-content">
                businesses
            </div>
            </NavLink>


          </div>
        </div>
      </div>
    );
  }
}

