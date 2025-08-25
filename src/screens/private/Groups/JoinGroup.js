import React, { Component } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserCircle,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class JoinGroup extends Component {
  constructor() {
    super();

    this.state = {
      groups: [],
      previous: null,
      next: null,
      count: 0,
      pages: 0,
      currentPage: 1,
    };

    this.getGroups = this.getGroups.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.handleJoinGroup = this.handleJoinGroup.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  getGroups(URL) {
    Axios.get(URL, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((res) => {
      if (res.data.error) {
      } else {
        this.setState({
          groups: res.data.results,
          previous: res.data.previous,
          next: res.data.next,
          count: res.data.count,
          pages: Math.ceil(res.data.count / 10),
        });
      }
    });
  }

  renderGroups() {
    const { groups } = this.state;
    if (groups) {
      return groups.map((group) => {
        let leader = group.leader;

        if (leader.first_name) {
          leader = group.leader.first_name + " " + group.leader.last_name;
        } else {
          leader = "Not Available";
        }

        return (
          <div className="group">
            <FontAwesomeIcon className="userCircleIcon" icon={faUserCircle} />
            <div className="leaderDescription">
              <input value={leader} className="leader" readOnly />
              <input
                value={group.description}
                className="description"
                readOnly
              />
            </div>
            <button onClick={() => this.handleJoinGroup(group.id)}>
              <FontAwesomeIcon icon={faUserPlus} />
            </button>
            <div className="borderBottom"></div>
          </div>
        );
      });
    } else {
      return <div className="noGroups">No groups were found.</div>;
    }
  }

  handleJoinGroup(groupId) {
    Axios.post(
      `http://127.0.0.1:8000/api/groups/`,
      {
        post_type: "join_group",
        groupId: groupId,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.success) {
        this.props.history.push("/dashboard/groups");
      }
    });
  }

  handleSearch(e) {
    let url = "http://127.0.0.1:8000/api/groups/?search=" + e.target.value;
    this.getGroups(url);
  }

  handlePageChange(key) {
    switch (key) {
      case "next":
        this.getGroups(this.state.next);
        this.setState({
          currentPage: this.state.currentPage + 1,
        });
        break;
      case "previous":
        this.getGroups(this.state.previous);
        this.setState({
          currentPage: this.state.currentPage - 1,
        });
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this.getGroups("http://127.0.0.1:8000/api/groups/");
  }

  render() {
    if (!this.state.groups) {
      return <div className="slkfdj"></div>;
    }
    return (
      <div className="content">
        <div className="createGroupBtn">
          <Link to={"/dashboard/createGroup"}>
            <button>Create Group</button>
          </Link>
        </div>
        <div className="joinGroup">
          <div className="groupsNameSearchbar">
            <div className="groupsName">Groups</div>
            <input
              className="searchBar"
              type="text"
              placeholder="Search Group"
              onChange={(e) => this.handleSearch(e)}
            />
          </div>
          <div className="joinGroupsWrapper">{this.renderGroups()}</div>
          <div className="pagePaginationWrapper">
            <div className="pagePagination">
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
              <div className="itemsShowing">
                {this.state.currentPage * 10 - 10}-
                {this.state.currentPage * 10 > this.state.count
                  ? this.state.count
                  : this.state.currentPage * 10}{" "}
                of {this.state.count}
              </div>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(JoinGroup);
