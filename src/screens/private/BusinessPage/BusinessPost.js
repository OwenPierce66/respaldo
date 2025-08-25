import React, { Component } from "react";
import PostPicturePlaceholder from "../../../../static/assets/images/Group 2.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import ReactHtmlParser from "react-html-parser";

class BusinessPost extends Component {
  constructor(props){
    super(props)

  }

  render() {
    const { post, page} = this.props
    return (
      <div className="news-post" key={post.id}>
        <div className="news-post-header">
          <div className="poster-container">
            <img
              src={PostPicturePlaceholder}
              alt="Post Img"
              className="post-header-img"
            />
            <div className="post-header-name">by {page.name}</div>
          </div>
          <div className="post-header-time">{moment(post.created_at).fromNow()}</div>
        </div>
        <div className="news-post-body">
          <div className="post-body-title">{post.title}</div>
          <div className="post-body-description">
            {ReactHtmlParser(post.text.substring(3, 350))}
            {post.text.length > 350 ? "......" : null}
          </div>
        </div>
        <div className="news-post-footer">
          <div className="icons-container">
            <div className="icon">
              <FontAwesomeIcon className="post-icon" icon="heart" />
              <div>0</div>
            </div>
            <div className="icon">
              <FontAwesomeIcon className="post-icon" icon="comment" />
              <div>0</div>
            </div>
          </div>

          <button className="post-share">Share</button>
        </div>
      </div>
    );
  }
}

export default BusinessPost;
