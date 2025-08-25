import Axios from "axios";
import React, { useEffect, useState } from "react";
import image from "../../../../static/assets/images/YOI-image.jpg";
import { pluralize } from "../../../utils/String";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChild, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faRectangleList } from "@fortawesome/free-regular-svg-icons";

const YouthOfIsrael = ({ match }) => {
  const { path, url } = match;
  const [childrenCount, setChildrenCount] = useState(0)

  useEffect(() => {
    Axios.get('http://127.0.0.1:8000/api/yoi/', { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } })
      .then((res) => {
        setChildrenCount(res.data.count)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  return (
    <div className="YOI-wrapper">
      <div className="top-container">
        <div className="left">
          <p className="title">Be a part of The Youth of Israel</p>
          <p className="sub-title">
            The Youth of Israel is a program that gives our teens an opportunity
            to come together, open up, learn, experience, and express themselves
            with a great support system
          </p>
          {/* Remove and uncomment links once YOI registrations are open again */}
          <p style={{ textAlign: 'center' }}>YOI registrations are currently closed.</p>
          {/*
          {!!childrenCount && <p className="sub-title">{childrenCount} {pluralize(childrenCount, 'kid', 'kids')} registered so far!</p>}
          <a href={`${url}/register`}><button><FontAwesomeIcon className="link-icon" icon={faChild} /> Register for YOI</button></a>
          <a href={`${url}/registrations`}><button className="secondary"><FontAwesomeIcon icon={faUsers} /> See my registered kids</button></a>
          <a href={`${url}/assistant`}><button className="secondary"> <FontAwesomeIcon icon={faRectangleList} /> Sign up to be a YOI assistant</button></a>
          */}
        </div>
        <div className="right">
          <img src={image} alt="YOI Image" />
        </div>
      </div>
      <div className="container">
      </div>
    </div>
  );
};

export default YouthOfIsrael;
