import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
          // Ahora usa navigate correctamente
          this.props.navigate("/dashboard/groups");
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
          onChange={(event) => this.handleChange(event)}
          value={this.state.description}
        />
        <div className="buttons-wrapper">
          <button className="Back-cg">
            <Link className="Back-cg-link" to="../Dashboard/joinGroup">
              Go Back
            </Link>
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

// Wrapper funcional para inyectar navigate
const CreateGroupWithNavigate = (props) => {
  const navigate = useNavigate();
  return <CreateGroup {...props} navigate={navigate} />;
};

export default connect(mapStateToProps)(CreateGroupWithNavigate);
