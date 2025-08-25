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
import Select from 'react-select';
import { faHeart, faTrash, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";

import PeticionesTwo from "./peticionesTwo";
import Modal from 'react-modal';
import BuscarPeticion from "./buscarpeticion";
import Comentarios from "./comentarios";
import CategoriesMenu from "./cetegorymenu";
import { fetchCategories } from "./apicategory";
import NuevasPeticiones from "./nuevoTask";


const Peticiones = (props) => {
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
  const [searchCategory, setSearchCategory] = useState("");
  const [isFavorito, setIsFavorito] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoriess, setSelectedCategoriess] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('image');
  // const [usuarioName, setUsuarioName] = useState("owen");
  const [videos, setVideos] = useState(null);
  const [images, setImages] = useState(null);

  const [masTasks, setMasTasks] = useState([{
    title: '',
    description: '',
    image: null,
    video: null,
    imagePreview: null,
    videoPreview: null
  }]);

  // const [usuario, setUsuario] = useState(724);

  useEffect(() => {
    if (dataa === "") {
      addOrEditTiendaa();
    } else {
      getTasks();
    }
    console.log(process.env.REACT_APP_S3_CUSTOM_DOMAIN
    );
    console.log(process.env); // Esto te mostrará todas las variables de entorno disponibles
  }, [dataa]);

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
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setTasks(response.data);
      setData(response.data);
      console.log(response.data);

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
      console.error('Error updating task:', error.response);

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

  const predefinedCategoriesLebaron = ["All categories of LeBaron", "Todas las categorias", "comida", "educacion", "chatgpt cuestions", "libros", "podcast", "perfiles"]; // Ejemplo


  const addOrEditTienda = async () => {
    try {
      const formData = new FormData();
      formData.append('title', normal);
      formData.append('description', translatedText);
      formData.append('username', props.usuarioName);

      const manualCategories = hashtags.split(',').map(cat => cat.trim()).filter(cat => cat !== "");
      const allCategories = [...selectedCategories, ...manualCategories];
      formData.append('categories', allCategories.join(','));

      if (selectedVideo) {
        formData.append('video', selectedVideo);
      }

      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      // Añadir cada tarea individualmente
      masTasks.forEach((task, index) => {
        formData.append(`subtasks[${index}][title]`, task.title);
        formData.append(`subtasks[${index}][description]`, task.description);
        if (task.image) formData.append(`subtasks[${index}][image]`, task.image, task.image.name);
        if (task.video) formData.append(`subtasks[${index}][video]`, task.video, task.video.name);
      });

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(`http://127.0.0.1:8000/api/tasks/${dataa}/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setTasks([...tasks, response.data]);
      setData([...data, response.data]);
      setSelectedImagee(null);
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

    setJuntar(a);
    if (mostrar === true) {
      setMostrar(false);
    } else {
      setMostrar(true);
    }

  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return; // No hacer nada si no se seleccionó un archivo

  //   const fileType = file.type.split('/')[0]; // 'image' o 'video'

  //   if (fileType === 'image') {
  //     const imageURL = URL.createObjectURL(file);
  //     // Agregar directamente a la lista de imágenes y limpiar el estado previo
  //     setImages(images => [...images, imageURL]);
  //     setSelectedImage(null);
  //     setVideoPreview(null);
  //   } else if (fileType === 'video') {
  //     const videoURL = URL.createObjectURL(file);
  //     // Agregar directamente a la lista de videos y limpiar el estado previo
  //     setVideos(videos => [...videos, videoURL]);
  //     setSelectedVideo(null);
  //     setSelectedImagee(null);
  //   }
  // };



  const sortedData = data.sort((a, b) => b.likes_count - a.likes_count);

  const tasksWithLikeInfo = sortedData.map(task => ({
    ...task,
    userHasLiked: userHasLikedTask(task, dataa)
  }));

  function userHasLikedTask(task, dataa) {
    return task.like_set.some(like => like.user.id === dataa);
  }

  const imageSelect = (image) => {
    setModalOpenImage(true);
    setImagen(image);
  }

  const handleAgregarFavorito = async (taskId) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      await axios.post('http://127.0.0.1:8000/api/favoritos/agregar/', { task: taskId }, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setIsFavorito(true);
      alert('Tarea agregada a favoritos');
    } catch (error) {
      console.error('Error agregando a favoritos:', error);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetchCategories();
      if (response.status === 200) {
        setCategories(response.data);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const selectedOptions = Array.from(event.target.options).filter(option => option.selected).map(option => option.value);
    setSelectedCategories(selectedOptions);
  };

  const options = categories.map(cat => ({ value: cat.id, label: cat.name }));

  const handleChange = (selectedOptions) => {
    // Actualiza el estado con los nombres de las categorías seleccionadas.
    const selectedCategoryNames = selectedOptions.map(option => option.label);
    setSelectedCategories(selectedCategoryNames);
    setSelectedCategoriess(selectedOptions);
  };

  const extractHashtags = (text) => {
    // Esta regex encuentra todas las palabras que comienzan con '#'
    return text.match(/#\w+/g) || [];
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return; 

  //   const fileType = file.type.split('/')[0]; 

  //   if (fileType === 'image') {
  //     const imageURL = URL.createObjectURL(file);

  //     setImages(images => [...images, imageURL]);
  //     setSelectedImage(file);
  //     setSelectedImage(null);
  //     setVideoPreview(null);
  //   } else if (fileType === 'video') {
  //     const videoURL = URL.createObjectURL(file);

  //     setVideos(videos => [...videos, videoURL]);
  //     setSelectedVideo(file);
  //     setSelectedVideo(null);
  //     setSelectedImagee(null);
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // No hacer nada si no se seleccionó un archivo

    const fileType = file.type.split('/')[0]; // 'image' o 'video'

    if (fileType === 'image') {
      setSelectedImage(file);
      setSelectedVideo(null); // Asegura que no hay un video seleccionado
      const imageURL = URL.createObjectURL(file);
      setSelectedImagee(imageURL);
      setVideoPreview(null); // Limpia la previsualización de video
    } else if (fileType === 'video') {
      setSelectedVideo(file);
      setSelectedImage(null); // Asegura que no hay una imagen seleccionada
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
      setSelectedImagee(null); // Limpia la previsualización de imagen
    }
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (index, e) => {
    const newTasks = masTasks.map((task, idx) => {
      if (idx === index) {
        return { ...task, [e.target.name]: e.target.value };
      }
      return task;
    });
    setMasTasks(newTasks);
  };

  // Función para manejar cambios en los archivos
  const handleFileChangee = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0]; // 'image' o 'video'
    const updatedTasks = masTasks.map((task, idx) => {
      if (idx === index) {
        if (fileType === 'image') {
          return {
            ...task,
            image: file,
            video: null,
            imagePreview: URL.createObjectURL(file),
            videoPreview: null
          };
        } else if (fileType === 'video') {
          return {
            ...task,
            video: file,
            image: null,
            videoPreview: URL.createObjectURL(file),
            imagePreview: null
          };
        }
      }
      return task;
    });
    setMasTasks(updatedTasks);
  };


  // Función para agregar un nuevo formulario de tarea
  const addTaskForm = () => {
    setMasTasks([...masTasks, { title: '', description: '', image: null, video: null }]);
  };


  return (
    <div>
      <BuscarPeticion {...{ setPeticionajena, peticionajena, setPeticionajenaa, peticionajenaa }} />
      <div>
        <input placeholder="Buscar Categoria..." style={{ border: "none", width: "100%", borderRadius: "16px" }} type="text" onChange={(e) => setSearchCategory(e.target.value)} />
      </div>
      {peticionajena === "" && peticion === "" ? (
        <div style={{ paddingTop: "10px" }}>
          <div className="whatpetition">
            <div className="whatpetitiontitle">Cual es tu peticion?{props.usuarioName}
            </div>

            <div>
              <input type="text" onChange={(e) => translateText(e.target.value)} />
            </div>
            <p style={{ paddingLeft: "15px", paddingRight: "15px" }}>{translatedText}</p>

            <div>
              {selectedImagee && (
                <img src={selectedImagee} alt="Imagen seleccionada" style={{ height: "100px", width: "100px" }} />
              )}
              {videoPreview && (
                <video src={videoPreview} controls width="250" />
              )}
              <input
                type="file"
                id="fileInput"
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="fileInput" >
                <div className="imagenIcon">
                  <FontAwesomeIcon icon={faImage} /> {/* Ícono para cargar archivos */}
                </div>
              </label>


            </div>

            <div>
              {masTasks.map((task, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Description"
                  />
                  <input
                    type="file"
                    id={`fileInput-${index}`}
                    name="file"
                    onChange={(e) => handleFileChangee(index, e)}
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`fileInput-${index}`} className="imagenIcon">
                    <FontAwesomeIcon icon={faImage} /> {/* Ícono para cargar archivos */}
                    {/* Upload Image/Video */}
                  </label>
                  {task.imagePreview && (
                    <img src={task.imagePreview} alt="Preview" style={{ height: "100px", width: "100px" }} />
                  )}
                  {task.videoPreview && (
                    <video src={task.videoPreview} controls style={{ width: '250px' }} />
                  )}
                </div>
              ))}
              <button onClick={addTaskForm}>Add Another Task</button>
            </div>

            {/* <div>
              <input type="file" id="fileInput" accept="image/*,video/*" onChange={handleFileChange} />
              <div>
                {images.map((img, index) => (
                  <img key={index} src={img} alt="Loaded" style={{ width: "100px", height: "100px" }} />
                ))}
                {videos.map((video, index) => (
                  <video key={index} src={video} controls style={{ width: "250px" }} />
                ))}
              </div>
            </div> */}

            {/* <div>
              <input type="file" id="fileInput" accept="image/*,video/*" onChange={handleFileChange} />
              <div>
                {images.map((img, index) => (
                  <img key={index} src={img} alt="Loaded" style={{ width: "100px", height: "100px" }} />
                ))}
                {videos.map((video, index) => (
                  <video key={index} src={video} controls style={{ width: "250px" }} />
                ))}
              </div>
            </div> */}

            {/* <div>
              <input type="file" id="fileInput" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <label htmlFor="fileInput">
                <FontAwesomeIcon icon={faUpload} /> 
              </label>
              <button onClick={handleAddImageVideo}>Agregar otro archivo</button>
              {images.map(img => (
                <img key={img} src={img} alt="Imagen" style={{ width: "100px", height: "100px" }} />
              ))}
              {videos.map(video => (
                <video key={video} src={video} controls style={{ width: "250px" }} />
              ))}
            </div> */}

            <input
              type="text"
              value={hashtags}
              style={{ borderRadius: "50px" }}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="Ingresa tu o tus categoria"
            />

            <div>
              <Select
                isMulti
                name="colors"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
                value={selectedCategoriess}
              />
            </div>

            <div> <button className="btnpetition" onClick={addOrEditTienda}>
              Agregar
            </button></div>
          </div>


          <CategoriesMenu onCategorySelected={setSelectedCategory} />


          <div className="contenido-pagin">
            {tasksWithLikeInfo
              .filter(task =>
                selectedCategory === "Todas las categorías" ||
                task.categories.split(',').some(cat => cat.trim() === selectedCategory) // Usa .split() para convertir el string en un array y .trim() para eliminar espacios en blanco
              )
              .filter(task =>
                searchCategory === "" ||
                task.categories.split(',').map(cat => cat.trim().toLowerCase()).includes(searchCategory.trim().toLowerCase())
              )
              .filter(task =>
                !peticionajena || task.user === peticionajena
              )
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
                          <div className="icon2" >
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


                        </div>
                        <button onClick={() => handleAgregarFavorito(link.id)}> {isFavorito ? 'En Favoritos' : 'Agregar a Favoritos'}</button>
                        <div>
                          {link.categories}
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

                        {link.video && (
                          <video controls className="testimonial-video">
                            <source src={link.video} type="video/mp4" />

                            Your browser does not support the video tag.
                          </video>
                        )}
                        {link.image !== null && link.image !== "" ? (<img src={link.image} alt="Imagen" onClick={() => imageSelect(link.image)} icon={faHeart} className="imagenPeticion" style={{ height: "100px", width: "100px" }} />) : (null)}

                        <div className="subtasks-container">
                          {link.subtasks.map(subtask => (
                            <div key={subtask.id} className="subtask">
                              <div>{subtask.title}</div>
                              <div>{subtask.description}</div>
                              {subtask.image && (
                                <img src={subtask.image} alt="Subtask" style={{ marginLeft: "4px", width: '336px', height: '336px' }} />
                              )}
                              {subtask.video && (
                                <video controls className="testimonial-video" style={{ marginLeft: "4px", width: '200px', height: '333px' }}>
                                  <source src={subtask.video} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              )}
                            </div>
                          ))}
                        </div>


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
        <div><Comentarios {...{ peticion, setPeticion, setPeticionajena, peticionajena, handleListUsers }} usuario={props.usuario} setUsuarioName={props.setUsuarioName} usuarioName={props.usuarioName} handleDelete={handleDelete} handleUpdate={handleUpdate} /></div>
      ) : (
        <div><PeticionesTwo setUsuarioName={props.setUsuarioName} usuarioName={props.usuarioName} usuario={props.usuario} {...{ setPeticionajena, peticionajena, setPeticionajenaa, peticionajenaa, getTasks }} /></div>

      )}
    </div>
  );
};

export default Peticiones;
