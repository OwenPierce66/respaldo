import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faHeart, faTrash, faMinus, faPlus, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';
// import LinkPreview from "../archivos/LinkPreview";
import PeticionCard from "./peticionCard";
import { useParams, useLocation } from "react-router-dom";

// RTK Query (comments)

import NewPeticionComments from "./newPeticionComennt";
import {
  useGetTaskCommentsQuery,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
} from "../commentApi";

const NewPeticionPost = () => {
  // ---- Router v6: nada de props.match.params ----
  const location = useLocation();
  const params = useParams();
  const peticionId = params?.peticionId || params?.id || new URLSearchParams(location.search).get("id");

  const [peticion, setPeticion] = useState(null);
  const user = useSelector((state) => state.auth.user);

  // Favoritos para seleccionar “aportación”
  const [favoritosUsuario, setFavoritosUsuario] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSelectTaskModalOpen, setSelectTaskModalOpen] = useState(false);
  const toggleSelectTaskModal = () => setSelectTaskModalOpen(!isSelectTaskModalOpen);
  const [aportacionSeleccionada, setAportacionSeleccionada] = useState(null);

  // Form de nuevo comentario
  const [commentInput, setCommentInput] = useState("");
  const [masTasks, setMasTasks] = useState([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  const [masFactores, setMasFactores] = useState([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  const [masFuentes, setMasFuentes] = useState([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);

  // ---- RTK Query: listado de comentarios con paginación y filtros básicos ----
  const [ordering, setOrdering] = useState("-created_at"); // '-created_at' | 'created_at' | '-likes' | 'likes'
  const [windowFilter, setWindowFilter] = useState("");     // '' | 'day' | 'week' | 'month'
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const {
    data: commentsPage,
    isFetching: commentsLoading,
    refetch: refetchComments,
  } = useGetTaskCommentsQuery(
    { taskId: peticionId, limit, offset, ordering, window: windowFilter },
    { skip: !peticionId }
  );

  const [createComment, { isLoading: creatingComment }] = useCreateCommentMutation();
  const [toggleLike] = useToggleCommentLikeMutation();

  const results = commentsPage?.results ?? [];
  const hasNext = Boolean(commentsPage?.next);

  // Cuando cambie el filtro/orden, reiniciamos el offset y pedimos desde cero
  useEffect(() => {
    setOffset(0);
    if (peticionId) refetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordering, windowFilter, peticionId]);

  const loadMore = () => {
    if (hasNext) setOffset((o) => o + limit);
  };

  // ---- Helpers ----
  const getMediaUrl = (path) => (path ? `http://127.0.0.1:8000${path}` : '');

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
      setFavoritosUsuario(response.data.map(f => f.task));
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  // ---- Petición base (PCH) ----
  const fetchPeticion = async () => {
    if (!peticionId) return;
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks_by_id/${peticionId}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
      });
      if (response.data?.length) setPeticion(response.data[0]);
    } catch (error) {
      console.error("Error fetching peticion:", error);
    }
  };

  useEffect(() => {
    cargarFavoritosDeTareas();
    fetchPeticion();
  }, [peticionId]);

  // ---- Submit nuevo comentario (POST RTK Query) ----
  const submitComment = async (e) => {
    e.preventDefault();
    if (!user?.id || !peticion?.id) return;

    // Al menos texto o algún archivo en subtareas
    const tieneArchivos = (arr) => arr.some(t => t.image || t.video);
    if (!commentInput && !tieneArchivos(masTasks) && !tieneArchivos(masFactores) && !tieneArchivos(masFuentes)) return;

    const formData = new FormData();
    formData.append('created_by', user.id);
    formData.append('post', peticion.id);
    formData.append('text', commentInput);
    if (aportacionSeleccionada) formData.append('aportacion', aportacionSeleccionada.id);

    // subtasks
    masTasks.forEach((t, i) => {
      formData.append(`subtasks[${i}][title]`, t.title);
      formData.append(`subtasks[${i}][description]`, t.description);
      formData.append(`subtasks[${i}][link]`, t.link);
      if (t.image) formData.append(`subtasks[${i}][image]`, t.image, t.image.name);
      if (t.video) formData.append(`subtasks[${i}][video]`, t.video, t.video.name);
    });

    // subfactores
    masFactores.forEach((t, i) => {
      formData.append(`subfactores[${i}][title]`, t.title);
      formData.append(`subfactores[${i}][description]`, t.description);
      formData.append(`subfactores[${i}][link]`, t.link);
      if (t.image) formData.append(`subfactores[${i}][image]`, t.image, t.image.name);
      if (t.video) formData.append(`subfactores[${i}][video]`, t.video, t.video.name);
    });

    // subfuentes
    masFuentes.forEach((t, i) => {
      formData.append(`subfuentes[${i}][title]`, t.title);
      formData.append(`subfuentes[${i}][description]`, t.description);
      formData.append(`subfuentes[${i}][link]`, t.link);
      if (t.image) formData.append(`subfuentes[${i}][image]`, t.image, t.image.name);
      if (t.video) formData.append(`subfuentes[${i}][video]`, t.video, t.video.name);
    });

    try {
      await createComment({ taskId: peticion.id, body: formData }).unwrap();
      setCommentInput("");
      setMasTasks([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
      setMasFuentes([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
      setMasFactores([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
      setAportacionSeleccionada(null);
      refetchComments();
      setAddModalOpen(false);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  // ---- Like a comentario (POST RTK) ----
  const handleLikeComment = async (commentId) => {
    try {
      await toggleLike({ taskId: peticionId, commentId }).unwrap();
      refetchComments();
    } catch (e) {
      console.error("Error liking comment:", e);
    }
  };

  // ---- UI helpers (inputs/archivos) ----
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const addTaskForm = () => setMasTasks(prev => [...prev, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  const addFuenteForm = () => setMasFuentes(prev => [...prev, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  const addFactorForm = () => setMasFactores(prev => [...prev, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  const removeTask = (index, setTasks) => setTasks(prev => prev.filter((_, i) => i !== index));

  const handleInputChange = (index, e) => setMasTasks(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t));
  const handleInputChangeFactores = (index, e) => setMasFactores(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t));
  const handleInputChangeFuentes = (index, e) => setMasFuentes(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t));

  const handleFileFor = (setter) => (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    setter(prev => prev.map((t, i) => i === index ? ({
      ...t,
      image: isImage ? file : null,
      video: !isImage ? file : null,
      imagePreview: isImage ? URL.createObjectURL(file) : null,
      videoPreview: !isImage ? URL.createObjectURL(file) : null
    }) : t));
  };
  const handlePostFileChange = handleFileFor(setMasTasks);
  const handlePostFileChangeFactor = handleFileFor(setMasFactores);
  const handlePostFileChangeFuente = handleFileFor(setMasFuentes);

  if (!peticion) return <div>Loading...</div>;

  return (
    <div className="anivelar">
      <div className="anivelar2">
        <div className="peticionPostWrapper" style={{ overflowY: "scroll" }}>
          <div className="peticionPost">
            <div className="peticionPostBody">
              {/* Cabecera PCH */}
              <PeticionCard peticionId={peticionId} openAddModal={openAddModal} />

              {/* Modal: Agregar comentario */}
              <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} contentLabel="Agregar Nueva Tarea">
                <div className="modal-content">
                  <h2>Agregar Comentario</h2>
                  <form onSubmit={submitComment}>
                    <textarea
                      placeholder={`Type here to reply to ${peticion.username}`}
                      className="commentInput"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    ></textarea>

                    {/* SubComment */}
                    <div>
                      <h3>Tareas</h3>
                      {masTasks.map((task, index) => (
                        <div key={index}>
                          <input type="text" name="title" value={task.title} onChange={(e) => handleInputChange(index, e)} placeholder="Title" />
                          <textarea name="description" value={task.description} onChange={(e) => handleInputChange(index, e)} placeholder="Description" />
                          <input type="url" name="link" value={task.link} onChange={(e) => handleInputChange(index, e)} placeholder="Paste link here" />
                          <input type="file" onChange={(e) => handlePostFileChange(index, e)} accept="image/*,video/*" />
                          <div className="botonesAddPCH">
                            <button type="button" onClick={addTaskForm}><FontAwesomeIcon icon={faPlus} className="faPlus" /></button>
                            <button type="button" onClick={() => removeTask(index, setMasTasks)}><FontAwesomeIcon icon={faMinus} className="faMinus" /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Factores */}
                    <div>
                      <h3>Factores</h3>
                      {masFactores.map((task, index) => (
                        <div key={index}>
                          <input type="text" name="title" value={task.title} onChange={(e) => handleInputChangeFactores(index, e)} placeholder="Title Factor" />
                          <textarea name="description" value={task.description} onChange={(e) => handleInputChangeFactores(index, e)} placeholder="Description Factor" />
                          <input type="url" name="link" value={task.link} onChange={(e) => handleInputChangeFactores(index, e)} placeholder="Paste link here" />
                          <input type="file" onChange={(e) => handlePostFileChangeFactor(index, e)} accept="image/*,video/*" />
                          <div className="botonesAddPCH">
                            <button type="button" onClick={addFactorForm}><FontAwesomeIcon icon={faPlus} className="faPlus" /></button>
                            <button type="button" onClick={() => removeTask(index, setMasFactores)}><FontAwesomeIcon icon={faMinus} className="faMinus" /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fuentes */}
                    <div>
                      <h3>Fuentes</h3>
                      {masFuentes.map((task, index) => (
                        <div key={index}>
                          <input type="text" name="title" value={task.title} onChange={(e) => handleInputChangeFuentes(index, e)} placeholder="Title Fuente" />
                          <textarea name="description" value={task.description} onChange={(e) => handleInputChangeFuentes(index, e)} placeholder="Description Fuente" />
                          <input type="url" name="link" value={task.link} onChange={(e) => handleInputChangeFuentes(index, e)} placeholder="Paste link here" />
                          <input type="file" onChange={(e) => handlePostFileChangeFuente(index, e)} accept="image/*,video/*" />
                          <div className="botonesAddPCH">
                            <button type="button" onClick={addFuenteForm}><FontAwesomeIcon icon={faPlus} className="faPlus" /></button>
                            <button type="button" onClick={() => removeTask(index, setMasFuentes)}><FontAwesomeIcon icon={faMinus} className="faMinus" /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selección de aportación favorita */}
                    <button type="button" onClick={toggleSelectTaskModal}>Seleccionar Aportación Favorita</button>
                    {aportacionSeleccionada && (
                      <div className="selected-task">
                        <h4>Aportación seleccionada:</h4>
                        <p>Título: {aportacionSeleccionada.title}</p>
                        <img src={getMediaUrl(aportacionSeleccionada.image)} alt="Imagen de la aportación" style={{ width: '100px' }} />
                      </div>
                    )}

                    <button type="submit" disabled={creatingComment}>Agregar</button>
                    <button type="button" onClick={closeAddModal}>Cerrar</button>
                  </form>
                </div>
              </Modal>

              {/* Modal selección aportación */}
              <Modal isOpen={isSelectTaskModalOpen} onRequestClose={toggleSelectTaskModal} contentLabel="Seleccionar Aportación">
                <h2>Seleccionar Aportación Favorita</h2>
                <div className="task-list">
                  {favoritosUsuario.map(task => (
                    <div key={task.id} className="task-item" onClick={() => handleSelectTask(task)}>
                      <div className="nuevo-usuario">
                        <div className="nuevo-user-infoImage">
                          <div className="nuevo-image-container">
                            {task.user_image && task.user_image !== "No image available" ? (
                              <img src={getMediaUrl(task.user_image)} alt="Imagen de Usuario" className="nuevo-circle-image" />
                            ) : (
                              <div className="nuevo-user-infoImageIcon">
                                <FontAwesomeIcon icon={faUser} style={{ color: "grey", cursor: "pointer" }} />
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

              {/* Controles de orden / ventana */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0' }}>
                <label>
                  Orden:&nbsp;
                  <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
                    <option value="-created_at">Más recientes</option>
                    <option value="created_at">Más antiguos</option>
                    <option value="-likes">Más liked</option>
                    <option value="likes">Menos liked</option>
                  </select>
                </label>
                <label>
                  Ventana:&nbsp;
                  <select value={windowFilter} onChange={(e) => setWindowFilter(e.target.value)}>
                    <option value="">Todas</option>
                    <option value="day">Hoy</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                  </select>
                </label>
              </div>

              {/* Listado de comentarios */}
              <div className="peticionCommentsContainer">
                <div className="commentsHeader">
                  {(commentsPage?.count ?? 0) + " comments"}
                </div>
                <div className="commentsContainer">
                  <NewPeticionComments
                    comments={results}
                    user={user}
                    handleReply={() => refetchComments()}
                    handleLike={handleLikeComment}
                    peticion={peticion.pch}
                  />
                  {commentsLoading && <div style={{ padding: 12 }}>Cargando…</div>}
                  {!commentsLoading && hasNext && (
                    <div style={{ padding: 12 }}>
                      <button className="btnpetition" onClick={loadMore}>Cargar más</button>
                    </div>
                  )}
                  {!commentsLoading && results.length === 0 && (
                    <div style={{ padding: 12 }}>Aún no hay comentarios.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div >
      </div>
    </div >
  );
};

export default NewPeticionPost;
