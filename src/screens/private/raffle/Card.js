/**
 * Use the CSS tab above to style your Element's container.
 */
import React, { Component } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

class CardSection extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="card-info">
        <div className="card-element">
          <label htmlFor="">Card Number</label>
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <div className="card-element">
          <label htmlFor="">Exp.</label>
          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <div className="card-element">
          <label htmlFor="">CVC</label>
          <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
    );
  }
}

export default CardSection;
