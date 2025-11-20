import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../owenscss/traductor.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

// RTK Query (nuevo)
import { useGetTaskCommentsQuery, useCreateCommentMutation, useToggleCommentLikeMutation, useDeleteCommentMutation } from './commentApi';


/**
 * Props esperadas mínimas:
 * - peticion: { id, user, username, title, description, ... }  => la Tarea (Task)
 * - usuario:   id de usuario logueado (opcional, pero útil para saber si puede borrar)
 * - usuarioName: string del username actual (opcional)
 * - setPeticion?: function para cerrar/volver (opcional)
 */
const Comentarios = (props) => {
  const taskId = props?.peticion?.id;
  const currentUserId = props?.usuario ?? null;

  // UI local
  const [text, setText] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [parentId, setParentId] = useState(null); // para Responder
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [likesModalUsers, setLikesModalUsers] = useState([]);
  const inputRef = useRef(null);

  // Data (RTK)
  const { data: commentsPage, isFetching, refetch } = useGetTaskCommentsQuery(
    { taskId },
    { skip: !taskId }
  );
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [toggleLike] = useToggleCommentLikeMutation();
  const [deleteComment] = useDeleteCommentMutation();
  // const [triggerGetLikes, likesReq] = useLazyGetCommentLikesQuery(); // si agregas endpoint opcional

  const comments = useMemo(() => commentsPage?.results ?? [], [commentsPage]);

  // Helpers
  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedImageFile(file);
    setSelectedImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const scrollToInput = () => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRef.current.focus();
    }
  };

  const onClickReply = (commentId) => {
    setParentId(commentId);
    scrollToInput();
  };

  const userHasLiked = (comment) => {
    // comment.like_set viene del serializer NewPeticionCommentSerializer (source="likes")
    if (!currentUserId || !Array.isArray(comment?.like_set)) return false;
    return comment.like_set.some((l) => l?.user?.id === currentUserId);
  };

  const handleAddComment = async () => {
    if (!taskId || !text.trim()) return;

    const body = new FormData();
    // El backend setea 'post' (Task) desde la URL; aquí solo mandamos campos del comentario:
    body.append('text', text.trim());
    if (parentId) body.append('parent', String(parentId));

    // Si adjuntas imagen, la empujo como subtask[0][image]
    if (selectedImageFile) {
      body.append('subtasks[0][title]', '');
      body.append('subtasks[0][description]', '');
      body.append('subtasks[0][link]', '');
      body.append('subtasks[0][image]', selectedImageFile);
    }

    try {
      await createComment({ taskId, body }).unwrap();
      setText('');
      setSelectedImageFile(null);
      setSelectedImagePreview(null);
      setParentId(null);
    } catch (e) {
      console.error('Error creando comentario:', e);
    }
  };

  const handleToggleLike = async (c) => {
    try {
      await toggleLike({ taskId, commentId: c.id }).unwrap();
    } catch (e) {
      console.error('Error al dar/ retirar like:', e);
    }
  };

  const handleDeleteComment = async (c) => {
    if (!currentUserId || c?.created_by?.id !== currentUserId) return;
    try {
      await deleteComment({ taskId, commentId: c.id }).unwrap();
    } catch (e) {
      console.error('Error al borrar comentario:', e);
    }
  };

  const openLikesModal = (c) => {
    // sin endpoint extra, usamos el like_set que ya viene con el comentario
    setLikesModalUsers(Array.isArray(c?.like_set) ? c.like_set.map(ls => ls.user) : []);
    setLikesModalOpen(true);
  };

  const renderComment = (c) => {
    return (
      <div key={c.id} className="comment" style={{ borderRadius: 10 }}>
        <div className="contentt" style={{ marginRight: 0, width: '100%' }}>
          <div className="redondear">
            <div className="hole">
              <div className="icon1">
                {/* espacio para editar si luego agregas endpoint PUT */}
              </div>
              <div className="icon2">
                {currentUserId && c?.created_by?.id === currentUserId ? (
                  <button
                    className="material-iconi"
                    title="Eliminar"
                    onClick={() => handleDeleteComment(c)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="usuario" style={{ height: 20 }}>
              {c?.created_by?.username ?? 'usuario'}
            </div>

            <div className="textol">
              <div className="titulo2">{c?.text}</div>
            </div>

            {/* Subadjuntos (si los hay) */}
            {Array.isArray(c?.subtasks) && c.subtasks.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {c.subtasks.map((s) => (
                  <div key={s.id} className="imagenPeticion">
                    {s.image ? (
                      <img src={s.image} alt="sub" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            <div className="line-down">
              <div className="likes">
                <div style={{ padding: 5 }}>
                  <button
                    type="button"
                    className="nlink"
                    onClick={() => onClickReply(c.id)}
                    aria-label={`Responder al comentario ${c.id}`}
                  >
                    Responder
                  </button>
                </div>

                <div className="megusta">
                  <div className="like">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(c)}
                      className="icon-button"
                      aria-pressed={userHasLiked(c)}
                      title={userHasLiked(c) ? 'Quitar me gusta' : 'Me gusta'}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ color: userHasLiked(c) ? '#54afff' : 'white' }}
                      />
                    </button>

                    <button
                      type="button"
                      className="like_cantidad"
                      onClick={() => openLikesModal(c)}
                      title="Ver quiénes dieron like"
                    >
                      {c?.likes_count ?? 0}
                    </button>
                  </div>
                  <div className="unlike">{/* reservado */}</div>
                </div>
              </div>
            </div>

            {/* Hijos (thread) */}
            {Array.isArray(c?.children) && c.children.length > 0 && (
              <div style={{ marginLeft: 18, marginTop: 10 }}>
                {c.children.map((h) => renderComment(h))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!taskId) return null;

  return (
    <div>
      {/* Caja para escribir comentario */}
      <div style={{ paddingTop: 10 }}>
        <div className="whatpetition">
          <div className="whatpetitiontitle">
            {parentId ? 'Respondiendo a un comentario…' : '¿Cuál es tu comentario?'}
          </div>

          <textarea
            ref={inputRef}
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe tu comentario…"
            className="comentario-input"
          />

          {/* Adjuntar imagen (como subtask[0][image]) */}
          <div className="imagenInput">
            <label htmlFor="fileInput">
              <div className="imagenIcon">
                <FontAwesomeIcon icon={faImage} />
              </div>
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {selectedImagePreview ? (
              <img
                src={selectedImagePreview}
                alt="preview"
                className="imagenPeticion"
                style={{ height: 100, width: 100 }}
              />
            ) : null}
          </div>

          <div>
            <button className="btnpetition" disabled={isCreating || !text.trim()} onClick={handleAddComment}>
              {isCreating ? 'Agregando…' : parentId ? 'Responder' : 'Agregar'}
            </button>

            {parentId ? (
              <button
                className="btnpetition"
                style={{ marginLeft: 8, background: '#777' }}
                onClick={() => setParentId(null)}
              >
                Cancelar respuesta
              </button>
            ) : null}
          </div>
        </div>

        {props?.setPeticion ? (
          <div>
            <button className="btnpetition" onClick={() => props.setPeticion('')}>
              Volver
            </button>
          </div>
        ) : null}
      </div>

      {/* Listado */}
      <div className="contenido-pagin">
        {/* Cabecera de la tarea (opcional, similar a tu versión previa) */}
        <div key={`task-${taskId}`} className="comment" style={{ borderRadius: 10 }}>
          <div className="contentt" style={{ marginRight: 0, width: '100%' }}>
            <div className="redondear">
              <div className="usuario" style={{ height: 20 }}>
                {props?.peticion?.username}
              </div>
              <div className="textol">
                <div className="titulo2">{props?.peticion?.title}</div>
                {props?.peticion?.description ? (
                  <div className="titulo1">{props?.peticion?.description}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        {isFetching ? (
          <div style={{ padding: 16 }}>Cargando comentarios…</div>
        ) : comments.length === 0 ? (
          <div style={{ padding: 16 }}>Aún no hay comentarios.</div>
        ) : (
          comments.map((c) => renderComment(c))
        )}
      </div>

      {/* Modal de usuarios que dieron like */}
      <Modal isOpen={likesModalOpen} onRequestClose={() => setLikesModalOpen(false)} contentLabel="Usuarios que dieron like">
        <h2>Usuarios que dieron “like”</h2>
        <ul style={{ paddingLeft: 18 }}>
          {likesModalUsers.length === 0 ? (
            <li>Nadie aún</li>
          ) : (
            likesModalUsers.map((u) => (
              <li key={u.id}>
                {u.username} (id: {u.id})
              </li>
            ))
          )}
        </ul>
        <button onClick={() => setLikesModalOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default Comentarios;
