
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import "../owenscss/traductor.scss";
import "../owenscss/portadaStyle.scss";
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
import SharedTaskModal from "./SharedTaskModal";
import { useGetFeedQuery, useCreateTaskMutation } from './feed/FeedApi';
import ReactJoyride from 'react-joyride';

// ---------------------------
// Componente Peticiones - inicio
// ---------------------------
const Peticiones = (props) => {
  // ---------------------------
  // Router / Redux hooks
  // ---------------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const location = useLocation();
  // const params = useParams();

  // si usas connect recibirás props.user; también usamos useSelector en muchas partes
  const reduxUser = useSelector((state) => state.auth.user);
  const reduxSubscriptionStatus = useSelector((state) => state.auth.subscriptionStatus);

  // preferencia: props (connect) > redux hook
  const user = props.user || reduxUser;
  const subscriptionStatus = props.subscriptionStatus || reduxSubscriptionStatus;

  // RTK Query feed (si existe)
// const { data: feed = [], isLoading, isError, refetch } = useGetFeedQuery();
const [createTask] = useCreateTaskMutation();
  // ---------------------------
  // Hooks - estados (todos top-level)
  // ---------------------------
  // UI / selection
  const [selectedTask, setSelectedTask] = useState(null);
  // const [filter, setFilter] = useState("all");

  // Modales
  const [isPortadaModalOpen, setIsPortadaModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenImage, setModalOpenImage] = useState(false);
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isModalOpenShare, setModalOpenShare] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Search / filtro
  const [combinedSearchTerm, setCombinedSearchTerm] = useState('');
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);
  const [tema, setTema] = useState("consejos");
  const [selectedCategory, setSelectedCategory] = useState("Todas las categorías");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoriess, setSelectedCategoriess] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [filtro, setFiltro] = useState("popularidad");
  const [mostrarBuscar, setMostrarBuscar] = useState(false);

  // Usuario y perfiles
  const [usuario, setUsuario] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nameUserSelect, setNameUserSelect] = useState('');
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Tasks, feed y normalizados
  const [tasks, setTasks] = useState([]);
  // const [data, setData] = useState([]);
  // const [normalizedTasks, setNormalizedTasks] = useState([]);
  // const [sharedTasks, setSharedTasks] = useState(null);
  // const [tasksArrayStateMarker, setTasksArrayStateMarker] = useState(null); // placeholder if you need
const [categories, setCategories] = useState([]);
const [likes, setLikes] = useState([]); 
const [peticionajena, setPeticionajena] = useState(null); 
  // Formulario de creación
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

  // Favoritos & likes
  const [favoritos, setFavoritos] = useState([]);
  const [pchFavoritos, setPchFavoritos] = useState([]);
  const [favoritosUsuarioSeleccionado, setFavoritosUsuarioSeleccionado] = useState([]);
  const [favoritosPerfilesUsuarioSeleccionado, setFavoritosPerfilesUsuarioSeleccionado] = useState([]);
  const [mostrarSoloFavoritosUsuarioSeleccionado, setMostrarSoloFavoritosUsuarioSeleccionado] = useState(false);
  const [tareasFavoritosIds, setTareasFavoritosIds] = useState([]); // derived, but keep for clarity
  const [perfilLikesCount, setPerfilLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Portadas / imagen fija
  const [portadas, setPortadas] = useState([]);
  const [imagenFija, setImagenFija] = useState(null);
  const [portadasUsuarioSeleccionado, setPortadasUsuarioSeleccionado] = useState([]);
  const [imagenFijaUsuarioSeleccionado, setImagenFijaUsuarioSeleccionado] = useState(null);

  // Shared users / lists
  const [sharedUsers, setSharedUsers] = useState([]);
  const [listUsers, setListUsers] = useState([]);

  // UI extras
  const [visibleSections, setVisibleSections] = useState({});
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [soloFavoritosTareas, setSoloFavoritosTareas] = useState(false);
  const [predefinedCategories, setPredefinedCategories] = useState([]);
  const [predefinedCategoriesUserSelect, setPredefinedCategoriesUserSelect] = useState([]);
  const [showLink, setShowLink] = useState({});
  const [imagen, setImagen] = useState("");
  // const [selected, setSelected] = useState(false);
  const [anchorEl, setAnchorEl] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [normal, setNormal] = useState("");
  // const [juntar, setJuntar] = useState("");
  // const [mostrar, setMostrar] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);
  const [dataa, setDataa] = useState("");
  const [filterLocal, setFilterLocal] = useState(null); // placeholder if needed

  // Joyride (tutorial)
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

  // ---------------------------
  // Derived values / small helpers
  // ---------------------------
  // const tasksArrayFromFeed = tasksArray; 

  // Preferencia: id list of favoritos de perfiles
  const favoritosIds = favoritos.map(favorito => favorito.id) || [];

  // placeholder derived
  const tareasFavoritosIdsDerived = pchFavoritos.map(id => id);
  // keep also in state if code uses tareasFavoritosIds variable name:
  const tareasFavoritosIdsVar = tareasFavoritosIdsDerived;


const PAGE_SIZE = 3;
const [offset, setOffset] = useState(0);
const [items, setItems] = useState([]);        // Lista de tareas que se van acumulando
const [page, setPage] = useState(null);        // Página actual devuelta por el backend
const [isFetching, setIsFetching] = useState(false);
const [canLoadMore, setCanLoadMore] = useState(true);
const loadingRef = useRef(false);  // evita cargas duplicadas
const sentinelRef = useRef(null);

// RTK query con params
// const { data: page, isLoading, isFetching, isError } = useGetFeedQuery({ limit: PAGE_SIZE, offset });



// const canLoadMore = !!page?.next;
// arriba, con otros hooks
const loaderRef = useRef(null);
// evita disparos dobles si el observer llama muy seguido
// const requestingMoreRef = useRef(false);
// const allowAutoLoadRef = useRef(true);
const lastScrollYRef = useRef(0);
const scrollRootRef = useRef(null);
// const seenIdsRef = useRef(new Set());
// const ioRef = useRef(null);

const loadMore = useCallback(() => {
  if (loadingRef.current) return;
  if (isFetching || !canLoadMore) return;
  loadingRef.current = true;
  setOffset(o => o + PAGE_SIZE);
}, [isFetching, canLoadMore]);

// Cuando cambia `isFetching`, se libera el bloqueo
useEffect(() => {
  if (!isFetching) loadingRef.current = false;
}, [isFetching]);


useEffect(() => {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  });
  const currentSentinel = sentinelRef.current;
  if (currentSentinel) {
    observer.observe(currentSentinel);
  }
  return () => {
    if (currentSentinel) {
      observer.unobserve(currentSentinel);
    }
  };
}, [loadMore]);





// useEffect(() => {
//   if (!isFetching && canLoadMore && ioRef.current && loaderRef.current) {
//     ioRef.current.observe(loaderRef.current);
//   }
// }, [isFetching, canLoadMore]);


 const feedWithLike = useMemo(() => {
   const uid = dataa;
   const liked = (task, userId) =>
     task?.like_set?.some((l) => l?.user?.id === userId) ?? false;
   const base = Array.isArray(items) ? items : [];
   return base.map((t) => ({ ...t, userHasLiked: liked(t, uid) }));
 }, [items, dataa]);




  // ---------------------------
  // Effects
  // ---------------------------

  // Log feed when ready
  // useEffect(() => {
  //   if (!isLoading && feedData) {
  //     console.log("Feed cargado:", feedData);
  //   }
  // }, [isLoading, feedData]);
useEffect(() => {
  // Montaje: obtén usuario una sola vez
  addOrEditTiendaa();
}, []); // <-- vacío

  // Inicialización: fetchUserDetails + favoritos + pchFavoritos
  useEffect(() => {
    fetchUserDetails();
    cargarFavoritos();
    cargarFavoritosDeTareas();
    // NOTE: not passing dependencies on purpose to run once on mount like original
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When tasks change, set default visible sections
  useEffect(() => {
    const defaultVisibleSections = tasks.reduce((acc, task) => {
      acc[task.id] = 'subtasks';
      return acc;
    }, {});
    setVisibleSections(defaultVisibleSections);
  }, [tasks]);

  // When usuario changes, fetch profile-related data
  useEffect(() => {
    console.log("Estado de usuario:", usuario);
    if (usuario && usuario.user && usuario.user.id) {
      obtenerLikesPerfil();
      fetchPortadas();
      fetchImagenFija();
    }
  }, [usuario]);

// Cuando YA tienes dataa, entonces cargas demás datos
useEffect(() => {
  if (!dataa) return;         // sin id? no hagas nada
  // getTasks();
  // fetchData();
  cargarFavoritos();
  // getTasksMios();
}, [dataa]);

  // load categories once
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
  const el = scrollRootRef.current;
  if (!el) return;

 const onScroll = () => {
   // si más adelante lo usas para algo, lo conservas:
   lastScrollYRef.current = el.scrollTop;
 };
  el.addEventListener('scroll', onScroll, { passive: true });
  return () => el.removeEventListener('scroll', onScroll);
}, []);



useEffect(() => { console.log('page', page); }, [page]);

useEffect(() => {
  if (!page?.items) return;
  setItems(prev => {
    const seen = new Set(prev.map(t => t.id));
    const merged = [...prev];
    for (const it of page.items) if (!seen.has(it.id)) merged.push(it);
    return merged;
  });
}, [page]);


useEffect(() => {
  const fetchPage = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("userTokenLG");
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/feed/?limit=${PAGE_SIZE}&offset=${offset}`,
        { headers: { Authorization: `Token ${token}` } }
      );

      // DRF: usa `results`; si no existe, cae a `items` o a array “plano”
      const pageItems = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];

      if (offset === 0) {
        setItems(pageItems);
      } else {
        setItems(prev => [...prev, ...pageItems]);
      }

      // Normaliza `page` a un shape uniforme
      setPage({
        items: pageItems,
        next: data?.next ?? null,
        prev: data?.prev ?? data?.previous ?? null,
        count: data?.count ?? pageItems.length,
      });

      setCanLoadMore(Boolean(data?.next));
    } catch (error) {
      console.error("Error al cargar feed:", error);
    } finally {
      setIsFetching(false);
    }
  };

  fetchPage();
}, [offset]);

useEffect(() => {
  if (usuario?.user?.id) getTasksMios();
}, [usuario?.user?.id]);

useEffect(() => {
  if (!Array.isArray(items)) return;
  setVisibleSections(prev => {
    const next = { ...prev };
    items.forEach(it => {
      if (!(it.id in next)) next[it.id] = 'subtasks';
    });
    return next;
  });
}, [items]);

useEffect(() => {
  return () => {
    [masTasks, masFactores, masFuentes].flat().forEach(t => {
      if (t?.imagePreview?.startsWith('blob:')) URL.revokeObjectURL(t.imagePreview);
      if (t?.videoPreview?.startsWith('blob:')) URL.revokeObjectURL(t.videoPreview);
    });
  };
}, []);

//   useEffect(() => {
//   if (Array.isArray(feed)) setTasks(feed);
// }, [feed]);

  // ---------------------------
  // Helpers / API wrappers / handlers
  // ---------------------------
// const getMediaUrl = (path) => {
//   if (!path) return '';
//   if (path.startsWith('http') || path.startsWith('blob:')) return path;
//   return `http://127.0.0.1:8000${path}`;
// };


  const openShareModal = (task) => {
    setSelectedTask(task);
    setIsShareModalOpen(true);
  };

  // const handleClick = () => {
  //   setSelected(!selected);
  // };
  const [selectedReplyId, setSelectedReplyId] = useState(null);

  const handleSectionChange = (taskId, section) => {
    setVisibleSections(prevSections => ({
      ...prevSections,
      [taskId]: section
    }));
  };

  const navigateToUserMesseges = (userId) => {
    navigate(`/dashboard/direcmassaging/${userId}`);
  };

  const navigateToUserForum = (userId) => {
    navigate(`/dashboard/newcommunity/${userId}`);
  };

  const navigateToPeticionPost = (peticionId) => {
    navigate(`/dashboard/newpeticionesPost/${peticionId}`);
  };

  // ---------- Favoritos (perfiles) ----------
  const cargarFavoritos = async () => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get('http://127.0.0.1:8000/api/pfavoritos/listar/', {
        headers: { Authorization: `Token ${token}` },
      });
      setFavoritos(response.data);
      console.log("Perfiles favoritos:", response.data);
      const currentUserId = usuario?.user?.id;
      const userHasLiked = response.data.some(like => like.id === currentUserId);
      console.log("Usuario actual:", currentUserId, "Ha dado like:", userHasLiked);
      setHasLiked(userHasLiked);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  // ---------- Favoritos (tareas) ----------
  const cargarFavoritosDeTareas = async () => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get('http://127.0.0.1:8000/api/favoritos/listar/', {
        headers: { Authorization: `Token ${token}` },
      });

      const favoritosIdss = Array.isArray(response.data)
        ? response.data.map(favorito => favorito.task.id)
        : [];

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

  // ---------- Tasks CRUD / fetch ----------
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
  };

  const getTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setTasks(response.data);
      // setData(response.data);
      console.log("tareas con el sharedby", response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
      // setData(updatedTasks);
      setItems(prev => prev.filter(t => t.id !== id));
      handleClose(null);
      // fetchData();
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

    const manualCategories = hashtags.split(',').map(c => c.trim()).filter(Boolean);
    const allCategories = [...selectedCategories, ...manualCategories];
    formData.append('categories', allCategories.join(','));

    masTasks.forEach((task, index) => {
      formData.append(`subtasks[${index}][title]`, task.title);
      formData.append(`subtasks[${index}][description]`, task.description);
      formData.append(`subtasks[${index}][link]`, task.link || '');
      if (task.image) formData.append(`subtasks[${index}][image]`, task.image, task.image.name);
      if (task.video) formData.append(`subtasks[${index}][video]`, task.video, task.video.name);
    });

    masFactores.forEach((task, index) => {
      formData.append(`subfactores[${index}][title]`, task.title);
      formData.append(`subfactores[${index}][description]`, task.description);
      formData.append(`subfactores[${index}][link]`, task.link || '');
      if (task.image) formData.append(`subfactores[${index}][image]`, task.image, task.image.name);
      if (task.video) formData.append(`subfactores[${index}][video]`, task.video, task.video.name);
    });

    masFuentes.forEach((task, index) => {
      formData.append(`subfuentes[${index}][title]`, task.title);
      formData.append(`subfuentes[${index}][description]`, task.description);
      formData.append(`subfuentes[${index}][link]`, task.link || '');
      if (task.image) formData.append(`subfuentes[${index}][image]`, task.image, task.image.name);
      if (task.video) formData.append(`subfuentes[${index}][video]`, task.video, task.video.name);
    });

    // 1) Crear la tarea (optimistic update la verás al instante)
    const res = await createTask({ userId: dataa, formData }).unwrap();

    // 2) (Opcional) Registrar el share con axios si quieres mantener tu contador
    await axios.post(
      'http://127.0.0.1:8000/api/shared-tasks/',
      { task_id: res.id },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem('userTokenLG')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setIsAddModalOpen(false);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};


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

  // const juntarTraduccion = (a) => {
  //   setJuntar(a);
  //   setMostrar(!mostrar);
  // };

  // ---------- Likes helpers ----------


const tasksWithLikeInfo = tasks.map(task => ({
  ...task,
  userHasLiked: userHasLikedTask(task, dataa)
}));


  const imageSelect = (image) => {
    setModalOpenImage(true);
    setImagen(image);
  };

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
      cargarFavoritos();
      handleLike(perfilId);
    } catch (error) {
      console.error('Error al manejar favoritos:', error);
    }
  };

  // ---------- Select helpers ----------
  const options = categories.map(cat => ({ value: cat.id, label: cat.name }));

  const handleChange = (selectedOptions) => {
    const selectedCategoryNames = selectedOptions.map(option => option.label);
    setSelectedCategories(selectedCategoryNames);
    setSelectedCategoriess(selectedOptions);
  };

  // ---------- File inputs for add form ----------
  const handleFileChangee = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
     // revoca previas anteriores
 const prev = masTasks[index];
 if (prev?.imagePreview?.startsWith('blob:')) URL.revokeObjectURL(prev.imagePreview);
 if (prev?.videoPreview?.startsWith('blob:')) URL.revokeObjectURL(prev.videoPreview);

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

  // ---------- Debugging / logs ----------
  useEffect(() => {
    console.log("Información del usuario:", user);
    console.log("Estado de la suscripción:", subscriptionStatus);
  }, [user, subscriptionStatus]);

  // ---------- fetchUserDetails ----------
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

  // ---------- obtenerLikesPerfil ----------
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

      const currentUserId = usuario?.user?.id;
      const userHasLiked = res.data.some(like => like.id === currentUserId);
      console.log("aver", currentUserId, "userHasLiked", userHasLiked);

    } catch (error) {
      console.error('Error al obtener los likes del perfil:', error);
    }
  };

  // ---------- handleLike ----------
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

  // If usuario not loaded yet, keep old behavior (original)
  // if (!usuario) {
  //   return <div>Cargando...</div>;
  // }

  // ---------- Menu anchor handlers ----------
  const handleClickMenu = (event, taskId) => {
    setAnchorEl(prevState => ({ ...prevState, [taskId]: event.currentTarget }));
  };

  const handleClose = (taskId) => {
    setAnchorEl(prevState => ({ ...prevState, [taskId]: null }));
  };

  // ---------- Background color (UI) ----------
  const backgroundColor = tema === "consejos" ? '#324c56' : tema === "peticiones" ? 'rgb(183 233 248)' : '#FFFFFF';

  // const closeModal = () => setModalIsOpen(false);

  const obtenerLikes = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/profiles/${userId}/likes/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setLikes(res.data);
      setIsLikesModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- file change handlers for factores / fuentes ----------
  const handlePostFileChangeFuente = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

     const prev = masFuentes[index];
 if (prev?.imagePreview?.startsWith('blob:')) URL.revokeObjectURL(prev.imagePreview);
 if (prev?.videoPreview?.startsWith('blob:')) URL.revokeObjectURL(prev.videoPreview);

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

     const prev = masFactores[index];
 if (prev?.imagePreview?.startsWith('blob:')) URL.revokeObjectURL(prev.imagePreview);
 if (prev?.videoPreview?.startsWith('blob:')) URL.revokeObjectURL(prev.videoPreview);


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

// const fetchData = async () => {
//   try {
//     const response = await axios.get("http://127.0.0.1:8000/api/feed/", {
//       headers: {
//         Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
//       },
//     });

//     const clean = (arr) =>
//       (arr || []).map((i) => ({
//         ...i,
//         link: i.link === "undefined" ? "" : i.link,
//       }));

//     const cleanTasks = response.data.map((task) => ({
//       ...task,
//       subtasks: clean(task.subtasks),
//       subfactores: clean(task.subfactores),
//       subfuentes: clean(task.subfuentes),
//     }));

//     setTasks(cleanTasks);
//     console.log("📌 Tareas cargadas:", cleanTasks);
//   } catch (err) {
//     console.error("Error fetching tasks:", err);
//   }
// };


  // ---------- removeTask (for add form) ----------
  const removeTask = (indexToRemove) => {
    setMasTasks((prevTasks) => prevTasks.filter((_, index) => index !== indexToRemove));
  };

  // ---------- filteredTasks (based on RTK feed tasksArray) ----------
// helper para saber si el usuario actual likeó la tarea
function userHasLikedTask(task, userId) {
  return task.like_set && task.like_set.some(like => like.user.id === userId);
}

// helpers/derivados como HOOKS, no detrás de un return condicional
// const feedWithLike = useMemo(() => {
//   const uid = dataa;
//   const liked = (task, userId) =>
//     task.like_set && task.like_set.some((l) => l.user.id === userId);
//   return (feed || []).map((t) => ({ ...t, userHasLiked: liked(t, uid) }));
// }, [feed, dataa]);

const filteredTasks = useMemo(() => {
   const list = Array.isArray(feedWithLike) ? feedWithLike : [];
   const searchLower = (combinedSearchTerm || "").trim().toLowerCase();
   const selCatLower = (selectedCategory || "").toLowerCase();

  return list.filter((task) => {
    const cats = task.categories
      ? task.categories.split(",").map((c) => c.trim().toLowerCase())
      : [];
    const username = (task.username || "").toLowerCase();
    const title = (task.title || "").toLowerCase();

    const categoryMatch =
      selectedCategory === "Todas las categorías" || cats.includes(selCatLower);

    const searchMatch =
      username.includes(searchLower) || title.includes(searchLower);

    const peticionAjenaMatch = !peticionajena || task.user === peticionajena;
const temaMatch = task.pch === tema;
    return categoryMatch && searchMatch && peticionAjenaMatch && temaMatch;
  });
}, [feedWithLike, selectedCategory, combinedSearchTerm, peticionajena]);

  // ---------- portadas / imagen fija fetch ----------
  const fetchPortadas = async () => {
    console.log("portadas nomas");
    const token = localStorage.getItem("userTokenLG");

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/portada/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setPortadas(response.data);
      console.log("portadas", response.data);
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
          Authorization: `Token ${token}`,
        },
      });
      setImagenFija(response.data.image);
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
        },
      });
      return response.data.image;
    } catch (error) {
      console.error(`Error fetching imagen fija for user ${userId}:`, error);
      return null;
    }
  };

  // ---------- open modal share (shared users list) ----------
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

  // ---------- toggles / UI ----------
  const toggleMostrarUsuarios = () => {
    setMostrarUsuarios(prevState => !prevState);
    if (usuarioSeleccionado) {
      cargarFavoritosPerfilesUsuarioSeleccionado(usuarioSeleccionado);
    } else {
      // no-op (kept for parity with original)
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
      setIsAddModalOpen(true);
    }
  };

  const toggleBuscar = () => {
    setMostrarBuscar(!mostrarBuscar);
  };

const getTasksMios = async () => {
  const currentUserId = usuario?.user?.id;
  if (!currentUserId) return;

  try {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/tasks/${currentUserId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    });

    // Normalizamos la respuesta para que siempre sea un array
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.tasks)
          ? data.tasks
          : (data && typeof data === 'object')
            ? [data] // si llega un objeto único, lo envolvemos
            : [];

    if (!Array.isArray(list)) {
      console.warn("getTasksMios: respuesta inesperada:", data);
      return;
    }

    const allCategories = list.reduce((acc, task) => {
      const cats = task?.categories ? task.categories.split(",").map(c => c.trim()).filter(Boolean) : [];
      return acc.concat(cats);
    }, []);

    const uniqueCategories = [...new Set(allCategories)];
    setPredefinedCategories(uniqueCategories);

    console.log("Tareas del usuario:", list);
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


  setUsuarioSeleccionado(userId);
  setPeticionajena(userId);
  setNameUserSelect(username);

  try {
    const portadasSeleccionado = await fetchPortadasUsuarioSeleccionado(userId);
    const imagenFijaSeleccionado = await fetchImagenFijaUsuarioSeleccionado(userId);
    await getTasksUsuarioSeleccionado(userId); // <— aquí ya calculas categorías con la respuesta

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



const safeItems = Array.isArray(items) ? items : [];

// helpers arriba del componente (o dentro, antes del return)
const cleanVal = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (s === "undefined" || s === "null" || s === "No image available" || s === "") return null;
  return s;
};

const first = (...vals) => vals.find(Boolean) || null;

const getFirstImage = (link) => {
  const subImgs =
    (link?.subtasks || []).map(s => cleanVal(s.image))
    .concat((link?.subfactores || []).map(s => cleanVal(s.image)))
    .concat((link?.subfuentes || []).map(s => cleanVal(s.image)));

  return first(
    cleanVal(link?.image),
    cleanVal(link?.image_url),
    cleanVal(link?.task?.image),
    cleanVal(link?.task?.image_url),
    ...subImgs
  );
};

const getFirstVideo = (link) => {
  const subVids =
    (link?.subtasks || []).map(s => cleanVal(s.video))
    .concat((link?.subfactores || []).map(s => cleanVal(s.video)))
    .concat((link?.subfuentes || []).map(s => cleanVal(s.video)));

  return first(
    cleanVal(link?.video),
    cleanVal(link?.task?.video),
    ...subVids
  );
};


  const handleListUsers = async (task) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const { data } = await axios.get(`http://127.0.0.1:8000/api/tasks/${task.id}/likes/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setListUsers(Array.isArray(data) ? data : []);
      setModalOpen(true);
    } catch (err) {
      console.error('Error al listar usuarios que dieron like:', err);
    }
  };

  const handleUpdate = async (task) => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const { data } = await axios.post(`http://127.0.0.1:8000/api/tasks/${task.id}/like/`, {}, {
        headers: { Authorization: `Token ${token}` },
      });
      setItems(prev => prev.map(t => {
        if (t.id !== task.id) return t;
        const likes_count = typeof data?.likes_count === 'number'
          ? data.likes_count
          : (t.userHasLiked ? t.likes_count - 1 : t.likes_count + 1);
        return { ...t, userHasLiked: !t.userHasLiked, likes_count };
      }));
    } catch (err) {
      console.error('Error al dar/retirar like:', err);
    }
  };




const toSrc = (path) => {
  const p = cleanVal(path);
  if (!p) return "";
  if (p.startsWith("blob:") || p.startsWith("data:") || /^https?:\/\//i.test(p)) return p;
  return `http://127.0.0.1:8000${p.startsWith("/") ? p : `/${p}`}`;
};









return (
  <div style={{ backgroundColor: backgroundColor, minHeight: '100vh' }}>
    {!usuario ? (
      <div>Cargando...</div>
    ) : (
      <div>
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
            isOpen={isPortadaModalOpen}
            onRequestClose={() => setIsPortadaModalOpen(false)}
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

    <div className="mantener" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 200 }} />

    <div className={"importante-separedor"} style={{ paddingTop: "0px" }}>
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
            style={{ color: hasLiked ? "#54afff" : "white" }}
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
            isOpen={isLikesModalOpen}
            onRequestClose={() => setIsLikesModalOpen(false)}
            contentLabel="Lista de Likes"
          >
            <h2>Usuarios que dieron Like</h2>
            <ul>
              {likes.map((user) => (
                <div key={user.id} className="user-info-container">
                  <div className="user-info">

                    <div className="user-image-container">
                      {user.user_image && user.user_image !== "No image available" ? (
                        <img src={toSrc(user.user_image)} alt="Usuario" className="user-circle-image" />
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
            onRequestClose={() => setIsAddModalOpen(false)}
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
                            <img src={toSrc(task.imagePreview)} alt="Preview" style={{ height: "100px", width: "100px" }} />
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
                            <img src={toSrc(task.imagePreview)} alt="Preview" style={{ height: "100px", width: "100px" }} />
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
                            <img src={toSrc(task.imagePreview)} alt="Preview" style={{ height: "100px", width: "100px" }} />
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
  options={options}
  value={selectedCategoriess}
  onChange={handleChange}
  classNamePrefix="select"
  styles={{
    control: (base) => ({ ...base, border: '3px solid black', borderRadius: 12 }),
  }}
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

            <div className="contenido-pagin" ref={scrollRootRef} style={{ overflowY: 'auto', maxHeight: '93vh' }}>
          {mostrarUsuarios ? (
            <PerfilesP
              cargarFavoritosPerfilesUsuarioSeleccionado={cargarFavoritosPerfilesUsuarioSeleccionado}
              mostrarUsuarios={mostrarUsuarios}
              favoritosPerfilesUsuarioSeleccionado={favoritosPerfilesUsuarioSeleccionado}
              usuarioSeleccionado={usuarioSeleccionado}
              mostrarFormulario={mostrarFormulario}
              mostrarSoloFavoritos={mostrarSoloFavoritos}
              selectedCategory={selectedCategory}
              combinedSearchTerm={combinedSearchTerm}
            />
          ) : (
            filteredTasks
              .filter(link => {
                if (usuarioSeleccionado) {
                  return true; // No filtramos por peticionajena si hay usuario seleccionado
                }
                return !peticionajena || link.user === peticionajena;
              })
              .filter(link =>
                !showMyTasksOnly || link.user === usuario.user.id || link.shared_by === usuario.user.username
              )
              .filter(link => {
                if (usuarioSeleccionado) {
                  if (mostrarSoloFavoritosUsuarioSeleccionado) {
                    return favoritosUsuarioSeleccionado.includes(link.id);
                  } else {
                    return link.user === usuarioSeleccionado;
                  }
                }
                if (soloFavoritosTareas) {
                  return pchFavoritos.includes(link.id);
                }
                return true;
              })
              .sort((a, b) => {
                if (filtro === "fecha") {
                  return new Date(b.created_at) - new Date(a.created_at);
                } else {
                  return b.likes_count - a.likes_count;
                }
              })
              .map(link => {
                const isShared = !!link.shared_by;

const imagePath = getFirstImage(link);
const videoPath = getFirstVideo(link);

                return (
                  <div key={link.id} style={{ borderRadius: "10px" }} className="comment" >
                    <div className="contentt" style={{ marginRight: "0px", width: "100vw" }}>
                      <div className="lineaaa" style={{ backgroundColor: "black", height: "5px", marginLeft: "-100px" }}></div>
                      <div className="redondear" style={{ padding: "6px" }}>
                        <div className="hole">
                          <div className="usuario" onClick={() => seleccionarUsuario(link.user, link.username)}>
                            <div className="user-infoImage">
                              <div className="image-container">
                                {link.user_image && link.user_image !== "No image available" ? (
                                  <img src={toSrc(link.user_image)} alt="Imag" className="circle-image" />
                                ) : (
                                  <div className="user-infoImageIcon">
                                    <FontAwesomeIcon icon={faUser} style={{ color: "grey", cursor: "pointer" }} />
                                  </div>
                                )}
                              </div>
                              <div className="username">{link.username}</div>
                            </div>
                          </div>

                          <div className="iconsPch">
                            <div className="icon1">
                          <div className="material-iconis" style={{ zIndex: 1 }}>
                                <div
                                  className="perfilFavorito"
                                  onClick={() => handleLikeToggle(link.user)}
                                >
                                  <FontAwesomeIcon
                                    icon={faHeart}
                                    style={{
                                      color: favoritosIds.includes(link.user) ? 'black' : 'white',
                                      cursor: 'pointer',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="icon2" style={{ position: "relative" }}>
                              <div className="menuPCH">
                                <Button
                                  aria-controls={`simple-menu-${link.id}`}
                                  aria-haspopup="true"
                                  onClick={(event) => handleClickMenu(event, link.id)}
                                >
                                  <div className="iconBarraPch"><FontAwesomeIcon icon={faBars} /></div>
                                </Button>
                                <Menu
                                  id={`simple-menu-${link.id}`}
                                  anchorEl={anchorEl[link.id]}
                                  keepMounted
                                  open={Boolean(anchorEl[link.id])}
                                  onClose={() => handleClose(link.id)}
                                >
                                  <MenuItem onClick={() => navigateToUserMesseges(link.user)}><FontAwesomeIcon icon={faEnvelope} /></MenuItem>
                                  <MenuItem onClick={() => navigateToUserForum(link.user)}><FontAwesomeIcon icon={faUsers} /></MenuItem>
                                  <MenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFavoritoTarea(link.id);
                                      handleClose(link.id);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faHeart}
                                      style={{
                                        color: pchFavoritos.includes(link.id) ? 'red' : 'grey',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  </MenuItem>
                                  {usuario.user.id === link.user ? (
                                    <MenuItem onClick={() => handleDelete(link.id)}><FontAwesomeIcon icon={faTrash} /></MenuItem>
                                  ) : null}
                                  <MenuItem><FontAwesomeIcon icon={faPen} style={{ color: "black" }} /></MenuItem>
                                </Menu>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="section-buttons">
                          <button
                            className={`section-button ${visibleSections[link.id] === 'subtasks' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange(link.id, 'subtasks')}
                          >
                            {tema}
                          </button>
                          <button
                            className={`section-button ${visibleSections[link.id] === 'subFactores' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange(link.id, 'subFactores')}
                          >
                            Factores
                          </button>
                          <button
                            className={`section-button ${visibleSections[link.id] === 'subFuentes' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange(link.id, 'subFuentes')}
                          >
                            Fuentes
                          </button>
                        </div>

                        <div className="textol" onClick={() => toggleExpand(link.id)}>
                          {expandedId === link.id ? ( <div className="titulo1">{link.description}</div> ) : null}
                          <div className="titulo2" style={{ color: tema === "consejos" ? "white" : "black" }}>
                            {link.title}
                          </div>
                        </div>

                   {videoPath && (
  <video controls className="testimonial-video" src={toSrc(videoPath)} />
)}

{imagePath && (
  <img
    src={toSrc(imagePath)}
    alt="Imagen"
    onClick={() => imageSelect(imagePath)}
    className="imagenPeticion"
    style={{ height: 100, width: 100 }}
    onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/placeholder.png'; // pon aquí tu placeholder estático
      }}
  />
)}


                        {/* Subtasks */}
                        {visibleSections[link.id] === 'subtasks' && (
                          <div className="subtasks-container">
                            {(link.subtasks ?? []).map(subtask => (
                              <div key={subtask.id} className="subtask">
                                <TextoConVerMas title={subtask.title} description={subtask.description} />

                                {subtask.image ? (
                                  <img src={toSrc(subtask.image)} className="imagePch" alt="Subtask" />
                                ) : subtask.link && subtask.link.trim() !== "" && subtask.link !== "undefined" ? (
                                  <div className="moldeando">
                                    <LinkPreview url={subtask.link} />
                                    <button onClick={() => handleToggleLink(subtask.id)}>Ocultar link</button>
                                  </div>
                                ) : null}

                                {subtask.video  && (
                                  <video controls className="testimonial-video">
                                    <source src={toSrc(subtask.video)} type="video/mp4" />
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

                        {/* SubFactores */}
                        {visibleSections[link.id] === 'subFactores' && (
                          <div className="subtasks-container">
                            <div className="subtasks-container-sub">
                              {(link.subfactores ?? []).map(subfactor => (
                                <div key={subfactor.id} className="subtask">
                                  <TextoConVerMas title={subfactor.title} description={subfactor.description} />

                                  {subfactor.image ? (
                                    <img src={toSrc(subfactor.image)} className="imagePch" alt="Subfactor" />
                                  ) : subfactor.link && subfactor.link.trim() !== "" && subfactor.link !== "undefined" ? (
                                    <div className="moldeando">
                                      <LinkPreview url={subfactor.link} />
                                      <button onClick={() => handleToggleLink(subfactor.id)}>Ocultar link</button>
                                    </div>
                                  ) : null}

                                  {subfactor.video  && (
                                    <video controls className="testimonial-video">
                                      <source src={toSrc(subfactor.video)} type="video/mp4" />
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
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SubFuentes */}
                        {visibleSections[link.id] === 'subFuentes' && (
                          <div className="subtasks-container">
                            <div className="subtasks-container-sub">
                              {(link.subfuentes ?? []).map(subfuente => (
                                <div key={subfuente.id} className="subtask">
                                  <TextoConVerMas title={subfuente.title} description={subfuente.description} tema={tema} />

                                  {subfuente.image ? (
                                    <img src={toSrc(subfuente.image)} className="imagePch" alt="Subfuente" />
                                  ) : subfuente.link && subfuente.link.trim() !== "" && subfuente.link !== "undefined" ? (
                                    <div className="moldeando">
                                      <LinkPreview url={subfuente.link} />
                                    </div>
                                  ) : null}

                                  {subfuente.video  && (
                                    <video controls className="testimonial-video">
                                      <source src={toSrc(subfuente.video)} type="video/mp4" />
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
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="categoriasPCH">{link.categories}</div>

                        {/* Modales */}
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
                                      <img src={toSrc(user.user_image)} alt="Usuario" className="user-circle-image" />
                                    ) : (
                                      <div className="user-icon-placeholder">
                                        <FontAwesomeIcon icon={faUser} style={{ color: "grey", cursor: "pointer" }} />
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
  contentLabel="Imagen"
>
  {imagen && (
    <img
      src={toSrc(imagen)}
      alt="Imagen"
      onClick={() => setModalOpenImage(false)}
      className="imagenPeticionModel"
    />
  )}
  <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
</Modal>

{/* debajo del Modal de likes/imagen, por ejemplo */}
<Modal
  isOpen={isModalOpenShare}
  onRequestClose={() => setModalOpenShare(false)}
  contentLabel="Usuarios que compartieron"
>
  <h2>Usuarios que compartieron</h2>
  <ul>
    {(sharedUsers || []).map(u => (
      <li key={u.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {u.user_image && u.user_image !== "No image available"
          ? <img src={toSrc(u.user_image)} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          : <FontAwesomeIcon icon={faUser} />}
        <span>{u.username}</span>
      </li>
    ))}
  </ul>
  <button onClick={() => setModalOpenShare(false)}>Cerrar</button>
</Modal>



                        <div className="line-down">
                          <div className="likes">
                            <div style={{ padding: "5px" }} onClick={() => navigateToPeticionPost(link.id)}>
                              <div   className={`nlink ${selectedReplyId === link.id ? 'nlink-selected' : ''}`}   onClick={() => setSelectedReplyId(prev => (prev === link.id ? null : link.id))} >
                                Responder
                              </div>
                            </div>

                            <div className="like">
                              <div className="like_cantidad" onClick={() => handleListUsers(link)}>{link.likes_count}</div>
                              <div onClick={() => handleUpdate(link)}>
                                <FontAwesomeIcon style={{ color: link.userHasLiked ? "#54afff" : "white" }} icon={faHeart} />
                              </div>
                            </div>

                            <div className="megusta">
                              <div className="compartir">
                                <div className="compartirNumero" onClick={() => openModalShare(link.id)}>{link.share_count}</div>
                                <div className="compartirIcon" onClick={() => openShareModal(link)}>
                                  <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="shared-byName">
                          {(() => {
                            const sharedByList = link.shared_by_list || [];

                            const yoComparti = sharedByList.some(u => u.username === (usuario.user && usuario.user.username));

                           if (yoComparti && peticionajena === usuario.user?.id) return "Tú";
                           const personaComparti = sharedByList.find(u => u.id === peticionajena);
                           
                            if (personaComparti) return personaComparti.username;

                            if (sharedByList.length > 0) {
                              const ultimo = sharedByList[sharedByList.length - 1];
                              return (
                                <div>
                                  <div>{ultimo.username}</div>
                                  <div className="shared-description">{ultimo.description}</div>
                                </div>
                              );
                            }

                            return null;
                          })()}
                        </div>

                        <SharedTaskModal
                          isOpen={isShareModalOpen}
                          taskId={selectedTask ? selectedTask.id : null}
                          onClose={() => setIsShareModalOpen(false)}
                          onShared={(nuevoShared) => console.log("Se compartió:", nuevoShared)}
                        />
                      </div>
                    </div>
                    </div>
                );
              })
          )}

  <div ref={loaderRef} style={{ height: 24 }} />
  {/* {canLoadMore && !isFetching && (
  <div style={{textAlign:'center', padding:12}}>
    <button onClick={loadMore}>Cargar más</button>
  </div>
)} */}

  <div ref={sentinelRef} style={{ height: '1px' }}></div>
{/* Opcional: pequeño estado visual */}
{/* {isFetching && <div style={{ textAlign:'center', padding: 12 }}>Cargando…</div>} */}
{!canLoadMore && <div style={{ textAlign:'center', padding: 12 }}>No hay más</div>}

            


        </div> 
      </div>


      </div>
      )}
    </div>
);

};



function mapStateToProps(state) {
  return {
    user: state.auth.user, // Mapea el estado del usuario desde Redux
    subscriptionStatus: state.auth.subscriptionStatus, // Mapea el estado de suscripción desde Redux
  };
}

export default connect(mapStateToProps)(Peticiones);