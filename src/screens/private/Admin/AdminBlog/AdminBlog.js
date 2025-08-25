import React, { Component } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import moment from "moment";
import { AdminBlogCreateForm, AdminBlogEditForm } from "./AdminBlogForms";

export default class AdminBlog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      previous: null,
      next: null,
      count: 0,
      pages: 0,
      currentPage: 1,
      showModal: "",
      activePost: null,
      saved: false,
      delete: "",
    };

    this.getBlogPosts = this.getBlogPosts.bind(this);
    this.handlePosts = this.handlePosts.bind(this);
    this.handleClosedModal = this.handleClosedModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleSuccessfulPost = this.handleSuccessfulPost.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.saved = this.saved.bind(this);
  }

  handlePageChange(key) {
    switch (key) {
      case "next":
        this.getBlogPosts(this.state.next);
        this.setState({
          currentPage: this.state.currentPage + 1,
        });
        break;
      case "previous":
        this.getBlogPosts(this.state.previous);
        this.setState({
          currentPage: this.state.currentPage - 1,
        });
        break;
      default:
        break;
    }
  }

  handleSearch(e) {
    let url = "http://127.0.0.1:8000/api/blog/?search=" + e.target.value;
    this.getBlogPosts(url);
  }

  handleDelete() {
    Axios.delete("http://127.0.0.1:8000/api/blog/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
      data: {
        id: this.state.activePost.id,
      },
    })
      .then((res) => {
        if (res.data.status === "Success") {
          this.handleClosedModal();
          this.getBlogPosts("http://127.0.0.1:8000/api/blog/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSuccessfulPost() {
    this.handleClosedModal();
    this.getBlogPosts("http://127.0.0.1:8000/api/blog/");
  }

  handleOpenModal(modal, item) {
    switch (modal) {
      case "Create":
        this.setState({
          showModal: "Create-Modal",
          activePost: item,
        });
        break;
      case "Edit":
        this.setState({
          showModal: "Edit-Modal",
          activePost: item,
        });
        break;
      case "Delete":
        this.setState({
          showModal: "Delete-Modal",
          activePost: item,
        });
        break;
    }
  }

  handleClosedModal() {
    this.setState({
      showModal: "",
    });
  }

  handlePosts() {
    const { posts } = this.state;
    if (posts) {
      return posts.map((post) => {
        return (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>
              <img
                src={post.thumb_nail}
                alt="thumb_nail"
                className="blog-thumb_nail"
              />
            </td>
            <td>{post.title}</td>
            <td>{post.createdBy.username}</td>
            <td>{post.status}</td>
            <td>{post.security}</td>
            <td>{moment(post.created).format("l")}</td>
            <td>{moment(post.updated).format("l")}</td>
            <td>
              <button
                className="rowButton"
                onClick={() => {
                  this.handleOpenModal("Edit", post);
                }}
              >
                Edit
              </button>
            </td>
            <td>
              <button
                className="rowButton"
                onClick={() => {
                  this.handleOpenModal("Delete", post);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      });
    }
  }

  getBlogPosts(URL) {
    Axios.get(URL, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      this.setState({
        previous: response.data.previous,
        next: response.data.next,
        posts: [...response.data.results.posts],
        count: response.data.count,
        pages: Math.ceil(response.data.count / 12),
      });
    });
  }

  saved(saved) {
    this.setState({ saved: saved });
  }

  componentWillMount() {
    Modal.setAppElement("body");
    this.getBlogPosts("http://127.0.0.1:8000/api/blog/?search=");
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="createButtonWrapper">
          <button
            className="createButton"
            onClick={() => this.setState({ showModal: "Create-Modal" })}
          >
            Add Post
          </button>
        </div>
        <div className="adminTable">
          <div className="adminTableHeader">
            <div className="adminTableHeader-title">Blog Post List</div>
            <input
              className="adminTableHeader-search"
              type="text"
              placeholder="Search Posts"
              onChange={(e) => this.handleSearch(e)}
            />
          </div>
          <div className="adminTableBody">
            <table>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Security</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th></th>
                <th></th>
              </tr>
              <tbody>{this.handlePosts()}</tbody>
            </table>
            <div className="adminTableFooter">
              <div className="pages">Rows per page: 12</div>
              <div className="pageNav">
                <div className="itemsShowing">
                  {this.state.currentPage * 12 - 12}-
                  {this.state.currentPage * 12 > this.state.count
                    ? this.state.count
                    : this.state.currentPage * 12}{" "}
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

        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal === "Create-Modal"}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
        >
          <div className="modal-header">
            <p className="modal-title">Create Blog Post</p>
            {this.state.saved == true ? (
              <div className="saved">Saved</div>
            ) : (
              <div className="saving">Saving!</div>
            )}
            <button className="modal-close" onClick={this.handleClosedModal}>
              x
            </button>
          </div>
          <div className="modal-body">
            <AdminBlogCreateForm
              handleSuccessfulPost={this.handleSuccessfulPost}
              saved={this.saved}
            />
          </div>
          <div className="modal-footer">
            <button form="create-form" type="submit">
              Submit
            </button>
          </div>
        </Modal>

        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal === "Edit-Modal"}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
        >
          <div className="modal-header">
            <p className="modal-title">
              Edit --{" "}
              {this.state.activePost ? this.state.activePost.title : null}
            </p>
            {this.state.saved == true ? (
              <div className="saved">Saved</div>
            ) : (
              <div className="saving">Saving!</div>
            )}
            <button className="modal-close" onClick={this.handleClosedModal}>
              x
            </button>
          </div>
          <div className="modal-body">
            <AdminBlogEditForm
              handleSuccessfulPost={this.handleSuccessfulPost}
              post={this.state.activePost}
              saved={this.saved}
            />
          </div>
          <div className="modal-footer">
            <button form="edit-form" type="submit">
              Submit
            </button>
          </div>
        </Modal>

        <Modal
          className="Modal"
          overlayClassName="Overlay"
          isOpen={this.state.showModal === "Delete-Modal"}
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.handleClosedModal}
        >
          <div className="modal-header">
            <p className="modal-title">
              Delete --{" "}
              {this.state.activePost ? this.state.activePost.title : null}
            </p>
            <button className="modal-close" onClick={this.handleClosedModal}>
              x
            </button>
          </div>
          <div className="modal-body">
            {this.state.activePost ? (
              <form
                onSubmit={() => this.handleDelete()}
                className="adminDeleteForm"
              >
                <div className="input-container">
                  <label htmlFor="">
                    Type "Confirm Delete Post" To Delete{" "}
                    {this.state.activePost.title}:
                  </label>
                  <input
                    type="text"
                    name="delete"
                    placeholder="Confirm Delete Post"
                    onChange={(e) =>
                      this.setState({
                        delete: e.target.value,
                      })
                    }
                    value={this.state.delete}
                    required
                  />
                </div>
                <div className="adminModal-button-container">
                  {this.state.delete === "Confirm Delete Post" ? (
                    <button type="submit">Delete Post</button>
                  ) : (
                    <button type="submit" disabled>
                      Delete Post
                    </button>
                  )}
                </div>
              </form>
            ) : null}
          </div>
        </Modal>
      </div>
    );
  }
}
