import React from "react";
import {
  ElementsConsumer,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Spinner from "../../../components/misc/Spinner";
import CardSection from "./Card";
import { Redirect } from "react-router";

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formDisabled: false,
      formSubmitted: false,
      showHidePayment1: false,
      showHidePayment2: false,
      showHidePayment1Class: "",
      showHidePayment2Class: "",
      price: 295,
      qty: 1,
      city: null,
      country: null,
      line1: null,
      line2: null,
      postal_code: null,
      state: null,
      email: null,
      name: null,
      phone: null,
      errorText: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.showHidePayment = this.showHidePayment.bind(this);
  }

  createTickets() {
    axios
      .post(
        "http://127.0.0.1:8000/api/raffle/",
        {
          data: {
            post_type: "create_tickets",
            qty: this.state.qty,
          },
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      )
      .then((response) => {
        this.setState({
          tickets: response.data.tickets,
          formSubmitted: true,
        });
      })
      .catch((err) => {
        console.log("Error");

        console.log(err);
      });
  }

  handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    this.setState({
      formDisabled: true,
    });

    if (this.state.qty > 50 || this.state.qty < 1) {
      this.setState({
        errorText: "Error: Ticket QTY can't be more than 50",
        formDisabled: false,
      });
      return;
    }

    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const client_secret = await axios
      .post(
        "http://127.0.0.1:8000/api/raffle/",
        {
          data: {
            post_type: "intent",
            price: this.state.price,
            qty: this.state.qty,
          },
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      )

      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log("Error");

        console.log(err);
      });

    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(
          CardCvcElement,
          CardExpiryElement,
          CardNumberElement
        ),
        billing_details: {
          address: {
            city: this.state.city,
            country: this.state.country,
            line1: this.state.line1,
            line2: this.state.line2,
            postal_code: this.state.postal_code,
            state: this.state.state,
          },
          email: this.state.email,
          name: this.state.name,
          phone: this.state.phone,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
      this.setState({
        formDisabled: false,
      });
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        this.createTickets();
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  showHidePayment(method) {
    switch (method) {
      case "showHidePayment1":
        let paymentClass =
          this.state.showHidePayment1Class === "show" ? "" : "show";
        this.setState({
          showHidePayment1: !this.state.showHidePayment1,
          showHidePayment1Class: paymentClass,
          showHidePayment2Class: "",
          showHidePayment2: false,
        });
        break;
      case "showHidePayment2":
        let paymentClass2 =
          this.state.showHidePayment2Class === "show" ? "" : "show";
        this.setState({
          showHidePayment1: false,
          showHidePayment1Class: "",
          showHidePayment2: !this.state.showHidePayment2,
          showHidePayment2Class: paymentClass2,
        });
        break;
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    if (this.state.formSubmitted) {
      return (
        <Redirect
          to={{
            pathname: "/confirmation",
            state: { tickets: this.state.tickets },
          }}
        />
      );
    } else {
      return (
        <div className="checkout">
          <div className="left-side">
            <p>{this.state.errorText}</p>

            <div className="item-container">
              <label className="card-title">Items</label>
              <div className="card">
                <div className="card-item">
                  <div className="card-name">Raffle Ticket</div>
                  <div className="desc">Ticket to enter you to win.</div>
                  <div className="item-price">${this.state.price}</div>
                  <div className="item-quantity">
                    <div>Qty:</div>
                    <input
                      className="item-qty-input"
                      name="qty"
                      defaultValue="1"
                      max="50"
                      type="number"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-container">
              <label className="card-title">Payment Methods</label>
              <div className="card">
                <div className="card-header">
                  <input
                    className="round"
                    type="checkbox"
                    onClick={() => this.showHidePayment("showHidePayment1")}
                    id="checkbox"
                    checked={this.state.showHidePayment1}
                  />
                  <span>Credit / Debit Card</span>
                </div>
                <div
                  className={"card-body " + this.state.showHidePayment1Class}
                >
                  <form onSubmit={this.handleSubmit}>
                    <fieldset disabled={this.state.formDisabled}>
                      <div className="user-info">
                        <div className="info-input">
                          <label htmlFor="name">Name On Card</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="name"
                            onChange={this.handleChange}
                            required
                          />
                        </div>
                        <div className="double">
                          <div className="info-input">
                            <label htmlFor="">Email</label>
                            <input
                              type="text"
                              name="email"
                              placeholder="Email"
                              className="email"
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                          <div className="info-input">
                            <label htmlFor="">Phone</label>
                            <input
                              type="text"
                              name="phone"
                              placeholder="Phone"
                              className="phone"
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="double">
                          <div className="info-input">
                            <label htmlFor="">Address 1</label>
                            <input
                              type="text"
                              name="line1"
                              placeholder="Address 1"
                              className="line1"
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                          <div className="info-input">
                            <label htmlFor="">Address 2</label>
                            <input
                              type="text"
                              name="line2"
                              placeholder="Address 2"
                              className="line2"
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="double">
                          <div className="info-input">
                            <label htmlFor="">City</label>
                            <input
                              type="text"
                              name="city"
                              placeholder="City"
                              className="city"
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                          <div className="info-input">
                            <label htmlFor="">State</label>
                            <input
                              type="text"
                              name="state"
                              placeholder="State"
                              className="state"
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="double">
                          <div className="info-input">
                            <label htmlFor="">Country</label>
                            <select
                              name="country"
                              onChange={this.handleChange}
                              required
                            >
                              <option value="US">United States</option>
                              <option value="MX">Mexico</option>
                            </select>
                          </div>
                          <div className="info-input">
                            <label htmlFor="">Postal Code</label>
                            <input
                              type="text"
                              name="postal_code"
                              placeholder="Postal Code"
                              className="postal_code"
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-wrapper">
                        <CardSection />
                        <button
                          className="card-payment-button"
                          disabled={!this.props.stripe}
                        >
                          Confirm Purchase
                        </button>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
              {/* <div className="card">
                <div className="card-header">
                  <input
                    className="round"
                    type="checkbox"
                    onClick={() => this.showHidePayment("showHidePayment2")}
                    id="checkbox"
                    checked={this.state.showHidePayment2}
                  />
                  <span>PayPal</span>
                </div>
                <div
                  className={"card-body " + this.state.showHidePayment2Class}
                >

                </div>
              </div> */}
            </div>
          </div>
          <div className="right-side">
            <label className="card-title">Summary</label>
            <div className="card summary">
              <div className="card-header">
                <div className="title">Order Summary</div>
              </div>
              <div className="card-main">
                <div className="price">
                  <span>Price Per Unit:</span>
                  <span>${this.state.price}</span>
                </div>
                <div className="date">
                  <span>Date:</span>
                  <span>7/7/2020</span>
                </div>
                <div className="time">
                  <span>Time:</span>
                  <span>3:30 PM</span>
                </div>
                <div className="cart">
                  <label>Cart:</label>
                  <div className="cart-items">
                    <span className="item">
                      - Raffle Ticket - QTY {this.state.qty}
                    </span>
                  </div>
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>${this.state.price * this.state.qty}</span>
                </div>
              </div>
            </div>
          </div>
          {this.state.formDisabled ? <Spinner /> : null}
        </div>
      );
    }
  }
}

export default function InjectedPaymentForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements, price }) => (
        <PaymentForm stripe={stripe} elements={elements} price={price} />
      )}
    </ElementsConsumer>
  );
}
