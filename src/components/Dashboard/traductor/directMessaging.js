// src/components/Dashboard/traductor/DirectMessaging.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faUserPlus,
  faUsers,
  faTimes,
  faArrowLeft,
  faPaperclip,
  faReply,
} from "@fortawesome/free-solid-svg-icons";

import "../owenscss/Mensajes.scss";

const API_BASE_URL = "http://127.0.0.1:8000";

// Lee el token desde localStorage y construye los headers de auth
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("userTokenLG") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  if (!token) return {};
  // Si usas JWT, cambia "Token" por "Bearer"
  return { Authorization: `Token ${token}` };
};

const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
};

/* ======================= MODAL DE ACCIONES DE USUARIO ======================= */

const UserActionsModal = ({
  isOpen,
  onClose,
  user,
  onStartDirectMessage,
  onGoToProfile,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="dm-modal-backdrop">
      <div className="dm-modal">
        <div className="dm-modal-header">
          <div>
            <h3>{user.username}</h3>
            <p className="dm-modal-subtitle">Opciones con este usuario</p>
          </div>
          <button className="dm-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="dm-modal-section">
          <button
            className="dm-user-action-btn"
            onClick={() => onStartDirectMessage && onStartDirectMessage(user)}
          >
            Enviar mensaje directo
          </button>
          <button
            className="dm-user-action-btn"
            onClick={() => onGoToProfile && onGoToProfile(user)}
          >
            Ver perfil de aportaciones
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================= MODAL DE INFO DE GRUPO ======================= */

const GroupInfoModal = ({
  isOpen,
  onClose,
  groupInfo,
  members,
  availableUsers,
  loadingUsers,
  onAddMember,
  onRemoveMember,
  currentUserId,
  onDeleteGroup,
  onMakeAdmin,
  onUserClick,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen || !groupInfo) return null;

  const filteredAvailable = availableUsers.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const creatorUser =
    members.find((m) => m.id === groupInfo.created_by) || null;

  const isCreator = currentUserId === groupInfo.created_by;
  const isAdmin = groupInfo.current_user_is_admin;
  const canManage = isCreator || isAdmin;

  return (
    <div className="dm-modal-backdrop">
      <div className="dm-modal">
        <div className="dm-modal-header">
          <div>
            <h3>Información del grupo</h3>
            <p className="dm-modal-subtitle">
              {groupInfo.name}{" "}
              {creatorUser && (
                <span className="dm-modal-creator">
                  · Creado por{" "}
                  <span
                    className="dm-username-link"
                    onClick={() => onUserClick && onUserClick(creatorUser)}
                  >
                    {creatorUser.username}
                  </span>
                </span>
              )}
            </p>
          </div>
          <button className="dm-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="dm-modal-section">
          <h4>Miembros</h4>
          <div className="dm-modal-members-list">
            {members.length === 0 && (
              <p className="dm-modal-empty">No hay miembros en este grupo.</p>
            )}

            {members.map((m) => (
              <div key={m.id} className="dm-modal-member-row">
                <span className="dm-modal-member-name">
                  <span
                    className="dm-username-link"
                    onClick={() => onUserClick && onUserClick(m)}
                  >
                    {m.username}
                    {m.id === currentUserId && " (tú)"}
                  </span>

                  {m.is_creator && (
                    <span className="dm-role-badge dm-role-creator">
                      Creador
                    </span>
                  )}

                  {!m.is_creator && m.is_admin && (
                    <span className="dm-role-badge dm-role-admin">Admin</span>
                  )}
                </span>

                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    className="dm-modal-member-remove"
                    onClick={() => onRemoveMember(m.id)}
                    disabled={
                      m.is_creator || m.id === currentUserId || !canManage
                    }
                    title={
                      m.is_creator
                        ? "No puedes eliminar al creador del grupo."
                        : !canManage
                        ? "Solo el creador o un admin del grupo puede eliminar miembros."
                        : m.id === currentUserId
                        ? "Para salir del grupo luego hacemos un botón especial."
                        : "Eliminar de este grupo"
                    }
                  >
                    Eliminar
                  </button>

                  <button
                    className={`dm-modal-member-make-admin ${
                      m.is_admin ? "is-admin" : ""
                    }`}
                    onClick={() => onMakeAdmin && onMakeAdmin(m.id)}
                    disabled={!canManage || m.is_creator || m.id === currentUserId}
                    title={
                      !canManage
                        ? "Solo el creador o un admin del grupo puede gestionar administradores."
                        : m.is_creator
                        ? "El creador siempre es admin."
                        : m.id === currentUserId
                        ? "No puedes modificar tu propio rol aquí."
                        : m.is_admin
                        ? "Quitar permisos de administrador."
                        : "Convertir en administrador"
                    }
                  >
                    {m.is_creator
                      ? "Admin"
                      : m.is_admin
                      ? "Quitar admin"
                      : "Hacer admin"}
                  </button>
                </div>
              </div>
            ))}

            {!canManage && members.length > 0 && (
              <p className="dm-modal-empty">
                Solo el creador o un admin del grupo puede eliminar miembros o
                gestionar administradores.
              </p>
            )}
          </div>
        </div>

        <div className="dm-modal-section">
          <h4>Agregar miembros</h4>
          <input
            type="text"
            placeholder="Buscar usuarios por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dm-modal-search"
          />
          <div className="dm-modal-available-list">
            {loadingUsers ? (
              <p className="dm-modal-empty">Cargando usuarios...</p>
            ) : filteredAvailable.length === 0 ? (
              <p className="dm-modal-empty">
                No hay usuarios disponibles para agregar.
              </p>
            ) : (
              filteredAvailable.map((u) => (
                <div key={u.id} className="dm-modal-member-row">
                  <span className="dm-modal-member-name">{u.username}</span>
                  <button
                    className="dm-modal-member-add"
                    onClick={() => onAddMember(u.id)}
                  >
                    Agregar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {isCreator && (
          <div className="dm-modal-footer">
            <button className="dm-modal-delete-group" onClick={onDeleteGroup}>
              Eliminar grupo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ======================= COMPONENTE PRINCIPAL ======================= */

const DirectMessaging = () => {
  const { userId: routeParam } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const loggedUserId = authUser?.id ?? null;

  const [isMobile, setIsMobile] = useState(false);

  const [directMessages, setDirectMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatError, setChatError] = useState(null);

  const [messageText, setMessageText] = useState("");

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);

  const [selectedUserForActions, setSelectedUserForActions] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Adjuntos a enviar ahora
  const [attachments, setAttachments] = useState([]);

  // Responder a mensaje
  const [replyTo, setReplyTo] = useState(null);

  const autoSelectedRef = useRef(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);

  const [selectedConversation, setSelectedConversation] = useState(null);

  // Buscador de conversaciones (usuarios / grupos)
  const [conversationSearch, setConversationSearch] = useState("");

  // Modal para ver adjuntos de un mensaje ya enviado
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [attachmentsModalItems, setAttachmentsModalItems] = useState([]);

  // Menú de opciones de mensaje (long-press)
  const [messageMenu, setMessageMenu] = useState({
    open: false,
    message: null,
    isGroup: false,
  });
  const longPressTimerRef = useRef(null);
  const LONG_PRESS_MS = 600;

  // Swipe para responder
  const SWIPE_THRESHOLD = 60; // px hacia la derecha
  const touchDataRef = useRef({
    x: null,
    y: null,
    message: null,
    isGroup: false,
    canLongPress: false,
  });

  // refs por id de mensaje para poder hacer scroll al citado
  const messageRefs = useRef({});

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Cargar conversaciones
  const fetchConversations = async () => {
    setLoadingConversations(true);
    setConversationsError(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/massaging/conversations/`,
        { headers: getAuthHeaders() }
      );
      setConversations(res.data || []);
    } catch (err) {
      console.error("Error fetchConversations:", err.response || err);
      setConversationsError("Error al cargar las conversaciones.");
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/massaging/users/`, {
        headers: getAuthHeaders(),
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetchUsers:", err.response || err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Cargar conversaciones + usuarios al montar
  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  // Autoseleccionar conversación al cargar, basándonos SOLO en la URL
  useEffect(() => {
    if (autoSelectedRef.current) return;
    if (!routeParam || !conversations.length) return;

    let targetConv = null;

    if (routeParam.startsWith("group-")) {
      const groupId = routeParam.replace("group-", "");
      targetConv = conversations.find(
        (c) => c.type === "group" && String(c.id) === String(groupId)
      );
    } else if (routeParam.startsWith("user-")) {
      const userIdStr = routeParam.replace("user-", "");
      targetConv = conversations.find(
        (c) => c.type === "direct" && String(c.id) === String(userIdStr)
      );
    } else {
      // compat: /direcmassaging/5 → asumimos directo
      targetConv = conversations.find(
        (c) => c.type === "direct" && String(c.id) === String(routeParam)
      );
    }

    if (targetConv) {
      autoSelectedRef.current = true;
      handleSelectConversation(targetConv, false);
    }
  }, [routeParam, conversations]);

  const fetchGroupMembers = async (groupId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/massaging/groupss/`, {
        headers: getAuthHeaders(),
      });
      const groups = res.data || [];
      const group = groups.find((g) => g.id === groupId);
      setGroupMembers(group?.members || []);
      setGroupInfo(group || null);
    } catch (err) {
      console.error("Error fetchGroupMembers:", err.response || err);
      setGroupMembers([]);
      setGroupInfo(null);
    }
  };

  const fetchDirectMessages = async (otherUserId) => {
    setLoadingChat(true);
    setChatError(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/massaging/messages/?user_id=${otherUserId}`,
        { headers: getAuthHeaders() }
      );
      const msgs = (res.data || [])
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setDirectMessages(msgs);
    } catch (err) {
      console.error("Error fetchDirectMessages:", err.response?.data || err);
      setChatError("Error al cargar mensajes directos.");
    } finally {
      setLoadingChat(false);
    }
  };

  const fetchGroupMessages = async (groupId) => {
    setLoadingChat(true);
    setChatError(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/massaging/groupss/${groupId}/messages/`,
        { headers: getAuthHeaders() }
      );
      const msgs = Array.isArray(res.data) ? res.data : [];
      const ordered = msgs
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setGroupMessages(ordered);
    } catch (err) {
      console.error("Error fetchGroupMessages:", err.response || err);
      setChatError("Error al cargar mensajes del grupo.");
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSelectConversation = async (conv, pushRoute = true) => {
    autoSelectedRef.current = true;

    setSelectedConversation(conv);
    setDirectMessages([]);
    setGroupMessages([]);
    setMessageText("");
    setChatError(null);
    setShowGroupModal(false);
    clearAttachments();
    setReplyTo(null);

    if (conv.type === "direct") {
      if (pushRoute) {
        // usamos replace para no romper el "back" al origen
        navigate(`/dashboard/direcmassaging/user-${conv.id}`, { replace: true });
      }
      await fetchDirectMessages(conv.id);
    } else if (conv.type === "group") {
      if (pushRoute) {
        navigate(`/dashboard/direcmassaging/group-${conv.id}`, {
          replace: true,
        });
      }
      await fetchGroupMessages(conv.id);
      await fetchGroupMembers(conv.id);
    }
  };

  // === Adjuntar archivos ===
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      id:
        file.name +
        "-" +
        file.lastModified +
        "-" +
        Math.random().toString(36).slice(2),
      file,
      previewUrl: URL.createObjectURL(file),
      isImage: file.type.startsWith("image/"),
    }));

    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = null;
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => {
      const found = prev.find((a) => a.id === id);
      if (found && found.previewUrl) {
        URL.revokeObjectURL(found.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const clearAttachments = () => {
    setAttachments((prev) => {
      prev.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
      return [];
    });
  };

  // === Enviar mensaje ===
  const handleSendMessage = async () => {
    if (!selectedConversation) return;
    if (!messageText.trim() && attachments.length === 0) return;

    if (selectedConversation.type === "direct") {
      await sendDirectMessage();
    } else if (selectedConversation.type === "group") {
      await sendGroupMessage();
    }
  };

  const sendDirectMessage = async () => {
    try {
      setLoadingChat(true);

      const formData = new FormData();
      formData.append("receiver", selectedConversation.id);
      formData.append("content", messageText);

      // si estamos respondiendo
      if (replyTo && replyTo.id) {
        formData.append("reply_to", replyTo.id);
      }

      attachments.forEach((att) => {
        formData.append("attachments", att.file);
      });

      const firstImage = attachments.find((a) => a.isImage);
      const firstVideo = attachments.find(
        (a) => !a.isImage && a.file.type.startsWith("video/")
      );

      if (firstImage) {
        formData.append("image", firstImage.file);
      }
      if (firstVideo) {
        formData.append("video", firstVideo.file);
      }

      const res = await axios.post(
        `${API_BASE_URL}/massaging/messages/`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (Array.isArray(res.data)) {
        const ordered = res.data
          .slice()
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setDirectMessages(ordered);
      } else {
        setDirectMessages((prev) =>
          [...prev, res.data].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          )
        );
      }

      setMessageText("");
      clearAttachments();
      setReplyTo(null);
      fetchConversations();
    } catch (err) {
      console.error("Error sendDirectMessage:", err.response || err);
      setChatError("Error al enviar el mensaje directo.");
    } finally {
      setLoadingChat(false);
    }
  };

  const sendGroupMessage = async () => {
    if (!loggedUserId) {
      setChatError("No se pudo identificar al usuario autenticado.");
      return;
    }
    if (!messageText.trim() && attachments.length === 0) return;

    try {
      setLoadingChat(true);

      const formData = new FormData();
      formData.append("content", messageText);

      if (replyTo && replyTo.id) {
        formData.append("reply_to", replyTo.id);
      }

      attachments.forEach((att) => {
        formData.append("attachments", att.file);
      });

      const firstImage = attachments.find((a) => a.isImage);
      const firstVideo = attachments.find(
        (a) => !a.isImage && a.file.type.startsWith("video/")
      );

      if (firstImage) {
        formData.append("image", firstImage.file);
      }
      if (firstVideo) {
        formData.append("video", firstVideo.file);
      }

      const res = await axios.post(
        `${API_BASE_URL}/massaging/groupss/${selectedConversation.id}/send_message/`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newMsg = res.data;
      setGroupMessages((prev) =>
        [...prev, newMsg].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        )
      );
      setMessageText("");
      clearAttachments();
      setReplyTo(null);
      fetchConversations();
    } catch (err) {
      console.error("Error sendGroupMessage:", err.response || err);
      setChatError("Error al enviar mensaje al grupo.");
    } finally {
      setLoadingChat(false);
    }
  };

  // Auto scroll al final
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [directMessages, groupMessages]);

  // Crear grupo
  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/massaging/groupss/create/`,
        { name: newGroupName },
        { headers: getAuthHeaders() }
      );
      const group = res.data;
      setNewGroupName("");
      setShowCreateGroup(false);
      await fetchConversations();

      const newConv = {
        id: group.id,
        type: "group",
        title: group.name,
        last_message: "",
        last_timestamp: null,
      };

      const found = conversations.find(
        (c) => c.type === "group" && c.id === group.id
      );
      await handleSelectConversation(found || newConv, true);
    } catch (err) {
      console.error("Error createGroup:", err.response || err);
    }
  };

  const openGroupModal = async () => {
    if (!selectedConversation || selectedConversation.type !== "group") return;
    setShowGroupModal(true);
    if (!users.length) {
      await fetchUsers();
    }
    await fetchGroupMembers(selectedConversation.id);
  };

  const handleAddMember = async (userIdToAdd) => {
    if (!selectedConversation || selectedConversation.type !== "group") return;

    try {
      await axios.post(
        `${API_BASE_URL}/massaging/groupss/${selectedConversation.id}/add_member/`,
        { user_id: userIdToAdd },
        { headers: getAuthHeaders() }
      );

      const addedUser = users.find((u) => u.id === userIdToAdd);
      if (addedUser) {
        setGroupMembers((prev) => [...prev, addedUser]);
      }
    } catch (err) {
      console.error("Error handleAddMember:", err.response || err);
    }
  };

  const handleRemoveMember = async (userIdToRemove) => {
    if (!selectedConversation || selectedConversation.type !== "group") return;

    try {
      await axios.post(
        `${API_BASE_URL}/massaging/groupss/${selectedConversation.id}/remove_member/`,
        { user_id: userIdToRemove },
        { headers: getAuthHeaders() }
      );
      setGroupMembers((prev) => prev.filter((m) => m.id !== userIdToRemove));
    } catch (err) {
      console.error("Error handleRemoveMember:", err.response || err);
    }
  };

  const handleMakeAdmin = async (userIdToPromote) => {
    if (!selectedConversation || selectedConversation.type !== "group") return;

    try {
      await axios.post(
        `${API_BASE_URL}/massaging/groupss/${selectedConversation.id}/make_admin/`,
        { user_id: userIdToPromote },
        { headers: getAuthHeaders() }
      );

      await fetchGroupMembers(selectedConversation.id);
      alert("Rol de administrador actualizado.");
    } catch (err) {
      console.error("Error handleMakeAdmin:", err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
          "No se pudo actualizar el rol de admin. Verifica que seas administrador del grupo."
      );
    }
  };

  // Modal usuario
  const openUserModal = (user) => {
    if (!user) return;
    setSelectedUserForActions(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUserForActions(null);
  };

  const handleStartDirectFromModal = (user) => {
    if (!user) return;

    const baseConv = {
      id: user.id,
      type: "direct",
      title: user.username,
      last_message: "",
      last_timestamp: null,
    };

    const existing = conversations.find(
      (c) => c.type === "direct" && Number(c.id) === Number(user.id)
    );

    const convToUse = existing || baseConv;

    if (!existing) {
      setConversations((prev) => [...prev, convToUse]);
    }

    handleSelectConversation(convToUse, true);
    closeUserModal();
  };

  const handleGoToProfile = (user) => {
    if (!user) return;
    navigate(`/dashboard/aportaciones/${user.id}`);
    closeUserModal();
  };

  const availableUsers = users.filter(
    (u) => !groupMembers.some((m) => m.id === u.id)
  );

  const showSidebar = !isMobile || (isMobile && !selectedConversation);
  const showChatPanel = !isMobile || (isMobile && selectedConversation);

  const handleBackToConversations = () => {
    if (!isMobile) return;
    setSelectedConversation(null);
    setDirectMessages([]);
    setGroupMessages([]);
    setMessageText("");
    setChatError(null);
    setShowGroupModal(false);
    clearAttachments();
    setReplyTo(null);
  };

  // ==== long press helpers ====
  const startLongPress = (event, msg, isGroup) => {
    event.preventDefault();
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(() => {
      setMessageMenu({
        open: true,
        message: msg,
        isGroup,
      });
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const closeMessageMenu = () => {
    setMessageMenu({
      open: false,
      message: null,
      isGroup: false,
    });
  };

  const handleDeleteSelectedMessage = async () => {
    const { message, isGroup } = messageMenu;
    if (!message) return;

    const ok = window.confirm("¿Seguro que quieres eliminar este mensaje?");
    if (!ok) return;

    try {
      if (isGroup) {
        await axios.delete(
          `${API_BASE_URL}/massaging/group_messages/${message.id}/delete/`,
          { headers: getAuthHeaders() }
        );
        setGroupMessages((prev) => prev.filter((m) => m.id !== message.id));
      } else {
        await axios.delete(
          `${API_BASE_URL}/massaging/messages/${message.id}/delete/`,
          { headers: getAuthHeaders() }
        );
        setDirectMessages((prev) => prev.filter((m) => m.id !== message.id));
      }
    } catch (err) {
      console.error("Error al eliminar mensaje:", err.response || err);
      setChatError("No se pudo eliminar el mensaje.");
    } finally {
      closeMessageMenu();
    }
  };

  // ==== responder (swipe derecho) ====
  const handleReplyToMessage = (msg) => {
    if (!msg) return;
    setReplyTo(msg);
  };

  const handleMessageTouchStart = (e, msg, isGroup, isMine) => {
    const touch = e.touches[0];
    touchDataRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      message: msg,
      isGroup,
      canLongPress: !!isMine,
    };

    // solo long-press (para eliminar) en mis mensajes
    if (isMine) {
      startLongPress(e, msg, isGroup);
    }
  };

  const handleMessageTouchMove = (e) => {
    const touch = e.touches[0];
    const data = touchDataRef.current;
    if (!data || data.x == null || data.y == null) return;

    const dx = touch.clientX - data.x;
    const dy = touch.clientY - data.y;

    // más desplazamiento horizontal que vertical y hacia la derecha
    if (Math.abs(dx) > Math.abs(dy) && dx > SWIPE_THRESHOLD) {
      cancelLongPress();
      if (data.message) {
        handleReplyToMessage(data.message);
      }
      touchDataRef.current = {
        x: null,
        y: null,
        message: null,
        isGroup: false,
        canLongPress: false,
      };
    }
  };

  const handleMessageTouchEnd = () => {
    cancelLongPress();
    touchDataRef.current = {
      x: null,
      y: null,
      message: null,
      isGroup: false,
      canLongPress: false,
    };
  };

  // ==== scroll a mensaje citado ====
  const scrollToMessage = (messageId) => {
    if (!messageId) return;
    const el = messageRefs.current[messageId];
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("dm-message-highlight");
    setTimeout(() => {
      el.classList.remove("dm-message-highlight");
    }, 1200);
  };

  // ==== Construir adjuntos de un mensaje (backend -> front) ====
  const buildMessageAttachments = (msg) => {
    const result = [];
    if (!msg || !Array.isArray(msg.attachments)) return result;

    msg.attachments.forEach((att) => {
      const rawUrl = att.file;
      if (!rawUrl) return;

      const url = resolveMediaUrl(rawUrl);
      if (!url) return;

      let type = "file";
      const ft = (att.file_type || "").toLowerCase();

      if (
        att.is_image ||
        ft.startsWith("image/") ||
        /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(rawUrl)
      ) {
        type = "image";
      } else if (
        att.is_video ||
        ft.startsWith("video/") ||
        /\.(mp4|webm|ogg|mov)$/i.test(rawUrl)
      ) {
        type = "video";
      }

      result.push({
        type,
        url,
        name:
          att.name ||
          att.filename ||
          att.original_name ||
          rawUrl.split("/").pop() ||
          "archivo",
      });
    });

    return result;
  };

  // ==== Modal de adjuntos ====
  const openAttachmentsModal = (atts) => {
    if (!atts || !atts.length) return;
    setAttachmentsModalItems(atts);
    setShowAttachmentsModal(true);
  };

  const closeAttachmentsModal = () => {
    setShowAttachmentsModal(false);
    setAttachmentsModalItems([]);
  };

  // ==== Preview dentro de la burbuja ====
  const renderMessageAttachmentsPreview = (atts) => {
    if (!atts || !atts.length) return null;

    const media = atts.filter(
      (a) => a.type === "image" || a.type === "video"
    );
    const files = atts.filter((a) => a.type === "file");

    if (!media.length && !files.length) return null;

    const handleOpen = () => openAttachmentsModal(atts);

    if (media.length > 5) {
      const first4 = media.slice(0, 4);
      const extra = media.length - 4;

      return (
        <div className="dm-attachments-preview-multi" onClick={handleOpen}>
          <div className="dm-attachments-grid-4">
            {first4.map((att, idx) => (
              <div key={idx} className="dm-attachment-cell">
                {att.type === "image" ? (
                  <img src={att.url} alt={att.name} />
                ) : (
                  <video src={att.url} />
                )}
              </div>
            ))}
          </div>
          {extra > 0 && (
            <div className="dm-attachments-extra-badge">+{extra}</div>
          )}
        </div>
      );
    }

    return (
      <div className="dm-attachments-preview-normal">
        {media.map((att, idx) => (
          <div
            key={idx}
            className="dm-attachment-normal-item"
            onClick={handleOpen}
          >
            {att.type === "image" ? (
              <img src={att.url} alt={att.name} />
            ) : (
              <video src={att.url} controls />
            )}
          </div>
        ))}
        {files.map((att, idx) => (
          <a
            key={`file-${idx}`}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="dm-message-attachment-file"
            onClick={(e) => e.stopPropagation()}
          >
            {att.name}
          </a>
        ))}
      </div>
    );
  };

  // ==== BACK GLOBAL SINCRONIZADO CON ORIGEN ====
  const handleGlobalBack = () => {
    try {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/dashboard");
      }
    } catch {
      navigate("/dashboard");
    }
  };

  // ========= HELPERS PARA AVATARES (LISTA + HEADER) =========

  const getUserById = (id) => {
    return users.find((u) => Number(u.id) === Number(id));
  };

  const getUserAvatarData = (id, fallbackName) => {
    const user = getUserById(id);
    const username = user?.username || fallbackName || "";

    const rawImage =
      user?.image || user?.profile_image || user?.avatar || null;

    const imageUrl = rawImage ? resolveMediaUrl(rawImage) : null;

    const initial =
      username && username.trim().length
        ? username.trim().charAt(0).toUpperCase()
        : "?";

    return {
      imageUrl,
      initial,
      username,
    };
  };

  const renderSidebar = () => {
    if (loadingConversations) {
      return <p>Cargando conversaciones...</p>;
    }
    if (conversationsError) {
      return <p style={{ color: "red" }}>{conversationsError}</p>;
    }
    if (!conversations.length) {
      return <p>No tienes conversaciones todavía.</p>;
    }

    const search = conversationSearch.trim().toLowerCase();
    const filteredConversations = conversations.filter((conv) => {
      if (!search) return true;
      const title = (conv.title || "").toLowerCase();
      return title.includes(search);
    });

    if (!filteredConversations.length && search) {
      return (
        <p>
          No se encontraron conversaciones para &quot;{conversationSearch}
          &quot;.
        </p>
      );
    }

    return filteredConversations.map((conv) => {
      const isActive =
        selectedConversation &&
        selectedConversation.type === conv.type &&
        selectedConversation.id === conv.id;

      // Avatar solo para conversaciones directas
      let avatarData = null;
      if (conv.type === "direct") {
        avatarData = getUserAvatarData(conv.id, conv.title);
      }

      return (
        <div
          key={`${conv.type}-${conv.id}`}
          className={`dm-conversation-item ${isActive ? "active" : ""}`}
          onClick={() => handleSelectConversation(conv, true)}
        >
          {conv.type === "direct" && (
            <div className="dm-conversation-avatar">
              {avatarData?.imageUrl ? (
                <img src={avatarData.imageUrl} alt={avatarData.username} />
              ) : (
                <span>{avatarData?.initial}</span>
              )}
            </div>
          )}

          <div className="dm-conversation-main">
            <div className="dm-conversation-title">
              {conv.type === "direct" ? (
                <span
                  className="dm-username-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    openUserModal({ id: conv.id, username: conv.title });
                  }}
                >
                  {conv.title}
                </span>
              ) : (
                conv.title
              )}
              {conv.type === "group" && (
                <span className="dm-badge dm-badge-group">
                  <FontAwesomeIcon icon={faUsers} /> Grupo
                </span>
              )}
            </div>
            {conv.last_message && (
              <div className="dm-conversation-last">
                {conv.last_message.length > 40
                  ? conv.last_message.slice(0, 40) + "..."
                  : conv.last_message}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // Util para mostrar el bloque "respuesta a"
  const renderQuotedMessage = (msg) => {
    if (!msg) return null;

    const replied =
      msg.replied_to ||
      msg.reply_to ||
      msg.replied_message ||
      msg.parent_message ||
      msg.parent ||
      null;

    if (!replied) return null;

    const repliedContent =
      typeof replied === "object"
        ? replied.content || replied.text || ""
        : "";
    const repliedSender =
      typeof replied === "object"
        ? replied.sender?.username || replied.sender_username || ""
        : "";
    const repliedId = typeof replied === "object" ? replied.id : null;

    const previewText = repliedContent
      ? repliedContent.length > 80
        ? repliedContent.slice(0, 80) + "…"
        : repliedContent
      : "[Mensaje]";

    const handleClick = () => {
      if (repliedId != null) {
        scrollToMessage(repliedId);
      }
    };

    return (
      <div className="dm-replied-block" onClick={handleClick}>
        <div className="dm-replied-header">
          <FontAwesomeIcon icon={faReply} className="dm-replied-icon" />
          <span className="dm-replied-sender">
            {repliedSender || "Mensaje anterior"}
          </span>
        </div>
        <div className="dm-replied-text">{previewText}</div>
      </div>
    );
  };

  const renderMessages = () => {
    if (!selectedConversation) {
      return (
        <div className="dm-empty-chat">
          <p>Selecciona un usuario o grupo para comenzar a chatear.</p>
        </div>
      );
    }

    if (loadingChat) {
      return <p>Cargando mensajes...</p>;
    }

    if (chatError) {
      return <p style={{ color: "red" }}>{chatError}</p>;
    }

    const isDirect = selectedConversation.type === "direct";
    const msgs = isDirect ? directMessages : groupMessages;

    if (!msgs || msgs.length === 0) {
      return <p>No hay mensajes todavía.</p>;
    }

    return (
      <div className="dm-messages-list">
        {msgs.map((msg) => {
          const senderId = msg.sender?.id;
          const senderName = msg.sender?.username;
          const isMine =
            loggedUserId &&
            senderId &&
            Number(senderId) === Number(loggedUserId);

          const senderInitial =
            senderName && senderName.trim().length
              ? senderName.trim().charAt(0).toUpperCase()
              : "?";

          const atts = buildMessageAttachments(msg);

          return (
            <div
              key={msg.id}
              ref={(el) => {
                if (el) {
                  messageRefs.current[msg.id] = el;
                }
              }}
              className={`dm-message-bubble ${isMine ? "mine" : "theirs"}`}
              onMouseDown={
                isMine ? (e) => startLongPress(e, msg, !isDirect) : undefined
              }
              onMouseUp={isMine ? cancelLongPress : undefined}
              onMouseLeave={isMine ? cancelLongPress : undefined}
              onTouchStart={(e) =>
                handleMessageTouchStart(e, msg, !isDirect, isMine)
              }
              onTouchMove={handleMessageTouchMove}
              onTouchEnd={handleMessageTouchEnd}
            >
              {/* Bloque de "respuesta a" si el mensaje actual responde a otro */}
              {renderQuotedMessage(msg)}

              {/* Solo nombre/avatar (inicial) en grupos; sin foto real */}
              {!isDirect && senderId && (
                <div className="dm-message-header">
                  <div className="dm-message-avatar">
                    <span>{senderInitial}</span>
                  </div>
                  <span
                    className="dm-message-sender dm-username-link"
                    onClick={() =>
                      openUserModal({
                        id: senderId,
                        username: senderName,
                      })
                    }
                  >
                    {senderName}
                  </span>
                </div>
              )}

              <div className="dm-message-body">{msg.content}</div>

              {atts.length > 0 && (
                <div className="dm-message-attachments">
                  {renderMessageAttachmentsPreview(atts)}
                </div>
              )}

              {/* Hora abajo a la derecha */}
              <div className="dm-message-footer">
                <span className="dm-message-time">
                  {msg.timestamp ? moment(msg.timestamp).format("LT") : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const renderChatHeader = () => {
    if (!selectedConversation) return null;
    const isGroup = selectedConversation.type === "group";

    let directAvatarData = null;
    if (!isGroup) {
      directAvatarData = getUserAvatarData(
        selectedConversation.id,
        selectedConversation.title
      );
    }

    return (
      <div className="dm-chat-header">
        <div className="dm-chat-header-left">
          {isMobile && (
            <button
              className="dm-back-button"
              onClick={handleBackToConversations}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}

          {/* Avatar arriba del nombre SOLO en direct */}
          {!isGroup && (
            <div className="dm-chat-header-avatar">
              {directAvatarData?.imageUrl ? (
                <img
                  src={directAvatarData.imageUrl}
                  alt={directAvatarData.username}
                />
              ) : (
                <span>{directAvatarData?.initial}</span>
              )}
            </div>
          )}

          {isGroup ? (
            <h2>{selectedConversation.title}</h2>
          ) : (
            <h2>
              <span
                className="dm-username-link"
                onClick={() =>
                  openUserModal({
                    id: selectedConversation.id,
                    username: selectedConversation.title,
                  })
                }
              >
                {selectedConversation.title}
              </span>
            </h2>
          )}

          {isGroup && (
            <span className="dm-badge dm-badge-group">
              <FontAwesomeIcon icon={faUsers} /> Grupo
            </span>
          )}
        </div>
        {isGroup && (
          <button
            className="dm-add-members-btn"
            onClick={openGroupModal}
            title="Ver información del grupo y gestionar miembros"
          >
            <FontAwesomeIcon icon={faUserPlus} /> Miembros
          </button>
        )}
      </div>
    );
  };

  const renderInput = () => {
    if (!selectedConversation) return null;

    // texto corto para el preview de respuesta
    const replyPreviewText =
      replyTo && replyTo.content
        ? replyTo.content.length > 80
          ? replyTo.content.slice(0, 80) + "…"
          : replyTo.content
        : "";

    const replyPreviewSender =
      replyTo && replyTo.sender
        ? replyTo.sender.id === loggedUserId
          ? "Tú"
          : replyTo.sender.username || "Usuario"
        : "Mensaje";

    return (
      <div className="dm-input-container">
        {/* Preview de "respondiendo a ..." */}
        {replyTo && (
          <div className="dm-reply-preview">
            <div className="dm-reply-preview-header">
              <div className="dm-reply-preview-title">
                <FontAwesomeIcon icon={faReply} className="dm-reply-icon" />
                <span>Respondiendo a {replyPreviewSender}</span>
              </div>
              <button
                className="dm-reply-preview-close"
                onClick={() => setReplyTo(null)}
              >
                ×
              </button>
            </div>
            <div className="dm-reply-preview-body">
              {replyPreviewText || "[Mensaje]"}
            </div>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="dm-attachments-preview">
            {attachments.map((att) => (
              <div key={att.id} className="dm-attachment-thumb">
                {att.isImage ? (
                  <img src={att.previewUrl} alt={att.file.name} />
                ) : (
                  <div className="dm-attachment-file-icon">
                    <span>{att.file.name}</span>
                  </div>
                )}
                <button
                  className="dm-attachment-remove"
                  onClick={() => handleRemoveAttachment(att.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="dm-input-row">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="dm-file-input-hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="dm-attach-button"
            onClick={() =>
              fileInputRef.current && fileInputRef.current.click()
            }
            title="Adjuntar archivos"
          >
            <FontAwesomeIcon icon={faPaperclip} />
          </button>

          <textarea
            className="dm-input"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Escribe un mensaje..."
            rows={2}
          />
          <button
            className="dm-send-button"
            onClick={handleSendMessage}
            disabled={!messageText.trim() && attachments.length === 0}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    );
  };

  const handleDeleteGroup = async () => {
    if (!selectedConversation || selectedConversation.type !== "group") return;

    const groupId = selectedConversation.id;

    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar este grupo? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      await axios.post(
        `${API_BASE_URL}/massaging/groupss/${groupId}/delete/`,
        {},
        { headers: getAuthHeaders() }
      );

      setShowGroupModal(false);
      setSelectedConversation(null);
      setGroupMembers([]);
      setGroupInfo(null);
      setGroupMessages([]);
      setMessageText("");
      setChatError(null);
      clearAttachments();
      setReplyTo(null);

      await fetchConversations();
      navigate("/dashboard/direcmassaging");
    } catch (err) {
      console.error("Error handleDeleteGroup:", err.response || err);
      alert(
        "No se pudo eliminar el grupo. Verifica que seas el creador del grupo."
      );
    }
  };

  return (
    <div className={`dm-wrapper ${isMobile ? "dm-wrapper-mobile" : ""}`}>
      {showSidebar && (
        <div className="dm-sidebar">
          <div className="dm-sidebar-header">
            <button
              className="dm-global-back-btn"
              onClick={handleGlobalBack}
              title="Regresar"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h1>Mensajes</h1>
            <button
              className="dm-new-group-btn"
              onClick={() => setShowCreateGroup((prev) => !prev)}
            >
              + Grupo
            </button>
          </div>

          {showCreateGroup && (
            <div className="dm-create-group">
              <input
                type="text"
                placeholder="Nombre del grupo"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <div className="dm-create-group-actions">
                <button onClick={createGroup} disabled={!newGroupName.trim()}>
                  Crear
                </button>
                <button onClick={() => setShowCreateGroup(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Buscador de conversaciones */}
          <div className="dm-sidebar-search">
            <input
              type="text"
              placeholder="Buscar conversación..."
              value={conversationSearch}
              onChange={(e) => setConversationSearch(e.target.value)}
            />
          </div>

          <div className="dm-sidebar-list">{renderSidebar()}</div>
        </div>
      )}

      {showChatPanel && (
        <div className="dm-chat-panel">
          {renderChatHeader()}
          <div className="dm-chat-body">{renderMessages()}</div>
          {renderInput()}
        </div>
      )}

      {selectedConversation && selectedConversation.type === "group" && (
        <GroupInfoModal
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          groupInfo={groupInfo}
          members={groupMembers}
          availableUsers={availableUsers}
          loadingUsers={loadingUsers}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          currentUserId={loggedUserId}
          onDeleteGroup={handleDeleteGroup}
          onMakeAdmin={handleMakeAdmin}
          onUserClick={openUserModal}
        />
      )}

      <UserActionsModal
        isOpen={showUserModal}
        onClose={closeUserModal}
        user={selectedUserForActions}
        onStartDirectMessage={handleStartDirectFromModal}
        onGoToProfile={handleGoToProfile}
      />

      {showAttachmentsModal && (
        <div
          className="dm-attachments-modal-backdrop"
          onClick={closeAttachmentsModal}
        >
          <div
            className="dm-attachments-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dm-attachments-modal-close"
              onClick={closeAttachmentsModal}
            >
              ×
            </button>
            <div className="dm-attachments-modal-list">
              {attachmentsModalItems.map((att, idx) => (
                <div key={idx} className="dm-attachments-modal-item">
                  {att.type === "image" ? (
                    <img src={att.url} alt={att.name} />
                  ) : att.type === "video" ? (
                    <video src={att.url} controls />
                  ) : (
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {att.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {messageMenu.open && (
        <div className="dm-msg-menu-backdrop" onClick={closeMessageMenu}>
          <div className="dm-msg-menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="dm-msg-menu-item dm-msg-menu-delete"
              onClick={handleDeleteSelectedMessage}
            >
              Eliminar mensaje
            </button>
            <button className="dm-msg-menu-item" onClick={closeMessageMenu}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectMessaging;
