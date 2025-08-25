import React, { useState, useEffect } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faArrowRight, faBars, faTrash, faPen, faEnvelope, faUsers, faUser } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';
import axios from "axios";
import LinkPreview from "./archivos/LinkPreview";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "../../owenscss/traductor.scss";
import { Link, useHistory } from "react-router-dom";

const PeticionCard = ({ peticionId, openAddModal }) => {
    const [peticion, setPeticion] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpenImage, setModalOpenImage] = useState(false);
    const [isModalOpenShare, setModalOpenShare] = useState(false);
    const [listUsers, setListUsers] = useState([]);
    const [sharedUsers, setSharedUsers] = useState([]);
    const [imagen, setImagen] = useState("");
    const [visibleSection, setVisibleSection] = useState('subtasks');
    const [isMounted, setIsMounted] = useState(true);
    const [hasLiked, setHasLiked] = useState(false);
    const [anchorEl, setAnchorEl] = useState({});
    const [selected, setSelected] = useState(false);
    const [favoritos, setFavoritos] = useState([]);
    const [pchFavoritos, setPchFavoritos] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [showLink, setShowLink] = useState({});

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

        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchPeticion = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/tasks_by_id/${peticionId}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });

            if (isMounted && response.data) {
                const fetchedPeticion = response.data[0];
                setPeticion(fetchedPeticion);
            }

            console.log("Petición obtenida", response);

            console.log("veamos si tenemos userHasLiked", response);
        } catch (error) {
            console.error("Error fetching peticion:", error);
        }
    };


    useEffect(() => {
        fetchUserDetails();
        setIsMounted(true);
        cargarFavoritosDeTareas();
        fetchPeticion();
        return () => {
            setIsMounted(false);
        };
    }, [peticionId]);

    useEffect(() => {
        if (usuario) {
            cargarFavoritos(); // Carga los favoritos solo cuando hay usuario
        }
    }, [usuario]);

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
            const favoritosIdss = response.data.map(favorito => favorito.task.id); // Obtener los IDs de las tareas favoritas
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

    const tareasFavoritosIds = pchFavoritos.map(id => id); // Para tareas




    const handleLike = async () => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/tasks/${peticionId}/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                    },
                }
            );
            fetchPeticion();
        } catch (error) {
            console.error("Error liking peticion:", error);
        }
    };

    const handleListUsersWhoLiked = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${peticionId}/users_who_liked/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            setListUsers(response.data);
            setModalOpen(true);
        } catch (error) {
            console.error("Error fetching users who liked:", error);
        }
    };

    const handleShare = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/shared-tasks/',
                { task_id: peticionId },
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                    },
                }
            );
            fetchPeticion();
        } catch (error) {
            console.error("Error sharing peticion:", error);
        }
    };

    const handleListUsersWhoShared = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${peticionId}/shared-users/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            setSharedUsers(response.data);
            setModalOpenShare(true);
        } catch (error) {
            console.error("Error fetching users who shared:", error);
        }
    };

    const handleSectionChange = (section) => {
        setVisibleSection(section);
    };

    const imageSelect = (image) => {
        setImagen(image);
        setModalOpenImage(true);
    };

    if (!peticion) return <div>Loading...</div>;

    const handleUpdate = async (task) => {
        console.log("veamos que tiene la taspeticionks si es igual que la tasks ", task);
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            fetchPeticion();
        } catch (error) {
            console.error('Error updating task:', error.response);
        }
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
            cargarFavoritos(); // Actualiza la lista de favoritos después de agregar/eliminar
            handleLike(perfilId);

        } catch (error) {
            console.error('Error al manejar favoritos:', error);
        }
    };

    const handleClickMenu = (event, taskId) => {
        setAnchorEl(prevState => ({ ...prevState, [taskId]: event.currentTarget }));
    };

    const handleClose = (taskId) => {
        setAnchorEl(prevState => ({ ...prevState, [taskId]: null }));
    };

    const peticionWithLikeInfo = {
        ...peticion,
        userHasLiked: userHasLikedPeticion(peticion, usuario.user.id),
    };
    console.log("veamos la peticon con userhasliked", peticionWithLikeInfo)
    function userHasLikedPeticion(peticion, userId) {
        return peticion.like_set && peticion.like_set.some(like => like.user.id === userId);
    }

    const history = useHistory();

    const navigateToUserMesseges = (userId) => {
        history.push(`/dashboard/direcmassaging/${userId}`);
    };

    const navigateToUserForum = (userId) => {
        history.push(`/dashboard/newcommunity/${userId}`);
    };

    const handleToggleLink = (subtaskId) => {
        setShowLink(prevState => ({
            ...prevState,
            [subtaskId]: !prevState[subtaskId]
        }));
    };

    return (
        <div key={peticion.id} className="comment" style={{ borderRadius: "10px" }}>
            <div className="contentt" style={{ marginRight: "0px", width: "100vw" }}>
                <div className="redondear" style={{ padding: "6px" }}>
                    <div className="hole">
                        <div className="usuario" onClick={() => console.log("Usuario seleccionado:", peticion.user)}>
                            <div className="user-infoImage">
                                <div className="image-container">
                                    {peticion.user_image && peticion.user_image !== "No image available" ? (
                                        <img src={peticion.user_image} alt="Usuario" className="circle-image" />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} style={{ color: "grey", cursor: "pointer" }} />
                                    )}
                                </div>
                                <div className="nombreFecha">
                                    <div className="username">{peticion.username}</div>
                                    <div className="postDate">{moment(peticion.created_at).fromNow()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="iconsPch">
                            <div className="icon1">
                                <div className="material-iconis" z-index="1">
                                    <div
                                        className="perfilFavorito"
                                        onClick={() => handleLikeToggle(peticion.user)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            style={{
                                                color: favoritosIds.includes(peticion.user) ? 'black' : 'grey',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="icon2" style={{ position: "relative" }}>
                                <div className="menuPCH">
                                    <Button
                                        aria-controls={`simple-menu-${peticion.id}`}
                                        aria-haspopup="true"
                                        onClick={(event) => handleClickMenu(event, peticion.id)}
                                    >
                                        <div className="iconBarraPch"><FontAwesomeIcon icon={faBars} /></div>
                                    </Button>
                                    <Menu
                                        id={`simple-menu-${peticion.id}`}
                                        anchorEl={anchorEl[peticion.id]}
                                        keepMounted
                                        open={Boolean(anchorEl[peticion.id])}
                                        onClose={() => handleClose(peticion.id)}
                                    >
                                        <MenuItem onClick={() => navigateToUserMesseges(peticion.id)}><FontAwesomeIcon icon={faEnvelope} /></MenuItem>
                                        <MenuItem onClick={() => navigateToUserForum(peticion.id)}><FontAwesomeIcon icon={faUsers} /></MenuItem>
                                        <MenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFavoritoTarea(peticion.id);
                                            handleClose(peticion.id);
                                        }}>
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                style={{
                                                    color: tareasFavoritosIds.includes(peticion.id) ? 'red' : 'grey',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </MenuItem>
                                        {usuario.user.id === peticion.user ? (
                                            <MenuItem onClick={() => handleDelete(task.id)}><FontAwesomeIcon icon={faTrash} /></MenuItem>
                                        ) : null}
                                        <MenuItem><FontAwesomeIcon icon={faPen} style={{ color: "black" }} /></MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section-buttons">
                        <button className={`section-button ${visibleSection === 'subtasks' ? 'selected' : ''}`} onClick={() => handleSectionChange('subtasks')}>
                            Subtasks
                        </button>
                        <button className={`section-button ${visibleSection === 'subFactores' ? 'selected' : ''}`} onClick={() => handleSectionChange('subFactores')}>
                            Factores
                        </button>
                        <button className={`section-button ${visibleSection === 'subFuentes' ? 'selected' : ''}`} onClick={() => handleSectionChange('subFuentes')}>
                            Fuentes
                        </button>
                    </div>

                    <div className="textol" style={{ width: "100vw" }}>
                        <div className="titulo2" style={{ width: "333px" }}>{peticion.title}</div>
                        <div className="titulo1" style={{ width: "333px" }}>{peticion.description}</div>
                    </div>
                    <div className="tamanio" style={{ width: "350px" }}>
                        {peticion.video && (
                            <video controls className="testimonial-video">
                                <source src={peticion.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        {peticion.image && (
                            <img src={peticion.image} alt="Imagen" onClick={() => imageSelect(peticion.image)} className="imagenPeticion" style={{ height: "100px", width: "100px" }} />
                        )}
                        {visibleSection === 'subtasks' && peticion.subtasks.length > 0 && (
                            <div className="subtasks-container">
                                {peticion.subtasks.map(subtask => (
                                    <div key={subtask.id} className="subtask" style={{ width: "100vw" }}>
                                        <div className="titulo2">{subtask.title}</div>
                                        <div className="titulo1" >{subtask.description}</div>
                                        {subtask.link && subtask.link.trim() !== "" && subtask.link !== "undefined" && (
                                            <div>
                                                {!showLink[subtask.id] ? (
                                                    <button onClick={() => handleToggleLink(subtask.id)}>Ver link</button>
                                                ) : (
                                                    <div>
                                                        <LinkPreview url={subtask.link} style={{ width: "100vw" }} />
                                                        <button onClick={() => handleToggleLink(subtask.id)}>Ocultar link</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {subtask.image && <img src={subtask.image} alt="Subtask" className="imagePch" />}
                                        {subtask.video && (
                                            <video controls className="testimonial-video">
                                                <source src={subtask.video} type="video/mp4" />
                                            </video>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {visibleSection === 'subFactores' && peticion.subfactores.length > 0 && (
                            <div className="subtasks-container">
                                {peticion.subfactores.map(subfactor => (
                                    <div key={subfactor.id} className="subtask" style={{ width: "100vw" }}>
                                        <div className="titulo2" >{subfactor.title}</div>
                                        <div className="titulo1" >{subfactor.description}</div>
                                        {subfactor.link && subfactor.link.trim() !== "" && subfactor.link !== "undefined" && (
                                            <div>
                                                {!showLink[subfactor.id] ? (
                                                    <button onClick={() => handleToggleLink(subfactor.id)}>Ver link</button>
                                                ) : (
                                                    <div>
                                                        <LinkPreview url={subfactor.link} style={{ width: "100vw" }} />
                                                        <button onClick={() => handleToggleLink(subfactor.id)}>Ocultar link</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {subfactor.image && <img src={subfactor.image} alt="Subfactor" className="imagePch" />}
                                        {subfactor.video && (
                                            <video controls className="testimonial-video">
                                                <source src={subfactor.video} type="video/mp4" />
                                            </video>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {visibleSection === 'subFuentes' && peticion.subfuentes.length > 0 && (
                            <div className="subtasks-container">
                                {peticion.subfuentes.map(subfuente => (
                                    <div key={subfuente.id} className="subtask">
                                        <div className="titulo2" style={{ width: "333px" }}>{subfuente.title}</div>
                                        <div className="titulo1" style={{ width: "333px" }}>{subfuente.description}</div>
                                        {subfuente.link && subfuente.link.trim() !== "" && subfuente.link !== "undefined" && (
                                            <div>
                                                {!showLink[subfuente.id] ? (
                                                    <button onClick={() => handleToggleLink(subfuente.id)}>Ver link</button>
                                                ) : (
                                                    <div>
                                                        <LinkPreview url={subfuente.link} style={{ width: "100vw" }} />
                                                        <button onClick={() => handleToggleLink(subfuente.id)}>Ocultar link</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {subfuente.image && <img src={subfuente.image} alt="Subfuente" className="imagePch" />}
                                        {subfuente.video && (
                                            <video controls className="testimonial-video">
                                                <source src={subfuente.video} type="video/mp4" />
                                            </video>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="line-container">
                        <div className="interaction-container">
                            <div
                                className={`reply-link ${selected ? 'reply-link-selected' : ''}`}
                                style={{ color: "white", padding: "5px", display: "flex" }}
                                onClick={openAddModal}
                            >
                                Responder
                            </div>

                            <div className="like-container">
                                <div className="like-count" style={{ fontWeight: "400", marginTop: "2px" }} onClick={handleListUsersWhoLiked}>
                                    {peticion.likes_count}
                                </div>
                                <div onClick={() => handleUpdate(peticion)}>
                                    <FontAwesomeIcon
                                        style={{
                                            color: (
                                                peticion &&
                                                peticion.like_set &&
                                                usuario &&
                                                usuario.user &&
                                                peticion.like_set.some(like => like.user.id === usuario.user.id)
                                            ) ? "54afff" : "white"
                                        }}
                                        icon={faHeart}
                                    />
                                </div>
                            </div>

                            <div className="share-container">
                                <div className="share-count" style={{ fontWeight: "400", }} onClick={handleListUsersWhoShared}>
                                    {peticion.share_count}
                                </div>
                                <div className="share-icon" onClick={handleShare}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="lineaaa" style={{ backgroundColor: "black", height: "5px", marginLeft: "-100px", marginTop: "16px" }}></div>

                    <Modal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)} contentLabel="Usuarios que dieron like">
                        <h2>Usuarios que dieron "like" a esta aportación:</h2>
                        {listUsers.length > 0 ? (
                            <ul>
                                {listUsers.map(user => (
                                    <div className="user-info" key={user.id}>

                                        <div className="user-image-container">
                                            {user.user_image && user.user_image !== "No image available" ? (
                                                <img src={user.user_image} alt="Usuario" className="user-circle-image" />
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
                            <p>No se encontraron usuarios que dieron "like".</p>
                        )}
                        <button onClick={() => setModalOpen(false)}>Cerrar</button>
                    </Modal>

                    <Modal isOpen={isModalOpenShare} onRequestClose={() => setModalOpenShare(false)} contentLabel="Usuarios que compartieron">
                        <h2>Usuarios que compartieron esta aportación:</h2>
                        {sharedUsers.length > 0 ? (
                            <ul>
                                {sharedUsers.map(user => (
                                    <div className="user-info" key={user.id}>

                                        <div className="user-image-container">
                                            {user.user_image && user.user_image !== "No image available" ? (
                                                <img src={user.user_image} alt="Usuario" className="user-circle-image" />
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
                            <p>No se encontraron usuarios que compartieron.</p>
                        )}
                        <button onClick={() => setModalOpenShare(false)}>Cerrar</button>
                    </Modal>

                    <Modal isOpen={isModalOpenImage} onRequestClose={() => setModalOpenImage(false)} contentLabel="Imagen">
                        <img src={imagen} alt="Imagen" className="imagenPeticionModel" />
                        <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default PeticionCard;
