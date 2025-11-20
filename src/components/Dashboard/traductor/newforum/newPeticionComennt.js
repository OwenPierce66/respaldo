import React, { useEffect, useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faHeart, faTrash, faPlus, faMinus, faUser, faVideo } from "@fortawesome/free-solid-svg-icons";
import "../../owenscss/comentarios.scss";
import Modal from 'react-modal';
import LinkPreview from "./archivos/LinkPreview";
import PeticionCard from "./peticionCard";

import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useLazyGetCommentLikesQuery,
}from "../commentApi";

// RTK Query (comments)

const getMediaUrl = (path) => (path ? `http://127.0.0.1:8000${path}` : '');

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

  const [masTasks, setMasTasks] = useState([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  const [masFactores, setMasFactores] = useState([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
  const [masFuentes, setMasFuentes] = useState([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);

  // RTK Query mutations/queries
  const [createComment, { isLoading: creatingReply }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [triggerGetLikes] = useLazyGetCommentLikesQuery();

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

  const onDelete = async () => {
    if (!confirm("Confirm You Want To Delete Comment.")) return;
    try {
      await deleteComment({ taskId: comment.post, commentId: comment.id }).unwrap();
      handleReply();
    } catch (e) {
      console.error("Error deleting comment:", e);
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyText && !masTasks.some(t => t.image || t.video) && !masFactores.some(t => t.image || t.video) && !masFuentes.some(t => t.image || t.video)) return;

    const formData = new FormData();
    formData.append('created_by', user.id);
    formData.append('parent', comment.id);
    formData.append('post', comment.post);
    formData.append('text', replyText);

    masTasks.forEach((t, i) => {
      formData.append(`subtasks[${i}][title]`, t.title);
      formData.append(`subtasks[${i}][description]`, t.description);
      formData.append(`subtasks[${i}][link]`, t.link);
      if (t.image) formData.append(`subtasks[${i}][image]`, t.image, t.image.name);
      if (t.video) formData.append(`subtasks[${i}][video]`, t.video, t.video.name);
    });

    masFactores.forEach((t, i) => {
      formData.append(`subfactores[${i}][title]`, t.title);
      formData.append(`subfactores[${i}][description]`, t.description);
      formData.append(`subfactores[${i}][link]`, t.link);
      if (t.image) formData.append(`subfactores[${i}][image]`, t.image, t.image.name);
      if (t.video) formData.append(`subfactores[${i}][video]`, t.video, t.video.name);
    });

    masFuentes.forEach((t, i) => {
      formData.append(`subfuentes[${i}][title]`, t.title);
      formData.append(`subfuentes[${i}][description]`, t.description);
      formData.append(`subfuentes[${i}][link]`, t.link);
      if (t.image) formData.append(`subfuentes[${i}][image]`, t.image, t.image.name);
      if (t.video) formData.append(`subfuentes[${i}][video]`, t.video, t.video.name);
    });

    try {
      await createComment({ taskId: comment.post, body: formData }).unwrap();
      setReplyText("");
      setShowReplyBox(false);
      setMasTasks([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
      setMasFactores([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
      setMasFuentes([{ title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }]);
      handleReply(comment.id, replyText);
    } catch (err) {
      console.error("Error submitting reply:", err);
    }
  };

  const toggleTree = () => {
    const child = document.getElementById(`replies${comment.id}`);
    const button = document.getElementById(`commentButton${comment.id}`);
    if (!child || !button) return;
    child.style.display = child.style.display === "none" ? "block" : "none";
    button.textContent = button.textContent === "Hide Replies" ? "Show Replies" : "Hide Replies";
  };

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

  const handleFileChange = handleFileFor(setMasTasks);
  const handlePostFileChangeFuente = handleFileFor(setMasFuentes);
  const handlePostFileChangeFactor = handleFileFor(setMasFactores);

  const handleListUsersWhoLikedComment = async (commentId) => {
    try {
      const { data } = await triggerGetLikes({ taskId: comment.post, commentId }).unwrap();
      setListUsers(data || []);
    } catch (e) {
      // Si usas builder.query simple, el unwrap es el array, ajusta así:
      const res = await triggerGetLikes({ taskId: comment.post, commentId });
      // @ts-ignore
      setListUsers(res?.data || []);
    }
    setModalOpen(true);
  };

  const imageSelect = (image) => {
    setModalOpenImage(true);
    setImagen(image);
  };

  const handleSectionChange = (section) => setVisibleSection(section);

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
    <div className="comment-container" id={comment.id}>
      <div className="comment-container2">
        <div className="redondear">
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
                    <div className="commentedAt">{moment(comment.created_at).fromNow()}</div>
                  </div>
                </div>
              </div>
              <div className="comment-icons">
                <div className="icon2">
                  {user.id === comment.created_by.id && (
                    <div className="material-iconi" onClick={onDelete}>
                      <FontAwesomeIcon icon={faTrash} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {comment.aportacion && (
              <div className="section-buttons" style={{ margin: "16px", marginLeft: "-155px" }}>
                <button className="section-button" onClick={() => setModalOpenAportacion(true)}>Ver Aportación</button>
              </div>
            )}

            <Modal
              isOpen={modalOpenAportacion}
              onRequestClose={() => setModalOpenAportacion(false)}
              contentLabel="Detalle de Aportación"
              style={customStyles}
            >
              <div>
                <h2>Detalles de la Aportación</h2>
                <PeticionCard peticionId={comment.aportacion} />
                <button onClick={() => setModalOpenAportacion(false)}>Cerrar</button>
              </div>
            </Modal>

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

          {/* Tabs subtareas/factores/fuentes */}
          <div className="section-buttons" style={{ justifyContent: "normal", marginLeft: "16px" }}>
            <button className={`section-button ${visibleSection === 'subtasks' ? 'selected' : ''}`} onClick={() => handleSectionChange('subtasks')}>SubComentario</button>
            <button className={`section-button ${visibleSection === 'subFactores' ? 'selected' : ''}`} onClick={() => handleSectionChange('subFactores')}>Factores</button>
            <button className={`section-button ${visibleSection === 'subFuentes' ? 'selected' : ''}`} onClick={() => handleSectionChange('subFuentes')}>Fuentes</button>
          </div>

          {visibleSection === 'subtasks' && (
            <div className="subtasks-container">
              {comment.subtasks.map(subtask => (
                <div key={subtask.id} className="subtask">
                  <div className="textol">
                    <div className="titulo2">{subtask.title}</div>
                    <div className="titulo1">{subtask.description}</div>
                  </div>
                  {subtask.image && <img src={getMediaUrl(subtask.image)} className="imagePch" alt="Subtask" />}
                  {subtask.video && (
                    <video controls className="testimonial-video">
                      <source src={getMediaUrl(subtask.video)} type="video/mp4" />
                    </video>
                  )}
                  <div className="moldeando">
                    {subtask.link && subtask.link.trim() !== "" && subtask.link !== "undefined" && (
                      !showLink ? (
                        <button onClick={() => setShowLink(true)}>Ver link</button>
                      ) : (
                        <div>
                          <LinkPreview url={subtask.link} />
                          <button onClick={() => setShowLink(false)}>Ocultar link</button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {visibleSection === 'subFactores' && (
            <div className="subtasks-container">
              <div className="subtasks-container-sub">
                {Array.isArray(comment.subFactores) && comment.subFactores.length > 0 ? (
                  comment.subFactores.map(subfactor => (
                    <div key={subfactor.id} className="subtask">
                      <div className="textol">
                        <div className="titulo2">{subfactor.title}</div>
                        <div className="titulo1">{subfactor.description}</div>
                      </div>
                      {subfactor.image && <img src={getMediaUrl(subfactor.image)} className="imagePch" alt="Subfactor" />}
                      {subfactor.video && (
                        <video controls className="testimonial-video">
                          <source src={getMediaUrl(subfactor.video)} type="video/mp4" />
                        </video>
                      )}
                      <div className="moldeando">
                        {subfactor.link && subfactor.link.trim() !== "" && subfactor.link !== "undefined" && (
                          !showLink ? (
                            <button onClick={() => setShowLink(true)}>Ver link</button>
                          ) : (
                            <div>
                              <LinkPreview url={subfactor.link} />
                              <button onClick={() => setShowLink(false)}>Ocultar link</button>
                            </div>
                          )
                        )}
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
                {Array.isArray(comment.subFuentes) && comment.subFuentes.length > 0 ? (
                  comment.subFuentes.map(subfuente => (
                    <div key={subfuente.id} className="subtask">
                      <div className="textol">
                        <div className="titulo2">{subfuente.title}</div>
                        <div className="titulo1">{subfuente.description}</div>
                      </div>
                      {subfuente.image && <img src={getMediaUrl(subfuente.image)} className="imagePch" alt="Subfuente" />}
                      {subfuente.video && (
                        <video controls className="testimonial-video">
                          <source src={getMediaUrl(subfuente.video)} type="video/mp4" />
                        </video>
                      )}
                      <div className="moldeando">
                        {subfuente.link && subfuente.link.trim() !== "" && subfuente.link !== "undefined" && (
                          !showLink ? (
                            <button onClick={() => setShowLink(true)}>Ver link</button>
                          ) : (
                            <div>
                              <LinkPreview url={subfuente.link} />
                              <button onClick={() => setShowLink(false)}>Ocultar link</button>
                            </div>
                          )
                        )}
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
              <div style={{ padding: "5px" }} onClick={() => setShowReplyBox(v => !v)}>
                <button className="comment-reply-link" style={{ color: "white" }}>Responder</button>
              </div>

              <div className="mostrar">
                <button onClick={toggleTree} id={`commentButton${comment.id}`} className="comment-toggle-link" style={{ color: "white" }}>
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
              {listUsers.map(u => (
                <div className="user-info" key={u.id} onClick={() => setPeticionajena(u.id)}>
                  <div className="user-image-container">
                    {u.user_image && u.user_image !== "No image available" ? (
                      <img src={getMediaUrl(u.user_image)} alt="Usuario" className="user-circle-image" />
                    ) : (
                      <div className="user-icon-placeholder">
                        <FontAwesomeIcon icon={faUser} style={{ color: "grey", cursor: "pointer" }} />
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <div className="username-info">{u.username}</div>
                  </div>
                  <div className="LikeHeart">
                    <div className="likes-count-info">{u.likes_count}</div>
                    <FontAwesomeIcon icon={faHeart} style={{ color: "grey", cursor: "pointer" }} />
                  </div>
                </div>
              ))}
            </ul>
            <button onClick={() => setModalOpen(false)}>Cerrar</button>
          </Modal>

          {showReplyBox && (
            <form className="replyBox" onSubmit={submitReply}>
              <textarea
                placeholder={`Type here to reply to ${comment.created_by.first_name || comment.created_by.username}`}
                className="Comment"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>

              {/* Sub Comment */}
              <div className="section-container">
                <div className="titulo-task">Sub Comment</div>
                {masTasks.map((task, index) => (
                  <div key={index} className="task-item">
                    <input type="text" name="title" value={task.title} onChange={(e) => setMasTasks(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t))} placeholder="Title" />
                    <textarea name="description" value={task.description} onChange={(e) => setMasTasks(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t))} placeholder="Description" />
                    <input type="file" onChange={(e) => handleFileChange(index, e)} accept="image/*,video/*" style={{ display: 'none' }} id={`task-file-${index}`} />
                    <label htmlFor={`task-file-${index}`} className="file-label">
                      <FontAwesomeIcon icon={faImage} /> / <FontAwesomeIcon icon={faVideo} />
                    </label>
                    {task.imagePreview && <img src={task.imagePreview} alt="Preview" className="preview-image" />}
                    {task.videoPreview && <video src={task.videoPreview} controls className="preview-video" />}
                    <div className="botonesAddPCH">
                      <button type="button" onClick={() => setMasTasks(prev => [...prev, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }])}><FontAwesomeIcon icon={faPlus} /></button>
                      <button type="button" onClick={() => setMasTasks(prev => prev.filter((_, i) => i !== index))}><FontAwesomeIcon icon={faMinus} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Factor */}
              <div className="section-container">
                <div className="titulo-factor">Factor</div>
                {masFactores.map((factor, index) => (
                  <div key={index} className="factor-item">
                    <input type="text" name="title" value={factor.title} onChange={(e) => setMasFactores(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t))} placeholder="Title" />
                    <textarea name="description" value={factor.description} onChange={(e) => setMasFactores(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t))} placeholder="Description" />
                    <input type="file" onChange={(e) => handlePostFileChangeFactor(index, e)} accept="image/*,video/*" style={{ display: 'none' }} id={`factor-file-${index}`} />
                    <label htmlFor={`factor-file-${index}`} className="file-label">
                      <FontAwesomeIcon icon={faImage} /> / <FontAwesomeIcon icon={faVideo} />
                    </label>
                    {factor.imagePreview && <img src={factor.imagePreview} alt="Preview" className="preview-image" />}
                    {factor.videoPreview && <video src={factor.videoPreview} controls className="preview-video" />}
                    <div className="botonesAddPCH">
                      <button type="button" onClick={() => setMasFactores(prev => [...prev, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }])}><FontAwesomeIcon icon={faPlus} /></button>
                      <button type="button" onClick={() => setMasFactores(prev => prev.filter((_, i) => i !== index))}><FontAwesomeIcon icon={faMinus} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fuente */}
              <div className="section-container">
                <div className="titulo-fuente">Fuente</div>
                {masFuentes.map((fuente, index) => (
                  <div key={index} className="fuente-item">
                    <input type="text" name="title" value={fuente.title} onChange={(e) => setMasFuentes(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t))} placeholder="Title" />
                    <textarea name="description" value={fuente.description} onChange={(e) => setMasFuentes(prev => prev.map((t, i) => i === index ? { ...t, [e.target.name]: e.target.value } : t))} placeholder="Description" />
                    <input type="file" onChange={(e) => handlePostFileChangeFuente(index, e)} accept="image/*,video/*" style={{ display: 'none' }} id={`fuente-file-${index}`} />
                    <label htmlFor={`fuente-file-${index}`} className="file-label">
                      <FontAwesomeIcon icon={faImage} /> / <FontAwesomeIcon icon={faVideo} />
                    </label>
                    {fuente.imagePreview && <img src={fuente.imagePreview} alt="Preview" className="preview-image" />}
                    {fuente.videoPreview && <video src={fuente.videoPreview} controls className="preview-video" />}
                    <div className="botonesAddPCH">
                      <button type="button" onClick={() => setMasFuentes(prev => [...prev, { title: '', description: '', link: '', image: null, video: null, imagePreview: null, videoPreview: null }])}><FontAwesomeIcon icon={faPlus} /></button>
                      <button type="button" onClick={() => setMasFuentes(prev => prev.filter((_, i) => i !== index))}><FontAwesomeIcon icon={faMinus} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={creatingReply}>Submit</button>
            </form>
          )}

          <div className="replies" id={`replies${comment.id}`}>
            {nestedComments}
          </div>

          <Modal isOpen={isModalOpenImage} onRequestClose={() => setModalOpenImage(false)} contentLabel="Imagen del comentario" style={{ padding: "0px !important " }}>
            <img src={getMediaUrl(imagen)} alt="Imagen" onClick={() => setModalOpenImage(false)} className="imagenPeticionModel" />
            <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

const NewPeticionComments = ({ comments, user, handleReply, handleLike, peticion }) => {
  return (
    <div>
      {comments.map((comment) =>
        comment.is_parent ? (
          <NewPeticionComment
            key={comment.id}
            comment={comment}
            user={user}
            handleReply={handleReply}
            handleLike={handleLike}
            peticion={peticion}
          />
        ) : null
      )}
    </div>
  );
};

export default NewPeticionComments;
