import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import Modal from "react-modal";
import RichTextEditor from "../../../components/misc/RichTextEditor";

const Forum = ({ match }) => {
  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [postTitle, setPostTitle] = useState(null);
  const [postText, setPostText] = useState(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const createPost = () => {
    Axios.post(
      `http://127.0.0.1:8000/forum/`,
      {
        title: postTitle,
        text: postText,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then(location.reload());
  };

  const getPosts = () => {
    Axios.get("http://127.0.0.1:8000/forum/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((res) => {
      setPosts(res.data);
    });
  };

  useEffect(() => getPosts(), []);

  return (
    <div className="forumWrapper">
      <div className="forum">
        <div className="forumHeader">
          <div className="pageTitle">LG Forum</div>
          <button onClick={openModal}>Create</button>
        </div>
        <div className="forumBody">
          <div className="postWrapper">
            {posts.map((post) => {
              return (
                <a href={`/dashboard/communityPost/${post.id}`}>
                  <div className="post">
                    <div className="postTitle">{post.title}</div>
                    <div className="postDetails">
                      <div className="creator">
                        {/* <img src="" alt="" className="profileImg" /> */}
                        <div className="img"></div>
                        <div className="name">
                          {post.createdBy.first_name +
                            " " +
                            post.createdBy.last_name}
                        </div>
                      </div>
                      <div className="created">
                        {moment(post.createdAt).format("LLL")}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
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
          <p className="modal-title">Create Post</p>
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
              <button onClick={createPost}>Save</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Forum;
