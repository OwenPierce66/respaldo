import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../owenscss/traductor.scss";
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
  faHeart,
  faTrash,
  faImage,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import PeticionesTwo from "./peticionesTwo";
import Modal from 'react-modal';
import BuscarPeticion from "./buscarpeticion";
import Comentarios from "./comentarios";
import CategoriesMenu from "./cetegorymenu";
import { fetchCategories } from "./apicategory";
import NuevasPeticiones from "./nuevoTask";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Peticiones = (props) => {
  const [tema, setTema] = useState("consejos");
  const [anchorEl, setAnchorEl] = useState(null);
  const [cconsejos, setConsejos] = useState([]);
  const [ppeticiones, setPpeticiones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [historia, setHistoria] = useState([]);
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
  const [sharedTasks, setSharedTasks] = useState([]); // Estado para las tareas compartidas

  useEffect(() => {
    if (dataa === "") {
      addOrEditTiendaa();
    } else {
      getTasks();
      getSharedTasks();
    }
    console.log(process.env.REACT_APP_S3_CUSTOM_DOMAIN);
    console.log(process.env);
  }, [dataa]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetchCategories();
      if (response.status === 200) {
        setCategories(response.data);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    // Actualiza los estados de cconsejos, ppeticiones e historia
    const consejos = tasks.filter(task => task.pch === "consejos");
    const peticiones = tasks.filter(task => task.pch === "peticiones");
    const historia = tasks.filter(task => task.pch === "historia");
    setConsejos(consejos);
    setPpeticiones(peticiones);
    setHistoria(historia);
  }, [tasks]);

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
      props.setUsuario(userDetails.user.id);
      props.setUsuarioName(userDetails.user.username);
      setDataa(userDetails.user.id);
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

  const getSharedTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/shared-tasks/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setSharedTasks(response.data);
      console.log('Shared Tasks:', response.data);
    } catch (error) {
      console.error('Error fetching shared tasks:', error);
    }
  };

  const handleShare = async (task) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.post('http://127.0.0.1:8000/api/shared-tasks/', { task_id: task.id }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Shared task response:', response.data); // Para depuración
      getSharedTasks(); // Actualizar las tareas compartidas
    } catch (error) {
      console.error('Error sharing task:', error);
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

  // const user = useSelector(state => state.auth.isAuthenticated);

  const addOrEditTienda = async () => {
    try {
      const formData = new FormData();
      formData.append('title', normal);
      formData.append('description', translatedText);
      formData.append('username', props.usuarioName);
      formData.append('pch', tema);

      const manualCategories = hashtags.split(',').map(cat => cat.trim()).filter(cat => cat !== "");
      const allCategories = [...selectedCategories, ...manualCategories];
      formData.append('categories', allCategories.join(','));

      if (selectedVideo) {
        formData.append('video', selectedVideo);
      }

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

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
    const apiKey = "YOUR_GOOGLE_TRANSLATE_API_KEY";
    const targetLanguage = "es";
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
    setMostrar(!mostrar);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];

    if (fileType === 'image') {
      setSelectedImage(file);
      setSelectedVideo(null);
      const imageURL = URL.createObjectURL(file);
      setSelectedImagee(imageURL);
      setVideoPreview(null);
    } else if (fileType === 'video') {
      setSelectedVideo(file);
      setSelectedImage(null);
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
      setSelectedImagee(null);
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

  const handleCategoryChange = (event) => {
    const selectedOptions = Array.from(event.target.options).filter(option => option.selected).map(option => option.value);
    setSelectedCategories(selectedOptions);
  };

  const options = categories.map(cat => ({ value: cat.id, label: cat.name }));

  const handleChange = (selectedOptions) => {
    const selectedCategoryNames = selectedOptions.map(option => option.label);
    setSelectedCategories(selectedCategoryNames);
    setSelectedCategoriess(selectedOptions);
  };

  const extractHashtags = (text) => {
    return text.match(/#\w+/g) || [];
  };

  const handleInputChange = (index, e) => {
    const newTasks = masTasks.map((task, idx) => {
      if (idx === index) {
        return { ...task, [e.target.name]: e.target.value };
      }
      return task;
    });
    setMasTasks(newTasks);
  };

  const handleFileChangee = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
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

  const addTaskForm = () => {
    setMasTasks([...masTasks, { title: '', description: '', image: null, video: null }]);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('userTokenLG');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get-user/', {
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

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  const { user, subscriptionStatus } = usuario;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setAnchorEl(null);
    if (option) {
      setTema(option);
    }
  };

  return (

      <div className="shared-tasks">
        <h2>Tareas Compartidas</h2>
        {sharedTasks.map((sharedTask) => (
          <div key={sharedTask.id} className="shared-task-item">
            <div>
              <h3>{sharedTask.task.title}</h3>
              <p>{sharedTask.task.description}</p>
              {sharedTask.task.image && (
                <img src={sharedTask.task.image} alt="Imagen compartida" style={{ height: "100px", width: "100px" }} />
              )}
              {sharedTask.task.video && (
                <video src={sharedTask.task.video} controls width="250" />
              )}
            </div>
            <p>Compartido por: {sharedTask.shared_by.username}</p>
          </div>
        ))}
      </div>

  );
};

export default GPeticiones;
