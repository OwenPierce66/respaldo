import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import Modal from "react-modal";

const NewForum = () => {
  const { userId } = useParams();
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('userTokenLG');
      try {
        const response = await Axios.get('http://127.0.0.1:8000/api/get-user/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log(response.data);
        setUsuario(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (usuario) {
      getPosts();
    }
  }, [usuario, userId]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const createPost = () => {
    const selectedUser = userId || usuario.user.id;
    Axios.post(
      `http://127.0.0.1:8000/newforum/`,
      {
        title: postTitle,
        text: postText,
        createdBy: selectedUser,  // Asegúrate de incluir el userId aquí
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then(() => {
      getPosts(); // Actualizar la lista de publicaciones después de crear una nueva
      closeModal(); // Cerrar el modal después de crear una publicación
    });
  };

  const getPosts = () => {
    const selectedUser = userId || usuario.user.id;
    console.log("Selected User ID:", selectedUser); // Asegúrate de que se está usando el userId correcto
    console.log("Logged User ID:", usuario.user.id); // Asegúrate de que se está usando el userId correcto

    Axios.get(`http://127.0.0.1:8000/newforum/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
      params: {
        user: selectedUser,
      },
    }).then((res) => {
      setPosts(res.data);
      console.log("Fetched posts for user:", selectedUser);
    });
  };

  const navigateToUserForum = (userId) => {
    history.push(`/dashboard/newcommunity/${userId}`);
  };

  if (!usuario) {
    return <div>Loading...</div>; // Renderiza un mensaje de carga mientras se obtiene el usuario
  }

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
              <a href={`/dashboard/newcommunityPost/${post.id}`} key={post.id}>
                <div className="post">
                  <div className="postTitle">{post.title}</div>
                  <div className="postDetails">
                    <div className="creator">
                      <div className="img"></div>
                      <div className="name">
                        {post.createdBy.first_name + " " + post.createdBy.last_name}
                      </div>
                    </div>
                    <div className="created">
                      {moment(post.createdAt).format("LLL")}
                    </div>
                  </div>
                </div>
              </a>
            ))}
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
                  placeholder="Enter Title"
                  onChange={(e) => setPostTitle(e.target.value)}
                  value={postTitle}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="">Text:</label>
                <textarea
                  name="text"
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
