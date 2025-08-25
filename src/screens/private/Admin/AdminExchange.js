import React, { Component } from "react";
import Axios from "axios";
import Modal from "react-modal";

class AdminExchange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRate: null,
      showModal: "",
      delete_input: "",
    };

    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleExchanges() {
    if (this.state.rates) {
      const { rates } = this.state;
      return rates.map((rate) => {
        return (
          <tr key={rate.name}>
            <td>
              <input
                type="checkbox"
                checked={this.state.activeRate == rate ? true : false}
                onClick={() => this.setState({ activeRate: rate })}
              />
            </td>
            <td>{rate.name}</td>
            <td>{rate.buy}</td>
            <td>{rate.sell}</td>
          </tr>
        );
      });
    }
  }

  handleSubmit() {
    Axios.put(
      "http://127.0.0.1:8000/api/adminExchange/",
      {
        id: this.state.activeRate.id,
        name: this.state.exchange_name ? this.state.exchange_name : null,
        buy: this.state.exchange_buy ? this.state.exchange_buy : null,
        sell: this.state.exchange_sell ? this.state.exchange_sell : null,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    );
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleOpenModal() {
    if (this.state.activeRate) {
      this.setState({
        showModal: "Rate-Modal",
      });
    }
  }

  handleClosedModal() {
    this.setState({
      showModal: "",
    });
  }

  componentDidMount() {
    Modal.setAppElement("body");

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
      <div className={this.props.className}>
        <div className="createButtonWrapper">
          <button
            className="createButton"
            onClick={() => this.handleOpenModal()}
          >
            Change Rate
          </button>
        </div>
        <div className="adminTable">
          <div className="adminTableHeader">
            <div className="adminTableHeader-title">
              Peition Submission List
            </div>
            {/* <input
              className="adminTableHeader-search"
              type="text"
              placeholder="Search Entries"
              onChange={(e) => this.handleSearch(e)}
            /> */}
          </div>
          <div className="adminTableBody">
            <table>
              <tr>
                <th>Select to Activate</th>
                <th>Name</th>
                <th>Buy</th>
                <th>Sell</th>
                <th></th>
                <th></th>
              </tr>
              <tbody>{this.handleExchanges()}</tbody>
            </table>
            <div className="adminTableFooter">
              {/* <div className="pages">Rows per page: 10</div>
              <div className="pageNav">
                <div className="itemsShowing">
                  {this.state.currentPage * 10 - 10}-
                  {this.state.currentPage * 10 > this.state.count
                    ? this.state.count
                    : this.state.currentPage * 10}{" "}
                  of {this.state.count}
                </div>
                <div className="changePage">
                  {this.state.previous ? (
                    <FontAwesomeIcon
                      className="changePage-icon"
                      icon={faChevronLeft}
                      onClick={() => this.handlePageChange("previous")}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="changePage-icon disabled"
                      icon={faChevronLeft}
                    />
                  )}
                  {this.state.next ? (
                    <FontAwesomeIcon
                      className="changePage-icon"
                      icon={faChevronRight}
                      onClick={() => this.handlePageChange("next")}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="changePage-icon disabled"
                      icon={faChevronRight}
                    />
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal === "Rate-Modal"}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
        >
          <div className="modal-header">
            <p className="modal-title">
              Edit {this.state.activeRate ? this.state.activeRate.name : null}
            </p>
            <button className="modal-close" onClick={this.handleClosedModal}>
              x
            </button>
          </div>
          <div className="modal-body">
            {this.state.activeRate ? (
              <form
                id="exchange-form"
                className="exchange-rate-form"
                onSubmit={() => this.handleSubmit()}
              >
                <div className="input-container">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="exchange_name"
                    value={
                      this.state.exchange_name
                        ? this.state.exchange_name
                        : this.state.activeRate.name
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <hr />
                <div className="input-container">
                  <label>Buy:</label>
                  <input
                    type="number"
                    step="0.000"
                    name="exchange_buy"
                    value={
                      this.state.exchange_buy
                        ? this.state.exchange_buy
                        : this.state.activeRate.buy
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <hr />
                <div className="input-container">
                  <label>Sell:</label>
                  <input
                    type="number"
                    step="0.000"
                    name="exchange_sell"
                    value={
                      this.state.exchange_sell
                        ? this.state.exchange_sell
                        : this.state.activeRate.sell
                    }
                    onChange={this.handleChange}
                  />
                </div>
              </form>
            ) : null}
          </div>
          <div className="modal-footer">
            <button form="exchange-form" type="submit">
              Submit
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AdminExchange;
