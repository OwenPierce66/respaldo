import React, { useEffect, useState } from "react";
import moment from "moment";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faHeart, faTrash, faPlus, faMinus, faUser, faVideo } from "@fortawesome/free-solid-svg-icons";
import "../../owenscss/comentarios.scss";
import Modal from 'react-modal';
import LinkPreview from "./archivos/LinkPreview";
import PeticionCard from "./peticionCard";

const NewPeticionComment = ({ comment, user, handleReply, handleLike, peticion }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [peticionajena, setPeticionajena] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpenImage, setModalOpenImage] = useState(false);
    const [imagen, setImagen] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const [visibleSection, setVisibleSection] = useState('subtasks');
    const [modalOpenAportacion, setModalOpenAportacion] = useState(false);
    const [showLink, setShowLink] = useState(false);


    const getMediaUrl = (path) => {
  return path ? `http://127.0.0.1:8000${path}` : '';
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

    const nestedComments = (comment.children || []).map((childComment) => (
        <NewPeticionComment
            key={childComment.id}
            comment={childComment}
            user={user}
            handleReply={handleReply}
            handleLike={handleLike}
            peticion={peticion}
        />
    ));

    const deleteComment = () => {
        if (confirm("Confirm You Want To Delete Comment.")) {
            Axios.delete(
                `http://127.0.0.1:8000/api/tasks_by_id/${comment.post}/comments/${comment.id}`,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                    },
                }
            ).then(() => {
                handleReply();
            });
        }
    };

    const submitComment = (e) => {
        e.preventDefault();
        if (!replyText && !masTasks.some(task => task.image || task.video)) return;

        const formData = new FormData();
        formData.append('created_by', user.id);
        formData.append('parent', comment.id);
        formData.append('post', comment.post);
        formData.append('text', replyText);

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

        Axios.post(
            `http://127.0.0.1:8000/api/tasks_by_id/${comment.post}/comments/`,
            formData,
            {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        ).then(() => {
            setReplyText("");
            setShowReplyBox(false);
            setMasTasks([{ title: '', description: '', image: null, video: null }]);
            handleReply(comment.id, replyText);
        }).catch(error => {
            console.error("Error submitting reply:", error);
        });
    };

    const toggleTree = () => {
        const child = document.getElementById(`replies${comment.id}`);
        const button = document.getElementById(`commentButton${comment.id}`);
        if (child.style.display === "none") {
            child.style.display = "block";
        } else {
            child.style.display = "none";
        }

        if (button.textContent === "Hide Replies") {
            button.textContent = "Show Replies";
        } else {
            button.textContent = "Hide Replies";
        }
    };

    const toggleReplyBox = () => {
        setShowReplyBox(!showReplyBox);
    };

    const handleFileChange = (index, e) => {
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

    const handleListUsersWhoLikedComment = async (commentId) => {
        try {
            const response = await Axios.get(`http://127.0.0.1:8000/api/comments/${commentId}/users_who_liked/`, {
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

    const imageSelect = (image) => {
        setModalOpenImage(true);
        setImagen(image);
    };

    const submitLike = async () => {
        try {
            await handleLike(comment.id);
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    const handleSectionChange = (section) => {
        setVisibleSection(section);
    };

    const customStyles = {
        content: {
            position: 'absolute',
            inset: '40px',
            border: '1px solid rgb(204, 204, 204)',
            background: 'rgb(255, 255, 255)',
            overflow: 'auto',
            borderRadius: '4px',
            outline: 'none',
            width: '100vw',
            marginLeft: '-40px',
            padding: "0px",
        },
    };


    return (
        // <div className="anivelar">
        //     <div className="anivelar2">
        <div className="comment-container" id={comment.id}>
            <div className="comment-container2">

                <div className="redondear">
                    {/* <div className="lineaaa"></div> */}
                    <div className="comment-content">
                        <div className="comment-header">
                            <div className="comment-usuario" onClick={() => setPeticionajena(comment.created_by.id)}>
                                <div className="user-infoImage">
                                    <div className="image-container">
                                        {comment.created_by.user_image ? (
                                            <img src={getMediaUrl(comment.created_by.user_image)} alt="Imagen de Usuario" className="circle-image" />
                                        ) : (
                                            <div className="user-infoImageIcon">
                                                <FontAwesomeIcon icon={faUser} style={{ color: "grey", cursor: "pointer" }} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="username">{comment.created_by.username}</div>
                                        <div className="commentedAt">
                                            {moment(comment.created_at).fromNow()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="comment-icons">
                                {/* <div className="icon1">
                                    <div className="material-iconis">
                                        <div className="perfilFavorito" onClick={() => handleLike(comment.id)}>
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                style={{
                                                    color: comment.like_set.some(like => like.user.id === user.id) ? 'black' : 'white',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div> */}
                                <div className="icon2">
                                    {user.id === comment.created_by.id && (
                                        <div className="material-iconi" onClick={() => deleteComment(comment.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {comment.aportacion && (
                            <div className="section-buttons" style={{ margin: "16px", marginLeft: "-155px" }}>
                                <button
                                    className="section-button"
                                    onClick={() => setModalOpenAportacion(true)}
                                >
                                    Ver Aportación
                                </button>
                            </div>
                        )}
                        <div>
                            <Modal
                                isOpen={modalOpenAportacion}
                                onRequestClose={() => setModalOpenAportacion(false)}
                                contentLabel="Detalle de Aportación"
                                style={customStyles} // Establece el estilo del modal aquí
                            >
                                <div>
                                    <h2>Detalles de la Aportación</h2>
                                    <PeticionCard peticionId={comment.aportacion} />
                                    <button onClick={() => setModalOpenAportacion(false)}>Cerrar</button>
                                </div>
                            </Modal>
                        </div>

                        <div className="comment-text">
                            <div className="comment-title">{comment.text}</div>
                        </div>

                        <div>
                            {comment.video && (
                                <video controls className="comment-video">
                                    <source src={getMediaUrl(comment.video)} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {comment.image && (
                                <img src={getMediaUrl(comment.image)} alt="Imagen" className="comment-image" />
                            )}
                        </div>
                    </div>

                    <div>
                        {comment.video && (
                            <video controls className="testimonial-video">
                                <source src={getMediaUrl(comment.video)} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        {comment.image && (
                            <img
                                src={getMediaUrl(comment.image)}
                                alt="Imagen"
                                onClick={() => imageSelect(comment.image)}
                                className="imagenPeticion"
                                style={{ height: "100px", width: "100px" }}
                            />
                        )}
                    </div>



                    {/* Botones de secciones para subtareas, factores y fuentes */}
                    <div className="section-buttons" style={{ justifyContent: "normal", marginLeft: " 16px" }}>
                        <button
                            className={`section-button ${visibleSection === 'subtasks' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange('subtasks')}
                        >
                            SubComentario
                        </button>
                        <button
                            className={`section-button ${visibleSection === 'subFactores' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange('subFactores')}
                        >
                            Factores
                        </button>
                        <button
                            className={`section-button ${visibleSection === 'subFuentes' ? 'selected' : ''}`}
                            onClick={() => handleSectionChange('subFuentes')}
                        >
                            Fuentes
                        </button>
                    </div>

                    {/* Contenido de las secciones visibles */}
                    {visibleSection === 'subtasks' && (
                        <div className="subtasks-container">
                            {comment.subtasks.map(subtask => (
                                <div key={subtask.id} className="subtask">
                                    <div className="textol">
                                        <div className="titulo2">{subtask.title}</div>
                                        <div className="titulo1">{subtask.description}</div>
                                    </div>
                                    {subtask.image && (
                                        <img src={getMediaUrl(subtask.image)} className="imagePch" alt="Subtask" />
                                    )}
                                    {subtask.video && (
                                        <video controls className="testimonial-video">
                                            <source src={getMediaUrl(subtask.video)} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                    <div className="moldeando">
                                        {subtask.link && subtask.link.trim() !== "" && subtask.link !== "undefined" ? (
                                            <div>
                                                {!showLink ? (
                                                    <button onClick={() => setShowLink(true)}>Ver link</button>
                                                ) : (
                                                    <div>
                                                        <LinkPreview url={subtask.link} />
                                                        <button onClick={() => setShowLink(false)}>Ocultar link</button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {visibleSection === 'subFactores' && (
                        <div className="subtasks-container">
                            <div className="subtasks-container-sub">
                                {comment.subFactores && Array.isArray(comment.subFactores) && comment.subFactores.length > 0 ? (
                                    comment.subFactores.map(subfactor => (
                                        <div key={subfactor.id} className="subtask">
                                            <div className="textol">
                                                <div className="titulo2">{subfactor.title}</div>
                                                <div className="titulo1">{subfactor.description}</div>
                                            </div>
                                            {subfactor.image && (
                                                <img src={getMediaUrl(subfactor.image)} className="imagePch" alt="Subfactor" />
                                            )}
                                            {subfactor.video && (
                                                <video controls className="testimonial-video">
                                                    <source src={getMediaUrl(subfactor.video)} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                            <div className="moldeando">
                                                {subfactor.link && subfactor.link.trim() !== "" && subfactor.link !== "undefined" ? (
                                                    <div>
                                                        {!showLink ? (
                                                            <button onClick={() => setShowLink(true)}>Ver link</button>
                                                        ) : (
                                                            <div>
                                                                <LinkPreview url={subfactor.link} />
                                                                <button onClick={() => setShowLink(false)}>Ocultar link</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No subFactores available</p>
                                )}
                            </div>
                        </div>
                    )}

                    {visibleSection === 'subFuentes' && (
                        <div className="subtasks-container">
                            <div className="subtasks-container-sub">
                                {comment.subFuentes && Array.isArray(comment.subFuentes) && comment.subFuentes.length > 0 ? (
                                    comment.subFuentes.map(subfuente => (
                                        <div key={subfuente.id} className="subtask">
                                            <div className="textol">
                                                <div className="titulo2">{subfuente.title}</div>
                                                <div className="titulo1">{subfuente.description}</div>
                                            </div>
                                            {subfuente.image && (
                                                <img src={getMediaUrl(subfuente.image)} className="imagePch" alt="Subfuente" />
                                            )}
                                            {subfuente.video && (
                                                <video controls className="testimonial-video">
                                                    <source src={getMediaUrl(subfuente.video)} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                            <div className="moldeando">
                                                {subfuente.link && subfuente.link.trim() !== "" && subfuente.link !== "undefined" ? (
                                                    <div>
                                                        {!showLink ? (
                                                            <button onClick={() => setShowLink(true)}>Ver link</button>
                                                        ) : (
                                                            <div>
                                                                <LinkPreview url={subfuente.link} />
                                                                <button onClick={() => setShowLink(false)}>Ocultar link</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No subFuentes available</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="line-down-comment">
                        <div className="comment-actions">
                            <div style={{ padding: "5px" }} onClick={toggleReplyBox}>
                                <button className="comment-reply-link" style={{ color: "white" }}>
                                    Responder
                                </button>
                            </div>

                            <div className="mostrar">
                                <button
                                    onClick={toggleTree}
                                    id={`commentButton${comment.id}`}
                                    className="comment-toggle-link"
                                    style={{ color: "white" }}
                                >
                                    Mostrar
                                </button>
                            </div>

                            <div className="comment-like">
                                <div className="comment-like-count" onClick={() => handleListUsersWhoLikedComment(comment.id)}>
                                    {comment.likes_count}
                                </div>
                                <div onClick={() => handleLike(comment.id)}>
                                    <FontAwesomeIcon
                                        style={{ color: comment.like_set.some(like => like.user.id === user.id) ? "#54afff" : "white" }}
                                        icon={faHeart}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)} contentLabel="Usuarios que dieron like">
                        <h2>Usuarios que dieron "like" al comentario</h2>
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

                    {showReplyBox && (
                        <form className="replyBox" onSubmit={submitComment}>
                            <textarea
                                placeholder={`Type here to reply to ${comment.created_by.first_name}`}
                                className="Comment"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            ></textarea>

                            {/* Sección de Tareas */}
                            <div className="section-container">
                                <div className="titulo-task">Sub Comment</div>
                                {masTasks.map((task, index) => (
                                    <div key={index} className="task-item">
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
                                            onChange={(e) => handleFileChange(index, e)}
                                            accept="image/*,video/*"
                                            style={{ display: 'none' }}
                                            id={`task-file-${index}`}
                                        />
                                        <label htmlFor={`task-file-${index}`} className="file-label">
                                            <FontAwesomeIcon icon={faImage} /> / <FontAwesomeIcon icon={faVideo} />
                                        </label>
                                        {task.imagePreview && <img src={getMediaUrl(task.imagePreview)} alt="Preview" className="preview-image" />}
                                        {task.videoPreview && <video src={getMediaUrl(task.videoPreview)} controls className="preview-video" />}
                                    </div>
                                ))}
                            </div>

                            {/* Sección de Factores */}
                            <div className="section-container">
                                <div className="titulo-factor">Factor</div>
                                {masFactores.map((factor, index) => (
                                    <div key={index} className="factor-item">
                                        <input
                                            type="text"
                                            name="title"
                                            value={factor.title}
                                            onChange={(e) => handleInputChangeFactores(index, e)}
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={factor.description}
                                            onChange={(e) => handleInputChangeFactores(index, e)}
                                            placeholder="Description"
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => handlePostFileChangeFactor(index, e)}
                                            accept="image/*,video/*"
                                            style={{ display: 'none' }}
                                            id={`factor-file-${index}`}
                                        />
                                        <label htmlFor={`factor-file-${index}`} className="file-label">
                                            <FontAwesomeIcon icon={faImage} /> / <FontAwesomeIcon icon={faVideo} />
                                        </label>
                                        {factor.imagePreview && <img src={getMediaUrl(factor.imagePreview)} alt="Preview" className="preview-image" />}
                                        {factor.videoPreview && <video src={getMediaUrl(factor.videoPreview)} controls className="preview-video" />}
                                    </div>
                                ))}
                            </div>

                            {/* Sección de Fuentes */}
                            <div className="section-container">
                                <div className="titulo-fuente">Fuente</div>
                                {masFuentes.map((fuente, index) => (
                                    <div key={index} className="fuente-item">
                                        <input
                                            type="text"
                                            name="title"
                                            value={fuente.title}
                                            onChange={(e) => handleInputChangeFuentes(index, e)}
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={fuente.description}
                                            onChange={(e) => handleInputChangeFuentes(index, e)}
                                            placeholder="Description"
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => handlePostFileChangeFuente(index, e)}
                                            accept="image/*,video/*"
                                            style={{ display: 'none' }}
                                            id={`fuente-file-${index}`}
                                        />
                                        <label htmlFor={`fuente-file-${index}`} className="file-label">
                                            <FontAwesomeIcon icon={faImage} /> / <FontAwesomeIcon icon={faVideo} />
                                        </label>
                                        {fuente.imagePreview && <img src={getMediaUrl(fuente.imagePreview)} alt="Preview" className="preview-image" />}
                                        {fuente.videoPreview && <video src={getMediaUrl(fuente.videoPreviewgetMediaUrl)} controls className="preview-video" />}
                                    </div>
                                ))}
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    )}

                    {/* <button onClick={toggleReplyBox} className="replyButton">Responder</button> */}

                    <div className="replies" id={`replies${comment.id}`}>
                        {nestedComments}
                    </div>
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
        //     </div>
        // </div>
    );
};

const NewPeticionComments = ({ comments, user, handleReply, handleLike, peticion }) => {
    return (
        <div>
            {comments.map((comment) => {
                if (comment.is_parent) {
                    return (
                        <NewPeticionComment
                            key={comment.id}
                            comment={comment}
                            user={user}
                            handleReply={handleReply}
                            handleLike={handleLike}
                            peticion={peticion}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
};

export default NewPeticionComments;
