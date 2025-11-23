// src/components/Dashboard/traductor/newforum/NewPeticionPost.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import PeticionCard from "./peticionCard";
import { useParams, useLocation } from "react-router-dom";

import NewPeticionComments from "./newPeticionComennt";
import {
  useGetTaskCommentsQuery,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
} from "../commentApi";

const NewPeticionPost = () => {
  // Router v6
  const location = useLocation();
  const params = useParams();
  const peticionId =
    params?.peticionId || params?.id || new URLSearchParams(location.search).get("id");

  const user = useSelector((state) => state.auth.user);

  // Petición base (PCH)
  const [peticion, setPeticion] = useState(null);

  // Favoritos para “aportación”
  const [favoritosUsuario, setFavoritosUsuario] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSelectTaskModalOpen, setSelectTaskModalOpen] = useState(false);
  const toggleSelectTaskModal = () => setSelectTaskModalOpen((v) => !v);
  const [aportacionSeleccionada, setAportacionSeleccionada] = useState(null);

  // Form de nuevo comentario
  const [commentInput, setCommentInput] = useState("");
  const [masTasks, setMasTasks] = useState([
    { title: "", description: "", link: "", image: null, video: null },
  ]);
  const [masFactores, setMasFactores] = useState([
    { title: "", description: "", link: "", image: null, video: null },
  ]);
  const [masFuentes, setMasFuentes] = useState([
    { title: "", description: "", link: "", image: null, video: null },
  ]);

  // RTK Query: comentarios + filtros
  const [ordering, setOrdering] = useState("-created_at");
  const [periodFilter, setPeriodFilter] = useState(""); // '', 'day', 'week', 'month'
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const {
    data: commentsPage,
    isFetching: commentsLoading,
    refetch: refetchComments,
  } = useGetTaskCommentsQuery(
    {
      taskId: peticionId,
      limit,
      offset,
      ordering,
      period: periodFilter, // <-- el backend usa 'period'
    },
    {
      skip: !peticionId,
      pollingInterval: 4000, // auto-refresh suave
    }
  );

  const [createComment, { isLoading: creatingComment }] = useCreateCommentMutation();
  const [toggleLike] = useToggleCommentLikeMutation();

  const results = commentsPage?.results ?? [];
  const hasNext = Boolean(commentsPage?.next);

  // Reconsultar al cambiar filtros
  useEffect(() => {
    setOffset(0);
    if (peticionId) refetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordering, periodFilter, peticionId]);

  // Helpers
  // ⬇️ SOLO cambié esta función para corregir rutas relativas tipo "media/..." o nombres sueltos
  const getMediaUrl = (path) => {
    if (!path) return "";
    const s = String(path).trim();
    const BASE = "http://127.0.0.1:8000";
    const join = (a, b) => `${String(a).replace(/\/+$/, "")}/${String(b).replace(/^\/+/, "")}`;

    if (/^https?:\/\//i.test(s)) return s;         // ya es absoluta
    if (s.startsWith("/")) return join(BASE, s);   // "/media/..."
    if (s.startsWith("media/")) return join(BASE, s); // "media/archivo.jpg"
    // nombre suelto o "carpeta/archivo.jpg" => anteponer /media
    return join(BASE, join("/media", s));
  };

  const handleSelectTask = (task) => {
    setAportacionSeleccionada(task);
    toggleSelectTaskModal();
  };

  const cargarFavoritosDeTareas = async () => {
    try {
      const token = localStorage.getItem("userTokenLG");
      const { data } = await axios.get("http://127.0.0.1:8000/api/favoritos/listar/", {
        headers: { Authorization: `Token ${token}` },
      });
      // si tu endpoint devuelve objetos Favorito -> map a .task
      setFavoritosUsuario(data.map((f) => f.task));
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  };

  const fetchPeticion = async () => {
    if (!peticionId) return;
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/tasks_by_id/${peticionId}/`,
        { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
      );
      if (data?.length) setPeticion(data[0]);
    } catch (error) {
      console.error("Error fetching peticion:", error);
    }
  };

  useEffect(() => {
    cargarFavoritosDeTareas();
    fetchPeticion();
  }, [peticionId]);

  // ----- INFINITE SCROLL: IntersectionObserver -----
  const scrollRef = useRef(null); // root del scroll
  const bottomRef = useRef(null); // sentinel

  useEffect(() => {
    if (!scrollRef.current || !bottomRef.current) return;

    const root = scrollRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && hasNext && !commentsLoading) {
          setOffset((o) => o + limit); // pedir siguiente página
        }
      },
      {
        root, // contenedor con overflowY: scroll
        rootMargin: "0px 0px 300px 0px", // pre-carga 300px antes del fondo
        threshold: 0,
      }
    );

    obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [hasNext, commentsLoading, limit]);
  // -----------------------------------------------

  // Submit nuevo comentario
  const submitComment = async (e) => {
    e.preventDefault();
    if (!user?.id || !peticion?.id) return;

    const tieneArchivos = (arr) => arr.some((t) => t.image || t.video);
    if (!commentInput && !tieneArchivos(masTasks) && !tieneArchivos(masFactores) && !tieneArchivos(masFuentes))
      return;

    const formData = new FormData();
    formData.append("created_by", user.id);
    formData.append("post", peticion.id);
    formData.append("text", commentInput);
    if (aportacionSeleccionada) formData.append("aportacion", aportacionSeleccionada.id);

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

      // limpiar formulario
      setCommentInput("");
      setMasTasks([{ title: "", description: "", link: "", image: null, video: null }]);
      setMasFuentes([{ title: "", description: "", link: "", image: null, video: null }]);
      setMasFactores([{ title: "", description: "", link: "", image: null, video: null }]);
      setAportacionSeleccionada(null);

      // volver a página 1 y refetch inmediato
      setOffset(0);
      refetchComments();

      setAddModalOpen(false);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  // Like de comentario
  const handleLikeComment = async (commentId) => {
    try {
      await toggleLike({ taskId: peticionId, commentId }).unwrap();
    } catch (e) {
      console.error("Error liking comment:", e);
    } finally {
      refetchComments(); // invalidatesTags ya lo hará; mantener por inmediatez
    }
  };

  // UI helpers
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const addTaskForm = () =>
    setMasTasks((prev) => [...prev, { title: "", description: "", link: "", image: null, video: null }]);
  const addFuenteForm = () =>
    setMasFuentes((prev) => [...prev, { title: "", description: "", link: "", image: null, video: null }]);
  const addFactorForm = () =>
    setMasFactores((prev) => [...prev, { title: "", description: "", link: "", image: null, video: null }]);
  const removeTask = (index, setTasks) => setTasks((prev) => prev.filter((_, i) => i !== index));

  const handleInputChange = (index, e) =>
    setMasTasks((prev) => prev.map((t, i) => (i === index ? { ...t, [e.target.name]: e.target.value } : t)));
  const handleInputChangeFactores = (index, e) =>
    setMasFactores((prev) => prev.map((t, i) => (i === index ? { ...t, [e.target.name]: e.target.value } : t)));
  const handleInputChangeFuentes = (index, e) =>
    setMasFuentes((prev) => prev.map((t, i) => (i === index ? { ...t, [e.target.name]: e.target.value } : t)));

  const handleFileFor =
    (setter) =>
    (index, e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const isImage = file.type.startsWith("image/");
      setter((prev) =>
        prev.map((t, i) =>
          i === index
            ? {
                ...t,
                image: isImage ? file : null,
                video: !isImage ? file : null,
              }
            : t
        )
      );
    };
  const handlePostFileChange = handleFileFor(setMasTasks);
  const handlePostFileChangeFactor = handleFileFor(setMasFactores);
  const handlePostFileChangeFuente = handleFileFor(setMasFuentes);

  if (!peticion) return <div>Loading...</div>;

  return (
    <div className="anivelar">
      <div className="anivelar2">
        <div
          className="peticionPostWrapper"
          ref={scrollRef}
          style={{ overflowY: "scroll" }} // 👈 root del IntersectionObserver
        >
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

                    {/* SubComment: Tareas */}
                    <div>
                      <h3>Tareas</h3>
                      {masTasks.map((task, index) => (
                        <div key={`tarea-${index}`}>
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
                          <input type="file" onChange={(e) => handlePostFileChange(index, e)} accept="image/*,video/*" />
                          <div className="botonesAddPCH">
                            <button type="button" onClick={addTaskForm}>
                              <FontAwesomeIcon icon={faPlus} className="faPlus" />
                            </button>
                            <button type="button" onClick={() => removeTask(index, setMasTasks)}>
                              <FontAwesomeIcon icon={faMinus} className="faMinus" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Factores */}
                    <div>
                      <h3>Factores</h3>
                      {masFactores.map((task, index) => (
                        <div key={`factor-${index}`}>
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
                            <button type="button" onClick={addFactorForm}>
                              <FontAwesomeIcon icon={faPlus} className="faPlus" />
                            </button>
                            <button type="button" onClick={() => removeTask(index, setMasFactores)}>
                              <FontAwesomeIcon icon={faMinus} className="faMinus" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fuentes */}
                    <div>
                      <h3>Fuentes</h3>
                      {masFuentes.map((task, index) => (
                        <div key={`fuente-${index}`}>
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
                            <button type="button" onClick={addFuenteForm}>
                              <FontAwesomeIcon icon={faPlus} className="faPlus" />
                            </button>
                            <button type="button" onClick={() => removeTask(index, setMasFuentes)}>
                              <FontAwesomeIcon icon={faMinus} className="faMinus" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selección de aportación favorita */}
                    <button type="button" onClick={toggleSelectTaskModal}>
                      Seleccionar Aportación Favorita
                    </button>
                    {aportacionSeleccionada && (
                      <div className="selected-task">
                        <h4>Aportación seleccionada:</h4>
                        <p>Título: {aportacionSeleccionada.title}</p>
                        <img
                          src={getMediaUrl(aportacionSeleccionada.image)}
                          alt="Imagen de la aportación"
                          style={{ width: "100px" }}
                        />
                      </div>
                    )}

                    <button type="submit" disabled={creatingComment}>
                      Agregar
                    </button>
                    <button type="button" onClick={closeAddModal}>
                      Cerrar
                    </button>
                  </form>
                </div>
              </Modal>

              {/* Modal: Seleccionar aportación */}
              <Modal
                isOpen={isSelectTaskModalOpen}
                onRequestClose={toggleSelectTaskModal}
                contentLabel="Seleccionar Aportación"
              >
                <h2>Seleccionar Aportación Favorita</h2>

                <div className="task-list" style={{ display: "grid", gap: 12, marginTop: 12 }}>
                  {favoritosUsuario.map((task) => (
                    <div
                      key={task.id}
                      className="task-item"
                      onClick={() => handleSelectTask(task)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 10,
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        cursor: "pointer",
                      }}
                    >
                      <div className="nuevo-image-container" style={{ width: 40, height: 40 }}>
                        {task.user_image && task.user_image !== "No image available" ? (
                          <img
                            src={getMediaUrl(task.user_image)}
                            alt="Imagen de Usuario"
                            className="nuevo-circle-image"
                            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="nuevo-user-infoImageIcon"
                            style={{ width: 40, height: 40, display: "grid", placeItems: "center" }}
                          >
                            <FontAwesomeIcon icon={faUser} style={{ color: "grey" }} />
                          </div>
                        )}
                      </div>

                      <div className="adjuntar" style={{ display: "grid" }}>
                        <div className="nuevo-username" style={{ fontWeight: 600 }}>
                          {task.username}
                        </div>
                        <div className="nuevo-titulo" style={{ opacity: 0.8 }}>
                          {task.title}
                        </div>
                      </div>
                    </div>
                  ))}
                  {favoritosUsuario.length === 0 && (
                    <div style={{ opacity: 0.7 }}>No tienes aportaciones favoritas aún.</div>
                  )}
                </div>

                <div style={{ marginTop: 12 }}>
                  <button onClick={toggleSelectTaskModal}>Cerrar</button>
                </div>
              </Modal>

              {/* Controles de orden / ventana */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
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
                  <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
                    <option value="">Todas</option>
                    <option value="day">Hoy</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                  </select>
                </label>
              </div>

              {/* Lista de comentarios */}
              <div className="peticionCommentsContainer">
                <div className="commentsHeader">{(commentsPage?.count ?? 0) + " comments"}</div>

                <div className="commentsContainer">
                  <NewPeticionComments
                    comments={results}
                    user={user}
                    handleReply={() => refetchComments()}
                    handleLike={handleLikeComment}
                    peticion={peticion?.pch}
                  />

                  {commentsLoading && <div style={{ padding: 12 }}>Cargando…</div>}
                  {!commentsLoading && results.length === 0 && (
                    <div style={{ padding: 12 }}>Aún no hay comentarios.</div>
                  )}

                  {/* Sentinel para infinite scroll */}
                  <div ref={bottomRef} style={{ height: 1 }} />
                </div>

                {/* (Opcional) Botón de respaldo */}
                {false && !commentsLoading && hasNext && (
                  <div style={{ padding: 12 }}>
                    <button className="btnpetition" onClick={() => setOffset((o) => o + limit)}>
                      Cargar más
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPeticionPost;
