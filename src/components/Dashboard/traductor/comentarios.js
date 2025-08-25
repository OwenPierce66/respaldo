import React, { useState, useEffect } from "react";
import axios from 'axios';
import Axios from "axios";
import "../owenscss/traductor.scss";
import { useSelector } from "react-redux";
import { Link } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBlog,
  faPen,
  faNewspaper,
  faUsersCog,
  faAddressBook,
  faMoneyBill,
  faCalendar,
  faTicketAlt,
  faChild,
  faStoreAlt,
  faUsers,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import PeticionesTwo from "./peticionesTwo";
import Modal from 'react-modal';


const Comentarios = (props) => {
  const [translatedText, setTranslatedText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [normal, setNormal] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagee, setSelectedImagee] = useState(null);

  const [juntar, setJuntar] = useState("");
  const [data, setData] = useState([]);
  const [peticionajena, setPeticionajena] = useState("");
  const [peticionajenaa, setPeticionajenaa] = useState("");

  const [correoUsuario, setCorreoUsuario] = useState(localStorage.getItem("userTokenLG"));
  const [mostrar, setMostrar] = useState("");
  const [peticion, setPeticion] = useState("");
  const [dataa, setDataa] = useState("");
  const [listUsers, setListUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenImage, setModalOpenImage] = useState(false);
  const [imagen, setImagen] = useState("");
  const [peticionComment, setPeticionComment] = useState(props.peticion);




  const addOrEditTiendaa = async () => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get('http://127.0.0.1:8000/api/get-user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const userDetails = response.data;
      console.log(userDetails);
      console.log(userDetails.user.id);

      console.log(userDetails.user.email);
      console.log(userDetails.user.id);
      //   props.setUsuario(userDetails.user.id);
      props.setUsuarioName(userDetails.user.username);
      setDataa(userDetails.user.id);
      // console.log(user);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  useEffect(() => {
    // if(dataa===""){
    // addOrEditTiendaa();
    // }else{
    // getTasks();
    // }
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks_by_id/${props.peticion.id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setTasks(response.data[0].comments);
      console.log(response.data[0].comments);
      setData(response.data[0].comments);
      setDataa(response.data[0].comments);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleUpdateComment = async (task) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/comments/${task.id}/`, task, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });

      getTasks();

    } catch (error) {
      console.error('Error updating task:', error.response);

    }
  };

  const handleListUsers = async (task) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${task.id}/users_who_liked_task_comment/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });


      if (Array.isArray(response.data)) {
        setListUsers(response.data);
      } else {
        console.log(`Tarea ID: ${task.id} - No se encontraron usuarios que dieron "like".`);
      }
      setModalOpen(true);  // Abrir el modal después de cargar los datos

    } catch (error) {
      console.error('Error updating task:', error.response);

    }
  };

  const handleListUserss = async (task) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${task.id}/users_who_liked/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });


      if (Array.isArray(response.data)) {
        setListUsers(response.data);
      } else {
        console.log(`Tarea ID: ${task.id} - No se encontraron usuarios que dieron "like".`);
      }
      setModalOpen(true);  // Abrir el modal después de cargar los datos

    } catch (error) {
      console.error('Error updating task:', error.response);

    }
  };


  const handleDeletee = async (id) => {
    props.handleDelete(id);
    props.setPeticion("");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/comments/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      setData(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const user = useSelector(state => state.auth.isAuthenticated)

  const addComment = async () => {
    try {
      const formData = new FormData();
      //   formData.append('user', props.peticion.user);
      formData.append('title', normal);
      formData.append('description', translatedText);
      formData.append('user', props.peticion.user);
      formData.append('userId', props.usuario);
      formData.append('task', props.peticion.id);
      formData.append('like', 0);
      // Crear un array de likes (puede ser una lista de IDs de usuarios, por ejemplo)
      const likesArray = [];
      formData.append('likes', JSON.stringify(likesArray)); // Convierte a cadena JSON
      formData.append('username', props.usuarioName);
      if (selectedImage !== null) {
        formData.append('image', selectedImage);
      } else {
        formData.append('image', "");
      }

      const response = await axios.post(`http://127.0.0.1:8000/api/comments/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });

      getTasks();
      setSelectedImagee(null);

    } catch (error) {
      console.error('Error adding comment:', error);
      console.error('Error details:', error.response.data[0].comments);
    }
  }

  const translateText = async (text) => {
    setNormal(text);
    const apiKey = "AIzaSyA1pr1L0zW8cv6TNwadyjFHqUhh11POuAQ"; // Tu clave de API
    const targetLanguage = "es"; // Idioma objetivo para la traducción
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      });

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      setTranslatedText(translatedText);
      setNormal(text);
    } catch (error) {
      console.error("Error al traducir el texto:", error);
    }
  };

  const juntarTraduccion = (a) => {
    // setCam(a);
    setJuntar(a);
    if (mostrar === true) {
      setMostrar(false);
    } else {
      setMostrar(true);
    }
    // setMas(a);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(e.target.files[0]);

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImagee(imageURL);
    } else {
      setSelectedImagee(null);
    }
  };

  const sortedData = data.sort((a, b) => b.likes_count - a.likes_count);

  const tasksWithLikeInfo = sortedData.map(task => ({
    ...task,
    userHasLiked: userHasLikedTask(task, dataa)
  }));

  function userHasLikedTask(task, dataa) {
    return task.likecomment_set.some(like => like.user.id === dataa);
  }

  return (
    <div>

      {peticionajena === "" ? (
        <div style={{ paddingTop: "10px" }}>
          <div className="whatpetition">
            <div className="whatpetitiontitle">Cual es tu comentario?
            </div>


            <input type="text" onChange={(e) => translateText(e.target.value)} />
            <p style={{ paddingLeft: "15px", paddingRight: "15px" }}>{translatedText}</p>

            <div className="imagenInput">
              <label htmlFor="fileInput">
                <div className="imagenIcon">
                  <FontAwesomeIcon icon={faImage} />
                </div>
              </label>
              <div>
                <input
                  type="file"
                  id="fileInput" // Agrega un id al input
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }} // Oculta el input
                />
              </div>
              <div>
                {selectedImagee !== null ? (
                  <img src={selectedImagee} alt="Imagen" icon={faHeart} className="imagenPeticion" style={{ height: "100px", width: "100px" }} />
                ) : (null)}</div>
            </div>
            <div> <button className="btnpetition" onClick={addComment}>
              Agregar
            </button></div>
          </div>

          <div> <button className="btnpetition" onClick={() => props.setPeticion("")}>
            volver
          </button></div>

          <div className="contenido-pagin">

            <div key={props.peticion.id} style={{ borderRadius: "10px" }} className="comment" >
              {correoUsuario === correoUsuario ? (
                <div
                  className="contentt"
                  key={props.peticion.id}
                  style={{ marginRight: "0px", width: "100vw" }}
                >
                  <div className="redondear">
                    <div className="hole">
                      <div className="icon1">
                        <div
                          className="material-iconis"
                          // onClick={() => hideModal(link.id)}
                          onClick={() => handleUpdate(props.peticion)}
                          z-index="1"
                        >
                          {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
                        </div>
                      </div>
                      <div className="icon2" >
                        <div
                          className="material-iconi"
                          onClick={() => handleDeletee(props.peticion.id)}
                        >
                          {props.usuario === props.peticion.user ? (<FontAwesomeIcon icon={faTrash} />) : (null)}
                        </div>
                      </div>
                    </div>
                    <div className="usuario" style={{ height: "20px" }} onClick={() => setPeticionajena(props.peticion.user)}>
                      {props.peticion.username}
                      {/* {link.id} */}
                      {/* {link.username} */}
                    </div>

                    <div
                      className="textol"
                      onClick={() => juntarTraduccion(props.peticion.description)}
                    >
                      {mostrar ? (
                        props.peticion.description === juntar ? (
                          <div className="titulo1"> {props.peticion.description}</div>
                        ) : null
                      ) : null}
                      <div className="titulo2">{props.peticion.title}</div>
                    </div>


                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={() => setModalOpen(false)}
                      contentLabel="Usuarios que dieron like"
                    >
                      <h2>Usuarios que dieron "like" a la tarea { }:</h2>
                      <ul>
                        {listUsers.map(user => (
                          <li key={user.id}>
                            ID: {user.id}, Nombre de usuario: {user.username}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => setModalOpen(false)}>Cerrar</button>
                    </Modal>

                    <Modal
                      isOpen={isModalOpenImage}
                      onRequestClose={() => setModalOpenImage(false)} // Permite cerrar el modal al hacer clic fuera de él o presionar ESC
                      contentLabel="Usuarios que dieron like"
                      style={{ padding: "0px !important " }}
                    >
                      <h2> </h2>
                      <img src={imagen} alt="Imagen" onClick={() => setModalOpenImage(false)} className="imagenPeticionModel" />
                      <button onClick={() => setModalOpenImage(false)}>Cerrar</button> {/* Botón para cerrar el modal */}
                    </Modal>

                    <div className="line-down">
                      <div className="likes">
                        <div style={{ padding: "5px" }}>
                          <Link
                            to="/peticionesTwo"
                            className="nlink"
                            style={{ color: "white" }}
                          // onClick={() => props.setComentario(link.id)}
                          >
                            Responder
                          </Link>
                        </div>
                        <div className="megusta">

                          {/* <input
              type="checkbox"
              checked={link.completed}
              onChange={() => handleUpdate({ ...link, completed: !link.completed, like: 1 })}
            />
            <br/> */}
                          <div
                            className="like"
                          >
                            <div onClick={() => handleUpdate(props.peticion.id)}>
                              <FontAwesomeIcon
                                style={{ color: props.peticion.userHasLiked ? "54afff" : "white" }}
                                icon={faHeart}
                              />
                            </div>

                            <div className="like_cantidad" onClick={() => handleListUserss(props.peticion)}>{props.peticion.likes_count}</div>
                            {/* <div className="like_cantidad" onClick={() => handleListUsers(peticionComment)}>{props.peticion.likes_count}</div> */}
                          </div>
                          <div
                            className="unlike"
                          >
                            {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
                          </div>
                        </div>
                        {/* <Likeia
                        correoUsuario={props.correoUsuario}
                        pageSelect={props.pageSelect}
                        {...{ setPostId, postId, user, setUser }}
                      /> */}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="content" style={{ marginLeft: "50px" }}>
                  <div className="hole" style={{ marginLeft: "30px" }}>
                    <div className="icon1" style={{ marginLeft: "190px" }}>
                      <div
                        className="material-iconis"
                        // onClick={() => setCurrentId(link.id)}
                        z-index="1"
                      >
                        {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
                      </div>
                    </div>
                    <div className="icon2" >
                      <div
                        className="material-iconi"
                      // onClick={() => onDeleteLink(link.id)}
                      >
                        {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
                      </div>
                    </div>
                  </div>

                  <div className="usuario" style={{ height: "20px" }}>
                    {props.peticion.username}
                  </div>
                  <div
                    className="textol"
                  // onClick={() => juntarTraduccion(link.description)}
                  >
                    {mostrar ? (
                      props.peticion.description === juntar ? (
                        <div className="titulo1"> {props.peticion.description}</div>
                      ) : null
                    ) : null}
                    <div className="titulo2">{props.peticion.title}</div>
                  </div>

                  <div className="line-down">
                    <div className="comment"></div>
                    <div className="likes">
                      <div style={{ padding: "5px" }}>
                        {/* <Link to="/respond" className="nlink">
                            Responder
                          </Link> */}
                      </div>
                      <div className="megusta">
                        {/* <div>{link.like}</div> */}
                        <div
                          className="like"
                        // onClick={() => incrementt(link)}
                        >
                          {/* <FontAwesomeIcon icon={faThumbsUp} /> */}
                        </div>
                        <div
                          className="unlike"
                        // onClick={() => incrementt(link)}
                        >
                          {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="contenido-pagin">
            {tasksWithLikeInfo.map((link) => (
              <div key={link.id} style={{ borderRadius: "10px" }} className="comment" >
                {correoUsuario === correoUsuario ? (
                  <div
                    className="contentt"
                    key={link.id}
                    style={{ marginRight: "0px", width: "100vw" }}
                  >
                    <div className="redondear">
                      <div className="hole">
                        <div className="icon1">
                          <div
                            className="material-iconis"
                            // onClick={() => hideModal(link.id)}
                            onClick={() => handleUpdate(link)}
                            z-index="1"
                          >
                            {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
                          </div>
                        </div>
                        <div className="icon2">
                          <div
                            className="material-iconi"
                            onClick={() => handleDelete(link.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            {props.usuario === link.userId ? (<FontAwesomeIcon icon={faTrash} />) : (null)}
                          </div>
                          {/* <div>
                          {props.usuario}
                          </div>
                          <div>
                          {link.userId} 
                          </div> */}
                        </div>
                      </div>
                      <div className="usuario" style={{ height: "20px" }} onClick={() => setPeticionajena(link.userId)}>
                        {link.username}
                        {/* {()=>setUsernames(link.user)}
            {usernames.map((usernamee) => (
              <div>
                {usernamee.username}
              </div>
            ))} */}
                        {/* {link.id} */}
                        {/* {link.username} */}
                      </div>

                      <div
                        className="textol"
                        onClick={() => juntarTraduccion(link.description)}
                      >
                        {mostrar ? (
                          link.description === juntar ? (
                            <div className="titulo1"> {link.description}</div>
                          ) : null
                        ) : null}
                        <div className="titulo2">{link.title}</div>
                      </div>

                      {link.image !== null && link.image !== "" ? (<img src={link.image} alt="Imagen" onClick={() => imageSelect(link.image)} icon={faHeart} className="imagenPeticion" style={{ height: "100px", width: "100px" }} />) : (null)}

                      <div className="line-down">
                        <div className="likes">
                          <div style={{ padding: "5px" }}
                          // onClick={() => setPeticion(link)}
                          >
                            <Link
                              to="/peticionesTwo"
                              className="nlink"
                              style={{ color: "white" }}
                            // onClick={() => props.setComentario(link.id)}
                            >
                              ___________
                            </Link>
                          </div>
                          <div className="megusta">

                            {/* <input
              type="checkbox"
              checked={link.completed}
              onChange={() => handleUpdate({ ...link, completed: !link.completed, like: 1 })}
            />
            <br/> */}
                            <div
                              className="like"
                            //   onClick={() => incrementt(link)}
                            >
                              <div onClick={() => handleUpdateComment(link)}>
                                <FontAwesomeIcon
                                  style={{ color: link.userHasLiked ? "54afff" : "white" }}
                                  icon={faHeart}
                                />
                              </div>

                              <div className="like_cantidad" onClick={() => handleListUsers(link)}>{link.likes_count}</div>
                            </div>
                            <div
                              className="unlike"
                            // onClick={() => incrementt(link)}
                            >
                              {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
                            </div>
                          </div>
                          {/* <Likeia
                        correoUsuario={props.correoUsuario}
                        pageSelect={props.pageSelect}
                        {...{ setPostId, postId, user, setUser }}
                      /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="content" style={{ marginLeft: "50px" }}>
                    <div className="hole" style={{ marginLeft: "30px" }}>
                      <div className="icon1" >
                        <div
                          className="material-iconis"
                          // onClick={() => setCurrentId(link.id)}
                          z-index="1"
                        >
                          {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
                        </div>
                      </div>
                      <div className="icon2">
                        <div
                          className="material-iconi"
                        // onClick={() => onDeleteLink(link.id)}
                        >
                          {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
                        </div>
                      </div>
                    </div>

                    <div className="usuario" style={{ height: "20px" }}>
                      {link.id}
                    </div>
                    <div
                      className="textol"
                    // onClick={() => juntarTraduccion(link.description)}
                    >
                      {/* {mostrar ? (
                        link.description === juntar ? (
                          <div className="titulo1"> {link.description}</div>
                        ) : null
                      ) : null} */}
                      <div className="titulo2">{link.content}</div>
                    </div>

                    <div className="line-down">
                      <div className="comment"></div>
                      <div className="likes">
                        <div style={{ padding: "5px" }}>
                          {/* <Link to="/respond" className="nlink">
                            Responder
                          </Link> */}
                        </div>
                        <div className="megusta">
                          {/* <div>{link.like}</div> */}
                          <div
                            className="like"
                          // onClick={() => incrementt(link)}
                          >
                            {/* <FontAwesomeIcon icon={faThumbsUp} /> */}
                          </div>
                          <div
                            className="unlike"
                          // onClick={() => incrementt(link)}
                          >
                            {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      ) : (
        <div><PeticionesTwo {...{ setPeticionajena, peticionajena, setPeticionajenaa, peticionajenaa }} /></div>
      )}
    </div>
  );
};

export default Comentarios;
