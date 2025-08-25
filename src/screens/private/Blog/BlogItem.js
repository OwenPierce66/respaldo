import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

function BlogItem(props) {
  const { thumb_nail, created, title, summary, id } = props.post;
  return (
    <div className="blog-item">
      <div className="header">
        {thumb_nail == null || thumb_nail.length == 0 ? null : (
          <img src={thumb_nail} alt="Thumb Nail Image" />
        )}
      </div>
      <div className="body">
        <div className="date">{moment(created).format("ll")}</div>
        <div className="title">{title}</div>

        {summary == null || summary.length == 0 ? null : (
          <div className="summary">
            {summary.slice(0, 100)}
            {summary !== null && summary.length > 150 ? "..." : null}
          </div>
        )}
      </div>
      {/* <a to={`blog/${id}`} className="blog-button">See More</a> */}
      <Link className="blog-button" to={`/dashboard/blogDetails/${id}`}>
        See More
      </Link>
    </div>
  );
}

export default BlogItem;
