// src/components/Dashboard/traductor/newforum/NewForumPost.js
import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import parse from "html-react-parser";
import NewComments from "./NewComent";
import { Link, useParams, useNavigate } from "react-router-dom";

Modal.setAppElement("body");

const NewForumPost = () => {
  const { postId } = useParams(); // <-- v6 hook
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [comments, setComments] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [commentInput, setCommentInput] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [back, setBack] = useState(false);

  useEffect(() => {
    if (!postId) return;
    const getPost = async () => {
      try {
        const res = await Axios.get(`http://127.0.0.1:8000/newforum/${postId}/`, {
          headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
        });
        setPost(res.data);
        setPostText(res.data.text || "");
        setPostTitle(res.data.title || "");
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    getPost();
  }, [postId]);

  useEffect(() => {
    if (!post) return;
    const getComments = async () => {
      try {
        const res = await Axios.get(`http://127.0.0.1:8000/newforum/${post.id}/comments/`, {
          headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
        });
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    getComments();
  }, [post]);

  // navegar cuando 'back' cambie a true (evita navegar durante render)
  useEffect(() => {
    if (back) {
      navigate("/dashboard/newcommunity");
    }
  }, [back, navigate]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const editPost = async () => {
    if (!post) return;
    try {
      const res = await Axios.put(
        `http://127.0.0.1:8000/newforum/${post.id}/`,
        { title: postTitle, text: postText },
        { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
      );
      setPost(res.data);
      setPostText(res.data.text || "");
      setPostTitle(res.data.title || "");
      closeModal();
    } catch (err) {
      console.error("Error editing post:", err);
    }
  };

  const deletePost = async () => {
    if (!confirm("Confirm You Want To Delete Post.")) return;
    try {
      await Axios.delete(`http://127.0.0.1:8000/newforum/${post.id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
      });
      setBack(true); // trigger useEffect that navigates
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    const inputText = commentInput?.trim();
    if (!inputText || !post) return;

    try {
      await Axios.post(
        `http://127.0.0.1:8000/newforum/${post.id}/comments/`,
        { createdBy: user.id, post: post.id, text: inputText },
        { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
      );
      setCommentInput("");
      // refrescar comentarios
      const res = await Axios.get(`http://127.0.0.1:8000/newforum/${post.id}/comments/`, {
        headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="forumPostWrapper">
      <div className="forumPost">
        <div className="forumPostHeader">
          <div className="forumPostTitle">{post.title}</div>
          <div className="forumPostOptions">
            <Link to="/dashboard/newcommunity/">Back to Community</Link>
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
                  {post.createdBy?.first_name} {post.createdBy?.last_name}
                </div>
                <div className="postDate">{moment(post.createdAt).fromNow()}</div>
              </div>
              <div className="postText">{parse(post.text || "")}</div>
            </div>
          </div>

          <div className="forumPostComment">
            <div className="userImage">
              <img src="https://via.placeholder.com/150" alt="" />
            </div>
            <form onSubmit={submitComment} className="commentArea">
              <textarea
                placeholder={`Type here to reply to ${post.createdBy?.first_name || "user"}`}
                className="commentInput"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button type="submit">Post Comment</button>
            </form>
          </div>

          <div className="forumCommentsContainer">
            <div className="commentsHeader">{comments ? `${comments.length} comments` : "0 comments"}</div>
            <div className="commentsContainer">
              <NewComments handleReply={async () => {
                // refetch comments cuando NewComments solicite
                const res = await Axios.get(`http://127.0.0.1:8000/newforum/${post.id}/comments/`, {
                  headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
                });
                setComments(res.data);
              }} comments={comments} user={user} />
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="Modal"
        overlayClassName="Overlay"
        isOpen={modalIsOpen}
        shouldCloseOnOverlayClick
        onRequestClose={closeModal}
      >
        <div className="modal-header">
          <p className="modal-title">Edit Post</p>
          <button className="modal-close" onClick={closeModal}>x</button>
        </div>
        <div className="modal-body">
          <div className="forumEdit">
            <div className="inputs">
              <div className="input-container">
                <label>Title:</label>
                <input type="text" placeholder="Enter Title" onChange={(e) => setPostTitle(e.target.value)} value={postTitle} required />
              </div>
              <div className="input-container">
                <label>Text:</label>
                <textarea placeholder="Enter Text" onChange={(e) => setPostText(e.target.value)} value={postText} required />
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

export default NewForumPost;
