import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { Link } from "react-router-dom";

class CreateGroup extends Component {
  constructor() {
    super();

    this.state = {
      description: null,
      error: null,
    };

    this.handleCreateGroup = this.handleCreateGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleCreateGroup() {
    Axios.post(
      "http://127.0.0.1:8000/api/groups/",
      {
        post_type: "create_group",
        description: this.state.description,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        if (res.data.success) {
          this.props.history.push("/dashboard/groups");
        } else {
          this.setState({
            error: res.data.error,
          });
        }
      })
      .catch((err) => {
        console.log("Create Group Error:" + err);
      });
  }

  render() {
    return (
      <div className="createGroup">
        <h3 className="cgTitle">Description</h3>
        <textarea
          name="description"
          type="text"
          placeholder="What is this group about?"
          onChange={() => this.handleChange(event)}
          value={this.state.description}
        />
        <div className="buttons-wrapper">
          <button className="Back-cg">
            {" "}
            <Link className="Back-cg-link" to="../Dashboard/joinGroup">
              Go Back
            </Link>{" "}
          </button>
          <button className="Back-cg" onClick={this.handleCreateGroup}>
            Create Group
          </button>
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

export default connect(mapStateToProps)(CreateGroup);
