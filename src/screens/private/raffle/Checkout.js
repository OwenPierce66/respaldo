import React, { Component } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51GrtUoHuoQnP408hk6dnSJKGungKZi3NqsYBBKhx2BJnzKpX0MMNuLOxXKTRleXogSS4tQghf4ZSsqDodxOuZZTz006S8g1HjE"
);

export default class Checkout extends Component {
  render() {
    return (
      <div className="checkout-wrapper">
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    );
  }
}
