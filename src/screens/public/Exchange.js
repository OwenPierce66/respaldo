import React, { Component } from "react";
import Axios from "axios";
import AmericanFlag from "../../../static/assets/images/AmericanFlag.png";
import MexicoFlag from "../../../static/assets/images/MexicoFlag.png";

class Exchange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rates: [],
    };

    this.handleRates = this.handleRates.bind(this);
  }

  handleRates() {
    if (this.state.rates) {
      return this.state.rates.map((rate) => {
        return (
          <div className="exchange-item">
            <div className="exchange-item-title">{rate.name}</div>
            <div className="exchange-rates">
              <div className="rate-buy">{rate.buy}</div>
              <div className="rate-sell">{rate.sell}</div>
            </div>
          </div>
        );
      });
    }
  }

  componentDidMount() {
    Axios.get("http://127.0.0.1:8000/api/exchange/")
      .then((res) => {
        this.setState({ rates: res.data.rates });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="all-vw">
        <div className="exchangePage">
          <div className="exchangePage-container">
            <div className="flags-container">
              <img src={AmericanFlag} alt="Image" />
              <img src={MexicoFlag} alt="Image" />
            </div>
            <div className="buy-sell">
              <div className="buy-sell-item">BUY</div>
              <div className="buy-sell-item">SELL</div>
            </div>
            <div className="exchange-items">{this.handleRates()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Exchange;
