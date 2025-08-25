import React, { Component } from "react";
import { Link } from "react-router-dom";

const Petitions = ({ match }) => {
  const { path, url } = match;

  return (
    <div className="petition-component">
      <li className="petition-link-wrapper">
        <Link className="petition-link" to={`${url}/Ammon`}>
          Are you voting for ammon?
        </Link>
        <div className="petition-date"> - Sep. 25, 2020</div>
      </li>
      <li className="petition-link-wrapper">
        <Link className="petition-link" to={`${url}/Credencial`}>
          Do you have a credencial?
        </Link>
        <div className="petition-date"> - Sep. 25, 2020 </div>
      </li>
      <li className="petition-link-wrapper">
        <Link className="petition-link" to={`${url}/Representative`}>
          Representative Form
        </Link>
        <div className="petition-date"> - Sep. 18, 2020.</div>
      </li>
      <li className="petition-link-wrapper">
        <Link className="petition-link" to={`${url}/Security`}>
          Security Petition
        </Link>
        <div className="petition-date"> - Aug. 25, 2020 </div>
      </li>
    </div>
  );
};

export default Petitions;