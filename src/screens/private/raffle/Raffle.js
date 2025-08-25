import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Countdown from "./countdown";

const Raffle = ({ match }) => {
  const { path, url } = match;

  return (
    <div className="raffle">
      <div className="left-side">
        <div className="header">
          <div className="title">Youth of Israel Raffle</div>
          <Countdown />
        </div>
        <div className="body">
          <div className="text">
            <p className="text-1">
              Your choice of Massey Ferguson Tractor, Ford Ranger gas or
              diesel, or Can-Am Maverick
            </p>
            <p className="text-2">
              Drawing will be held on saturday july 18th
            </p>
            <div className="button-container">
            <NavLink to={`${url}/checkout`} className="draw meet">
                Enter Now To Win!
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="right-side">
        <div className="images">
          <img
            className="image-1"
            src="https://picsum.photos/id/1/150/150"
            alt=""
          />
          <img
            className="image-1"
            src="https://picsum.photos/id/12/150/150"
            alt=""
          />
          <img
            className="image-1"
            src="https://picsum.photos/id/13/150/150"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Raffle;

