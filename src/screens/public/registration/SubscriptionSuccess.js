import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const SubscriptionSuccess = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="registration">
      <div className="header">
        <div className="left">LG</div>
        <div className="center">
          <p className="active">Account</p>
          <p className="active">Details</p>
          <p className="active">Subscription</p>
          <p className="active">Start</p>
        </div>
        <div className="right">
          {/* <p>Already using?</p>
          <Link className="link">Sign In</Link> */}
        </div>
      </div>
      <div className="body">
        <div className="SubscriptionSuccess">
          <div className="success-icon-wrapper">
            <FontAwesomeIcon className="success-icon" icon={faCheckCircle} />
          </div>
          <div className="success-text-wrapper">
            <h1>You're all set! You're account has been created</h1>
            <h2>
              You can now view your LG Dashboard by clicking 
              <a className="dashboard-link" href="/dashboard">Here</a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
