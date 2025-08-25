import React, { useState, useEffect } from "react";
import axios from 'axios';
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
import Modal from 'react-modal';

import PeticionesTwo from "./peticionesTwo";
import Comentarios from "./comentarios";

const Traductor = (props) => {
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
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("Todas las categorías");
  const [predefinedCategories, setPredefinedCategories] = useState([]);

  const predefinedCategoriesLebaron = ["All categories of LeBaron", "All Categories", "comida", "educacion", "chatgpt cuestions", "libros", "podcast", "perfiles"]; // Ejemplo

  useEffect(() => {

    if (dataa === "") {
      addOrEditTiendaa();
    } else {
      getTasks();
    }

  }, [dataa]);

  useEffect(() => {
    if (data.length > 0) {
      const allCategories = data.map(task => task.category);
      const uniqueCategories = [...new Set(allCategories)];
      setPredefinedCategories(uniqueCategories);
    }
  }, [data]);

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
      props.setUsuario(userDetails.user.id);
      props.setUsuarioName(userDetails.user.username);
      setDataa(userDetails.user.id);
      // console.log(user);
    } catch (error) {
      console.error('Error creating task:', error);
    }

  }

  const getTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${dataa}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setTasks(response.data);
      console.log(response.data);
      setData(response.data);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleUpdate = async (task) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      getTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleListUsers = async (task) => {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
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

  const addOrEditTienda = async () => {
    try {
      const formData = new FormData();
      // Asegúrate de agregar todos los campos necesarios a formData
      formData.append('title', normal);
      formData.append('description', translatedText);
      formData.append('like', 0);
      // Crear un array de likes (puede ser una lista de IDs de usuarios, por ejemplo)
      const likesArray = [];
      formData.append('likes', JSON.stringify(likesArray)); // Convierte a cadena JSON
      formData.append('username', props.usuarioName);
      formData.append('category', category);

      const finalCategory = category ? category : selectedCategory;
      formData.append('category', finalCategory);

      if (selectedImage !== null) {
        formData.append('image', selectedImage);
      } else {
        formData.append('image', "");
      }

      const response = await axios.post(`http://127.0.0.1:8000/api/tasks/${dataa}/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setData([...data, response.data]);
    } catch (error) {
      console.error('Error creating task:', error);
      console.error('Error creating task:', error.response.data);
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


  function userHasLikedTask(task, dataa) {
    return task.like_set.some(like => like.user.id === dataa);
  }

  const imageSelect = (image) => {
    setModalOpenImage(true);
    setImagen(image);
  }

  const tasksWithLikeInfo = sortedData.map(task => ({
    ...task,
    userHasLiked: userHasLikedTask(task, dataa)
  }));

  return (
    <div style={{ paddingTop: "10px" }}>

      {peticionajena === "" && peticion === "" ? (
        <div style={{ paddingTop: "10px" }}>
          <div className="whatpetition">
            <div className="whatpetitiontitle">Cual es tu peticion?{props.usuarioName}
            </div>

            <div style={{ marginTop: "8px" }}>
              <input type="text" onChange={(e) => translateText(e.target.value)} />
            </div>
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

              <input
                type="text"
                value={category}
                style={{ borderRadius: "50px" }}

                onChange={(e) => setCategory(e.target.value)}
                placeholder="Elige tu Categoría"
              />

              <select
                value={selectedCategory}
                style={{ marginBottom: "5px", marginTop: "5px", borderRadius: "50px" }}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Elige una categoría</option>
                {predefinedCategories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>


              <div>
                {selectedImagee !== null ? (
                  <img src={selectedImagee} alt="Imagen" icon={faHeart} className="imagenPeticion" style={{ height: "100px", width: "100px" }} />
                ) : (null)}</div>
            </div>

            <div> <button className="btnpetition" onClick={addOrEditTienda}>
              Agregar
            </button></div>
          </div>

          <div className="category-menu">
            <div className="horizontal-scroll">
              <ul>
                <li onClick={() => setSelectedCategory("")}>Elige una categoría</li>
                {predefinedCategoriesLebaron.map((cat, index) => (
                  <li key={index} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="category-menu">
            <div className="horizontal-scroll">
              <ul>
                {/* <li onClick={() => setSelectedCategory("")}>Elige una categoría</li> */}
                {predefinedCategories.map((cat, index) => (
                  <li key={index} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="contenido-pagin">
            {tasksWithLikeInfo
              .filter((link) => selectedCategory === "Todas las categorías" || link.category === selectedCategory)
              .map((link) => (
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
                              {props.usuario === link.user ? (<FontAwesomeIcon icon={faTrash} />) : (null)}

                            </div>

                          </div>
                        </div>
                        <div className="usuario" style={{ height: "20px", }} onClick={() => setPeticionajena(link.user)}>
                          {link.username}
                          {link.category}
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


                        <Modal
                          isOpen={isModalOpen}
                          onRequestClose={() => setModalOpen(false)} // Permite cerrar el modal al hacer clic fuera de él o presionar ESC
                          contentLabel="Usuarios que dieron like"
                        >
                          <h2>Usuarios que dieron "like" a la tarea { }:</h2>
                          <ul>
                            {listUsers.map(user => (
                              <li key={user.id} onClick={() => setPeticionajena(user.id)}>
                                ID: {user.id}, Nombre de usuario: {user.username}
                              </li>
                            ))}
                          </ul>
                          <button onClick={() => setModalOpen(false)}>Cerrar</button> {/* Botón para cerrar el modal */}
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
                            <div style={{ padding: "5px" }} onClick={() => setPeticion(link)}>
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


                              <div
                                className="like"
                              >
                                <div onClick={() => handleUpdate(link)}>
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
                        {link.username}
                      </div>
                      <div
                        className="textol"
                      // onClick={() => juntarTraduccion(link.description)}
                      >
                        {mostrar ? (
                          link.description === juntar ? (
                            <div className="titulo1"> {link.description}</div>
                          ) : null
                        ) : null}
                        <div className="titulo2">{link.title}</div>
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

      ) : peticion !== "" ? (
        <div><Comentarios {...{ peticion, setPeticion, setPeticionajena, peticionajena }} usuario={props.usuario} setUsuarioName={props.setUsuarioName} usuarioName={props.usuarioName} handleDelete={handleDelete} handleUpdate={handleUpdate} /></div>
      ) : (
        <div><PeticionesTwo setUsuarioName={props.setUsuarioName} usuarioName={props.usuarioName} {...{ setPeticionajena, peticionajena, setPeticionajenaa, peticionajenaa, getTasks }} /></div>

      )}

    </div>
  );
};

export default Traductor;
