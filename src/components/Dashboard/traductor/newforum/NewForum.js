// src/components/Dashboard/traductor/newforum/newForum.js
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"; // <- import unificado
import moment from "moment";
import Modal from "react-modal";

const NewForum = () => {
  const { userId: paramUserId } = useParams(); // ahora viene seguro desde react-router
  const location = useLocation();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("userTokenLG");
      try {
        const response = await Axios.get("http://127.0.0.1:8000/api/get-user/", {
          headers: { Authorization: `Token ${token}` },
        });
        setUsuario(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    // si no hay usuario todavía no hacemos fetch
    if (usuario) {
      getPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario, paramUserId]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const createPost = async () => {
    const selectedUser = paramUserId || usuario?.user?.id;
    if (!selectedUser) {
      console.error("No user id available for createPost");
      return;
    }

    try {
      await Axios.post(
        `http://127.0.0.1:8000/newforum/`,
        {
          title: postTitle,
          text: postText,
          createdBy: selectedUser,
        },
        { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
      );
      setPostTitle("");
      setPostText("");
      getPosts();
      closeModal();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const getPosts = async () => {
    const selectedUser = paramUserId || usuario?.user?.id;
    if (!selectedUser) {
      console.warn("No selectedUser for getPosts yet");
      return;
    }
    try {
      const res = await Axios.get(`http://127.0.0.1:8000/newforum/`, {
        headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
        params: { user: selectedUser },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // ejemplo de navegación (usa la ruta que tengas definida)
  const navigateToUserForum = (id) => {
    // si tus Routes están montadas en /dashboard/* usa ruta relativa:
    navigate(`/dashboard/newcommunity/${id}`);
    // o, si estás ya en /dashboard, podrías usar: navigate(`newcommunity/${id}`);
  };

  if (!usuario) return <div>Loading...</div>;

  return (
    <div className="forumWrapper">
      <div className="forum">
        <div className="forumHeader">
          <div className="pageTitle">LG Forum</div>
          <button onClick={openModal}>Create</button>
        </div>

        <div className="forumBody">
          <div className="postWrapper">
            {posts.map((post) => (
              <Link to={`/dashboard/newcommunityPost/${post.id}`} key={post.id}>
                <div className="post">
                  <div className="postTitle">{post.title}</div>
                  <div className="postDetails">
                    <div className="creator">
                      <div className="img" />
                      <div className="name">
                        {post.createdBy?.first_name} {post.createdBy?.last_name}
                      </div>
                    </div>
                    <div className="created">{moment(post.createdAt).format("LLL")}</div>
                  </div>
                </div>
              </Link>
            ))}
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
          <p className="modal-title">Create Post</p>
          <button className="modal-close" onClick={closeModal}>
            x
          </button>
        </div>
        <div className="modal-body">
          <div className="forumEdit">
            <div className="inputs">
              <div className="input-container">
                <label>Title:</label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  onChange={(e) => setPostTitle(e.target.value)}
                  value={postTitle}
                  required
                />
              </div>
              <div className="input-container">
                <label>Text:</label>
                <textarea
                  placeholder="Enter Text"
                  onChange={(e) => setPostText(e.target.value)}
                  value={postText}
                  required
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

export default NewForum;
