import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import Comments from "../../../components/Forum/Comments";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import RichTextEditor from "../../../components/misc/RichTextEditor";
import ReactHtmlParser from "react-html-parser";
import { Redirect } from "react-router";

const ForumPost = (props) => {
  const postId = props.match.params.postId;
  const [post, setPost] = useState(null);
  const [postTitle, setPostTitle] = useState(null);
  const [postText, setPostText] = useState(null);
  const [comments, setComments] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [commentInput, setCommentInput] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [back, setBack] = useState("false");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const editPost = () => {
    Axios.put(
      `http://127.0.0.1:8000/forum/${post.id}/`,
      {
        title: postTitle,
        text: postText,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      setPost(res.data);
      setPostText(res.data.text);
      setPostTitle(res.data.title);
      closeModal();
    });
  };

  const deletePost = () => {
    if (confirm("Confirm You Want To Delete Comment.")) {
      Axios.delete(`http://127.0.0.1:8000/forum/${post.id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      })
        .then((res) => {
          setBack("back");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getPost = () => {
    Axios.get(`http://127.0.0.1:8000/forum/${postId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((res) => {
      setPost(res.data);
      setPostText(res.data.text);
      setPostTitle(res.data.title);
    });
  };

  const getComments = () => {
    Axios.get(`http://127.0.0.1:8000/forum/${postId}/comments/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((res) => {
      setComments(res.data);
    });
  };

  const submitComment = (e) => {
    e.preventDefault();
    const inputText = commentInput;

    if (!inputText) {
      return;
    }

    Axios.post(
      `http://127.0.0.1:8000/forum/${post.id}/comments/`,
      {
        createdBy: user.id,
        post: post.id,
        text: inputText,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then(() => {
      setCommentInput("");
      getComments();
    });
  };

  useEffect(() => getPost(), []);
  useEffect(() => getComments(), [post]);

  if (!post) {
    return <div></div>;
  }

  if (back == "back") {
    return <Redirect to={{ pathname: "/dashboard/community" }} />;
  }

  return (
    <div className="forumPostWrapper">
      <div className="forumPost">
        <div className="forumPostHeader">
          <div className="forumPostTitle">{post.title}</div>
          <div className="forumPostOptions">
            <a href="/dashboard/community/">Back to Community</a>
            <button onClick={openModal}>Edit</button>
            <button onClick={deletePost}>Delete</button>
          </div>
        </div>
        <div className="forumPostBody">
          <div className="forumPostMain">
            <div className="userImage">
              <img src="https://via.placeholder.com/150" alt="" />
            </div>
            <div className="postDetails">
              <div className="detailsWrapper">
                <div className="userName">
                  {post.createdBy.first_name + " " + post.createdBy.last_name}
                </div>
                <div className="postDate">
                  {moment(post.createdAt).fromNow()}
                </div>
              </div>
              <div className="postText">{ReactHtmlParser(post.text)}</div>
            </div>
          </div>
          <div className="forumPostComment">
            <div className="userImage">
              <img src="https://via.placeholder.com/150" alt="" />
            </div>
            <form onSubmit={submitComment} className="commentArea">
              <textarea
                placeholder={`Type here to reply to ${post.createdBy.first_name}`}
                className="commentInput"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              ></textarea>
              <button type="submit">Post Comment</button>
            </form>
          </div>
          <div className="forumCommentsContainer">
            <div className="commentsHeader">
              {comments !== null ? comments.length + " comments" : "0 comments"}
            </div>
            <div className="commentsContainer">
              <Comments
                handleReply={getComments}
                comments={comments}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="Modal"
        overlayClassName="Overlay"
        isOpen={modalIsOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={closeModal}
      >
        <div className="modal-header">
          <p className="modal-title">Edit Post</p>
          <button className="modal-close" onClick={closeModal}>
            x
          </button>
        </div>
        <div className="modal-body">
          <div className="forumEdit">
            <div className="inputs">
              <div className="input-container">
                <label htmlFor="">Title:</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  onChange={(e) => setPostTitle(e.target.value)}
                  value={postTitle}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="">Text:</label>
                <RichTextEditor
                  handleRichTextEditorChange={(content) => setPostText(content)}
                  contentToEdit={postText ? postText : null}
                />
              </div>
            </div>

            <div className="buttonContainer">
              <button onClick={editPost}>Save</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ForumPost;
