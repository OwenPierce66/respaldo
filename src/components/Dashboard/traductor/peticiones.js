import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../owenscss/traductor.scss";
import "../owenscss/portadaStyle.scss";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux"; // Importa `connect` para conectar con Redux
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  faUser,
  faEnvelope,
  faHeart,
  faTrash,
  faImage,
  faGlobe,
  faArrowRight,
  faBars,
  faMinus,
  faPlus,
  faSearch,
  faPenToSquare,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import Modal from 'react-modal';
import CategoriesMenu from "./cetegorymenu";
import { fetchCategories } from "./apicategory";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LinkPreview from "./newforum/archivos/LinkPreview";
import TaskFilterMenu from "./Filtro";
import PortadaModal from "./PortadaModal";
import TextoConVerMas from "./TextoConVerMas";
import PerfilesP from './perfilesP';
import ChatAssistant from "./ChatIA";
const ReactJoyride = require('react-joyride').default;

const Peticiones = ({ user, subscriptionStatus }) => {
  const [combinedSearchTerm, setCombinedSearchTerm] = useState('');
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);
  const [tema, setTema] = useState("consejos");
  const [usuario, setUsuario] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [normal, setNormal] = useState("");
  const [juntar, setJuntar] = useState("");
  const [data, setData] = useState([]);
  const [peticionajena, setPeticionajena] = useState("");
  const [mostrar, setMostrar] = useState("");
  const [dataa, setDataa] = useState("");
  const [showLink, setShowLink] = useState({});
  const [listUsers, setListUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenImage, setModalOpenImage] = useState(false);
  const [imagen, setImagen] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas las categorías");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoriess, setSelectedCategoriess] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [normalizedTasks, setNormalizedTasks] = useState([]);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [filtro, setFiltro] = useState("popularidad"); 
  const [visibleSections, setVisibleSections] = useState({});
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarBuscar, setMostrarBuscar] = useState(false);
  const [predefinedCategories, setPredefinedCategories] = useState([]);
  const [predefinedCategoriesUserSelect, setPredefinedCategoriesUserSelect] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [likes, setLikes] = useState([]);
  const [perfilLikesCount, setPerfilLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [pchFavoritos, setPchFavoritos] = useState([]);
  const [anchorEl, setAnchorEl] = useState({});
  const [isModalOpenShare, setModalOpenShare] = useState(false);
  const [portadas, setPortadas] = useState([]);
  const [imagenFija, setImagenFija] = useState(null);
  const [selected, setSelected] = useState(false);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [soloFavoritosTareas, setSoloFavoritosTareas] = useState(false);
  const [nameUserSelect, setNameUserSelect] = useState('');
  const [mostrarSoloFavoritosUsuarioSeleccionado, setMostrarSoloFavoritosUsuarioSeleccionado] = useState(false);
  const [favoritosUsuarioSeleccionado, setFavoritosUsuarioSeleccionado] = useState([]);
  const [favoritosPerfilesUsuarioSeleccionado, setFavoritosPerfilesUsuarioSeleccionado] = useState([]);
  const [portadasUsuarioSeleccionado, setPortadasUsuarioSeleccionado] = useState([]);
  const [imagenFijaUsuarioSeleccionado, setImagenFijaUsuarioSeleccionado] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [sharedTasks, setSharedTasks] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

const getMediaUrl = (path) => {
  return path ? `http://127.0.0.1:8000${path}` : '';
};



  const [joyrideState, setJoyrideState] = useState({
    run: true,
    steps: [
      {
        target: '.iconpchMensaje',
        content: 'Este botón te lleva a los mensajes',
      },
      {
        target: '.iconpchUsers',
        content: 'Este botón te lleva al foro de ese perfil .',
      },
      {
        target: '.perfilHeart',
        content: 'Este botón te permite agregar a favoritos al perfil.',
      },
    ],
    stepIndex: 0,
  });

  const [masTasks, setMasTasks] = useState([{
    title: '',
    description: '',
    image: null,
    video: null,
    imagePreview: null,
    videoPreview: null
  }]);

  const [masFactores, setMasFactores] = useState([{
    title: '',
    description: '',
    link: '',
    image: null,
    video: null,
    imagePreview: null,
    videoPreview: null,
  }]);

  const [masFuentes, setMasFuentes] = useState([{
    title: '',
    description: '',
    link: '',
    image: null,
    video: null,
    imagePreview: null,
    videoPreview: null,
  }]);

  const handleClick = () => {
    setSelected(!selected);  
  };

  useEffect(() => {
    const defaultVisibleSections = tasks.reduce((acc, task) => {
      acc[task.id] = 'subtasks'; // 'subtasks' como sección predeterminada
      return acc;
    }, {});
    setVisibleSections(defaultVisibleSections);
  }, [tasks]);

  const handleSectionChange = (taskId, section) => {
    setVisibleSections(prevSections => ({
      ...prevSections,
      [taskId]: section 
    }));
  };

  const history = useHistory();

  const navigateToUserMesseges = (userId) => {
    history.push(`/dashboard/direcmassaging/${userId}`);
  };

  const navigateToUserForum = (userId) => {
    history.push(`/dashboard/newcommunity/${userId}`);
  };

  const navigateToPeticionPost = (peticionId) => {
    history.push(`/dashboard/newpeticionesPost/${peticionId}`);
  };

  useEffect(() => {
    fetchUserDetails();
    cargarFavoritos(); 
    cargarFavoritosDeTareas();
  }, []); 


  const cargarFavoritos = async () => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get('http://127.0.0.1:8000/api/pfavoritos/listar/', {
        headers: { Authorization: `Token ${token}` },
      });
      setFavoritos(response.data);
      console.log("Perfiles favoritos:", response.data);
      const currentUserId = usuario.user.id;
      const userHasLiked = response.data.some(like => like.id === currentUserId);
      console.log("Usuario actual:", currentUserId, "Ha dado like:", userHasLiked);
      setHasLiked(userHasLiked);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  const favoritosIds = favoritos.map(favorito => favorito.id) || [];

  const cargarFavoritosDeTareas = async () => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get('http://127.0.0.1:8000/api/favoritos/listar/', {
        headers: { Authorization: `Token ${token}` },
      });
      const favoritosIdss = response.data.map(favorito => favorito.task.id);
      setPchFavoritos(favoritosIdss);
      console.log("Tareas favoritas cargadas:", favoritosIdss);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  const handleToggleFavoritoTarea = async (taskId) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.post('http://127.0.0.1:8000/api/favoritos/agregar/',
        { task: taskId },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.mensaje);
      setPchFavoritos(prevFavoritos =>
        prevFavoritos.includes(taskId)
          ? prevFavoritos.filter(id => id !== taskId)
          : [...prevFavoritos, taskId]
      );
      cargarFavoritosDeTareas();
    } catch (error) {
      console.error('Error al manejar favoritos de tareas:', error);
    }
  };

  const tareasFavoritosIds = pchFavoritos.map(id => id); 

  useEffect(() => {
    if (dataa === "") {
      addOrEditTiendaa();
    } else {
      getTasks();
      fetchData();
      cargarFavoritos();
      // getSharedTasks();
      getTasksMios();

    }
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
      console.log("tareas con el sharedby", response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // const getSharedTasks = async () => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:8000/api/shared-tasks/`, {
  //       headers: {
  //         Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
  //       },
  //     });

  //     const uniqueTasksMap = {};
  //     const uniqueSharedTasks = response.data.filter(task => {
  //       if (!uniqueTasksMap[task.id]) {
  //         uniqueTasksMap[task.id] = true;
  //         return true;
  //       }
  //       return false;
  //     });

  //     const sortedSharedTasks = uniqueSharedTasks.sort((a, b) => {
  //       return new Date(b.created_at) - new Date(a.created_at);
  //     });

  //     setSharedTasks(sortedSharedTasks);
  //     console.log('Shareddd Tasks:', sortedSharedTasks);
  //   } catch (error) {
  //     console.error('Error fetching shared tasks:', error);
  //   }
  // };

  const handleShare = async (task) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.post('http://127.0.0.1:8000/api/shared-tasks/',
        { task_id: task.id },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log('Shared task response:', response.data); 
      // getSharedTasks(); 
      fetchData();

      let sharedTasksWithLikeInfo = response.data.map(sharedTask => ({
        ...sharedTask,
        task: {
          ...sharedTask.task,
          userHasLiked: sharedTask.user_has_liked
        }
      }));

      sharedTasksWithLikeInfo = sharedTasksWithLikeInfo.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // setSharedTasks(sharedTasksWithLikeInfo);
      console.log('Sharedd Tasks:', sharedTasksWithLikeInfo);
    } catch (error) {
      console.error('Error sharing task:', error);
    }
  };

  const handleUpdate = async (task) => {
    console.log("veamos que tiene la tasks si es igual que la peticion ", task);

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      fetchData();
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
      handleClose(null);
      fetchData();

    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addOrEditTienda = async () => {
    try {
      const formData = new FormData();
      formData.append('title', normal);
      formData.append('description', translatedText);
      formData.append('username', usuario.user.username);
      formData.append('pch', tema);

      const manualCategories = hashtags.split(',').map(cat => cat.trim()).filter(cat => cat !== "");
      const allCategories = [...selectedCategories, ...manualCategories];
      formData.append('categories', allCategories.join(','));


      masTasks.forEach((task, index) => {
        formData.append(`subtasks[${index}][title]`, task.title);
        formData.append(`subtasks[${index}][description]`, task.description);
        formData.append(`subtasks[${index}][link]`, task.link);
        if (task.image) formData.append(`subtasks[${index}][image]`, task.image, task.image.name);
        if (task.video) formData.append(`subtasks[${index}][video]`, task.video, task.video.name);
      });


      masFactores.forEach((task, index) => {
        formData.append(`subfactores[${index}][title]`, task.title);
        formData.append(`subfactores[${index}][description]`, task.description);
        formData.append(`subfactores[${index}][link]`, task.link);
        if (task.image) formData.append(`subfactores[${index}][image]`, task.image, task.image.name);
        if (task.video) formData.append(`subfactores[${index}][video]`, task.video, task.video.name);
      });

      masFuentes.forEach((task, index) => {
        formData.append(`subfuentes[${index}][title]`, task.title);
        formData.append(`subfuentes[${index}][description]`, task.description);
        formData.append(`subfuentes[${index}][link]`, task.link);
        if (task.image) formData.append(`subfuentes[${index}][image]`, task.image, task.image.name);
        if (task.video) formData.append(`subfuentes[${index}][video]`, task.video, task.video.name);
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
      const newTask = response.data;

      await axios.post('http://127.0.0.1:8000/api/shared-tasks/', {
        task_id: newTask.id
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          'Content-Type': 'application/json'
        },
      });
      // getSharedTasks(); 
      fetchData();
      setAddModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      console.error('Error creating task:', error.response.data);
    }
  }

  const translateText = async (text) => {
    setNormal(text);
    const apiKey = "AIzaSyA1pr1L0zW8cv6TNwadyjFHqUhh11POuAQ";
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

  const tasksWithLikeInfo = normalizedTasks.map(link => ({
    ...link,
    task: {
      ...link.task,
      userHasLiked: userHasLikedTask(link.task, dataa)
    }
  }));

  function userHasLikedTask(task, userId) {
    return task.like_set && task.like_set.some(like => like.user.id === userId);
  }

  const imageSelect = (image) => {
    setModalOpenImage(true);
    setImagen(image);
  }

  const handleLikeToggle = async (perfilId) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.post('http://127.0.0.1:8000/api/pfavoritos/agregar/',
        { perfil_id: perfilId },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.mensaje);
      cargarFavoritos(); // Actualiza la lista de favoritos después de agregar/eliminar
      handleLike(perfilId);

    } catch (error) {
      console.error('Error al manejar favoritos:', error);
    }
  };

  const options = categories.map(cat => ({ value: cat.id, label: cat.name }));

  const handleChange = (selectedOptions) => {
    const selectedCategoryNames = selectedOptions.map(option => option.label);
    setSelectedCategories(selectedCategoryNames);
    setSelectedCategoriess(selectedOptions);
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

  const handleInputChange = (index, e) => {
    const newTasks = masTasks.map((task, idx) => {
      if (idx === index) {
        return { ...task, [e.target.name]: e.target.value };
      }
      return task;
    });
    setMasTasks(newTasks);
  };

  const handleInputChangeFactores = (index, e) => {
    const newTasks = masFactores.map((task, idx) => {
      if (idx === index) {
        return { ...task, [e.target.name]: e.target.value };
      }
      return task;
    });
    setMasFactores(newTasks);
  };

  const handleInputChangeFuentes = (index, e) => {
    const newTasks = masFuentes.map((task, idx) => {
      if (idx === index) {
        return { ...task, [e.target.name]: e.target.value };
      }
      return task;
    });
    setMasFuentes(newTasks);
  };

  const addTaskForm = () => {
    setMasTasks([...masTasks, { title: '', description: '', image: null, video: null }]);
  };

  const addFuenteForm = () => {
    setMasFuentes([...masFuentes, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  };

  const addFactorForm = () => {
    setMasFactores([...masFactores, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  };

  useEffect(() => {
    console.log("Información del usuario:", user);
    console.log("Estado de la suscripción:", subscriptionStatus);
  }, [user, subscriptionStatus]);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('userTokenLG');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log("usuario", response.data);
      setUsuario(response.data);

      setPortadasUsuarioSeleccionado([]); // Reiniciar portadas del usuario seleccionado
      setImagenFijaUsuarioSeleccionado(null); // Reiniciar imagen fija del usuario seleccionado

    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    console.log("Estado de usuario:", usuario);
    if (usuario && usuario.user && usuario.user.id) {
      obtenerLikesPerfil();
      fetchPortadas();  // Refrescar portadas después de eliminar
      fetchImagenFija();
    }
  }, [usuario]);

  const obtenerLikesPerfil = async () => {
    if (!usuario || !usuario.user || !usuario.user.id) {
      console.warn("Usuario o usuario.user.id no está definido.");
      return;
    }
    console.log("presionado", usuario.user.id);
    try {
      const res = await axios.get(`http://localhost:8000/api/profiles/${usuario.user.id}/likes/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      if (Array.isArray(res.data)) {
        setPerfilLikesCount(res.data.length);
        console.log("algointeresante", res.data);
      } else {
        console.error('Respuesta inesperada: ', res.data);
      }

      const currentUserId = usuario.user.id;
      const userHasLiked = res.data.some(like => like.id === currentUserId);
      console.log("aver", currentUserId, "userHasLiked", userHasLiked);

    } catch (error) {
      console.error('Error al obtener los likes del perfil:', error);
    }

  };

  const handleLike = async (profileId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/profiles/${profileId}/like/`, {}, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      console.log(response.data);
      obtenerLikesPerfil();
    } catch (error) {
      console.error('Error al manejar el like:', error);
    }
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  const handleClickMenu = (event, taskId) => {
    setAnchorEl(prevState => ({ ...prevState, [taskId]: event.currentTarget }));
  };

  const handleClose = (taskId) => {
    setAnchorEl(prevState => ({ ...prevState, [taskId]: null }));
  };


  const backgroundColor = tema === "consejos" ? '#324c56' : tema === "peticiones" ? 'rgb(183 233 248)' : '#FFFFFF';

  const closeModal = () => setModalIsOpen(false);

  const obtenerLikes = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/profiles/${userId}/likes/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setLikes(res.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostFileChangeFuente = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    const updatedTasks = masFuentes.map((task, idx) => {
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
    setMasFuentes(updatedTasks);
  };

  const handlePostFileChangeFactor = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    const updatedTasks = masFactores.map((task, idx) => {
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
    setMasFactores(updatedTasks);
  };

function normalizeTasks(tasks, sharedTasks) {
  console.log("==> normalizeTasks - tasks:", tasks);
  console.log("==> normalizeTasks - sharedTasks:", sharedTasks);

  const taskMap = {};

  // Agrega todas las tareas originales
  tasks.forEach(task => {
    taskMap[task.id] = {
      task,
      shared_by_list: [], // lista de quienes la compartieron
    };
  });

  // Agrega los shares (pueden venir múltiples por misma tarea)
  sharedTasks.forEach(shared => {
    const taskId = shared.task.id;
    const sharedByUser = shared.shared_by;

    if (!taskMap[taskId]) {
      taskMap[taskId] = {
        task: shared.task,
        shared_by_list: [],
      };
    }

    taskMap[taskId].shared_by_list.push(sharedByUser);
  });

  const normalizedTasks = Object.values(taskMap);
  console.log("==> normalizeTasks - resultado normalizado:", normalizedTasks);
  return normalizedTasks;
}

  // function normalizeTasks(tasks, sharedTasks) {
  //   let normalizedTasks = [];
  //   tasks.forEach(task => {
  //     normalizedTasks.push({
  //       shared_by: null,  // No fue compartida
  //       task: task       // Mantiene la estructura original
  //     });
  //   });
  //   const sharedTaskCounts = sharedTasks.reduce((acc, shared) => {
  //     acc[shared.task.id] = (acc[shared.task.id] || 0) + 1;
  //     return acc;
  //   }, {});

  //   sharedTasks.forEach(shared => {
  //     if (sharedTaskCounts[shared.task.id] > 1) {
  //       let sharedTask = shared.task;
  //       let sharedBy = shared.shared_by.username;

  //       normalizedTasks.push({
  //         shared_by: sharedBy,
  //         task: sharedTask
  //       });
  //     }
  //   });
  //   return normalizedTasks;
  // }
const fetchData = async () => {
  try {
    const responseTasks = await axios.get(`http://127.0.0.1:8000/api/tasks/`, {
      headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
    });

    const responseSharedTasks = await axios.get(`http://127.0.0.1:8000/api/shared-tasks/`, {
      headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
    });

    const newTasks = responseTasks.data;
    const newSharedTasks = responseSharedTasks.data;

    // Opcional: ordenar por created_at para que el último share esté al final
    newSharedTasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const normalizedNewTasks = normalizeTasks(newTasks, newSharedTasks);

    const filteredTasks = normalizedNewTasks.filter((item) => {
      const taskCategories = item.task.categories ? item.task.categories.split(',') : [];

      return (
        (selectedCategory === "Todas las categorías" || taskCategories.includes(selectedCategory)) &&
        (peticionajena === "" || item.task.user === peticionajena)
      );
    });

    setNormalizedTasks((prevTasks) => {
      const taskMap = {};
      prevTasks.forEach((task) => {
        taskMap[task.task.id] = task;
      });

      filteredTasks.forEach((newTask) => {
        taskMap[newTask.task.id] = newTask;
      });

      const updatedTasks = Object.values(taskMap).sort((a, b) => b.task.likes_count - a.task.likes_count);

      return updatedTasks;
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

  // const fetchData = async () => {
  //   try {
  //     const responseTasks = await axios.get(`http://127.0.0.1:8000/api/tasks/`, {
  //       headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
  //     });

  //     const responseSharedTasks = await axios.get(`http://127.0.0.1:8000/api/shared-tasks/`, {
  //       headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
  //     });

  //     const newTasks = responseTasks.data;
  //     const newSharedTasks = responseSharedTasks.data;
  //     const normalizedNewTasks = normalizeTasks(newTasks, newSharedTasks);
  //     const filteredTasks = normalizedNewTasks.filter((task) => {
  //       const taskCategories = task.task.categories ? task.task.categories.split(',') : [];

  //       return (
  //         (selectedCategory === "Todas las categorías" || taskCategories.includes(selectedCategory)) &&
  //         (peticionajena === "" || task.task.user === peticionajena)
  //       );
  //     });

  //     setNormalizedTasks((prevTasks) => {
  //       const taskMap = {};
  //       prevTasks.forEach((task) => {
  //         taskMap[task.task.id] = task;
  //       });

  //       filteredTasks.forEach((newTask) => {
  //         taskMap[newTask.task.id] = newTask;
  //       });

  //       const updatedTasks = Object.values(taskMap).sort((a, b) => b.task.likes_count - a.task.likes_count);

  //       return updatedTasks;
  //     });
  //   } catch (error) {
  //     console.error('Error fetching tasks:', error);
  //   }
  // };

  const removeTask = (indexToRemove) => {
    setMasTasks((prevTasks) => prevTasks.filter((_, index) => index !== indexToRemove));
  };

  const filteredTasks = tasksWithLikeInfo.filter(link => {
    const categories = link.task.categories ? link.task.categories.split(',').map(cat => cat.trim().toLowerCase()) : [];
    const username = link.task.username ? link.task.username.toLowerCase() : '';
    const title = link.task.title ? link.task.title.toLowerCase() : '';
    const searchLower = combinedSearchTerm.trim().toLowerCase();
    const categoryMatch = categories.includes(searchLower);
    const usernameMatch = username.includes(searchLower);
    const titleMatch = title.includes(searchLower);

    return categoryMatch || usernameMatch || titleMatch;
  });

  const fetchPortadas = async () => {
    console.log("portadas nomas"); // Cambiado de "consolle" a "console"
    const token = localStorage.getItem("userTokenLG");

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/portada/', {
        headers: {
          Authorization: `Token ${token}`, // Token de autenticación
          'Content-Type': 'multipart/form-data',
        },
      });
      setPortadas(response.data);
      console.log("portadas", response.data); // Cambiado de "consolle" a "console"
    } catch (error) {
      console.error('Error fetching portadas:', error);
    }
  };

  const fetchImagenFija = async () => {
    console.log("Fetching imagen fija");
    const token = localStorage.getItem("userTokenLG");

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/imagen-fija/', {
        headers: {
          Authorization: `Token ${token}`, // Token de autenticación
          'Content-Type': 'multipart/form-data',
        },
      });
      setImagenFija(response.data.image); // Establece la imagen en el estado
      console.log("Imagen fija:", response.data.image);
    } catch (error) {
      console.error('Error fetching imagen fija:', error);
    }
  };

  const fetchPortadasUsuarioSeleccionado = async (userId) => {
    const token = localStorage.getItem("userTokenLG");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/usuario/${userId}/portadas`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching portadas for user ${userId}:`, error);
      return []; 
    }
  };

  const fetchImagenFijaUsuarioSeleccionado = async (userId) => {
    const token = localStorage.getItem("userTokenLG");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/usuario/${userId}/imagen-fija`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.image; 
    } catch (error) {
      console.error(`Error fetching imagen fija for user ${userId}:`, error);
      return null; 
    }
  };


  const openModalShare = async (taskId) => {
    const token = localStorage.getItem("userTokenLG");
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${taskId}/shared-users/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSharedUsers(response.data);
      setModalOpenShare(true);
    } catch (error) {
      console.error("Error al obtener usuarios que compartieron la tarea:", error);
    }
  };

  const toggleMostrarUsuarios = () => {
    setMostrarUsuarios(prevState => !prevState);
    if (usuarioSeleccionado) {

      cargarFavoritosPerfilesUsuarioSeleccionado(usuarioSeleccionado);

    } else {
    }
  };

  const handleMostrarCompartidos = () => {
    setShowMyTasksOnly(prevState => !prevState);
    handleClose();
  };

  const toggleMostrarFavoritos = () => {
    setMostrarSoloFavoritos(!mostrarSoloFavoritos); 
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);  
  };

  const handleButtonClick = () => {
    if (mostrarUsuarios) {
      toggleFormulario(); 
    } else {
      openAddModal();  
    }
  };

  const toggleBuscar = () => {
    setMostrarBuscar(!mostrarBuscar);
  };


  const getTasksMios = async () => {
    const currentUserId = usuario.user.id;
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${currentUserId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });

      const allCategories = response.data.reduce((categories, task) => {
        const taskCategories = task.categories ? task.categories.split(",") : [];
        return [...categories, ...taskCategories.map(cat => cat.trim())];
      }, []);

      const uniqueCategories = [...new Set(allCategories)]; // Elimina duplicados

      setPredefinedCategories(uniqueCategories); 
      console.log("Tareas del usuario:", response.data);
      console.log("Categorías únicas:", uniqueCategories);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getTasksUsuarioSeleccionado = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasksUserSelect/${userId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      console.log("vamos a ver que categorias hay aqui ", response);

      const allCategories = response.data.reduce((categories, task) => {
        const taskCategories = task.categories ? task.categories.split(",") : [];
        return [...categories, ...taskCategories.map(cat => cat.trim())];
      }, []);

      const uniqueCategories = [...new Set(allCategories)]; 
      setPredefinedCategoriesUserSelect(uniqueCategories);

      console.log("Tareas del usuario seleccionado:", response.data);
      console.log("Categorías únicas del usuario seleccionado:", uniqueCategories);
    } catch (error) {
      console.error('Error fetching tasks for selected user:', error);
    }
  };


  const seleccionarUsuario = async (userId, username) => {
    const tareasUsuario = tasks.filter((task) => task.user === userId);

    const allCategories = tareasUsuario.reduce((categories, task) => {
      const taskCategories = task.categories ? task.categories.split(",") : [];
      return [...categories, ...taskCategories.map(cat => cat.trim())];
    }, []);

    const uniqueCategories = [...new Set(allCategories)];
    setPredefinedCategoriesUserSelect(uniqueCategories);

    setUsuarioSeleccionado(userId); 
    setPeticionajena(userId);
    setNameUserSelect(username);
    try {
      const portadasSeleccionado = await fetchPortadasUsuarioSeleccionado(userId);
      const imagenFijaSeleccionado = await fetchImagenFijaUsuarioSeleccionado(userId);
      await getTasksUsuarioSeleccionado(userId);

      setPortadasUsuarioSeleccionado(portadasSeleccionado);
      setImagenFijaUsuarioSeleccionado(imagenFijaSeleccionado);


    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const cargarFavoritosUsuarioSeleccionado = async (userId) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get(`http://127.0.0.1:8000/api/favoritos/listar/${userId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const favoritosIdsUsuarioSeleccionado = response.data; 
      console.log("Tareas favoritas del usuario seleccionado cargadas:", favoritosIdsUsuarioSeleccionado);
      setFavoritosUsuarioSeleccionado(favoritosIdsUsuarioSeleccionado);
    } catch (error) {
      console.error('Error al cargar los favoritos del usuario seleccionado:', error);
    }
  };

  const cargarFavoritosPerfilesUsuarioSeleccionado = async (userId) => {
    console.log("no es cierto no funciona verdad o si ?");

    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get(`http://127.0.0.1:8000/api/pfavoritos/listar/${userId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const perfilesFavoritos = response.data.map(favorito => favorito.id);
      setFavoritosPerfilesUsuarioSeleccionado(perfilesFavoritos); 
      console.log("Perfiles favoritos del usuario seleccionado:", perfilesFavoritos);
    } catch (error) {
      console.error('Error al cargar los perfiles favoritos del usuario seleccionado:', error);
    }
  };


  const restartTutorial = () => {
    
    setJoyrideState((prevState) => ({
      ...prevState,
      run: false, 
    }));

    setJoyrideState((prevState) => ({
      ...prevState,
      run: true, 
      stepIndex: 0, 
    }));
  };

  const handleToggleLink = (subtaskId) => {
    setShowLink(prevState => ({
      ...prevState,
      [subtaskId]: !prevState[subtaskId]
    }));
  };

  return (
    <div style={{ backgroundColor: backgroundColor, minHeight: '100vh' }}>

      <ReactJoyride
        steps={joyrideState.steps}
        run={joyrideState.run}
        continuous={true}
        showSkipButton={true}
        disableScrolling={true} 
        scrollOffset={100}
        floaterProps={{
          wrapperClass: 'react-joyride__beacon-container'
        }}
        styles={{
          options: {
            zIndex: 10000,
          },
          beacon: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 10100,
          },
        }}
      />


      <div className={'search-container'}>
        <FontAwesomeIcon
          className="search-container-icon"
          icon={faSearch}
          onClick={toggleBuscar}
        />
        {mostrarBuscar && (
          <div className="buscarCategoria2">
            <input
              className="buscarCategoria2Input"
              placeholder="Buscar por categoría, usuario o título..."
              type="text"
              value={combinedSearchTerm}
              onChange={(e) => setCombinedSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="buscarCategoria">
        <div>
          <div className="portada-modal">
            <PortadaModal
              isOpen={isModalOpen}
              onRequestClose={() => setModalOpen(false)}
              fetchPortadas={fetchPortadas}
              fetchImagenFija={fetchImagenFija}
              imagenFija={usuarioSeleccionado ? imagenFijaUsuarioSeleccionado : imagenFija}
              portadas={usuarioSeleccionado ? portadasUsuarioSeleccionado : portadas} 
              usuarioSeleccionado={usuarioSeleccionado}
              restartTutorial={restartTutorial}
            />
          </div>

        </div>
      </div>

      <div className="mantener" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 200 }}>

      </div>

      <div style={{ paddingTop: "0px" }}>
        <div className={"whatpetition"}>
          <div className="iconspch" style={{ paddingTop: "84px" }}>
            <div className="iconpchMensaje" onClick={() => navigateToUserMesseges(usuario.user.id)}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>

            <div className="iconpchUsers" onClick={() => navigateToUserForum(usuario.user.id)}>
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>

          <div className="perfilHeart" onClick={() => handleLikeToggle(usuario.user.id)}>
            <FontAwesomeIcon
              style={{ color: hasLiked ? "54afff" : "white" }}
              icon={faHeart}
            />
          </div>

          <div>
            <div style={{ fontSize: "1.6em", marginTop: "-9px" }} onClick={() => obtenerLikes(usuario.user.id)}>
              {perfilLikesCount}
            </div>
          </div>

          <div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Lista de Likes"
            >
              <h2>Usuarios que dieron Like</h2>
              <ul>
                {likes.map((user) => (
                  <div key={user.id} className="user-info-container">
                    <div className="user-info">

                      <div className="user-image-container">
                        {user.user_image && user.user_image !== "No image available" ? (
                          <img src={getMediaUrl(user.user_image)} alt="Usuario" className="user-circle-image" />
                        ) : (
                          <div className="user-icon-placeholder">
                            <FontAwesomeIcon
                              icon={faUser}
                              style={{ color: "grey", cursor: "pointer" }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="user-details">
                        <div className="username-info">{user.username}</div>
                      </div>


                      <div className="LikeHeart">
                        <div className="likes-count-info">{user.likes_count}</div>

                        <FontAwesomeIcon icon={faHeart} style={{ color: "grey", cursor: "pointer" }} />
                      </div>

                    </div>


                  </div>

                ))}
              </ul>
            </Modal>
          </div>

          <div className="tema-buttons">
            <button
              onClick={() => setTema("consejos")}
              className="tema-button"
              style={{
                display: tema === "consejos" ? "none" : "block",
                backgroundColor: "transparent",
                color: tema === "consejos" ? "white" : "black", 
              }}
            >
              <div className="palabra">
                {tema === "consejos" ? "Consejos" : "consejos"}
              </div>
            </button>

            <button
              onClick={() => setTema("peticiones")}
              className="tema-button"
              style={{
                display: tema === "peticiones" ? "none" : "block",
                backgroundColor: "transparent", 
              }}
            >
              <div className="palabra">
                {tema === "peticiones" ? "Peticiones" : "peticiones"}
              </div>
            </button>

            <button
              onClick={() => setTema("historias")}
              className="tema-button"
              style={{
                display: tema === "historias" ? "none" : "block",
                backgroundColor: "transparent", 
                color: tema === "consejos" ? "rgb(188, 224, 253)" : "black", 
              }}
            >
              <div className="palabra">
                {tema === "historias" ? "Historias" : "historias"}
              </div>
            </button>
          </div>





          <div>
            <h1>{usuarioSeleccionado ? nameUserSelect : user.username}</h1>
          </div>

          <div
            className="nombreFondo"
            style={{
              color: tema === "consejos" ? "#bce0fd" : "black",
            }}
          >
            {tema}
          </div>


          <Modal
            isOpen={isAddModalOpen}
            onRequestClose={closeAddModal}
            contentLabel="Agregar Nueva Tarea"
          >
            <div>

              <div className="c">
                <div className="titulo-principal">Titutlo Principal</div>
                <div>
                  <input type="text" onChange={(e) => translateText(e.target.value)} />
                </div>
                <p style={{ paddingLeft: "15px", paddingRight: "15px" }}>{translatedText}</p>
              </div>

              <div>
                <div>
                  <div>
                    {masTasks.map((task, index) => (
                      <div key={index}>
                        <div className="contenedor-consejo">
                          <div className="titulo-consejo">{tema}</div>
                          <div>
                            <input
                              type="file"
                              id={`fileInput-${index}`}
                              name="file"
                              onChange={(e) => handleFileChangee(index, e)}
                              accept="image/*,video/*"
                              style={{ display: 'none' }}
                            />
                            <label htmlFor={`fileInput-${index}`} className="imagenIcon">
                              <FontAwesomeIcon icon={faImage} /> 
                            </label>
                          </div>
                        </div>

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
                        <div>
                          {task.imagePreview && (
                            <img src={getMediaUrl(task.imagePreview)} alt="Preview" style={{ height: "100px", width: "100px" }} />
                          )}
                          {task.videoPreview && (
                            <video src={task.videoPreview} controls style={{ width: '250px' }} />
                          )}
                        </div>

                        <div>
                          <input
                            type="url"
                            name="link"
                            value={task.link}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Paste link here"
                          />
                          {task.link && <LinkPreview url={task.link} />}
                        </div>

                        <div className="botonesAddPCH">
                          <button onClick={addTaskForm}>
                            <FontAwesomeIcon icon={faPlus} className="faPlus" />
                          </button>
                          <button onClick={() => removeTask(index)}>
                            <FontAwesomeIcon icon={faMinus} className="faMinus" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {masFactores.map((task, index) => (
                      <div key={index}>
                        <div className="contenedor-factor">
                          <div className="titulo-factor">Factor</div>
                          <div>
                            <input
                              type="file"
                              id={`fileInputtFactor-${index}`}
                              name="fileeFactor"
                              onChange={(e) => handlePostFileChangeFactor(index, e)}
                              accept="image/*,video/*"
                              style={{ display: 'none' }}
                            />
                            <label htmlFor={`fileInputtFactor-${index}`} className="imagenIcon">
                              <FontAwesomeIcon icon={faImage} />
                            </label>
                          </div>
                        </div>

                        <input
                          type="text"
                          name="title"
                          value={task.title}
                          onChange={(e) => handleInputChangeFactores(index, e)}
                          placeholder="Title Factor"
                        />
                        <textarea
                          name="description"
                          value={task.description}
                          onChange={(e) => handleInputChangeFactores(index, e)}
                          placeholder="Description Factor"
                        />
                        <div>
                          {task.imagePreview && (
                            <img src={getMediaUrl(task.imagePreview)} alt="Preview" style={{ height: "100px", width: "100px" }} />
                          )}
                          {task.videoPreview && (
                            <video src={task.videoPreview} controls style={{ width: '250px' }} />
                          )}
                        </div>

                        <div>
                          <input
                            type="url"
                            name="link"
                            value={task.link}
                            onChange={(e) => handleInputChangeFactores(index, e)}
                            placeholder="Paste Link Here"
                          />
                          {task.link && <LinkPreview url={task.link} />}
                        </div>

                        <div className="botonesAddPCH">
                          <button onClick={addFactorForm}>
                            <FontAwesomeIcon icon={faPlus} className="faPlus" />
                          </button>
                          <button onClick={() => removeTask(index)}  >
                            <FontAwesomeIcon icon={faMinus} className="faMinus" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {masFuentes.map((task, index) => (
                      <div key={index}>
                        <div className="contenedor-fuente">
                          <div className="titulo-fuente">Fuente</div>
                          <div>
                            <input
                              type="file"
                              id={`fileInputtFuentes-${index}`}
                              name="filee"
                              onChange={(e) => handlePostFileChangeFuente(index, e)}
                              accept="image/*,video/*"
                              style={{ display: 'none' }}
                            />
                            <label htmlFor={`fileInputtFuentes-${index}`} className="imagenIcon">
                              <FontAwesomeIcon icon={faImage} />
                            </label>
                          </div>
                        </div>

                        <input
                          type="text"
                          name="title"
                          value={task.title}
                          onChange={(e) => handleInputChangeFuentes(index, e)}
                          placeholder="Title Fuente"
                        />
                        <textarea
                          name="description"
                          value={task.description}
                          onChange={(e) => handleInputChangeFuentes(index, e)}
                          placeholder="Description Fuente"
                        />
                        <div>
                          {task.imagePreview && (
                            <img src={getMediaUrl(task.imagePreview)} alt="Preview" style={{ height: "100px", width: "100px" }} />
                          )}
                          {task.videoPreview && (
                            <video src={task.videoPreview} controls style={{ width: '250px' }} />
                          )}
                        </div>

                        <div>
                          <input
                            type="url"
                            name="link"
                            value={task.link}
                            onChange={(e) => handleInputChangeFuentes(index, e)}
                            placeholder="Paste link here"
                          />
                          {task.link && <LinkPreview url={task.link} />}
                        </div>

                        <div className="botonesAddPCH">
                          <button onClick={addFuenteForm}>
                            <FontAwesomeIcon icon={faPlus} className="faPlus" />
                          </button>
                          <button onClick={() => removeTask(index)}>
                            <FontAwesomeIcon icon={faMinus} className="faMinus" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="SelectCategoria">Selecciona Tus Categorias</div>

            <div className="categoriaBorder">
              <Select
                isMulti
                name="colors"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
                value={selectedCategoriess}
                styles={{ border: "3px solid black" }}
              />
            </div>

            <input
              type="text"
              value={hashtags}
              style={{ borderRadius: "50px" }}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="O Crea Tus categorias"
            />
            <div className="separarComa">Separalas por coma,</div>

            <div>
              <div
                className="btnAgregar"
                onClick={() => addOrEditTienda()}
              >
                Agregar
              </div>

            </div>
          </Modal>
        </div>

        <CategoriesMenu
          style={{
            color: tema === "consejos" ? "rgb(84, 175, 255)" : "black"
          }}
          className="category-menu" onCategorySelected={setSelectedCategory} tema={tema} />

        {showMyTasksOnly && (
          <div className="category-menu" style={{
            color: tema === "consejos" ? "rgb(84, 175, 255)" : "black"
          }}>
            <div className="horizontal-scroll" >
              <ul>
                {predefinedCategories.map((cat, index) => (
                  <li key={index} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}


        {usuarioSeleccionado && (
          <div className="category-menu" style={{
            color: tema === "consejos" ? "#3bce0fd" : "black", marginTop: "11px"
          }}>
            <div className="horizontal-scroll">
              <ul>
                {predefinedCategoriesUserSelect.map((cat, index) => (
                  <li key={index} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}



        {/* <ChatAssistant /> */}

        <div className="botonesAbajo">
          <div
            className="btnAgregar"
            onClick={handleButtonClick}
            style={{
              color: tema === "consejos" ? "#bce0fd" : "black", // Color de texto
            }}
          >
            Agregar
          </div>
          <div className="iconGlobal" onClick={toggleMostrarUsuarios}>
            <FontAwesomeIcon icon={mostrarUsuarios ? faUsers : faGlobe} />
          </div>
          <div>
            <TaskFilterMenu tema={tema} setSoloFavoritosTareas={setSoloFavoritosTareas} mostrarSoloFavoritos={mostrarSoloFavoritos} cargarFavoritosPerfilesUsuarioSeleccionado={cargarFavoritosPerfilesUsuarioSeleccionado} cargarFavoritosUsuarioSeleccionado={cargarFavoritosUsuarioSeleccionado} usuarioSeleccionado={usuarioSeleccionado} mostrarSoloFavoritosUsuarioSeleccionado={mostrarSoloFavoritosUsuarioSeleccionado} setMostrarSoloFavoritosUsuarioSeleccionado={setMostrarSoloFavoritosUsuarioSeleccionado} soloFavoritosTareas={soloFavoritosTareas} mostrarUsuarios={mostrarUsuarios} setFiltro={setFiltro} handleMostrarCompartidos={handleMostrarCompartidos} showMyTasksOnly={showMyTasksOnly} toggleMostrarFavoritos={toggleMostrarFavoritos} />
          </div>
        </div>

        {peticionajena && (
          <button onClick={() => {
            setPeticionajena(""); // Deseleccionar el usuario
            setUsuarioSeleccionado(null); // Establecer que no hay usuario seleccionado
            setPortadasUsuarioSeleccionado([]); // Limpiar portadas del usuario seleccionado
            setImagenFijaUsuarioSeleccionado(null); // Limpiar imagen fija del usuario seleccionado
          }}>
            Ver todas las tareas
          </button>
        )}


        <div className="contenido-pagin">
          {mostrarUsuarios ? (
            <PerfilesP cargarFavoritosPerfilesUsuarioSeleccionado={cargarFavoritosPerfilesUsuarioSeleccionado} mostrarUsuarios={mostrarUsuarios} favoritosPerfilesUsuarioSeleccionado={favoritosPerfilesUsuarioSeleccionado} usuarioSeleccionado={usuarioSeleccionado} mostrarFormulario={mostrarFormulario} mostrarSoloFavoritos={mostrarSoloFavoritos} selectedCategory={selectedCategory} combinedSearchTerm={combinedSearchTerm} />  // Renderiza el componente PerfilesP si se selecciona "ver usuarios"
          ) : (
            filteredTasks
              .filter(link => link.task.pch === tema) // Filtrar solo las tareas que coinciden con el tema
              .filter(link =>
                selectedCategory === "Todas las categorías" ||
                link.task.categories.split(',').some(cat => cat.trim() === selectedCategory)
              )
              .filter(link => {
                if (usuarioSeleccionado) {
                  return true; // No filtramos por peticionajena, seguimos adelante
                }
                return !peticionajena || link.task.user === peticionajena;
              })
              .filter(link =>
                !showMyTasksOnly || link.task.user === usuario.user.id || link.shared_by === usuario.user.username
              )
              .filter(link => {
                if (usuarioSeleccionado) {
                  if (mostrarSoloFavoritosUsuarioSeleccionado) {
                    return favoritosUsuarioSeleccionado.includes(link.task.id);
                  } else {
                    return link.task.user === usuarioSeleccionado;
                  }
                }
                if (soloFavoritosTareas) {
                  return tareasFavoritosIds.includes(link.task.id);
                }
                return true;
              })
              .sort((a, b) => {
                if (filtro === "fecha") {
                  return new Date(b.task.created_at) - new Date(a.task.created_at); // Ordenar por fecha de creación
                } else {
                  return b.task.likes_count - a.task.likes_count; // Ordenar por popularidad (número de likes)
                }
              })
              .map((link) => {
                const task = link.task;
                const isShared = !!link.shared_by;

                return (
                  <div key={task.id} style={{ borderRadius: "10px" }} className="comment">
                    <div
                      className="contentt"
                      key={task.id}
                      style={{ marginRight: "0px", width: "100vw" }}
                    >
                      <div className="lineaaa" style={{ backgroundColor: "black", height: "5px", marginLeft: "-100px" }}></div>
                      <div className="redondear" style={{ paddin: "6px" }}>
                        <div className="hole">
                          <div className="usuario"
                            onClick={() => seleccionarUsuario(task.user, task.username)}
                          >

                            <div className="user-infoImage">
                              <div className="image-container">
                                {task.user_image && task.user_image !== "No image available" ? (
                                  <img src={getMediaUrl(task.user_image)} alt="Imag" className="circle-image" ></img>
                                ) : (
                                  <div className="user-infoImageIcon">
                                    <FontAwesomeIcon
                                      icon={faUser}
                                      style={{
                                        color: "grey",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="username">
                                {task.username}
                              </div>
                            </div>

                          </div>
                          <div className="iconsPch">
                            <div className="icon1">
                              <div className="material-iconis" z-index="1">
                                <div
                                  className="perfilFavorito"
                                  onClick={() => handleLikeToggle(task.user)}
                                >
                                  <FontAwesomeIcon
                                    icon={faHeart}
                                    style={{
                                      color: favoritosIds.includes(task.user) ? 'black' : 'white',
                                      cursor: 'pointer',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="icon2" style={{ position: "relative" }}>
                              <div className="menuPCH">
                                <Button
                                  aria-controls={`simple-menu-${task.id}`}
                                  aria-haspopup="true"
                                  onClick={(event) => handleClickMenu(event, task.id)}
                                >
                                  <div className="iconBarraPch"><FontAwesomeIcon icon={faBars} /></div>
                                </Button>
                                <Menu
                                  id={`simple-menu-${task.id}`}
                                  anchorEl={anchorEl[task.id]}
                                  keepMounted
                                  open={Boolean(anchorEl[task.id])}
                                  onClose={() => handleClose(task.id)}
                                >
                                  <MenuItem onClick={() => navigateToUserMesseges(task.user)}><FontAwesomeIcon icon={faEnvelope} /></MenuItem>
                                  <MenuItem onClick={() => navigateToUserForum(task.user)}><FontAwesomeIcon icon={faUsers} /></MenuItem>
                                  <MenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavoritoTarea(task.id);
                                    handleClose(task.id);
                                  }}>
                                    <FontAwesomeIcon
                                      icon={faHeart}
                                      style={{
                                        color: tareasFavoritosIds.includes(task.id) ? 'red' : 'grey',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  </MenuItem>
                                  {usuario.user.id === task.user ? (
                                    <MenuItem onClick={() => handleDelete(task.id)}><FontAwesomeIcon icon={faTrash} /></MenuItem>
                                  ) : null}
                                  <MenuItem><FontAwesomeIcon icon={faPen} style={{ color: "black" }} /></MenuItem>
                                </Menu>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="section-buttons">
                          <button
                            className={`section-button ${visibleSections[task.id] === 'subtasks' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange(task.id, 'subtasks')}
                          >
                            {tema}
                          </button>
                          <button
                            className={`section-button ${visibleSections[task.id] === 'subFactores' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange(task.id, 'subFactores')}
                          >
                            Factores
                          </button>
                          <button
                            className={`section-button ${visibleSections[task.id] === 'subFuentes' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange(task.id, 'subFuentes')}
                          >
                            Fuentes
                          </button>
                        </div>

                        <div className="textol" onClick={() => juntarTraduccion(task.description)}>
                          {mostrar ? (
                            task.description === juntar ? (
                              <div className="titulo1"> {task.description}</div>
                            ) : null
                          ) : null}
                          <div className="titulo2" style={{
                            color: tema === "consejos" ? "white" : "black"
                          }}>{task.title}</div>
                        </div>

                        {task.video && (
                          <video controls className="testimonial-video">
                            <source src={getMediaUrl(task.video)} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {task.image && (
                          <img src={getMediaUrl(task.image)} alt="Imagen" onClick={() => imageSelect(task.image)} className="imagenPeticion" style={{ height: "100px", width: "100px" }} />
                        )}
                        {visibleSections[task.id] === 'subtasks' && (
                          <div className="subtasks-container">
                            {task.subtasks.map(subtask => (
                              <div key={subtask.id} className="subtask">
                                <TextoConVerMas title={subtask.title} description={subtask.description} />

                                {subtask.image ? (
                                  <img src={getMediaUrl(subtask.image)} className="imagePch" alt="Subtask" />
                                ) : (
                                  subtask.link && subtask.link.trim() !== "" && subtask.link !== "undefined" && (
                                    <div className="moldeando">
                                      <LinkPreview url={subtask.link} />
                                      <button onClick={() => handleToggleLink(subtask.id)}>Ocultar link</button>
                                    </div>
                                  )
                                )}

                                {subtask.video && (
                                  <video controls className="testimonial-video">
                                    <source src={getMediaUrl(subtask.video)} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                )}

                                {subtask.link && subtask.link.trim() !== "" && subtask.link !== "undefined" && subtask.image && (
                                  <div className="moldeando">
                                    {!showLink[subtask.id] ? (
                                      <button onClick={() => handleToggleLink(subtask.id)}>Ver link</button>
                                    ) : (
                                      <div>
                                        <LinkPreview url={subtask.link} />
                                        <button onClick={() => handleToggleLink(subtask.id)}>Ocultar link</button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {visibleSections[task.id] === 'subFactores' && (
                          <div className="subtasks-container">
                            <div className="subtasks-container-sub">
                              {task.subfactores.map(subfactor => (
                                <div key={subfactor.id} className="subtask">
                                  <TextoConVerMas title={subfactor.title} description={subfactor.description} />

                                  {subfactor.image ? (
                                    <img src={getMediaUrl(subfactor.image)} className="imagePch" alt="Subfactor" />
                                  ) : (
                                    subfactor.link && subfactor.link.trim() !== "" && subfactor.link !== "undefined" && (
                                      <div className="moldeando">
                                        <LinkPreview url={subfactor.link} />
                                        <button onClick={() => handleToggleLink(subfactor.id)}>Ocultar link</button>
                                      </div>
                                    )
                                  )}

                                  {subfactor.video && (
                                    <video controls className="testimonial-video">
                                      <source src={getMediaUrl(subfactor.video)} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  )}

                                  {subfactor.link && subfactor.link.trim() !== "" && subfactor.link !== "undefined" && subfactor.image && (
                                    <div className="moldeando">
                                      {!showLink[subfactor.id] ? (
                                        <button onClick={() => handleToggleLink(subfactor.id)}>Ver link</button>
                                      ) : (
                                        <div>
                                          <LinkPreview url={subfactor.link} />
                                          {/* <button onClick={() => handleToggleLink(subfactor.id)}>Ocultar link</button> */}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {visibleSections[task.id] === 'subFuentes' && (
                          <div className="subtasks-container">
                            <div className="subtasks-container-sub">
                              {task.subfuentes.map(subfuente => (
                                <div key={subfuente.id} className="subtask">
                                  <TextoConVerMas title={subfuente.title} description={subfuente.description} tema={tema} />

                                  {subfuente.image ? (
                                    <img src={getMediaUrl(subfuente.image)} className="imagePch" alt="Subfuente" />
                                  ) : (
                                    subfuente.link && subfuente.link.trim() !== "" && subfuente.link !== "undefined" && (
                                      <div className="moldeando">
                                        <LinkPreview url={subfuente.link} />
                                        {/* <button onClick={() => handleToggleLink(subfuente.id)}>Ocultar link</button> */}
                                      </div>
                                    )
                                  )}

                                  {subfuente.video && (
                                    <video controls className="testimonial-video">
                                      <source src={getMediaUrl(subfuente.video)} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  )}

                                  {subfuente.link && subfuente.link.trim() !== "" && subfuente.link !== "undefined" && subfuente.image && (
                                    <div className="moldeando">
                                      {!showLink[subfuente.id] ? (
                                        <button onClick={() => handleToggleLink(subfuente.id)}>Ver link</button>
                                      ) : (
                                        <div>
                                          <LinkPreview url={subfuente.link} />
                                          {/* <button onClick={() => handleToggleLink(subfuente.id)}>Ocultar link</button> */}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="categoriasPCH">
                          {task.categories}
                        </div>

                        <Modal
                          isOpen={isModalOpen}
                          onRequestClose={() => setModalOpen(false)}
                          contentLabel="Usuarios que dieron like"
                        >
                          <h2>Usuarios que dieron "like" a la tarea:</h2>
                          <ul>
                            {listUsers.map(user => (
                              <div key={user.id} onClick={() => setPeticionajena(user.id)}>
                                <div className="user-info">

                                  <div className="user-image-container">
                                    {user.user_image && user.user_image !== "No image available" ? (
                                      <img src={getMediaUrl(user.user_image)} alt="Usuario" className="user-circle-image" />
                                    ) : (
                                      <div className="user-icon-placeholder">
                                        <FontAwesomeIcon
                                          icon={faUser}
                                          style={{ color: "grey", cursor: "pointer" }}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="user-details">
                                    <div className="username-info">{user.username}</div>
                                  </div>


                                  <div className="LikeHeart">
                                    <div className="likes-count-info">{user.likes_count}</div>

                                    <FontAwesomeIcon icon={faHeart} style={{ color: "grey", cursor: "pointer" }} />
                                  </div>

                                </div>

                              </div>
                            ))}
                          </ul>
                          <button onClick={() => setModalOpen(false)}>Cerrar</button>
                        </Modal>

                        <Modal
                          isOpen={isModalOpenImage}
                          onRequestClose={() => setModalOpenImage(false)}
                          contentLabel="Usuarios que dieron like"
                          style={{ padding: "0px !important " }}
                        >
                          <h2> </h2>
                          <img src={getMediaUrl(imagen)} alt="Imagen" onClick={() => setModalOpenImage(false)} className="imagenPeticionModel" />
                          <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
                        </Modal>

                        <div className="line-down">
                          <div className="likes">
                            <div style={{ padding: "5px" }} onClick={() => navigateToPeticionPost(task.id)}>
                              <div
                                className={`nlink ${selected ? 'nlink-selected' : ''}`}  // Clase condicional
                                style={{ color: "white" }}
                                onClick={handleClick}
                              >
                                Responder
                              </div>
                            </div>

                            <div className="like">
                              <div className="like_cantidad" onClick={() => handleListUsers(task)}>{task.likes_count}</div>
                              <div onClick={() => handleUpdate(task)}>
                                <FontAwesomeIcon
                                  style={{ color: task.userHasLiked ? "54afff" : "white" }}
                                  icon={faHeart}
                                />
                              </div>
                            </div>
                            <div className="megusta">
                              <div className="compartir">
                                <div className="compartirNumero" onClick={() => openModalShare(task.id)}>
                                  {task.share_count}
                                </div>
                                <div>
                                  {isModalOpenShare && (
                                    <Modal isOpen={isModalOpenShare} onRequestClose={() => setModalOpenShare(false)}>
                                      <h2>Usuarios que compartieron la tarea</h2>
                                      {sharedUsers.length > 0 ? (
                                        <ul>
                                          {sharedUsers.map(user => (
                                            <div className="user-info" key={user.id}>

                                              <div className="user-image-container">
                                                {user.user_image && user.user_image !== "No image available" ? (
                                                  <img src={getMediaUrl(user.user_image)} alt="Usuario" className="user-circle-image" />
                                                ) : (
                                                  <div className="user-icon-placeholder">
                                                    <FontAwesomeIcon
                                                      icon={faUser}
                                                      style={{ color: "grey", cursor: "pointer" }}
                                                    />
                                                  </div>
                                                )}
                                              </div>

                                              <div className="user-details">
                                                <div className="username-info">{user.username}</div>
                                              </div>


                                              <div className="LikeHeart">
                                                <div className="likes-count-info">{user.likes_count}</div>

                                                <FontAwesomeIcon icon={faHeart} style={{ color: "grey", cursor: "pointer" }} />
                                              </div>

                                            </div>

                                          ))}
                                        </ul>
                                      ) : (
                                        <p>No se encontraron usuarios que hayan compartido esta tarea.</p>
                                      )}
                                      <button onClick={() => setModalOpenShare(false)}>Cerrar</button>
                                    </Modal>
                                  )}
                                </div>
                                <div className="compartirIcon" onClick={() => handleShare(task)}>
                                  <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
<div className="shared-byName">
  {(() => {
    const sharedByList = link.shared_by_list || [];

console.log("👤 usuario actual:", usuario.user && usuario.user.username);
console.log("👤 peticionajena:", peticionajena);

const yoComparti = sharedByList.some(u => u.username === (usuario.user && usuario.user.username));

if (peticionajena === (usuario.user && usuario.user.username) && yoComparti) {
  return "Tú";
}


    const personaComparti = sharedByList.find(u => u.username === peticionajena);
    if (personaComparti) {
      console.log("✅ Coincide con usuario ajeno:", personaComparti.username);
      return personaComparti.username;
    }

    if (sharedByList.length > 0) {
      const ultimo = sharedByList[sharedByList.length - 1].username;
      console.log("🕵️ Mostrando el último:", ultimo);
      return ultimo;
    }

    console.log("❌ Nada que mostrar");
    return null;
  })()}
</div>

                    {isShared ? (
                      <div className="shared-by">
                    {/* <div className="shared-byName">
  {Array.isArray(link.shared_by_list) && link.shared_by_list.length > 0 ? (
    <ul>
      {link.shared_by_list.map((user, index) => (
        <li key={index}>{user.username}</li>
      ))}
    </ul>
  ) : (
    <span>No compartido por nadie.</span>
  )}
</div> */}


                        <div className="shared-byName">"algo minimo "{link.shared_by}</div>
                      </div>
                    ) : null}

  <button onClick={() => setMostrarModal(true)} className="shared-byName-btn">
    Ver quién lo compartió
  </button>
  {mostrarModal && (
    <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Usuarios que compartieron</h3>
        {Array.isArray(link.shared_by_list) && link.shared_by_list.length > 0 ? (
          <ul>
            {link.shared_by_list.map((user, index) => (
              <li key={index}>{user.username}</li>
            ))}
          </ul>
        ) : (
          <p>No hay usuarios.</p>
        )}
        <button onClick={() => setMostrarModal(false)}>Cerrar</button>
      </div>
    </div>
  )}
                  </div>
                );
              })
          )}
        </div>
      </div >

    </div >
  );
};

function mapStateToProps(state) {
  return {
    user: state.auth.user, // Mapea el estado del usuario desde Redux
    subscriptionStatus: state.auth.subscriptionStatus, // Mapea el estado de suscripción desde Redux
  };
}

export default connect(mapStateToProps)(Peticiones);