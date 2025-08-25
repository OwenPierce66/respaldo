import React from 'react';
import Modal from 'react-modal';
import { Link } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";

const SharedTasks = ({
    sharedTasks,
    toggleFavoritos,
    showFavoritos,
    filteredSharedTasks,
    handleUpdate,
    handleDeleteSharedTask,
    setPeticionajena,
    handleAgregarFavorito,
    handleShare,
    juntarTraduccion,
    mostrar,
    juntar,
    imageSelect,
    isModalOpen,
    setModalOpen,
    listUsers,
    isModalOpenImage,
    setModalOpenImage,
    imagen,
    setPeticion,
    handleListUsers,
    isFavorito,
    navigateToUserMesseges,
    navigateToUserForum
}) => {
    return (
        <div className="shared-tasks">
            <h2>Tareas Compartidas</h2>
            <button onClick={toggleFavoritos}>
                {showFavoritos ? "Mostrar Todas" : "Mostrar Favoritos"}
            </button>
            {filteredSharedTasks.map((sharedTask) => (
                <div key={sharedTask.id} className="comment">
                    <p>Compartido por: {sharedTask.shared_by.username} </p>

                    <div className="redondear">
                        <div className="hole">
                            <div className="icon1">
                                <div
                                    className="material-iconis"
                                    onClick={() => handleUpdate(sharedTask.task)}
                                    z-index="1"
                                >
                                    {/* Añade el icono o botón para actualizar aquí */}
                                </div>
                            </div>
                            <div className="icon2">
                                <div
                                    className="material-iconi"
                                    onClick={() => handleDeleteSharedTask(sharedTask.id)}
                                >
                                    {sharedTask.task.user ? (<FontAwesomeIcon icon={faTrash} />) : (null)}
                                </div>
                            </div>
                        </div>
                        <div className="usuario" style={{ height: "20px" }} onClick={() => setPeticionajena(sharedTask.task.user)}>
                            {sharedTask.task.username}
                        </div>
                        <button onClick={() => navigateToUserMesseges(sharedTask.task.user)}>mensaje</button>
                        <button onClick={() => navigateToUserForum(sharedTask.task.user)}>Ir al foro del usuario</button>
                        <button onClick={() => handleAgregarFavorito(sharedTask.task.id)}>
                            {isFavorito ? 'En Favoritos' : 'Agregar a Favoritos'}
                        </button>
                        <button onClick={() => handleShare(sharedTask.task)}>Compartir</button>

                        <p>Compartido: {sharedTask.task.share_count} veces</p>
                        <div>
                            {sharedTask.task.categories}
                        </div>
                        <div
                            className="textol"
                            onClick={() => juntarTraduccion(sharedTask.task.description)}
                        >
                            {mostrar ? (
                                sharedTask.task.description === juntar ? (
                                    <div className="titulo1"> {sharedTask.task.description}</div>
                                ) : null
                            ) : null}
                            <div className="titulo2">{sharedTask.task.title}</div>
                        </div>

                        {sharedTask.task.video && (
                            <video controls className="testimonial-video">
                                <source src={sharedTask.task.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        {sharedTask.task.image !== null && sharedTask.task.image !== "" ? (
                            <img src={sharedTask.task.image} alt="Imagen" onClick={() => imageSelect(sharedTask.task.image)} className="imagenPeticion" style={{ height: "100px", width: "100px" }} />
                        ) : (null)}

                        <div className="subtasks-container">
                            {sharedTask.task.subtasks.map(subtask => (
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
                            onRequestClose={() => setModalOpen(false)}
                            contentLabel="Usuarios que dieron like"
                        >
                            <h2>Usuarios que dieron "like" a la tarea:</h2>
                            <ul>
                                {listUsers.map(user => (
                                    <li key={user.id} onClick={() => setPeticionajena(user.id)}>
                                        ID: {user.id}, Nombre de usuario: {user.username}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setModalOpen(false)}>Cerrar</button>
                        </Modal>

                        <Modal
                            isOpen={isModalOpenImage}
                            onRequestClose={() => setModalOpenImage(false)}
                            contentLabel="Imagen"
                            style={{ padding: "0px !important " }}
                        >
                            <img src={imagen} alt="Imagen" onClick={() => setModalOpenImage(false)} className="imagenPeticionModel" />
                            <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
                        </Modal>

                        <div className="line-down">
                            <div className="likes">
                                <div style={{ padding: "5px" }} onClick={() => setPeticion(sharedTask.task)}>
                                    <Link
                                        to="/peticionesTwo"
                                        className="nlink"
                                        style={{ color: "white" }}
                                    >
                                        Responder
                                    </Link>
                                </div>
                                <div className="megusta">
                                    <div className="like">
                                        <div onClick={() => handleUpdate(sharedTask.task)}>
                                            <FontAwesomeIcon
                                                style={{
                                                    color: sharedTask.user_has_liked ? "54afff" : "white"
                                                }}
                                                icon={faHeart}
                                            />
                                        </div>

                                        <div className="like_cantidad" onClick={() => handleListUsers(sharedTask.task)}>{sharedTask.task.likes_count}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SharedTasks;
