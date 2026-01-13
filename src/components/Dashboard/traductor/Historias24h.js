// src/components/Dashboard/traductor/Historias24h.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBookmark,
  faEllipsis,
  faHeart,
  faPlay,
  faPause,
  faReply,
  faUser,
  faVolumeMute,
  faVolumeUp,
  faXmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "../owenscss/usersRowModal.scss";
import "../owenscss/Historias24h.scss";

import TierTabs from "./TierTabs";
import UserRow from "./UserRow";
import SharedTaskModal from "./SharedTaskModal";

import { API_BASE, cleanVal, toSrc } from "./utils/media";
import {
  tierTabs,
  getTierKey,
  getTierMeta,
  normalizeUsersResponse,
  getUserAvatarSrc,
} from "./utils/users";

// =========================
// Helpers
// =========================
const PAGE_SIZE = 60;
const IMAGE_DURATION_MS = 6500;
const STORY_WINDOW_MS = 24 * 60 * 60 * 1000;

function getAuthHeaders() {
  const token =
    localStorage.getItem("userTokenLG") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  if (!token) return {};
  return { Authorization: `Token ${token}` };
}

const getTaskUserId = (t) => t?.user?.id ?? t?.user_id ?? t?.user ?? null;

const parseCreatedAtMs = (t) => {
  const raw =
    t?.created_at ||
    t?.createdAt ||
    t?.created ||
    t?.timestamp ||
    t?.date_created ||
    null;

  if (!raw) return null;
  if (typeof raw === "number") return raw;

  const s = String(raw).trim();
  const ms = Date.parse(s);
  return Number.isFinite(ms) ? ms : null;
};

const isWithin24h = (t, nowMs) => {
  const ms = parseCreatedAtMs(t);
  if (!ms) return true;
  return nowMs - ms <= STORY_WINDOW_MS;
};

const getStoryMedia = (t) => {
  // prioridad: video
  const v =
    cleanVal(t?.primary_video) ||
    cleanVal(t?.video) ||
    cleanVal(t?.video_url) ||
    cleanVal(t?.media_url) ||
    cleanVal(t?.file) ||
    cleanVal(t?.task?.video) ||
    null;

  if (v) return { type: "video", src: toSrc(v) };

  // fallback: imagen
  const img =
    cleanVal(t?.image) ||
    cleanVal(t?.image_url) ||
    cleanVal(t?.photo) ||
    cleanVal(t?.picture) ||
    cleanVal(t?.task?.image) ||
    null;

  if (img) return { type: "image", src: toSrc(img) };

  return null;
};

const formatAgo = (ms, nowMs) => {
  if (!ms) return "";
  const diff = Math.max(0, nowMs - ms);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
};

const makeTierCounts = (usersArr) => {
  const counts = (tierTabs || []).reduce((acc, t) => {
    acc[t.key] = 0;
    return acc;
  }, {});
  const arr = Array.isArray(usersArr) ? usersArr : [];
  counts.all = arr.length;

  arr.forEach((u) => {
    const k = getTierKey(u);
    if (!k || k === "all") return;
    counts[k] = (counts[k] || 0) + 1;
  });

  return counts;
};

// =========================
// Component
// =========================
const Historias24h = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector((s) => s.auth.user);
  const loggedUserId = reduxUser?.id ?? reduxUser?.user?.id ?? null;

  const hasAuthToken = !!(
    localStorage.getItem("userTokenLG") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );

  // ✅ nowMs estable (se actualiza cada minuto)
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ✅ Fetch Stories (NO RTK Query aquí)
  const [page, setPage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const refetchStories = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/stories/?limit=${PAGE_SIZE}&offset=0`, {
        headers: getAuthHeaders(),
      });
      setPage(data);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    refetchStories();
  }, [refetchStories]);

  // ✅ items desde /api/stories/
  const items = useMemo(() => {
    const arr = Array.isArray(page?.results)
      ? page.results
      : Array.isArray(page?.items)
      ? page.items
      : Array.isArray(page)
      ? page
      : [];

    return arr
      .filter((t) => isWithin24h(t, nowMs)) // doble seguridad
      .map((t) => ({
        ...t,
        _storyMedia: t?.media?.src ? t.media : getStoryMedia(t),
        _createdMs: parseCreatedAtMs(t),
      }))
      .filter((t) => !!t._storyMedia);
  }, [page, nowMs]);

  // Agrupar por usuario
  const storyUsers = useMemo(() => {
    const byUser = new Map();

    for (const t of items) {
      const uid = getTaskUserId(t);
      if (!uid) continue;

      if (!byUser.has(uid)) {
        byUser.set(uid, {
          userId: uid,
          username: cleanVal(t?.username) || cleanVal(t?.user?.username) || `user-${uid}`,
          user_image: cleanVal(t?.user_image) || cleanVal(t?.user?.user_image) || null,
          stories: [],
          latestMs: t._createdMs || 0,
        });
      }

      const entry = byUser.get(uid);
      entry.stories.push(t);
      entry.latestMs = Math.max(entry.latestMs || 0, t._createdMs || 0);
    }

    const out = Array.from(byUser.values()).map((u) => {
      const sorted = [...u.stories].sort((a, b) => (a._createdMs || 0) - (b._createdMs || 0));
      return { ...u, stories: sorted };
    });

    out.sort((a, b) => (b.latestMs || 0) - (a.latestMs || 0));
    return out;
  }, [items]);

  // ==============
  // Viewer state
  // ==============
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  const videoRef = useRef(null);
  const imageTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const [progress, setProgress] = useState(0);

  // Favoritos
  const [pchFavoritos, setPchFavoritos] = useState(() => {
    try {
      const raw = localStorage.getItem("pchFavoritosLG");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleToggleFavoritoTarea = useCallback(async (taskId) => {
    if (!taskId) return;

    setPchFavoritos((prev) => {
      const has = prev.includes(taskId);
      const next = has ? prev.filter((x) => x !== taskId) : [...prev, taskId];
      try {
        localStorage.setItem("pchFavoritosLG", JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      await axios.post(
        `${API_BASE}/api/pchfavoritos/toggle/`,
        { task_id: taskId },
        { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
      );
    } catch {}
  }, []);

  // ==============
  // Likes / Shares modals (tier)
  // ==============
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isSharedUsersModalOpen, setIsSharedUsersModalOpen] = useState(false);

  const [likesModalFilter, setLikesModalFilter] = useState("all");
  const [sharedModalFilter, setSharedModalFilter] = useState("all");

  const [likeUsers, setLikeUsers] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);

  const likesCounts = useMemo(() => makeTierCounts(likeUsers), [likeUsers]);
  const sharedCounts = useMemo(() => makeTierCounts(sharedUsers), [sharedUsers]);

  const likeUsersFiltered = useMemo(() => {
    const arr = Array.isArray(likeUsers) ? likeUsers : [];
    if (likesModalFilter === "all") return arr;
    return arr.filter((u) => getTierKey(u) === likesModalFilter);
  }, [likeUsers, likesModalFilter]);

  const sharedUsersFiltered = useMemo(() => {
    const arr = Array.isArray(sharedUsers) ? sharedUsers : [];
    if (sharedModalFilter === "all") return arr;
    return arr.filter((u) => getTierKey(u) === sharedModalFilter);
  }, [sharedUsers, sharedModalFilter]);

  const openLikesModal = useCallback(async (taskId) => {
    if (!taskId) return;
    try {
      const { data } = await axios.get(`${API_BASE}/api/tasks/${taskId}/users_who_liked/`, {
        headers: getAuthHeaders(),
      });
      setLikesModalFilter("all");
      setLikeUsers(normalizeUsersResponse(data));
      setIsLikesModalOpen(true);
    } catch (err) {
      console.error("openLikesModal error:", err?.response?.data || err);
      setLikesModalFilter("all");
      setLikeUsers([]);
      setIsLikesModalOpen(true);
    }
  }, []);

  const openSharedUsersModal = useCallback(async (taskId) => {
    if (!taskId) return;
    try {
      const { data } = await axios.get(`${API_BASE}/api/tasks/${taskId}/shared-users/`, {
        headers: getAuthHeaders(),
      });
      setSharedModalFilter("all");
      setSharedUsers(normalizeUsersResponse(data));
      setIsSharedUsersModalOpen(true);
    } catch (err) {
      console.error("openSharedUsersModal error:", err?.response?.data || err);
      setSharedModalFilter("all");
      setSharedUsers([]);
      setIsSharedUsersModalOpen(true);
    }
  }, []);

  // ==============
  // Upload Story (API: /api/stories/)
  // ==============
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const openUpload = useCallback(() => {
    setUploadError("");
    setUploadFile(null);
    setUploadCaption("");
    setUploadPreview(null);
    setIsUploadOpen(true);
  }, []);

  const closeUpload = useCallback(() => {
    setIsUploadOpen(false);
    setUploadError("");
    setUploading(false);
    if (uploadPreview) {
      try {
        URL.revokeObjectURL(uploadPreview);
      } catch {}
    }
    setUploadPreview(null);
    setUploadFile(null);
    setUploadCaption("");
  }, [uploadPreview]);

  const onPickUploadFile = useCallback(
    (e) => {
      const f = e.target.files?.[0] || null;
      setUploadError("");

      if (!f) {
        setUploadFile(null);
        if (uploadPreview) {
          try {
            URL.revokeObjectURL(uploadPreview);
          } catch {}
        }
        setUploadPreview(null);
        return;
      }

      const isImg = f.type?.startsWith("image/");
      const isVid = f.type?.startsWith("video/");
      if (!isImg && !isVid) {
        setUploadError("Solo se permite imagen o video.");
        return;
      }

      if (uploadPreview) {
        try {
          URL.revokeObjectURL(uploadPreview);
        } catch {}
      }
      const url = URL.createObjectURL(f);
      setUploadPreview(url);
      setUploadFile(f);
    },
    [uploadPreview]
  );

  const submitUploadStory = useCallback(async () => {
    if (!uploadFile) {
      setUploadError("Selecciona un archivo (imagen o video).");
      return;
    }

    setUploading(true);
    setUploadError("");

    const isImg = uploadFile.type?.startsWith("image/");
    const isVid = uploadFile.type?.startsWith("video/");

    const fd = new FormData();
    fd.append("caption", uploadCaption?.trim() || "");
    if (isVid) fd.append("video", uploadFile);
    if (isImg) fd.append("image", uploadFile);

    try {
      await axios.post(`${API_BASE}/api/stories/`, fd, {
        headers: {
          ...getAuthHeaders(),
          // NO forzar Content-Type en browser (axios pone boundary solo)
        },
      });

      closeUpload();
      refetchStories();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "No se pudo subir la historia.";
      console.error("submitUploadStory error:", err?.response?.data || err);
      setUploadError(msg);
      setUploading(false);
    }
  }, [uploadFile, uploadCaption, closeUpload, refetchStories]);

  // ==============
  // Share modal
  // ==============
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const openShareModal = useCallback((task) => {
    setSelectedTask(task);
    setIsShareModalOpen(true);
  }, []);

  // ==============
  // MUI menu (opciones story)
  // ==============
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const openMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  // ==============
  // Viewer computed
  // ==============
  const activeUser = useMemo(() => {
    if (!activeUserId) return null;
    return storyUsers.find((u) => String(u.userId) === String(activeUserId)) || null;
  }, [storyUsers, activeUserId]);

  const activeStory = useMemo(() => {
    if (!activeUser) return null;
    return activeUser.stories?.[activeStoryIndex] || null;
  }, [activeUser, activeStoryIndex]);

  const activeMedia = activeStory?._storyMedia || null;

  const openViewerFor = useCallback((userId, startIndex = 0) => {
    setActiveUserId(userId);
    setActiveStoryIndex(startIndex);
    setProgress(0);
    setPaused(false);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    setActiveUserId(null);
    setActiveStoryIndex(0);
    setProgress(0);
    setPaused(false);

    if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    imageTimerRef.current = null;
    progressTimerRef.current = null;

    if (videoRef.current) {
      try {
        videoRef.current.pause?.();
      } catch {}
    }
  }, []);

  const goNextUser = useCallback(() => {
    if (!activeUserId) return false;
    const idx = storyUsers.findIndex((u) => String(u.userId) === String(activeUserId));
    if (idx < 0) return false;
    const next = storyUsers[idx + 1];
    if (!next) return false;
    openViewerFor(next.userId, 0);
    return true;
  }, [activeUserId, storyUsers, openViewerFor]);

  const goPrevUser = useCallback(() => {
    if (!activeUserId) return false;
    const idx = storyUsers.findIndex((u) => String(u.userId) === String(activeUserId));
    if (idx <= 0) return false;
    const prev = storyUsers[idx - 1];
    if (!prev) return false;
    openViewerFor(prev.userId, Math.max(0, (prev.stories?.length || 1) - 1));
    return true;
  }, [activeUserId, storyUsers, openViewerFor]);

  const nextStory = useCallback(() => {
    if (!activeUser) return;
    const total = activeUser.stories?.length || 0;

    if (activeStoryIndex < total - 1) {
      setActiveStoryIndex((i) => i + 1);
      setProgress(0);
      setPaused(false);
      return;
    }

    const moved = goNextUser();
    if (!moved) closeViewer();
  }, [activeUser, activeStoryIndex, goNextUser, closeViewer]);

  const prevStory = useCallback(() => {
    if (!activeUser) return;
    const total = activeUser.stories?.length || 0;

    if (activeStoryIndex > 0) {
      setActiveStoryIndex((i) => i - 1);
      setProgress(0);
      setPaused(false);
      return;
    }

    const moved = goPrevUser();
    if (!moved) closeViewer();
  }, [activeUser, activeStoryIndex, goPrevUser, closeViewer]);

  const onViewerTap = useCallback(
    (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;

      if (pct < 0.35) prevStory();
      else nextStory();
    },
    [prevStory, nextStory]
  );

  // Hold para pausar
  const holdRef = useRef({ timer: null, active: false, moved: false, startX: 0, startY: 0 });
  const HOLD_DELAY_MS = 140;
  const HOLD_CANCEL_MOVE_PX = 12;

  const clearHoldTimer = () => {
    if (holdRef.current.timer) clearTimeout(holdRef.current.timer);
    holdRef.current.timer = null;
  };

  const beginHold = (x, y) => {
    holdRef.current = { timer: null, active: true, moved: false, startX: x, startY: y };
    clearHoldTimer();
    holdRef.current.timer = setTimeout(() => setPaused(true), HOLD_DELAY_MS);
  };

  const moveHold = (x, y) => {
    if (!holdRef.current.active) return;
    const dx = x - holdRef.current.startX;
    const dy = y - holdRef.current.startY;
    if (Math.abs(dx) > HOLD_CANCEL_MOVE_PX || Math.abs(dy) > HOLD_CANCEL_MOVE_PX) {
      holdRef.current.moved = true;
      clearHoldTimer();
    }
  };

  const endHold = () => {
    if (!holdRef.current.active) return;
    clearHoldTimer();
    holdRef.current.active = false;
  };

  // ==============
  // Playback / progress sync
  // ==============
  useEffect(() => {
    try {
      Modal.setAppElement("#root");
    } catch {}
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;

    if (paused) {
      v.pause?.();
    } else {
      const p = v.play?.();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, [muted, paused]);

  useEffect(() => {
    if (!viewerOpen) return;

    if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    imageTimerRef.current = null;
    progressTimerRef.current = null;

    setProgress(0);

    if (!activeStory || !activeMedia) return;

    if (activeMedia.type === "video") {
      const v = videoRef.current;
      if (!v) return;

      v.muted = muted;
      v.currentTime = 0;

      const safePlay = () => {
        if (paused) return;
        const p = v.play?.();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };

      const onTime = () => {
        const dur = v.duration || 0;
        const cur = v.currentTime || 0;
        if (dur > 0) setProgress(Math.min(1, cur / dur));
      };

      const onEnded = () => {
        setProgress(1);
        nextStory();
      };

      v.addEventListener("timeupdate", onTime);
      v.addEventListener("ended", onEnded);
      v.addEventListener("loadedmetadata", onTime);

      safePlay();

      return () => {
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("ended", onEnded);
        v.removeEventListener("loadedmetadata", onTime);
      };
    }

    if (activeMedia.type === "image") {
      const start = Date.now();
      const tick = () => {
        if (paused) return;
        const elapsed = Date.now() - start;
        setProgress(Math.min(1, elapsed / IMAGE_DURATION_MS));
      };

      progressTimerRef.current = setInterval(tick, 50);

      imageTimerRef.current = setTimeout(() => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
        nextStory();
      }, IMAGE_DURATION_MS);

      return () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
        progressTimerRef.current = null;
        imageTimerRef.current = null;
      };
    }
  }, [viewerOpen, activeStoryIndex, activeUserId, activeStory, activeMedia, muted, paused, nextStory]);

  // ==============
  // Like toggle (sigue usando Task endpoint; si quieres "likes de story" se cambia después)
  // ==============
  const [localItems, setLocalItems] = useState([]);
  useEffect(() => setLocalItems(items), [items]);

  const activeTaskId = activeStory?.id ?? null;

  const toggleTaskLike = useCallback(async () => {
    if (!activeStory?.id) return;
    const taskId = activeStory.id;

    const liked = !!activeStory.userHasLiked;
    setLocalItems((prev) =>
      (prev || []).map((t) =>
        t.id === taskId
          ? { ...t, userHasLiked: !liked, likes_count: (t.likes_count ?? 0) + (liked ? -1 : 1) }
          : t
      )
    );

    try {
      await axios.put(`${API_BASE}/api/tasks/${taskId}/`, {}, { headers: getAuthHeaders() });
    } catch (err) {
      setLocalItems((prev) =>
        (prev || []).map((t) =>
          t.id === taskId
            ? { ...t, userHasLiked: liked, likes_count: (t.likes_count ?? 0) + (liked ? 1 : -1) }
            : t
        )
      );
      console.error("toggleTaskLike error:", err?.response?.data || err);
    }
  }, [activeStory]);

  const activeStoryLive = useMemo(() => {
    if (!activeStory?.id) return activeStory;
    const found = (localItems || []).find((x) => x.id === activeStory.id);
    return found ? { ...activeStory, ...found } : activeStory;
  }, [activeStory, localItems]);

  // Abrir viewer desde strip
  const onOpenUser = useCallback(
    (userId) => {
      const u = storyUsers.find((x) => String(x.userId) === String(userId));
      if (!u) return;
      openViewerFor(u.userId, 0);
    },
    [storyUsers, openViewerFor]
  );

  const navigateToPeticionPost = useCallback(
    (peticionId) => {
      if (!peticionId) return;
      navigate(`/dashboard/newpeticionesPost/${peticionId}`);
    },
    [navigate]
  );

  return (
    <div className="stories24-root">
      <div className="stories24-top">
        <button className="stories24-back" type="button" onClick={() => navigate(-1)} title="Regresar">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className="stories24-title">Historias (24h)</div>

        <button className="stories24-refresh" type="button" onClick={() => refetchStories()} title="Refrescar">
          ↻
        </button>
      </div>

      <div className="stories24-strip">
        {hasAuthToken ? (
          <button className="stories24-bubble stories24-add" type="button" onClick={openUpload} title="Subir historia (24h)">
            <span className="stories24-bubble-avatar stories24-add-avatar">
              <span className="stories24-add-plus">
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </span>
            <span className="stories24-bubble-name">Tu historia</span>
          </button>
        ) : null}

        {storyUsers.map((u) => {
          const avatarSrc = u.user_image ? toSrc(u.user_image) : null;
          const isMe = loggedUserId && String(u.userId) === String(loggedUserId);

          return (
            <button
              key={`story-user-${u.userId}`}
              className={`stories24-bubble ${isMe ? "is-me" : ""}`}
              type="button"
              onClick={() => onOpenUser(u.userId)}
              title={u.username}
            >
              <span className="stories24-bubble-avatar">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={u.username}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                ) : (
                  <span className="stories24-bubble-fallback">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                )}
              </span>
              <span className="stories24-bubble-name">{u.username}</span>
            </button>
          );
        })}
      </div>

      {!isFetching && storyUsers.length === 0 ? (
        <div className="stories24-empty">
          <div className="stories24-empty-title">No hay historias en las últimas 24 horas.</div>
          <div className="stories24-empty-sub">Publica una historia con el botón “Tu historia”.</div>
        </div>
      ) : null}

      {/* =======================
          VIEWER FULL SCREEN
         ======================= */}
      <Modal
        isOpen={viewerOpen}
        onRequestClose={closeViewer}
        contentLabel="Historias Viewer"
        className="stories24-viewer"
        overlayClassName="stories24-viewer-overlay"
      >
        {activeUser && activeStoryLive && activeMedia ? (
          <div
            className="stories24-viewer-inner"
            onMouseDown={(e) => beginHold(e.clientX, e.clientY)}
            onMouseMove={(e) => moveHold(e.clientX, e.clientY)}
            onMouseUp={() => endHold()}
            onTouchStart={(e) => {
              const t = e.touches?.[0];
              if (t) beginHold(t.clientX, t.clientY);
            }}
            onTouchMove={(e) => {
              const t = e.touches?.[0];
              if (t) moveHold(t.clientX, t.clientY);
            }}
            onTouchEnd={() => endHold()}
            onClick={(e) => {
              if (e.target.closest("button,a,input,textarea,select,.MuiMenu-root,.MuiPopover-root")) return;
              onViewerTap(e);
            }}
          >
            <div className="stories24-progress">
              {(activeUser.stories || []).map((st, i) => {
                const done = i < activeStoryIndex;
                const active = i === activeStoryIndex;
                const pct = done ? 1 : active ? progress : 0;

                return (
                  <div key={`prog-${st.id}`} className="stories24-progress-seg">
                    <div
                      className="stories24-progress-fill"
                      style={{ transform: `scaleX(${Math.max(0, Math.min(1, pct))})` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="stories24-header" onClick={(e) => e.stopPropagation()}>
              <button className="stories24-close" type="button" onClick={closeViewer} title="Cerrar">
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <div className="stories24-user">
                <span className="stories24-user-avatar">
                  {activeUser.user_image ? (
                    <img
                      src={toSrc(activeUser.user_image)}
                      alt={activeUser.username}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                </span>

                <div className="stories24-user-meta">
                  <div className="stories24-user-name">{activeUser.username}</div>
                  <div className="stories24-user-time">{formatAgo(activeStoryLive._createdMs, nowMs)}</div>
                </div>
              </div>

              <div className="stories24-header-actions">
                <button
                  className="stories24-mute"
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  title={muted ? "Activar sonido" : "Silenciar"}
                >
                  <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} />
                </button>

                <button className="stories24-more" type="button" onClick={openMenu} title="Opciones">
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>

                <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu();
                      if (activeTaskId) openLikesModal(activeTaskId);
                    }}
                  >
                    Ver likes
                  </MenuItem>

                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu();
                      if (activeTaskId) openSharedUsersModal(activeTaskId);
                    }}
                  >
                    Ver compartidos
                  </MenuItem>

                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu();
                      if (activeStoryLive?.id) navigateToPeticionPost(activeStoryLive.id);
                    }}
                  >
                    Ir a post
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <div className="stories24-media">
              {activeMedia.type === "video" ? (
                <video
                  ref={videoRef}
                  className="stories24-video"
                  src={activeMedia.src}
                  playsInline
                  muted={muted}
                  autoPlay
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img
                  className="stories24-image"
                  src={activeMedia.src}
                  alt="historia"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              )}
            </div>

            <div className="stories24-footer" onClick={(e) => e.stopPropagation()}>
              <div className="stories24-actions-left">
                <button
                  className={`stories24-like ${activeStoryLive.userHasLiked ? "liked" : ""}`}
                  type="button"
                  onClick={toggleTaskLike}
                  title={activeStoryLive.userHasLiked ? "Quitar me gusta" : "Dar me gusta"}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <span className="stories24-count">{activeStoryLive.likes_count ?? 0}</span>
                </button>

                <button
                  className="stories24-reply"
                  type="button"
                  onClick={() => navigateToPeticionPost(activeStoryLive.id)}
                  title="Responder"
                >
                  <FontAwesomeIcon icon={faReply} />
                </button>

                <button className="stories24-share" type="button" onClick={() => openShareModal(activeStoryLive)} title="Compartir">
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span className="stories24-count">{activeStoryLive.share_count ?? 0}</span>
                </button>

                <button
                  className="stories24-save"
                  type="button"
                  onClick={() => handleToggleFavoritoTarea(activeStoryLive.id)}
                  title="Guardar"
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{ color: pchFavoritos.includes(activeStoryLive.id) ? "#54afff" : undefined }}
                  />
                </button>
              </div>

              <div className="stories24-actions-right">
                <button
                  className="stories24-play"
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  title={paused ? "Reproducir" : "Pausar"}
                >
                  <FontAwesomeIcon icon={paused ? faPlay : faPause} />
                </button>
              </div>
            </div>

            <div className="stories24-nav-hints">
              <div className="stories24-nav-left" />
              <div className="stories24-nav-right" />
            </div>
          </div>
        ) : (
          <div className="stories24-viewer-loading">Cargando…</div>
        )}

        <Modal
          isOpen={isLikesModalOpen}
          onRequestClose={() => setIsLikesModalOpen(false)}
          contentLabel="Usuarios que dieron like"
          className="users-modal"
          overlayClassName="users-modal-overlay"
        >
          <TierTabs tabs={tierTabs} counts={likesCounts} activeKey={likesModalFilter} onChange={setLikesModalFilter} />

          <ul className="users-modal__list">
            {(likeUsersFiltered || []).map((u, i) => {
              const meta = getTierMeta(u);
              const avatar = getUserAvatarSrc(u);
              const badge = meta.key !== "regular" ? meta.label : null;

              return (
                <UserRow
                  key={`like-${u.id ?? u.username}-${i}`}
                  avatarSrc={avatar}
                  username={u.username}
                  badgeLabel={badge}
                  right={<FontAwesomeIcon icon={faHeart} style={{ color: meta.color }} />}
                />
              );
            })}
          </ul>

          <button type="button" onClick={() => setIsLikesModalOpen(false)}>
            Cerrar
          </button>
        </Modal>

        <Modal
          isOpen={isSharedUsersModalOpen}
          onRequestClose={() => setIsSharedUsersModalOpen(false)}
          contentLabel="Usuarios que compartieron"
          className="users-modal"
          overlayClassName="users-modal-overlay"
        >
          <TierTabs tabs={tierTabs} counts={sharedCounts} activeKey={sharedModalFilter} onChange={setSharedModalFilter} />

          <ul className="users-modal__list">
            {(sharedUsersFiltered || []).map((u, i) => {
              const meta = getTierMeta(u);
              const avatar = getUserAvatarSrc(u);
              const badge = meta.key !== "regular" ? meta.label : null;

              return (
                <UserRow
                  key={`shared-${u.id ?? u.username}-${i}`}
                  avatarSrc={avatar}
                  username={u.username}
                  badgeLabel={badge}
                  right={<FontAwesomeIcon icon={faArrowRight} style={{ color: meta.color }} />}
                />
              );
            })}
          </ul>

          <button type="button" onClick={() => setIsSharedUsersModalOpen(false)}>
            Cerrar
          </button>
        </Modal>

        <SharedTaskModal
          isOpen={isShareModalOpen}
          taskId={selectedTask ? selectedTask.id : null}
          onClose={() => setIsShareModalOpen(false)}
          onShared={() => {
            setIsShareModalOpen(false);
            refetchStories();
          }}
        />
      </Modal>

      {/* Upload modal */}
      <Modal
        isOpen={isUploadOpen}
        onRequestClose={() => (!uploading ? closeUpload() : null)}
        contentLabel="Subir historia"
        className="stories24-upload-modal"
        overlayClassName="stories24-upload-overlay"
      >
        <div className="stories24-upload-head">
          <div className="stories24-upload-title">Subir historia (24h)</div>
          <button
            className="stories24-upload-close"
            type="button"
            onClick={() => (!uploading ? closeUpload() : null)}
            title="Cerrar"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="stories24-upload-body">
          <div className="stories24-upload-pick">
            <input type="file" accept="image/*,video/*" onChange={onPickUploadFile} disabled={uploading} />
          </div>

          {uploadPreview ? (
            <div className="stories24-upload-preview">
              {uploadFile?.type?.startsWith("video/") ? (
                <video src={uploadPreview} controls playsInline />
              ) : (
                <img src={uploadPreview} alt="preview" />
              )}
            </div>
          ) : (
            <div className="stories24-upload-placeholder">Selecciona una imagen o video para tu historia.</div>
          )}

          <textarea
            className="stories24-upload-caption"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            placeholder="Texto (opcional)"
            disabled={uploading}
            rows={3}
          />

          {uploadError ? <div className="stories24-upload-error">{uploadError}</div> : null}
        </div>

        <div className="stories24-upload-actions">
          <button
            type="button"
            className="stories24-upload-btn stories24-upload-cancel"
            onClick={() => (!uploading ? closeUpload() : null)}
            disabled={uploading}
          >
            Cancelar
          </button>

          <button type="button" className="stories24-upload-btn stories24-upload-submit" onClick={submitUploadStory} disabled={uploading}>
            {uploading ? "Subiendo…" : "Publicar"}
          </button>
        </div>
      </Modal>

      {isFetching && <div className="stories24-loading">Cargando…</div>}
    </div>
  );
};

export default Historias24h;
