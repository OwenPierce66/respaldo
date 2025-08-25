import React, { Component } from "react";
import Axios from "axios";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";

class BlogDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: null,
      isLoaded: false,
    };
  }

  componentDidMount() {
    Axios.get(
      `http://127.0.0.1:8000/api/blog/id:${this.props.match.params.blogId}`
    )
      .then((res) => {
        this.setState({
          post: res.data,
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className="blogDetail-container">
        {this.state.isLoaded ? (
          <div className="blogDetail">
            <div className="header-wrapper">
              <div className="header">
                <div className="img-wrapper">
                  <img src={this.state.post.thumb_nail} alt="" />
                </div>
                <p className="title">{this.state.post.title}</p>
                <p className="summary">{this.state.post.summary}</p>
              </div>
            </div>
            <div className="body">
              <div className="content-wrapper">
                <p className="author">
                  Written By: {this.state.post.createdBy.first_name}{" "}
                  {this.state.post.createdBy.last_name}
                </p>
                <div className="text-body">
                  {ReactHtmlParser(this.state.post.content)}
                </div>
              </div>
            </div>
            <Link to={`/dashboard/blog/`} style={{marginLeft: "5%", marginBottom: "3%", color: "#2c4e2d", fontSize: "20px"}} >Back to Blogs</Link>
          </div>
        ) : (
          <div>
            <h1>Loading...</h1>
          </div>
        )}
      </div>
    );
  }
}

export default BlogDetails;
