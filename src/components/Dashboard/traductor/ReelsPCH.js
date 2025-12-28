// src/components/Dashboard/traductor/ReelsPCH.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faArrowRight,
  faReply,
  faUser,
  faVolumeMute,
  faVolumeUp,
  faLayerGroup,
  faBars,
  faEnvelope,
  faUsers,
  faTrash,
  faPen,
  faBookmark,
  faPlay,
  faPause,
  faXmark,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

// MUI v5 (si usas v4 cambia los imports)
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useGetFeedQuery } from "./feed/FeedApi";
import SharedTaskModal from "./SharedTaskModal";

import "../owenscss/ReelsPCH.scss";

const API_BASE = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("userTokenLG") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  if (!token) return {};
  return { Authorization: `Token ${token}` };
};

const cleanVal = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (s === "" || s === "No image available" || s === "undefined" || s === "null")
    return null;
  return s;
};

const toSrc = (path) => {
  const p = cleanVal(path);
  if (!p) return "";
  if (/^https?:\/\//i.test(p) || p.startsWith("blob:") || p.startsWith("data:"))
    return p;
  try {
    return new URL(p.startsWith("/") ? p : `/${p}`, API_BASE).href;
  } catch {
    return p;
  }
};

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

const normalizeUsersResponse = (data) => {
  let arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data?.users)
    ? data.users
    : [];

  arr = arr.filter(isObj);

  return arr.map((u) => ({
    id: u?.id ?? u?.user?.id ?? u?.pk ?? u?.user_id ?? null,
    username: u?.username ?? u?.user?.username ?? "",
    likes_count: u?.likes_count ?? 0,
    _orig: u,
  }));
};

const getUserAvatarSrc = (raw) => {
  const u = raw?._orig ?? raw;

  const candidates = [
    u?.user_image,
    u?.user_image_url,
    u?.image,
    u?.avatar,
    u?.avatar_url,
    u?.profile_image,
    u?.photo,
    u?.picture,
    u?.user?.user_image,
    u?.user?.image,
    u?.user?.avatar,
    u?.profile?.image,
    u?.profile?.avatar,
  ];

  const found = candidates.map(cleanVal).find(Boolean);
  return found ? toSrc(found) : null;
};

// ✅ nombre de quién lo compartió (compat con varios formatos)
const getSharedByName = (t) => {
  const direct =
    cleanVal(t?.shared_byName) ||
    cleanVal(t?.shared_by_name) ||
    cleanVal(t?.sharedByName);

  if (direct) return direct;

  const objName =
    cleanVal(t?.shared_by?.username) ||
    cleanVal(t?.shared_by?.user?.username) ||
    cleanVal(t?.sharedBy?.username) ||
    cleanVal(t?.sharedBy?.user?.username);

  if (objName) return objName;

  const list =
    (Array.isArray(t?.shared_by_list) && t.shared_by_list) ||
    (Array.isArray(t?.sharedByList) && t.sharedByList) ||
    [];

  if (list.length) {
    const last = list[list.length - 1];
    const name =
      cleanVal(last?.username) || cleanVal(last?.user?.username) || cleanVal(last?.user);
    if (name) return name;
  }

  const st = Array.isArray(t?.shared_tasks) ? t.shared_tasks : [];
  if (st.length) {
    const last = st[st.length - 1];
    const name =
      cleanVal(last?.username) ||
      cleanVal(last?.user?.username) ||
      cleanVal(last?.shared_by?.username);
    if (name) return name;
  }

  return null;
};

// =========================
//  ✅ PLAYLISTS / VISTAS
// =========================
const VIEW_ORDER = ["main", "factores", "fuentes"];

const uniq = (arr) => {
  const out = [];
  const seen = new Set();
  for (const v of arr) {
    const c = cleanVal(v);
    if (!c) continue;
    if (seen.has(c)) continue;
    seen.add(c);
    out.push(c);
  }
  return out;
};

const extractVideos = (obj) => {
  if (!obj) return [];
  const bag = [];

  bag.push(obj?.primary_video);
  bag.push(obj?.video);
  bag.push(obj?.task?.video);

  bag.push(obj?.video_url);
  bag.push(obj?.media_url);
  bag.push(obj?.file);

  bag.push(obj?.video2);
  bag.push(obj?.video_2);
  bag.push(obj?.video3);
  bag.push(obj?.video_3);

  if (Array.isArray(obj?.videos)) bag.push(...obj.videos);
  if (Array.isArray(obj?.video_list)) bag.push(...obj.video_list);
  if (Array.isArray(obj?.media_videos)) bag.push(...obj.media_videos);

  return uniq(bag);
};

const getFirstVideoAnywhere = (task) => {
  const subs = (task?.subtasks || []).flatMap((s) => extractVideos(s));
  const facs = (task?.subfactores || []).flatMap((s) => extractVideos(s));
  const fues = (task?.subfuentes || []).flatMap((s) => extractVideos(s));
  const main = extractVideos(task);
  return main[0] || subs[0] || facs[0] || fues[0] || null;
};

const buildPlaylists = (task) => {
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : [];
  const factores = Array.isArray(task?.subfactores) ? task.subfactores : [];
  const fuentes = Array.isArray(task?.subfuentes) ? task.subfuentes : [];

  const mainVideos = uniq([
    ...extractVideos(task),
    ...subtasks.flatMap((s) => extractVideos(s)),
  ]).map((src, idx) => ({
    src,
    kind: "main",
    item: null,
    groupIndex: null,
    groupTotal: null,
    localIndex: idx,
    localTotal: null,
  }));

  const factoresVideos = [];
  factores.forEach((f, gi) => {
    const vids = extractVideos(f);
    vids.forEach((src, li) => {
      factoresVideos.push({
        src,
        kind: "factores",
        item: f,
        groupIndex: gi,
        groupTotal: factores.length,
        localIndex: li,
        localTotal: vids.length,
      });
    });
  });

  const fuentesVideos = [];
  fuentes.forEach((fu, gi) => {
    const vids = extractVideos(fu);
    vids.forEach((src, li) => {
      fuentesVideos.push({
        src,
        kind: "fuentes",
        item: fu,
        groupIndex: gi,
        groupTotal: fuentes.length,
        localIndex: li,
        localTotal: vids.length,
      });
    });
  });

  return {
    main: mainVideos,
    factores: factoresVideos,
    fuentes: fuentesVideos,
  };
};

const getEffectiveState = (state, playlists) => {
  const fallbackMode =
    VIEW_ORDER.find((m) => (playlists?.[m]?.length || 0) > 0) || "main";
  const mode = playlists?.[state?.mode]?.length ? state.mode : fallbackMode;
  const len = playlists?.[mode]?.length || 0;
  const pos = len ? Math.min(Math.max(0, state?.pos || 0), len - 1) : 0;
  return { mode, pos };
};

const PAGE_SIZE = 6;

const ALLOWED_TEMAS = new Set(["consejos", "peticiones", "historias"]);
const normalizeTema = (v) => {
  if (!v) return null;
  const s = String(v).trim().toLowerCase();
  return ALLOWED_TEMAS.has(s) ? s : null;
};

// ✅ helper para obtener userId robusto del task (link.user en tu feed)
const getTaskUserId = (t) =>
  t?.user?.id ??
  t?.user_id ??
  t?.userId ??
  t?.profile?.id ??
  t?.profile_id ??
  t?.user ??
  null;

const ReelsPCH = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const reduxUser = useSelector((s) => s.auth.user);
  const loggedUserId = reduxUser?.id ?? reduxUser?.user?.id ?? null;

  const initialTema = useMemo(() => {
    const st = location.state || {};
    const fromState = normalizeTema(st.tema || st.pch || st?.task?.pch);

    const sp = new URLSearchParams(location.search || "");
    const fromQuery = normalizeTema(sp.get("tema") || sp.get("pch"));

    return fromState || fromQuery || "historias";
  }, [location.search, location.state]);

  const initialFocusId = useMemo(() => {
    const st = location.state || {};
    if (st.focusId || st.taskId) return st.focusId || st.taskId;

    const sp = new URLSearchParams(location.search || "");
    return sp.get("focus") || sp.get("id") || null;
  }, [location.search, location.state]);

  const [tema, setTema] = useState(() => initialTema);

  const [focusId, setFocusId] = useState(() => initialFocusId);
  const focusAttemptsRef = useRef(0);

  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  const [viewStateById, setViewStateById] = useState({});

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isSharedUsersModalOpen, setIsSharedUsersModalOpen] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const containerRef = useRef(null);
  const videoRefs = useRef({});

  const [period, setPeriod] = useState(null);

  // =========================
  // ✅ UI hidden
  // - uiHidden: oculto permanente (desde menú)
  // - pressHidden: oculto temporal mientras mantienes presionado
  // =========================
  const [uiHidden, setUiHidden] = useState(false);
  const [pressHidden, setPressHidden] = useState(false);
  const uiSuppressed = uiHidden || pressHidden;

  // evita que el "click" posterior a un long-press dispare acciones
  const suppressNextClickRef = useRef(false);

  // =========================
  // ✅ SELECCIÓN (click normal): pausa + player inferior
  // =========================
  const [selectedReelId, setSelectedReelId] = useState(null);

  // Player inferior
  const [playerState, setPlayerState] = useState({
    id: null,
    current: 0,
    duration: 0,
    paused: true,
  });

  const formatTime = (sec) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  const pauseAndSelect = useCallback(
    (taskId, idx) => {
      const v = videoRefs.current[idx];
      if (v) v.pause?.();
      setSelectedReelId(taskId);
      setPlayerState((p) => ({
        ...p,
        id: taskId,
        current: v?.currentTime || 0,
        duration: v?.duration || 0,
        paused: true,
      }));
    },
    []
  );

  const closeSelected = useCallback(
    (idx) => {
      setSelectedReelId(null);
      setPlayerState((p) => ({ ...p, id: null, paused: true }));
      const v = videoRefs.current[idx];
      if (v) {
        v.muted = muted;
        const pr = v.play?.();
        if (pr && typeof pr.catch === "function") pr.catch(() => {});
      }
    },
    [muted]
  );

  // ✅ sincroniza playerState cuando el reel activo está seleccionado
  useEffect(() => {
    const task = items?.[activeIndex];
    const reel = task; // por compat, pero abajo usamos reels
    // Usamos reels real:
  }, [activeIndex, items]);

  // =========================
  // ✅ Menú MUI por taskId
  // =========================
  const [anchorEl, setAnchorEl] = useState({});

  const handleClickMenu = (event, taskId) => {
    event.stopPropagation();
    setAnchorEl((prev) => ({ ...(prev || {}), [taskId]: event.currentTarget }));
  };

  const handleCloseMenu = (taskId) => {
    setAnchorEl((prev) => ({ ...(prev || {}), [taskId]: null }));
  };

  // =========================
  // ✅ FAVORITOS (TAREA)
  // =========================
  const [pchFavoritos, setPchFavoritos] = useState(() => {
    try {
      const raw = localStorage.getItem("pchFavoritosLG");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const TASK_FAV_TOGGLE_URL = `${API_BASE}/api/pchfavoritos/toggle/`;

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
        TASK_FAV_TOGGLE_URL,
        { task_id: taskId },
        { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
      );
    } catch {}
  }, []);

  // rutas (ajusta a tus rutas reales)
  const navigateToUserMesseges = useCallback(
    (userId) => {
      if (!userId) return;
      navigate(`/dashboard/usermesseges/${userId}`);
    },
    [navigate]
  );

  const navigateToUserForum = useCallback(
    (userId) => {
      if (!userId) return;
      navigate(`/dashboard/userforum/${userId}`);
    },
    [navigate]
  );

  // =========================
  // ✅ FAVORITOS (perfiles)
  // =========================
  const [favUsers, setFavUsers] = useState(() => {
    try {
      const raw = localStorage.getItem("favUsersLG");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [favFlash, setFavFlash] = useState({});
  const favFlashTimersRef = useRef({});

  useEffect(() => {
    return () => {
      Object.values(favFlashTimersRef.current || {}).forEach((t) => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/pfavoritos/listar/`, {
          headers: getAuthHeaders(),
        });
        const ids = Array.isArray(data) ? data.map((x) => x?.id).filter(Boolean) : [];
        const map = {};
        ids.forEach((id) => (map[id] = true));
        setFavUsers(map);
        try {
          localStorage.setItem("favUsersLG", JSON.stringify(map));
        } catch {}
      } catch (e) {}
    })();
  }, []);

  const toggleProfileFavorite = useCallback(
    async (task) => {
      const perfilId = getTaskUserId(task);
      if (!perfilId) return;

      const wasFav = !!favUsers[perfilId];

      setFavUsers((prev) => {
        const next = { ...(prev || {}) };
        if (wasFav) delete next[perfilId];
        else next[perfilId] = true;
        try {
          localStorage.setItem("favUsersLG", JSON.stringify(next));
        } catch {}
        return next;
      });

      if (!wasFav) {
        setFavFlash((prev) => ({ ...(prev || {}), [perfilId]: true }));
        if (favFlashTimersRef.current[perfilId]) {
          clearTimeout(favFlashTimersRef.current[perfilId]);
        }
        favFlashTimersRef.current[perfilId] = setTimeout(() => {
          setFavFlash((prev) => {
            const next = { ...(prev || {}) };
            delete next[perfilId];
            return next;
          });
        }, 750);
      }

      try {
        await axios.post(
          `${API_BASE}/api/pfavoritos/agregar/`,
          { perfil_id: perfilId },
          { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("toggleProfileFavorite error:", err);
      }
    },
    [favUsers]
  );

  useEffect(() => {
    if (initialTema && initialTema !== tema) {
      setTema(initialTema);
      setOffset(0);
      setItems([]);
      setCanLoadMore(true);
      setActiveIndex(0);
      setViewStateById({});
      setSelectedReelId(null);
      setUiHidden(false);
      setPressHidden(false);
    }
    setFocusId(initialFocusId || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTema, initialFocusId]);

  const ordering = "-created_at";
  const { data: page, isFetching, refetch } = useGetFeedQuery({
    limit: PAGE_SIZE,
    offset,
    ordering,
    pch: tema,
    ...(tema === "historias" ? { media: "video" } : {}),
    ...(period ? { period } : {}),
  });

  useEffect(() => {
    try {
      Modal.setAppElement("#root");
    } catch {}
  }, []);

  const handleTemaChange = useCallback((newTema) => {
    setTema(newTema);
    setOffset(0);
    setItems([]);
    setCanLoadMore(true);
    setActiveIndex(0);
    setFocusId(null);
    focusAttemptsRef.current = 0;
    setViewStateById({});
    setSelectedReelId(null);
    setUiHidden(false);
    setPressHidden(false);
  }, []);

  useEffect(() => {
    const pageItems = Array.isArray(page?.items)
      ? page.items
      : Array.isArray(page?.results)
      ? page.results
      : Array.isArray(page)
      ? page
      : [];

    const hasNext =
      typeof page?.next !== "undefined" ? Boolean(page.next) : pageItems.length >= PAGE_SIZE;

    setCanLoadMore(hasNext);

    if (!pageItems.length) return;

    setItems((prev) => {
      if (offset === 0) return pageItems;
      const seen = new Set(prev.map((x) => x.id));
      const toAppend = pageItems.filter((x) => !seen.has(x.id));
      return [...prev, ...toAppend];
    });
  }, [page, offset]);

  const reels = useMemo(() => {
    const base = Array.isArray(items) ? items : [];
    return base
      .filter((t) => t?.pch === tema)
      .map((t) => ({ ...t, _anyVideo: getFirstVideoAnywhere(t) }))
      .filter((t) => !!t._anyVideo);
  }, [items, tema]);

  useEffect(() => {
    if (reels.length === 0) return;
    if (activeIndex > reels.length - 1) {
      setActiveIndex(Math.max(0, reels.length - 1));
    }
  }, [reels.length, activeIndex]);

  useEffect(() => {
    if (!canLoadMore) return;
    if (isFetching) return;
    if (reels.length === 0) return;

    const nearEnd = activeIndex >= reels.length - 2;
    if (nearEnd) setOffset((prev) => prev + PAGE_SIZE);
  }, [activeIndex, reels.length, canLoadMore, isFetching]);

  const getPageHeight = useCallback(() => {
    const el = containerRef.current;
    return el?.clientHeight || window.innerHeight || 1;
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const h = getPageHeight();
    const idx = Math.round(el.scrollTop / h);
    if (Number.isFinite(idx)) {
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    }
  }, [getPageHeight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ✅ si cambias de reel, quita selección (player), pero NO quita uiHidden permanente
  useEffect(() => {
    setSelectedReelId(null);
    setPressHidden(false);
  }, [activeIndex]);

  // ✅ autoplay:
  // - si está seleccionado (player) => no forces play
  // - si UI está suprimida (oculta) => FORZAR play
  useEffect(() => {
    const activeTaskId = reels?.[activeIndex]?.id ?? null;

    Object.entries(videoRefs.current).forEach(([idxStr, vid]) => {
      const idx = Number(idxStr);
      if (!vid) return;

      if (idx === activeIndex) {
        // si UI oculta => siempre reproduce
        if (uiSuppressed) {
          vid.muted = muted;
          const p = vid.play?.();
          if (p && typeof p.catch === "function") p.catch(() => {});
          return;
        }

        // si seleccionado => pausa (player controla)
        if (activeTaskId && selectedReelId === activeTaskId) {
          vid.pause?.();
          return;
        }

        vid.muted = muted;
        const p = vid.play?.();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else {
        vid.pause?.();
      }
    });
  }, [activeIndex, muted, reels, selectedReelId, uiSuppressed]);

  // ✅ sincroniza playerState cuando reel activo está seleccionado
  useEffect(() => {
    const task = reels?.[activeIndex];
    if (!task) return;
    if (uiSuppressed) return;
    if (selectedReelId !== task.id) return;

    const v = videoRefs.current[activeIndex];
    if (!v) return;

    const sync = () => {
      setPlayerState({
        id: task.id,
        current: v.currentTime || 0,
        duration: v.duration || 0,
        paused: !!v.paused,
      });
    };

    sync();
    v.addEventListener("timeupdate", sync);
    v.addEventListener("loadedmetadata", sync);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);

    return () => {
      v.removeEventListener("timeupdate", sync);
      v.removeEventListener("loadedmetadata", sync);
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
    };
  }, [selectedReelId, activeIndex, reels, uiSuppressed]);

  const goBack = () => navigate(-1);

  const scrollToIndex = (idx) => {
    const el = containerRef.current;
    if (!el) return;
    const h = getPageHeight();
    el.scrollTo({ top: idx * h, behavior: "smooth" });
  };

  useEffect(() => {
    if (!focusId) {
      focusAttemptsRef.current = 0;
      return;
    }

    const idx = reels.findIndex((t) => String(t.id) === String(focusId));

    if (idx >= 0) {
      setActiveIndex(idx);
      requestAnimationFrame(() => scrollToIndex(idx));
      setFocusId(null);
      focusAttemptsRef.current = 0;
      return;
    }

    if (canLoadMore && !isFetching && focusAttemptsRef.current < 10) {
      focusAttemptsRef.current += 1;
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }, [focusId, reels, canLoadMore, isFetching]);

  const openShareModal = (task) => {
    setSelectedTask(task);
    setIsShareModalOpen(true);
  };

  const openLikesModal = async (taskId) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/tasks/${taskId}/users_who_liked/`, {
        headers: getAuthHeaders(),
      });
      setListUsers(normalizeUsersResponse(data));
      setIsLikesModalOpen(true);
    } catch (err) {
      console.error("openLikesModal error:", err);
      setListUsers([]);
      setIsLikesModalOpen(true);
    }
  };

  const openSharedUsersModal = async (taskId) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/tasks/${taskId}/shared-users/`, {
        headers: getAuthHeaders(),
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.users)
        ? data.users
        : [];

      setSharedUsers(arr);
      setIsSharedUsersModalOpen(true);
    } catch (err) {
      console.error("openSharedUsersModal error:", err);
      setSharedUsers([]);
      setIsSharedUsersModalOpen(true);
    }
  };

  const toggleTaskLike = async (task) => {
    const url = `${API_BASE}/api/tasks/${task.id}/`;
    const liked = !!task.userHasLiked;

    setItems((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              userHasLiked: !liked,
              likes_count: (t.likes_count ?? 0) + (liked ? -1 : 1),
              like_set: Array.isArray(t.like_set)
                ? liked
                  ? t.like_set.filter((l) => l?.user?.id !== loggedUserId)
                  : [...t.like_set, { user: { id: loggedUserId } }]
                : [],
            }
          : t
      )
    );

    try {
      await axios.put(url, {}, { headers: getAuthHeaders() });
    } catch (err) {
      setItems((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                userHasLiked: liked,
                likes_count: (t.likes_count ?? 0) + (liked ? 1 : -1),
                like_set: Array.isArray(t.like_set)
                  ? liked
                    ? [...t.like_set, { user: { id: loggedUserId } }]
                    : t.like_set.filter((l) => l?.user?.id !== loggedUserId)
                  : [],
              }
            : t
        )
      );
      console.error("toggleTaskLike error:", err);
    }
  };

  const navigateToPeticionPost = (peticionId) => {
    navigate(`/dashboard/newpeticionesPost/${peticionId}`);
  };

  // ✅ SOLO CAMBIA VISTA (main -> factores -> fuentes -> ...)
  const cycleViewOnly = useCallback((task) => {
    const playlists = buildPlaylists(task);

    setViewStateById((prev) => {
      const current = prev?.[task.id] || { mode: "main", pos: 0 };
      const eff = getEffectiveState(current, playlists);

      const startIdx = VIEW_ORDER.indexOf(eff.mode);

      for (let step = 1; step <= VIEW_ORDER.length; step++) {
        const nextMode = VIEW_ORDER[(startIdx + step) % VIEW_ORDER.length];
        const nextLen = playlists?.[nextMode]?.length || 0;
        if (nextLen > 0) {
          return { ...(prev || {}), [task.id]: { mode: nextMode, pos: 0 } };
        }
      }

      return { ...(prev || {}), [task.id]: { mode: eff.mode, pos: eff.pos } };
    });
  }, []);

  // ✅ navegar clips dentro de la vista actual (swipe left/right)
  const stepClipInCurrentView = useCallback((task, delta) => {
    const playlists = buildPlaylists(task);

    setViewStateById((prev) => {
      const current = prev?.[task.id] || { mode: "main", pos: 0 };
      const eff = getEffectiveState(current, playlists);

      const list = playlists?.[eff.mode] || [];
      const len = list.length;
      if (!len) return prev || {};

      const nextPos = Math.min(Math.max(eff.pos + delta, 0), len - 1);
      if (nextPos === eff.pos) return prev || {};

      return { ...(prev || {}), [task.id]: { mode: eff.mode, pos: nextPos } };
    });
  }, []);

  // =========================
  //  ✅ SWIPE LEFT/RIGHT (clip anterior/siguiente)
  // =========================
  const swipeRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    taskId: null,
  });

  // =========================
  // ✅ HOLD (mantener presionado) => ocultar temporal mientras está presionado
  // =========================
  const holdRef = useRef({
    timer: null,
    startX: 0,
    startY: 0,
    active: false,
    idx: null,
    taskId: null,
    triggered: false,
  });

  const HOLD_DELAY_MS = 220;
  const HOLD_CANCEL_MOVE_PX = 12;

  const clearHoldTimer = () => {
    if (holdRef.current.timer) {
      clearTimeout(holdRef.current.timer);
      holdRef.current.timer = null;
    }
  };

  const startHold = (clientX, clientY, taskId, idx) => {
    // si ya hay oculto permanente, no hace falta hold
    if (uiHidden) return;
    // si está en modo player (seleccionado), aquí NO hacemos hold para evitar líos
    if (selectedReelId) return;

    holdRef.current = {
      timer: null,
      startX: clientX,
      startY: clientY,
      active: true,
      idx,
      taskId,
      triggered: false,
    };

    clearHoldTimer();
    holdRef.current.timer = setTimeout(() => {
      // dispara ocultado temporal
      holdRef.current.triggered = true;
      suppressNextClickRef.current = true;
      setPressHidden(true);

      // asegurar que el video siga reproduciendo
      const v = videoRefs.current[idx];
      if (v) {
        v.muted = muted;
        const p = v.play?.();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }, HOLD_DELAY_MS);
  };

  const moveHold = (clientX, clientY) => {
    if (!holdRef.current.active) return;
    const dx = clientX - holdRef.current.startX;
    const dy = clientY - holdRef.current.startY;
    if (Math.abs(dx) > HOLD_CANCEL_MOVE_PX || Math.abs(dy) > HOLD_CANCEL_MOVE_PX) {
      clearHoldTimer();
    }
  };

  const endHold = () => {
    if (!holdRef.current.active) {
      clearHoldTimer();
      return;
    }

    clearHoldTimer();

    const wasTriggered = !!holdRef.current.triggered;
    holdRef.current.active = false;
    holdRef.current.triggered = false;

    if (wasTriggered) {
      setPressHidden(false);
    }
  };

  const SWIPE_MIN_X = 45;
  const SWIPE_MAX_Y = 80;

  const isInteractiveTarget = (target) => {
    if (!target) return false;
    return !!target.closest(
      "button, a, input, textarea, select, label, .reel-player, .MuiMenu-root, .MuiPopover-root"
    );
  };

  const beginSwipe = useCallback((x, y, taskId) => {
    swipeRef.current = { active: true, startX: x, startY: y, taskId };
  }, []);

  const endSwipe = useCallback(
    (x, y, task) => {
      const s = swipeRef.current;
      if (!s?.active || s.taskId == null) return;

      const dx = x - s.startX;
      const dy = y - s.startY;

      swipeRef.current = { active: false, startX: 0, startY: 0, taskId: null };

      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dy) > SWIPE_MAX_Y) return;
      if (Math.abs(dx) < SWIPE_MIN_X) return;

      stepClipInCurrentView(task, dx < 0 ? +1 : -1);
    },
    [stepClipInCurrentView]
  );

  const handleTouchStart = useCallback(
    (e, task, idx) => {
      if (isInteractiveTarget(e.target)) return;
      const t = e.touches?.[0];
      if (!t) return;

      // swipe start
      beginSwipe(t.clientX, t.clientY, task.id);

      // hold start (temporal hide)
      startHold(t.clientX, t.clientY, task.id, idx);
    },
    [beginSwipe, uiHidden, selectedReelId, muted]
  );

  const handleTouchMove = useCallback((e) => {
    const t = e.touches?.[0];
    if (!t) return;
    moveHold(t.clientX, t.clientY);
  }, []);

  const handleTouchEnd = useCallback(
    (e, task) => {
      endHold();
      const t = e.changedTouches?.[0];
      if (!t) return;
      endSwipe(t.clientX, t.clientY, task);
    },
    [endSwipe]
  );

  const handleMouseDown = useCallback(
    (e, task, idx) => {
      if (e.button !== 0) return;
      if (isInteractiveTarget(e.target)) return;

      // swipe start
      beginSwipe(e.clientX, e.clientY, task.id);

      // hold start
      startHold(e.clientX, e.clientY, task.id, idx);
    },
    [beginSwipe, uiHidden, selectedReelId, muted]
  );

  const handleMouseMove = useCallback((e) => {
    moveHold(e.clientX, e.clientY);
  }, []);

  const handleMouseUp = useCallback(
    (e, task) => {
      endHold();
      endSwipe(e.clientX, e.clientY, task);
    },
    [endSwipe]
  );

  const emptyState = !isFetching && reels.length === 0;

  // ✅ label del botón “cambiar vista”: tema | factor | fuente
  const getViewLabel = (mode, temaValue) => {
    if (mode === "main") return temaValue;
    if (mode === "factores") return "factor";
    return "fuente";
  };

  return (
    <div className={`reels-root ${uiHidden ? "ui-hidden" : ""}`}>
      {/* ✅ Topbar SOLO si NO está oculto */}
      {!uiSuppressed && (
        <div className="reels-topbar">
          <button className="reels-back" onClick={goBack} title="Regresar">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="reels-topbar-center">
            <button
              className={`reels-tab ${tema === "consejos" ? "active" : ""}`}
              onClick={() => handleTemaChange("consejos")}
            >
              consejos
            </button>
            <button
              className={`reels-tab ${tema === "peticiones" ? "active" : ""}`}
              onClick={() => handleTemaChange("peticiones")}
            >
              peticiones
            </button>
            <button
              className={`reels-tab ${tema === "historias" ? "active" : ""}`}
              onClick={() => handleTemaChange("historias")}
            >
              historias
            </button>
          </div>

          <button
            className="reels-mute"
            onClick={() => setMuted((m) => !m)}
            title={muted ? "Activar sonido" : "Silenciar"}
          >
            <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} />
          </button>
        </div>
      )}

      {emptyState ? (
        <div className="reels-empty">
          <div className="reels-empty-title">No hay reels para “{tema}”.</div>
          <div className="reels-empty-sub">
            Publica una tarea con video en ese tema o cambia de pestaña.
          </div>
        </div>
      ) : (
        <div className="reels-container" ref={containerRef}>
          {reels.map((t, idx) => {
            const playlists = buildPlaylists(t);
            const rawState = viewStateById?.[t.id] || { mode: "main", pos: 0 };
            const eff = getEffectiveState(rawState, playlists);

            const hasFactores = (playlists?.factores?.length || 0) > 0;
            const hasFuentes = (playlists?.fuentes?.length || 0) > 0;

            const extraCount = (hasFactores ? 1 : 0) + (hasFuentes ? 1 : 0);

            const badgeCount =
              extraCount === 0 ? 0 : extraCount === 1 ? 1 : eff.mode === "main" ? 2 : 1;

            const list = playlists?.[eff.mode] || [];
            const entry = list[eff.pos] || null;

            const videoUrl = entry?.src ? toSrc(entry.src) : toSrc(t._anyVideo);
            const avatar = t.user_image ? toSrc(t.user_image) : null;

            const sharedByName = getSharedByName(t);

            const counterLabel = list.length ? `${eff.pos + 1}/${list.length}` : "—";
            const viewLabel = getViewLabel(eff.mode, tema);

            const itemTitle =
              entry?.item?.title || entry?.item?.name || entry?.item?.nombre || "";
            const itemDesc = entry?.item?.description || entry?.item?.descripcion || "";
            const itemLink = cleanVal(entry?.item?.link) || cleanVal(entry?.item?.url) || null;

            const perfilId = getTaskUserId(t);
            const isFav = perfilId ? !!favUsers[perfilId] : false;
            const flashing = perfilId ? !!favFlash[perfilId] : false;

            const isSelected = selectedReelId === t.id;
            const ownerUserId = t?.user?.id ?? t?.user_id ?? t?.user ?? null;

            return (
              <section
                className={`reel ${isSelected ? "is-selected" : ""}`}
                key={t.id}
                onTouchStart={(e) => handleTouchStart(e, t, idx)}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, t)}
                onMouseDown={(e) => handleMouseDown(e, t, idx)}
                onMouseMove={handleMouseMove}
                onMouseUp={(e) => handleMouseUp(e, t)}
                onClick={(e) => {
                  if (isInteractiveTarget(e.target)) return;

                  // si venimos de un hold (long-press), ignorar el click "fantasma"
                  if (suppressNextClickRef.current) {
                    suppressNextClickRef.current = false;
                    return;
                  }

                  // si está oculto permanente => click solo muestra UI (no pausa)
                  if (uiHidden) {
                    setUiHidden(false);
                    return;
                  }

                  // click normal:
                  // - si NO está seleccionado => pausa + player
                  // - si está seleccionado => cerrar player + reanudar
                  if (!isSelected) {
                    pauseAndSelect(t.id, idx);
                    return;
                  }

                  closeSelected(idx);
                }}
              >
                <video
                  key={`${t.id}-${eff.mode}-${eff.pos}-${videoUrl}`}
                  ref={(el) => {
                    if (el) videoRefs.current[idx] = el;
                    else delete videoRefs.current[idx];
                  }}
                  className="reel-video"
                  src={videoUrl}
                  playsInline
                  loop
                  muted={muted}
                  preload={idx <= activeIndex + 1 ? "auto" : "metadata"}
                />

                {/* ✅ Overlay SOLO si NO está oculto (ni permanente ni hold) */}
                {!uiSuppressed && (
                  <div className="reel-overlay">
                    <div className="reel-left">
                      {sharedByName ? (
                        <div className="reel-mode-indicator shared-byName">
                          <span style={{ fontWeight: 700 }}>{sharedByName}</span>
                        </div>
                      ) : null}

                      <div className="reel-userline">
                        <div className="reel-username">{t.username}</div>
                      </div>

                      {eff.mode === "main" ? (
                        <>
                          <div className="reel-title">{t.title}</div>
                          {t.description && <div className="reel-description">{t.description}</div>}
                        </>
                      ) : (
                        <>
                          <div className="reel-title">
                            {itemTitle || (eff.mode === "factores" ? "Factor" : "Fuente")}
                          </div>
                          {itemDesc ? <div className="reel-description">{itemDesc}</div> : null}
                          {itemLink ? (
                            <a
                              className="reel-section-item-link"
                              href={itemLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Abrir link
                            </a>
                          ) : null}
                        </>
                      )}

                      {t.categories && (
                        <div className="reel-cats">
                          {String(t.categories)
                            .split(",")
                            .map((c) => c.trim())
                            .filter(Boolean)
                            .slice(0, 6)
                            .map((c) => (
                              <span key={`${t.id}-${c}`} className="reel-chip">
                                {c}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className="reel-right">
                      {/* ✅ Menu SOLO cuando está seleccionado (porque icon2 vive ahí) */}
                      {isSelected && (
                        <div
                          className="icon2"
                          style={{ position: "relative" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="menuPCH">
                            <Button
                              aria-controls={`simple-menu-${t.id}`}
                              aria-haspopup="true"
                              onClick={(event) => handleClickMenu(event, t.id)}
                            >
                              <div className="iconBarraPch">
                                <FontAwesomeIcon icon={faBars} />
                              </div>
                            </Button>

                            <Menu
                              id={`simple-menu-${t.id}`}
                              anchorEl={anchorEl[t.id]}
                              keepMounted
                              open={Boolean(anchorEl[t.id])}
                              onClose={() => handleCloseMenu(t.id)}
                            >
                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToUserMesseges(ownerUserId);
                                  handleCloseMenu(t.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faEnvelope} />
                              </MenuItem>

                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToUserForum(ownerUserId);
                                  handleCloseMenu(t.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faUsers} />
                              </MenuItem>

                              {/* ✅ favorito tarea (tu función) */}
                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavoritoTarea(t.id);
                                  handleCloseMenu(t.id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  style={{
                                    color: pchFavoritos.includes(t.id) ? "red" : "grey",
                                    cursor: "pointer",
                                  }}
                                />
                              </MenuItem>

                              {/* ✅ OCULTAR TODO PERMANENTE (hasta click en pantalla) */}
                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // oculta todo y asegura que el video esté reproduciéndose
                                  setUiHidden(true);
                                  setSelectedReelId(null);

                                  const v = videoRefs.current[idx];
                                  if (v) {
                                    v.muted = muted;
                                    const p = v.play?.();
                                    if (p && typeof p.catch === "function") p.catch(() => {});
                                  }

                                  handleCloseMenu(t.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faEyeSlash} />
                              </MenuItem>

                              {String(loggedUserId) === String(ownerUserId) ? (
                                <MenuItem
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      await axios.delete(`${API_BASE}/api/tasks/${t.id}/`, {
                                        headers: getAuthHeaders(),
                                      });
                                      setItems((prev) => (prev || []).filter((x) => x.id !== t.id));
                                    } catch {}
                                    handleCloseMenu(t.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </MenuItem>
                              ) : null}

                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/dashboard/tasks/${t.id}/edit`);
                                  handleCloseMenu(t.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faPen} style={{ color: "black" }} />
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>
                      )}

                      {/* ✅ Avatar con corazón tipo iconsPch (pfavoritos) */}
                      <button
                        className="reel-profile-btn"
                        type="button"
                        title={t.username || "usuario"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProfileFavorite(t);
                        }}
                      >
                        <div className="reel-avatar reel-avatar--right reel-avatar-clickable">
                          <div className="reel-avatar-inner">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={t.username || "usuario"}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/placeholder.png";
                                }}
                              />
                            ) : (
                              <div className="reel-avatar-fallback">
                                <FontAwesomeIcon icon={faUser} />
                              </div>
                            )}
                          </div>

                          {perfilId && (
                            <div
                              className={[
                                "reel-avatar-heart",
                                isFav ? "active" : "",
                                flashing ? "flash" : "",
                              ].join(" ")}
                            >
                              <FontAwesomeIcon icon={faHeart} />
                            </div>
                          )}
                        </div>
                      </button>

                      {/* ✅ Cambiar vista */}
                      <button
                        className="reel-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleViewOnly(t);
                        }}
                        title="Cambiar vista (tema / factor / fuente)"
                      >
                        <div className="reel-action-icon-wrap">
                          <FontAwesomeIcon icon={faLayerGroup} className="reel-action-icon" />
                          {badgeCount > 0 && <span className="reel-action-badge">{badgeCount}</span>}
                        </div>

                        <div className="reel-action-label">{viewLabel}</div>
                        <div className="reel-action-count">{counterLabel}</div>
                      </button>

                      <button
                        className="reel-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskLike(t);
                        }}
                        title="Me gusta"
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={`reel-action-icon ${t.userHasLiked ? "liked" : ""}`}
                        />
                        <div
                          className="reel-action-count"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLikesModal(t.id);
                          }}
                          title="Ver usuarios que dieron like"
                        >
                          {t.likes_count ?? 0}
                        </div>
                      </button>

                      <button
                        className="reel-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPeticionPost(t.id);
                        }}
                        title="Responder"
                      >
                        <FontAwesomeIcon icon={faReply} className="reel-action-icon" />
                        <div className="reel-action-label">Responder</div>
                      </button>

                      <button
                        className="reel-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal(t);
                        }}
                        title="Compartir"
                      >
                        <FontAwesomeIcon icon={faArrowRight} className="reel-action-icon" />
                        <div
                          className="reel-action-count"
                          onClick={(e) => {
                            e.stopPropagation();
                            openSharedUsersModal(t.id);
                          }}
                          title="Ver usuarios que compartieron"
                        >
                          {t.share_count ?? 0}
                        </div>
                      </button>

                      {/* ✅ Guardar debajo de Compartir */}
                      <button
                        className="reel-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavoritoTarea(t.id);
                        }}
                        title="Guardar"
                      >
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className="reel-action-icon"
                          style={{ color: pchFavoritos.includes(t.id) ? "#54afff" : undefined }}
                        />
                        <div className="reel-action-label">Guardar</div>
                      </button>
                    </div>

                    {/* ✅ Player inferior SOLO cuando está seleccionado */}
                    {isSelected && (
                      <div className="reel-player" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="reel-player-btn"
                          type="button"
                          onClick={() => {
                            const v = videoRefs.current[idx];
                            if (!v) return;
                            if (v.paused) {
                              v.muted = muted;
                              v.play?.().catch(() => {});
                            } else {
                              v.pause?.();
                            }
                          }}
                          title={playerState.paused ? "Reproducir" : "Pausar"}
                        >
                          <FontAwesomeIcon icon={playerState.paused ? faPlay : faPause} />
                        </button>

                        <input
                          className="reel-player-range"
                          type="range"
                          min="0"
                          max={Math.max(1, playerState.duration || 0)}
                          step="0.1"
                          value={Math.min(playerState.current || 0, playerState.duration || 0)}
                          onChange={(e) => {
                            const v = videoRefs.current[idx];
                            if (!v) return;
                            v.currentTime = Number(e.target.value || 0);
                          }}
                        />

                        <div className="reel-player-time">
                          {formatTime(playerState.current)} / {formatTime(playerState.duration)}
                        </div>

                        <button
                          className="reel-player-close"
                          type="button"
                          onClick={() => closeSelected(idx)}
                          title="Cerrar reproductor"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    )}

                    {idx > 0 && (
                      <button
                        className="reel-nav reel-nav-up"
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToIndex(idx - 1);
                        }}
                        title="Anterior"
                      />
                    )}
                    {idx < reels.length - 1 && (
                      <button
                        className="reel-nav reel-nav-down"
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToIndex(idx + 1);
                        }}
                        title="Siguiente"
                      />
                    )}
                  </div>
                )}
              </section>
            );
          })}

          {isFetching && !uiSuppressed && <div className="reels-loading">Cargando…</div>}
          {!canLoadMore && reels.length > 0 && !uiSuppressed && (
            <div className="reels-end">No hay más.</div>
          )}
        </div>
      )}

      {/* Modal: usuarios que dieron like */}
      <Modal
        isOpen={isLikesModalOpen}
        onRequestClose={() => setIsLikesModalOpen(false)}
        contentLabel="Usuarios que dieron like"
      >
        <h2>Usuarios que dieron Like</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {(listUsers || []).map((u, i) => {
            const avatar = getUserAvatarSrc(u);
            return (
              <li
                key={`like-${u.id ?? u.username}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={u.username}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{u.username}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div>{u.likes_count ?? 0}</div>
                  <FontAwesomeIcon icon={faHeart} />
                </div>
              </li>
            );
          })}
        </ul>
        <button onClick={() => setIsLikesModalOpen(false)}>Cerrar</button>
      </Modal>

      {/* Modal: usuarios que compartieron */}
      <Modal
        isOpen={isSharedUsersModalOpen}
        onRequestClose={() => setIsSharedUsersModalOpen(false)}
        contentLabel="Usuarios que compartieron"
      >
        <h2>Usuarios que compartieron</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {(sharedUsers || []).map((u, i) => {
            const avatar = getUserAvatarSrc(u);
            const username = u?.username ?? u?.user?.username ?? "";
            return (
              <li
                key={`shared-${u.id ?? username}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={username}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{username}</div>
                </div>
              </li>
            );
          })}
        </ul>
        <button onClick={() => setIsSharedUsersModalOpen(false)}>Cerrar</button>
      </Modal>

      {/* SharedTaskModal */}
      <SharedTaskModal
        isOpen={isShareModalOpen}
        taskId={selectedTask ? selectedTask.id : null}
        onClose={() => setIsShareModalOpen(false)}
        onShared={({ server, taskId, description }) => {
          setItems((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    share_count: server?.share_count ?? (t.share_count ?? 0) + 1,
                    shared_by_list: server?.shared_by_list ?? [
                      ...(t.shared_by_list || []),
                      {
                        id: loggedUserId,
                        username: reduxUser?.username ?? reduxUser?.user?.username,
                        description,
                      },
                    ],
                  }
                : t
            )
          );

          setIsShareModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default ReelsPCH;
