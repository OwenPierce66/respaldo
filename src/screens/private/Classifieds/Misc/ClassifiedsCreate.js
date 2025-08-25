import { faBox, faBoxOpen, faCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ClassifiedsCreate = ({ match }) => {
  const { path, url } = match;

  return (
    <div className="ccw">
      <div className="create">
        <div className="title">Classified Listing</div>
        <div className="icon-wrapper">
          <FontAwesomeIcon className="create-icon" icon={faBoxOpen} />
        </div>
        <div className="button-wrapper">
          <a
            href={`${url}-listing/classified`}
            className="create-listing-button"
          >
            Create
          </a>
        </div>
      </div>
      <div className="create">
        <div className="title">Vehicle Lisiting</div>
        <div className="icon-wrapper">
          <FontAwesomeIcon className="create-icon" icon={faCar} />
        </div>
        <div className="button-wrapper">
          <a href={`${url}-listing/vehicle`} className="create-listing-button">
            Create
          </a>
        </div>
      </div>
    </div>
  );
};

export default ClassifiedsCreate;
