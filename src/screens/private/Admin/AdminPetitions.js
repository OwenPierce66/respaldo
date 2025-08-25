import React, { Component } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Spinner from "../../../components/misc/Spinner";

export default class AdminPetitions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previous: null,
      next: null,
      count: 0,
      pages: 0,
      currentPage: 1,
      showModal: "",
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.getPetitionEntries = this.getPetitionEntries.bind(this);
  }

  handleSearch(e) {
    let url =
      "http://127.0.0.1:8000/api/admin/get_petition_entries/?search=" +
      e.target.value;
    this.getPetitionEntries(url);
  }

  handlePageChange(key) {
    switch (key) {
      case "next":
        this.getPetitionEntries(this.state.next);
        this.setState({
          currentPage: this.state.currentPage + 1,
        });
        break;
      case "previous":
        this.getPetitionEntries(this.state.previous);
        this.setState({
          currentPage: this.state.currentPage - 1,
        });
        break;
      default:
        break;
    }
  }

  getPetitionEntries(URL) {
    Axios.get(URL, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      this.setState({
        previous: response.data.previous,
        next: response.data.next,
        petition_entries: response.data.results,
        count: response.data.count,
        pages: Math.ceil(response.data.count / 10),
      });
    });
  }

  displayPetitionEntries() {
    if (this.state.petition_entries) {
      return this.state.petition_entries.map((item) => {
        return (
          <tr className="table-body">
            <td className="table-info">{item.id}</td>
            <td className="table-info">{item.petition.name}</td>
            <td className="table-info">{item.name}</td>
            <td className="table-info">{item.phone_number}</td>
          </tr>
        );
      });
    }
  }

  componentDidMount() {
    this.getPetitionEntries(
      "http://127.0.0.1:8000/api/admin/get_petition_entries/?search="
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        {/* <div className="createButtonWrapper">
          <button
            className="createButton"
            onClick={() => this.setState({ showModal: "Create-Modal" })}
          >
            Create Petition
          </button>
        </div> */}
        <div className="adminTable">
          <div className="adminTableHeader">
            <div className="adminTableHeader-title">
              Petition Submission List
            </div>
            <input
              className="adminTableHeader-search"
              type="text"
              placeholder="Search Entries"
              onChange={(e) => this.handleSearch(e)}
            />
          </div>
          <div className="adminTableBody">
            <table>
              <tr>
                <th>ID</th>
                <th>Petition</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th></th>
                <th></th>
              </tr>
              <tbody>{this.displayPetitionEntries()}</tbody>
            </table>
            <div className="adminTableFooter">
              <div className="pages">Rows per page: 10</div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
