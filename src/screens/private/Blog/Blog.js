import React, { Component } from "react";
import Axios from "axios";
import BlogItem from "./BlogItem";

class Blog extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      next: null,
    };

    this.handleNextItems = this.handleNextItems.bind(this);
  }

  handleNextItems() {
    Axios.get(this.state.next, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        this.setState({
          posts: [...this.state.posts, ...res.data.results.posts],
          next: res.data.next,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleBlogItems() {
    return this.state.posts.map((post) => {
      return <BlogItem key={post.id} post={post} />;
    });
  }

  componentDidMount() {
    Axios.get("http://127.0.0.1:8000/api/blog/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
      params: {
        private: true,
      },
    })
      .then((res) => {
        this.setState({
          posts: [...this.state.posts, ...res.data.results.posts],
          next: res.data.next,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="all-vw">
        <div className="blog">
          <div className="blog-header">
            <div className="title">The Lebaron Galeana Public Blog</div>
          </div>
          <div className="blog-body">
            <div className="blog-container">{this.handleBlogItems()}</div>
          </div>
          <div className="blog-footer">
            <button
              type="button"
              className="load-more-button"
              disabled={this.state.next ? false : true}
              onClick={this.handleNextItems}
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Blog;
