
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import NewPeticionComments from "./newPeticionComennt"; // Asegúrate de que este componente está bien importado
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faHeart, faTrash, faMinus, faPlus, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

// import SubtasksComponent from "./archivos/subtasksComponent";
// import CommentMediaComponent from "./archivos/CommentMediaComponent";
import Modal from 'react-modal';
// import { link } from "superagent";
import LinkPreview from "./archivos/LinkPreview";
import PeticionCard from "./peticionCard";

const NewPeticionPost = (props) => {
    const peticionId = props.match.params.peticionId;
    const [peticion, setPeticion] = useState(null);
    const [comments, setComments] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const [peticionajena, setPeticionajena] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [listUsers, setListUsers] = useState([]);
    const [isModalOpenImage, setModalOpenImage] = useState(false);
    const [imagen, setImagen] = useState(""); const [commentInput, setCommentInput] = useState("");
    const [isSelectTaskModalOpen, setSelectTaskModalOpen] = useState(false);
    const [aportacionSeleccionada, setAportacionSeleccionada] = useState(null);
    const toggleSelectTaskModal = () => setSelectTaskModalOpen(!isSelectTaskModalOpen);
    const [favoritosUsuario, setFavoritosUsuario] = useState([]);

    const getMediaUrl = (path) => {
  return path ? `http://127.0.0.1:8000${path}` : '';
};


    const handleSelectTask = (task) => {
        setAportacionSeleccionada(task);
        toggleSelectTaskModal();
    };
    const cargarFavoritosDeTareas = async () => {
        try {
            const token = localStorage.getItem("userTokenLG");
            const response = await axios.get('http://127.0.0.1:8000/api/favoritos/listar/', {
                headers: { Authorization: `Token ${token}` },
            });
            setFavoritosUsuario(response.data.map(favorito => favorito.task)); // Guardar las tareas favoritas
            console.log(response.data.map(favorito => favorito.task)); // Guardar las tareas favoritas
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    };

    const [masTasks, setMasTasks] = useState([{
        title: '',
        description: '',
        link: '',
        image: null,
        video: null,
        imagePreview: null,
        videoPreview: null,
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

    useEffect(() => {
        cargarFavoritosDeTareas();
        fetchPeticion();
        fetchComments();
    }, [peticionId]);

    const fetchPeticion = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/tasks_by_id/${peticionId}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            if (response.data.length > 0) {
                setPeticion(response.data[0]);
                console.log("buscnado la aportacion ", response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching peticion:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/tasks_by_id/${peticionId}/comments/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            setComments(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();

        // Verificar que haya texto en el comentario o al menos una subtarea con archivo
        if (!commentInput && !masTasks.some(task => task.image || task.video)) return;

        // Crear una instancia de FormData
        const formData = new FormData();
        formData.append('created_by', user.id);
        formData.append('post', peticion.id);
        formData.append('text', commentInput);
        formData.append('text', commentInput);
        // Agregar la aportación seleccionada al FormData
        if (aportacionSeleccionada) {
            formData.append('aportacion', aportacionSeleccionada.id);
        }
        // Agregar subtareas a FormData
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

        try {
            await axios.post(
                `http://127.0.0.1:8000/api/tasks_by_id/${peticion.id}/comments/`,
                formData,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setCommentInput("");
            setMasTasks([{ title: '', description: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
            setMasFuentes([{ title: '', description: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
            setMasFactores([{ title: '', description: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
            fetchComments(); // Fetch comments again to update the list
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };


    const handleListUsersWhoLikedComment = async (commentId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/comments/${commentId}/users_who_liked/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });

            if (Array.isArray(response.data)) {
                setListUsers(response.data);
            } else {
                console.log(`Comment ID: ${commentId} - No se encontraron usuarios que dieron "like".`);
            }
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching users who liked comment:', error.response);
        }
    };

    const handleLike = async (commentId) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/tasks_by_id/${peticionId}/comments/${commentId}/like/`, // Asegúrate de que peticionId está disponible en el alcance
                {},
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                    },
                }
            );
            fetchComments(); // Para actualizar la lista de comentarios
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };


    const addTaskForm = () => {
        setMasTasks([...masTasks, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
    };

    const addFuenteForm = () => {
        setMasFuentes([...masFuentes, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
    };

    const addFactorForm = () => {
        setMasFactores([...masFactores, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
    };

    const removeTask = (index, setTasks) => {
        setTasks((prevTasks) => prevTasks.filter((_, idx) => idx !== index));
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


    const handlePostFileChange = (index, e) => {
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

    if (!peticion) {
        return <div>Loading...</div>;
    }


    const imageSelect = (image) => {
        setModalOpenImage(true);
        setImagen(image);
    }


    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
    };

    return (
        <div className="anivelar">
            <div className="anivelar2">

                <div className="peticionPostWrapper" style={{
                    overflowY: "scroll"
                }}>
                    <div className="peticionPost">
                        <div className="peticionPostBody">
                            <div>
                                <PeticionCard peticionId={peticionId} openAddModal={openAddModal} />
                            </div>
                            <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} contentLabel="Agregar Nueva Tarea">
                                <div className="modal-content">
                                    <h2>Agregar Nueva Tarea</h2>
                                    <form onSubmit={submitComment}>
                                        <textarea
                                            placeholder={`Type here to reply to ${peticion.username}`}
                                            className="commentInput"
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                        ></textarea>
                                        <div>
                                            <h3>Tareas</h3>
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
                                                        type="url"
                                                        name="link"
                                                        value={task.link}
                                                        onChange={(e) => handleInputChange(index, e)}
                                                        placeholder="Paste link here"
                                                    />
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handlePostFileChange(index, e)}
                                                        accept="image/*,video/*"
                                                    />
                                                    <div className="botonesAddPCH">
                                                        <button type="button" onClick={() => addTaskForm()}>
                                                            <FontAwesomeIcon icon={faPlus} className="faPlus" />
                                                        </button>
                                                        <button type="button" onClick={() => removeTask(index, setMasTasks)}>
                                                            <FontAwesomeIcon icon={faMinus} className="faMinus" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h3>Factores</h3>
                                            {masFactores.map((task, index) => (
                                                <div key={index}>
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
                                                    <input
                                                        type="url"
                                                        name="link"
                                                        value={task.link}
                                                        onChange={(e) => handleInputChangeFactores(index, e)}
                                                        placeholder="Paste link here"
                                                    />
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handlePostFileChangeFactor(index, e)}
                                                        accept="image/*,video/*"
                                                    />
                                                    <div className="botonesAddPCH">
                                                        <button type="button" onClick={() => addFactorForm()}>
                                                            <FontAwesomeIcon icon={faPlus} className="faPlus" />
                                                        </button>
                                                        <button type="button" onClick={() => removeTask(index, setMasFactores)}>
                                                            <FontAwesomeIcon icon={faMinus} className="faMinus" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h3>Fuentes</h3>
                                            {masFuentes.map((task, index) => (
                                                <div key={index}>
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
                                                    <input
                                                        type="url"
                                                        name="link"
                                                        value={task.link}
                                                        onChange={(e) => handleInputChangeFuentes(index, e)}
                                                        placeholder="Paste link here"
                                                    />
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handlePostFileChangeFuente(index, e)}
                                                        accept="image/*,video/*"
                                                    />
                                                    <div className="botonesAddPCH">
                                                        <button type="button" onClick={() => addFuenteForm()}>
                                                            <FontAwesomeIcon icon={faPlus} className="faPlus" />
                                                        </button>
                                                        <button type="button" onClick={() => removeTask(index, setMasFuentes)}>
                                                            <FontAwesomeIcon icon={faMinus} className="faMinus" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Botón para abrir el modal de selección de tarea */}
                                        <button type="button" onClick={toggleSelectTaskModal}>
                                            Seleccionar Aportación Favorita
                                        </button>

                                        {/* Mostrar la aportación seleccionada */}
                                        {aportacionSeleccionada && (
                                            <div className="selected-task">
                                                <h4>Aportación seleccionada:</h4>
                                                <p>Título: {aportacionSeleccionada.title}</p>
                                                <img src={getMediaUrl(aportacionSeleccionada.image)} alt="Imagen de la aportación" style={{ width: '100px' }} />
                                            </div>
                                        )}
                                        <button type="submit">Agregar</button>
                                        <button onClick={closeAddModal}>Cerrar</button>
                                    </form>
                                </div>
                            </Modal>
                            <Modal isOpen={isSelectTaskModalOpen} onRequestClose={toggleSelectTaskModal} contentLabel="Seleccionar Aportación">
                                <h2>Seleccionar Aportación Favorita</h2>
                                <div className="task-list">
                                    {favoritosUsuario.map(task => (
                                        <div key={task.id} className="task-item" onClick={() => handleSelectTask(task)}>
                                            <div className="nuevo-usuario" onClick={() => seleccionarUsuario(task.user, task.username)}>
                                                <div className="nuevo-user-infoImage">
                                                    <div className="nuevo-image-container">
                                                        {task.user_image && task.user_image !== "No image available" ? (
                                                            <img src={getMediaUrl(task.user_image)} alt="Imagen de Usuario" className="nuevo-circle-image" />
                                                        ) : (
                                                            <div className="nuevo-user-infoImageIcon">
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
                                                    <div className="adjuntar">
                                                        <div className="nuevo-username">{task.username}</div>
                                                        <div className="nuevo-titulo">{task.title}</div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    ))}
                                </div>
                                <button onClick={toggleSelectTaskModal}>Cerrar</button>
                            </Modal>

                            <div className="peticionCommentsContainer">
                                <div className="commentsHeader">
                                    {comments.length + " comments"}
                                </div>
                                <div className="commentsContainer">
                                    <NewPeticionComments
                                        handleReply={fetchComments}
                                        handleLike={handleLike}
                                        comments={comments}
                                        user={user}
                                        peticion={peticion.pch}
                                    />
                                </div>
                            </div>
                            <div>
                                <Modal
                                    isOpen={isModalOpen}
                                    onRequestClose={() => setModalOpen(false)}
                                    contentLabel="Usuarios que dieron like"
                                >
                                    <h2>Usuarios que dieron "like" a este comentario:</h2>
                                    <ul>
                                        {listUsers.map(user => (
                                            <div className="user-info" key={user.id} onClick={() => setPeticionajena(user.id)}>

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
                                    <button onClick={() => setModalOpen(false)}>Cerrar</button>
                                </Modal>
                                <Modal
                                    isOpen={isModalOpenImage}
                                    onRequestClose={() => setModalOpenImage(false)}
                                    contentLabel="Imagen del comentario"
                                    style={{ padding: "0px !important " }}
                                >
                                    <img src={getMediaUrl(imagen)} alt="Imagen" onClick={() => setModalOpenImage(false)} className="imagenPeticionModel" />
                                    <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </div >
    );
};

export default NewPeticionPost;