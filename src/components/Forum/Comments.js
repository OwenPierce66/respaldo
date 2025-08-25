import React, { useState } from "react";
import moment from "moment";
import Axios from "axios";

const Comment = ({ comment, user, handleReply }) => {
  const nestedComments = (comment.children || []).map((comment) => {
    return (
      <Comment
        key={comment.id}
        comment={comment}
        user={user}
        handleReply={handleReply}
        type="child"
      />
    );
  });

  const deleteComment = () => {
    if (confirm("Confirm You Want To Delete Comment.")) {
      Axios.delete(
        `http://127.0.0.1:8000/forum/${comment.post}/comments/${comment.id}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      ).then(() => {
        handleReply();
      });
    }
  };

  const submitComment = (e) => {
    e.preventDefault();
    const inputText = document.getElementById(
      `commentInput${comment.id}`
    ).value;

    if (!inputText) {
      return;
    }

    Axios.post(
      `http://127.0.0.1:8000/forum/${comment.post}/comments/`,
      {
        createdBy: user.id,
        parent: comment.id,
        post: comment.post,
        text: inputText,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then(() => {
      toggleReply();
      handleReply();
    });
  };

  const toggleTree = () => {
    const child = document.getElementById(`replies${comment.id}`);
    const button = document.getElementById(`commentButton${comment.id}`);
    if (child.style.display === "none") {
      child.style.display = "block";
    } else {
      child.style.display = "none";
    }

    if (button.textContent === "Hide Replies") {
      button.textContent = "Show Replies";
    } else {
      button.textContent = "Hide Replies";
    }
  };

  const toggleReply = () => {
    const child = document.getElementById(`commentBox${comment.id}`);
    child.classList.toggle("hidden");
  };

  return (
    <div className="comment" id={comment.id}>
      <div className="commentor">
        <img src="https://via.placeholder.com/150" alt="" />
        <div className="commentorName">
          {comment.createdBy.first_name + " " + comment.createdBy.last_name}
        </div>
        <div className="commentedAt">{moment(comment.createdAt).fromNow()}</div>
      </div>
      <div className="commentText">{comment.text}</div>
      <div className="bottomLinks">
        <button onClick={toggleReply} className="replyButton">
          Reply
        </button>
        <button
          onClick={toggleTree}
          id={`commentButton${comment.id}`}
          className="collapseTree"
        >
          Hide Replies
        </button>
        {user.id === comment.createdBy.id ? (
          <button className="deleteButton" onClick={deleteComment}>
            Delete
          </button>
        ) : null}
      </div>
      <form
        className="commentArea hidden"
        id={`commentBox${comment.id}`}
        onSubmit={submitComment}
      >
        <textarea
          placeholder={`Type here to reply to ${comment.createdBy.first_name}`}
          className="commentInput"
          id={`commentInput${comment.id}`}
        ></textarea>
        <button type="submit">Post Comment</button>
      </form>
      <div className="replies" id={`replies${comment.id}`}>
        {nestedComments}
      </div>
    </div>
  );
};

const Comments = (props) => {
  const comments = props.comments ? props.comments : [];
  return (
    <div>
      {comments.map((comment) => {
        if (comment.is_parent) {
          return (
            <Comment
              key={comment.id}
              comment={comment}
              user={props.user}
              handleReply={props.handleReply}
              type="child"
            />
          );
        }
      })}
    </div>
  );
};

export default Comments;
