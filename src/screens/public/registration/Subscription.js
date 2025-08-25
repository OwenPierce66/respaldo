import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { loadStripe } from "@stripe/stripe-js";
import Axios from "axios";
import { Link } from "react-router-dom";

const Subscription = (props) => {
  const handleSubmit = async (ID) => {
    const stripe = await loadStripe(
      "pk_test_51GrtUoHuoQnP408hk6dnSJKGungKZi3NqsYBBKhx2BJnzKpX0MMNuLOxXKTRleXogSS4tQghf4ZSsqDodxOuZZTz006S8g1HjE"
    );

    Axios.post("http://127.0.0.1:8000/api/create-checkout-session/", {
      priceId: ID,
      userId: props.match.params.accountId,
    }).then((res) => {
      stripe.redirectToCheckout({ sessionId: res.data.sessionId });
    });
  };

  return (
    <div className="registration">
      <div className="header">
        <div className="left">LG</div>
        <div className="center">
          <p className="active">Account</p>
          <p className="active">Details</p>
          <p className="active">Subscription</p>
          <p>Start</p>
        </div>
        <div className="right">
          <p>Already using?</p>
          <Link to="../../app/login" className="link">
            Sign In
          </Link>
        </div>
      </div>
      <div className="body">
        <div className="Subscription">
          <div className="price-card">
            <div className="price-header">
              <div className="title">Monthly</div>
            </div>
            <div className="price-body">
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local News
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Business Directory
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local Petitions
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local Exchange Rate
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local Blogs
              </div>
            </div>
            <div className="price-footer">
              <div className="amount">
                <div className="price">$8</div>
                <div className="time">/month</div>
              </div>
              <button
                className="price-button"
                onClick={() => handleSubmit("price_1IO6aRHuoQnP408hcj01IfAr")}
              >
                Choose
              </button>
            </div>
          </div>
          <div className="price-card">
            <div className="price-header">
              <div className="title">Yearly</div>
            </div>
            <div className="price-body">
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local News
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Business Directory
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local Petitions
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local Exchange Rate
              </div>
              <div>
                <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
                Local Blogs
              </div>
            </div>
            <div className="price-footer">
              <div className="amount">
                <div className="price">$55</div>
                <div className="time">/year</div>
              </div>
              <button
                className="price-button"
                onClick={() => handleSubmit("price_1IO6aRHuoQnP408hdes0m0lW")}
              >
                Choose
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
