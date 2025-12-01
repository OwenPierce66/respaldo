// src/screens/private/Groups/Groups.js
import React, { useEffect, useState, useCallback } from "react";
import GroupParticipants from "../../../components/Groups/GroupParticipants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faPlus,
  faEllipsisH,
  faSignOutAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { useSelector } from "react-redux";
import GroupChat from "../../../components/Groups/GroupChat";
import AddParticipants from "../../../components/Groups/AddParticipants";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // estados (equivalentes a this.state)
  const [chatInput, setChatInput] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [groupMessages, setGroupMessages] = useState(null);
  const [groupTexts, setGroupTexts] = useState({});
  const [isLeader, setIsLeader] = useState(null);
  const [groupParticipants, setGroupParticipants] = useState({});
  const [description, setDescription] = useState("Nothing to see yet.");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("Test");
  const [settings, setSettings] = useState("groupChat"); // "groupChat" o "groupChatS"
  const [settingsParticipants, setSettingsParticipants] = useState("groupParticipantsS"); // "groupParticipants" o "groupParticipantsS"
  const [buttongroup, setButtongroup] = useState("Gbtn-class");
  const [editDesc, setEditDesc] = useState(false);
  const [isMobileOrDesktop, setIsMobileOrDesktop] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  // ---------- Helpers / API calls ----------
// fallback: intenta obtener un "my_group", si falla por MultipleObjectsReturned,
// pide la lista de grupos donde esté el user y usa el primero.
const getGroup = useCallback(async () => {
  try {
    const res = await Axios.get("http://127.0.0.1:8000/api/my_group/", {
      headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
    });
    console.log("getGroup response:", res?.data);
    if (res.data && res.data.group) {
      setGroupData(res.data.group);
      if (res.data.groupMessages) setGroupMessages(res.data.groupMessages);
    } else {
      console.warn("getGroup: unexpected response shape", res.data);
      navigate("/dashboard/joinGroup");
    }
  } catch (error) {
    console.error("getGroup error:", error);
    // Si el servidor devolvió HTML con MultipleObjectsReturned (500),
    // intentamos un endpoint alternativo que liste grupos donde el usuario esté.
    try {
      // Si tienes un endpoint paginado de grupos públicos / membership, úsalo.
      // Ej: GET /api/groups/?member=<userId>  (ajusta según tu API)
      const fallback = await Axios.get("http://127.0.0.1:8000/api/groups/?member=" + (user?.id || ""), {
        headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
      });
      const results = fallback.data.results || fallback.data;
      if (Array.isArray(results) && results.length > 0) {
        console.warn("Using fallback group from groups list", results[0]);
        setGroupData(results[0]);
        // opcional: load messages separately...
      } else {
        // si no hay grupos, redirigir al joinGroup
        navigate("/dashboard/joinGroup");
      }
    } catch (fallbackErr) {
      console.error("Fallback get groups error:", fallbackErr);
      // último recurso: redirigir al joinGroup
      navigate("/dashboard/joinGroup");
    }
  }
}, [navigate, user]);


  const deleteText = async (messageId) => {
    if (!groupData) return;
    try {
      const res = await Axios.post(
        `http://127.0.0.1:8000/api/group_messages/${groupData.id}`,
        { messageId, post_type: "delete" },
        { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
      );
      if (res.data.success) {
        setGroupMessages(res.data.groupMessages);
      } else {
        console.log("failed");
      }
    } catch (err) {
      console.error("deleteText error:", err);
    }
  };

  const sendText = async () => {
    if (!groupData) return;
    try {
      const res = await Axios.post(
        `http://127.0.0.1:8000/api/group_messages/${groupData.id}`,
        {
          post_type: "create",
          messageData: {
            group: groupData.id,
            message: "this is a test message from the dashboard.",
            creator: user?.id || 1,
          },
        },
        { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
      );
      if (res.data.success) {
        setGroupMessages(res.data.groupMessages);
      } else {
        console.warn("sendText: no success", res.data);
      }
    } catch (err) {
      console.error("sendText error:", err);
    }
  };

  const leaveGroup = async () => {
    if (!groupData) return;
    try {
      const res = await Axios.post(
        `http://127.0.0.1:8000/api/my_group/`,
        { post_type: "leaveGroup", group: groupData.id },
        { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
      );
      if (res.data.success) {
        // recargar o redirigir
        navigate("/dashboard/joinGroup");
      } else {
        console.warn("leaveGroup: response:", res.data);
      }
    } catch (err) {
      console.error("leaveGroup error:", err);
    }
  };

  const HandleSettingsOpen = () => {
    // toggle simple
    setSettings((s) => (s === "groupChat" ? "groupChatS" : "groupChatS"));
  };

  const HandleSettingsClose = () => {
    setSettings((s) => (s === "groupChatS" ? "groupChat" : "groupChat"));
  };

  const groupParticipantsOpen = () => setSettingsParticipants("groupParticipants");
  const groupParticipantsClosed = () => setSettingsParticipants("groupParticipantsS");

  const toggleEditDesc = () => setEditDesc((v) => !v);

  const HandleEditDesc = async (e) => {
    const value = e.target.value;
    // actualizar localmente
    setGroupData((prev) => ({ ...(prev || {}), description: value }));

    try {
      await Axios.post(
        `http://127.0.0.1:8000/api/my_group/`,
        {
          post_type: "editDesc",
          description: value,
          group: groupData?.id,
        },
        {
          headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
        }
      );
    } catch (err) {
      console.error("HandleEditDesc error:", err);
    }
  };

  const handleIsMobile = () => {
    if (window.innerWidth <= 800) {
      setIsMobileOrDesktop("mobile");
    } else {
      setIsMobileOrDesktop("desktop");
    }
  };

  // ---------- Lifecycle ----------
  useEffect(() => {
    getGroup();
    handleIsMobile();
    Modal.setAppElement("body");

    const onResize = () => {
      setWindowSize(window.innerWidth);
      handleIsMobile();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getGroup]);

  // ---------- Render helpers ----------
  const renderGroupTexts = () => {
    if (!groupMessages) return null;
    return groupMessages.map((text) => (
      <div className="text" key={text.id}>
        <h3>{text.creator.username}</h3>
        <p>{text.message}</p>
        <div className="timeDeleteContainer">
          <h4>{text.created}</h4>
          {(user?.id === text.creator.id || user?.id === groupData?.leader?.id) && (
            <button onClick={() => deleteText(text.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </div>
    ));
  };

  // ---------- Guard: sin groupData ----------
  if (!groupData) {
    return (
      <div>
        You Are Not In A Group{" "}
        <button onClick={() => navigate("/dashboard/joinGroup")}>Join Groups</button>
      </div>
    );
  }

  // ---------- UI ----------
  const leaderId = groupData?.leader?.id;

  if (isMobileOrDesktop === "mobile") {
    return (
      <div className="groups-wrapper">
        <div className="groups">
          <div className={settings}>
            <button
              className="Gbtn-classM"
              onClick={() => {
                HandleSettingsOpen();
                groupParticipantsOpen();
              }}
            >
              <FontAwesomeIcon className="Gbtn-icon" icon={faEllipsisH} />
            </button>
            <GroupChat groupId={groupData.id} user={user} />
          </div>
          <button
            className="Gbtn-classM"
            onClick={() => {
              HandleSettingsClose();
              groupParticipantsClosed();
            }}
          >
            <FontAwesomeIcon className="Gbtn-icon" icon={faSignOutAlt} />
          </button>
          <div className="upper">
            <div className="group">
              <div className="description">
                <div className="desc-header">
                  Description
                  {leaderId === user?.id ? (
                    <button className="Gbtn-class" onClick={toggleEditDesc}>
                      <FontAwesomeIcon className="Gbtn-icon" icon={faEdit} />
                    </button>
                  ) : null}
                </div>

                {editDesc === false ? (
                  <div className="desc-body">
                    <div className="inner-desc">{groupData.description}</div>
                  </div>
                ) : (
                  <div className="desc-body">
                    <textarea
                      type="text"
                      value={groupData.description}
                      onChange={HandleEditDesc}
                      placeholder={groupData.description}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={settingsParticipants}>
            <div className="groupParticipantsHeader">
              <div className="gp-header">Participants</div>

              <div className="settings">
                <button className="GroupButton" onClick={leaveGroup}>
                  Leave Group
                </button>
              </div>

              <div className="btn-open-modal">
                {leaderId === user?.id ? (
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  />
                ) : null}
              </div>
            </div>
            <GroupParticipants group={groupData} user={user} />
          </div>

          <Modal
            className="Modal"
            overlayClassName="Overlay"
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => {
              setIsModalOpen(false);
            }}
          >
            <AddParticipants />
          </Modal>
        </div>
      </div>
    );
  }

  // desktop
  return (
    <div className="groups-wrapper">
      <div className="groups">
        <div className="upper">
          <div className="group">
            <div className="description">
              <div className="desc-top">
                <div className="desc-header">Description</div>
                <div className="Gbtn-class-edit-desc">
                  {leaderId === user?.id ? (
                    <button className="Gbtn-class" onClick={toggleEditDesc}>
                      <FontAwesomeIcon className="Gbtn-icon" icon={faEdit} />
                    </button>
                  ) : null}
                </div>
              </div>

              {editDesc === false ? (
                <div className="desc-body">
                  <div className="inner-desc">{groupData.description}</div>
                </div>
              ) : (
                <div className="desc-body">
                  <textarea
                    type="text"
                    value={groupData.description}
                    onChange={HandleEditDesc}
                    placeholder={groupData.description}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lower">
          <div className={settings}>
            <GroupChat groupId={groupData.id} user={user} />
          </div>
          <div className="groupParticipants">
            <div className="groupParticipantsHeader">
              <div className="gp-header">Participants</div>

              <div className="settings">
                <button className="GroupButton" onClick={leaveGroup}>
                  Leave Group
                </button>
              </div>

              <div className="btn-open-modal">
                {leaderId === user?.id ? (
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  />
                ) : null}
              </div>
            </div>
            <GroupParticipants group={groupData} user={user} />
          </div>
        </div>
      </div>

      <Modal
        className="Modal"
        overlayClassName="Overlay"
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
      >
        <AddParticipants />
      </Modal>
    </div>
  );
};

export default Groups;
