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
import Comentarios from "./comentarios";
import { useHistory } from "react-router-dom"; // Usamos useHistory para navegar a mensajes, foro, etc.


const PeticionesTwo = (props) => {
  const [translatedText, setTranslatedText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [normal, setNormal] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagee, setSelectedImagee] = useState(null);

  const [juntar, setJuntar] = useState("");
  const [data, setData] = useState([]);
  const [peticionajena, setPeticionajena] = useState("");
  const [peticionajenaa, setPeticionajenaa] = useState(props.peticionajena);

  const [correoUsuario, setCorreoUsuario] = useState(localStorage.getItem("userTokenLG"));
  const [mostrar, setMostrar] = useState("");
  const [peticion, setPeticion] = useState("");
  const [dataa, setDataa] = useState("");
  const [listUsers, setListUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenImage, setModalOpenImage] = useState(false);
  const [category, setCategory] = useState('');
  const [imagen, setImagen] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Todas las categorías");
  const [predefinedCategories, setPredefinedCategories] = useState([]);

  const predefinedCategoriesLebaron = ["All categories of LeBaron", "All Categories", "comida", "educacion", "chatgpt cuestions", "libros", "podcast", "perfiles"];

  const history = useHistory(); // Para navegación

  // Obtener datos del usuario autenticado
  const user = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (props.peticionajena === "") {
      addOrEditTiendaa();
    } else {
      getTasks();
    }
  }, [props.peticionajena]);

  useEffect(() => {
    if (data.length > 0) {
      const allCategories = [];
      data.forEach(task => {
        allCategories.push(...task.categories.split(',').map(category => category.trim()));
      });

      const uniqueCategories = [...new Set(allCategories)];
      console.log(uniqueCategories);
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
      setDataa(userDetails.user.id);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks_by_user/${props.peticionajena}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setTasks(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleUpdate = async (task) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, tasks, {
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
      setModalOpen(true);
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

  const navigateToMessages = (userId) => {
    history.push(`/dashboard/direcmassaging/${userId}`);
  };

  const navigateToForum = (userId) => {
    history.push(`/dashboard/newcommunity/${userId}`);
  };

  const translateText = async (text) => {
    setNormal(text);
    const apiKey = "YOUR_GOOGLE_TRANSLATE_API_KEY"; // Tu clave de API
    const targetLanguage = "es"; // Idioma objetivo
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
      setTranslatedText(data.data.translations[0].translatedText);
    } catch (error) {
      console.error("Error al traducir el texto:", error);
    }
  };

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
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <div>
        <div className="peticionName">
          <div className="peticionNameTitle">Peticiones de {peticionajenaa}</div>
        </div>
        <button className="btnpetition" onClick={() => props.setPeticionajena("")}>
          Volver
        </button>

        <div className="category-menu">
          <ul className="horizontal-scroll">
            {predefinedCategoriesLebaron.map((cat, index) => (
              <li key={index} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </li>
            ))}
          </ul>
        </div>

        <div className="category-menu">
          <ul className="horizontal-scroll">
            {predefinedCategories.map((cat, index) => (
              <li key={index} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </li>
            ))}
          </ul>
        </div>

        <div className="contenido-pagin">
          {tasksWithLikeInfo
            .filter(task =>
              selectedCategory === "Todas las categorías" ||
              task.categories.split(',').map(cat => cat.trim()).includes(selectedCategory)
            )
            .map((task) => (
              <div key={task.id} className="comment" style={{ borderRadius: "10px" }}>
                <div className="contentt">
                  <div className="redondear">
                    <div className="hole">
                      <div className="icon1">
                        <div className="material-iconis" onClick={() => handleUpdate(task)}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </div>
                      </div>
                      <div className="icon2">
                        <div className="material-iconi" onClick={() => handleDelete(task.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </div>
                      </div>
                    </div>
                    <div className="usuario" onClick={() => navigateToMessages(task.user)}>
                      {task.username}
                    </div>
                    <div className="textol" onClick={() => setJuntar(task.description)}>
                      <div className="titulo2">{task.title}</div>
                    </div>
                    {task.image && (
                      <img src={task.image} alt="Imagen" onClick={() => imageSelect(task.image)} className="imagenPeticion" />
                    )}

                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={() => setModalOpen(false)}
                      contentLabel="Usuarios que dieron like"
                    >
                      <h2>Usuarios que dieron "like":</h2>
                      <ul>
                        {listUsers.map(user => (
                          <li key={user.id} onClick={() => setPeticionajena(user.id)}>
                            {user.username}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => setModalOpen(false)}>Cerrar</button>
                    </Modal>

                    <Modal
                      isOpen={isModalOpenImage}
                      onRequestClose={() => setModalOpenImage(false)}
                      contentLabel="Ver Imagen"
                    >
                      <img src={imagen} alt="Imagen" onClick={() => setModalOpenImage(false)} />
                      <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
                    </Modal>

                    <div className="line-down">
                      <div className="likes">
                        <div onClick={() => setPeticion(task)}>
                          <Link to="/peticionesTwo" className="nlink">
                            Responder
                          </Link>
                        </div>
                        <div className="megusta">
                          <div className="like" onClick={() => handleUpdate(task)}>
                            <FontAwesomeIcon icon={faHeart} style={{ color: task.userHasLiked ? "54afff" : "white" }} />
                          </div>
                          <div className="like_cantidad" onClick={() => handleListUsers(task)}>
                            {task.likes_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PeticionesTwo;
