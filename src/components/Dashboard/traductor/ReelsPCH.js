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
  faEnvelope,
  faUsers,
  faTrash,
  faPen,
  faBookmark,
  faPlay,
  faPause,
  faXmark,
  faEyeSlash,
  faEllipsis, // ✅ 3 puntos horizontal
  faFilter, // ✅ ICONO FILTRO
} from "@fortawesome/free-solid-svg-icons";
import "../owenscss/usersRowModal.scss";
import UserRow from "./UserRow";
import TierTabs from "./TierTabs";

// MUI v5
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useGetFeedQuery } from "./feed/FeedApi";
import SharedTaskModal from "./SharedTaskModal";

import "../owenscss/ReelsPCH.scss";
import TaskFilterMenu from "./Filtro";
import CategoriesMenu from "./cetegorymenu";
import TextoConVerMas from "./TextoConVerMas"; // ✅
import { API_BASE, cleanVal, toSrc } from "./utils/media";
import {
  tierTabs,
  getTierKey,
  getTierMeta,
  normalizeUsersResponse,
  getUserAvatarSrc,
} from "./utils/users";

// ====== TIER / JERARQUÍA (igual que Peticiones) ======
const APP_USER_ID = 1;        // owen
const APP_USERNAME = "owen";
const SUB_PLUS_THRESHOLD = 8; // “mayor a lo establecido”


const getAuthHeaders = () => {
  const token =
    localStorage.getItem("userTokenLG") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  if (!token) return {};
  return { Authorization: `Token ${token}` };
};




// ✅ Avatar del que compartió (último que compartió)
const getSharedByAvatarSrc = (t) => {
  const pick = (obj) => {
    if (!obj) return null;

    const candidates = [
      obj?.user_image,
      obj?.user_image_url,
      obj?.avatar,
      obj?.avatar_url,
      obj?.image,
      obj?.image_url,
      obj?.profile_image,
      obj?.photo,
      obj?.picture,
      obj?.user?.user_image,
      obj?.user?.avatar,
      obj?.user?.image,
      obj?.profile?.image,
      obj?.profile?.avatar,
    ];

    const found = candidates.map(cleanVal).find(Boolean);
    return found ? toSrc(found) : null;
  };

  // 1) si viene como objeto directo
  const direct = pick(t?.shared_by) || pick(t?.sharedBy);
  if (direct) return direct;

  // 2) shared_by_list: último con imagen válida
  const list =
    (Array.isArray(t?.shared_by_list) && t.shared_by_list) ||
    (Array.isArray(t?.sharedByList) && t.sharedByList) ||
    [];

  for (let i = list.length - 1; i >= 0; i--) {
    const img = pick(list[i]);
    if (img) return img;
  }

  // 3) shared_tasks: último con imagen válida
  const st = Array.isArray(t?.shared_tasks) ? t.shared_tasks : [];
  for (let i = st.length - 1; i >= 0; i--) {
    const img = pick(st[i]);
    if (img) return img;
  }

  return null;
};


const getSharedByName = (t) => {
  const direct =
    cleanVal(t?.shared_byName) || cleanVal(t?.shared_by_name) || cleanVal(t?.sharedByName);

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
    const name = cleanVal(last?.username) || cleanVal(last?.user?.username) || cleanVal(last?.user);
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

const getSharedByInfo = (t) => {
  const name = getSharedByName(t);

  const list =
    (Array.isArray(t?.shared_by_list) && t.shared_by_list) ||
    (Array.isArray(t?.sharedByList) && t.sharedByList) ||
    [];

  let description = null;

  // 1) shared_by_list (última descripción no vacía)
  for (let i = list.length - 1; i >= 0; i--) {
    const d = cleanVal(list[i]?.description);
    if (d) {
      description = d;
      break;
    }
  }

  // 2) fallback: si en algún caso viene en un objeto
  if (!description) {
    description =
      cleanVal(t?.shared_by?.description) ||
      cleanVal(t?.sharedBy?.description) ||
      cleanVal(t?.shared_by_description) ||
      cleanVal(t?.sharedByDescription) ||
      null;
  }

  return name ? { name, description } : null;
};


const getSharedByDescription = (t) => {
  const direct =
    cleanVal(t?.shared_description) ||
    cleanVal(t?.shared_by_description) ||
    cleanVal(t?.sharedByDescription);

  if (direct) return direct;

  const objDesc =
    cleanVal(t?.shared_by?.description) ||
    cleanVal(t?.shared_by?.text) ||
    cleanVal(t?.shared_by?.comment);

  if (objDesc) return objDesc;

  const list =
    (Array.isArray(t?.shared_by_list) && t.shared_by_list) ||
    (Array.isArray(t?.sharedByList) && t.sharedByList) ||
    [];

  if (list.length) {
    const last = list[list.length - 1];
    const desc =
      cleanVal(last?.description) ||
      cleanVal(last?.text) ||
      cleanVal(last?.comment) ||
      cleanVal(last?.desc);
    if (desc) return desc;
  }

  const st = Array.isArray(t?.shared_tasks) ? t.shared_tasks : [];
  if (st.length) {
    const last = st[st.length - 1];
    const desc = cleanVal(last?.description) || cleanVal(last?.text) || cleanVal(last?.comment);
    if (desc) return desc;
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

// ✅ FIX: dedupe MAIN por src, priorizando subtasks (aportaciones) cuando el src se repite
const dedupeMainPreferContribution = (entries) => {
  const out = [];
  const idxBySrc = new Map();

  const isSub = (e) => e?.groupIndex != null;

  for (const e of entries) {
    const src = cleanVal(e?.src);
    if (!src) continue;

    const next = { ...e, src };
    const existingIndex = idxBySrc.get(src);

    if (existingIndex == null) {
      idxBySrc.set(src, out.length);
      out.push(next);
      continue;
    }

    const prev = out[existingIndex];
    if (!isSub(prev) && isSub(next)) {
      out[existingIndex] = next;
    }
  }

  return out;
};

const buildPlaylists = (task) => {
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : [];
  const factores = Array.isArray(task?.subfactores) ? task.subfactores : [];
  const fuentes = Array.isArray(task?.subfuentes) ? task.subfuentes : [];

  const mainEntriesRaw = [];

  const taskVids = extractVideos(task);
  taskVids.forEach((src, li) => {
    mainEntriesRaw.push({
      src,
      kind: "main",
      item: task,
      groupIndex: null,
      groupTotal: null,
      localIndex: li,
      localTotal: taskVids.length,
    });
  });

  subtasks.forEach((st, gi) => {
    const vids = extractVideos(st);
    vids.forEach((src, li) => {
      mainEntriesRaw.push({
        src,
        kind: "main",
        item: st,
        groupIndex: gi,
        groupTotal: subtasks.length,
        localIndex: li,
        localTotal: vids.length,
      });
    });
  });

  const mainVideos = dedupeMainPreferContribution(mainEntriesRaw);

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
  const fallbackMode = VIEW_ORDER.find((m) => (playlists?.[m]?.length || 0) > 0) || "main";
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

const getTaskUserId = (t) =>
  t?.user?.id ?? t?.user_id ?? t?.userId ?? t?.profile?.id ?? t?.profile_id ?? t?.user ?? null;

const ReelsPCH = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const reduxUser = useSelector((s) => s.auth.user);
  const loggedUserId = reduxUser?.id ?? reduxUser?.user?.id ?? null;

  // =========================
  // ✅ FILTROS / CATEGORÍAS
  // =========================
  const [soloFavoritosTareas, setSoloFavoritosTareas] = useState(false);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [filtro, setFiltro] = useState(null);

  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarSoloFavoritosUsuarioSeleccionado, setMostrarSoloFavoritosUsuarioSeleccionado] =
    useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const openFilter = useCallback((e) => {
    e.stopPropagation();
    setFilterAnchorEl(e.currentTarget);
    setFilterOpen(true);
  }, []);

  const closeFilter = useCallback(() => {
    setFilterOpen(false);
    setFilterAnchorEl(null);
  }, []);

  const toggleFilter = useCallback(
    (e) => {
      e.stopPropagation();
      if (filterOpen) {
        closeFilter();
      } else {
        openFilter(e);
      }
    },
    [filterOpen, openFilter, closeFilter]
  );

  const predefinedCategories = useMemo(() => [], []);
  const predefinedCategoriesUserSelect = useMemo(() => [], []);

  const toggleMostrarFavoritos = useCallback(() => {
    setMostrarSoloFavoritos((p) => !p);
  }, []);

  const handleMostrarCompartidos = useCallback(() => {
    setFiltro((prev) => (prev === "compartidos" ? null : "compartidos"));
  }, []);

  const cargarFavoritosPerfilesUsuarioSeleccionado = useCallback(() => {}, []);
  const cargarFavoritosUsuarioSeleccionado = useCallback(() => {}, []);

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

  const rootRef = useRef(null);
  const selectedExtraRef = useRef(null);

  const [period, setPeriod] = useState(null);

  // =========================
  // ✅ UI hidden (POR REEL)
  // =========================
  const [uiHiddenById, setUiHiddenById] = useState({});
  const [pressHiddenTaskId, setPressHiddenTaskId] = useState(null);

  const isUiHidden = useCallback(
    (taskId) => (taskId != null ? !!uiHiddenById?.[taskId] : false),
    [uiHiddenById]
  );

  const isPressHidden = useCallback(
    (taskId) => taskId != null && String(pressHiddenTaskId) === String(taskId),
    [pressHiddenTaskId]
  );

  const isUiSuppressedFor = useCallback(
    (taskId) => isUiHidden(taskId) || isPressHidden(taskId),
    [isUiHidden, isPressHidden]
  );

  const suppressNextClickRef = useRef(false);
  const pressHiddenKeepPausedRef = useRef(false);

  // =========================
  // ✅ SELECCIÓN
  // =========================
  const [selectedReelId, setSelectedReelId] = useState(null);


  // ✅ Estado: "selección" del bloque shared-byName por reel
const [sharedOpenById, setSharedOpenById] = useState({}); // { [taskId]: true/false }


const pauseAndSelect = useCallback((taskId, idx) => {
  const v = videoRefs.current[idx];
  if (v) v.pause?.();
  setSelectedReelId(taskId);
  setFilterOpen(false);
  setPlayerState((p) => ({
    ...p,
    id: taskId,
    current: v?.currentTime || 0,
    duration: v?.duration || 0,
    paused: true,
  }));
}, []);

const [likesModalFilter, setLikesModalFilter] = useState("all");
const [sharedModalFilter, setSharedModalFilter] = useState("all");

const likesCounts = useMemo(() => {
  const counts = { all: (listUsers || []).length, verified:0, sub_green:0, sub_red:0, recommended:0, app:0, regular:0 };
  (listUsers || []).forEach((u) => {
    const k = getTierKey(u);
    counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
}, [listUsers]);

const sharedCounts = useMemo(() => {
  const counts = { all: (sharedUsers || []).length, verified:0, sub_green:0, sub_red:0, recommended:0, app:0, regular:0 };
  (sharedUsers || []).forEach((u) => {
    const k = getTierKey(u);
    counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
}, [sharedUsers]);

const listUsersFiltered = useMemo(() => {
  const arr = Array.isArray(listUsers) ? listUsers : [];
  if (likesModalFilter === "all") return arr;
  return arr.filter((u) => getTierKey(u) === likesModalFilter);
}, [listUsers, likesModalFilter]);

const sharedUsersFiltered = useMemo(() => {
  const arr = Array.isArray(sharedUsers) ? sharedUsers : [];
  if (sharedModalFilter === "all") return arr;
  return arr.filter((u) => getTierKey(u) === sharedModalFilter);
}, [sharedUsers, sharedModalFilter]);



const toggleSharedByIndicator = useCallback(
  (taskId, idx) => {
    if (!taskId) return;

    if (String(selectedReelId) !== String(taskId)) {
      pauseAndSelect(taskId, idx);
      setSharedOpenById((prev) => ({ ...(prev || {}), [taskId]: true }));
      return;
    }

    setSharedOpenById((prev) => ({
      ...(prev || {}),
      [taskId]: !prev?.[taskId],
    }));
  },
  [selectedReelId, pauseAndSelect]
);



  const [playerState, setPlayerState] = useState({
    id: null,
    current: 0,
    duration: 0,
    paused: true,
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const apply = () => {
      const h = selectedExtraRef.current?.offsetHeight || 0;
      root.style.setProperty("--underbar-h", `${h}px`);
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [selectedReelId, filterOpen, showMyTasksOnly, usuarioSeleccionado, tema]);

  const formatTime = (sec) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  // const pauseAndSelect = useCallback((taskId, idx) => {
  //   const v = videoRefs.current[idx];
  //   if (v) v.pause?.();
  //   setSelectedReelId(taskId);
  //   setFilterOpen(false);
  //   setPlayerState((p) => ({
  //     ...p,
  //     id: taskId,
  //     current: v?.currentTime || 0,
  //     duration: v?.duration || 0,
  //     paused: true,
  //   }));
  // }, []);

  const closeSelected = useCallback(
    (idx) => {
      setSelectedReelId(null);
      setFilterOpen(false);
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

const navigateToUserMesseges = useCallback(
  (userId) => {
    if (!userId) return;
    navigate(`/dashboard/direcmassaging/user-${userId}`);
  },
  [navigate]
);

const navigateToUserForum = useCallback(
  (userId) => {
    if (!userId) return;
    navigate(`/dashboard/newcommunity/${userId}`);
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
      setUiHiddenById({});
      setPressHiddenTaskId(null);
      pressHiddenKeepPausedRef.current = false;
      setFilterOpen(false);
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
    ...(selectedCategory ? { category: selectedCategory } : {}),
    ...(filtro ? { filtro } : {}),
    ...(showMyTasksOnly ? { my_tasks: 1 } : {}),
    ...(soloFavoritosTareas ? { favorites: 1 } : {}),
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
    setUiHiddenById({});
    setPressHiddenTaskId(null);
    pressHiddenKeepPausedRef.current = false;
    setFilterOpen(false);
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

    let out = base
      .filter((t) => t?.pch === tema)
      .map((t) => ({ ...t, _anyVideo: getFirstVideoAnywhere(t) }))
      .filter((t) => !!t._anyVideo);

    if (selectedCategory) {
      out = out.filter((t) => {
        const cats = String(t.categories || "");
        return cats.toLowerCase().includes(String(selectedCategory).toLowerCase());
      });
    }

    if (showMyTasksOnly && loggedUserId) {
      out = out.filter((t) => String(getTaskUserId(t)) === String(loggedUserId));
    }

    if (usuarioSeleccionado) {
      const uid = usuarioSeleccionado?.id ?? usuarioSeleccionado;
      if (uid) out = out.filter((t) => String(getTaskUserId(t)) === String(uid));
    }

    if (soloFavoritosTareas) {
      out = out.filter((t) => pchFavoritos.includes(t.id));
    }

    return out;
  }, [
    items,
    tema,
    selectedCategory,
    showMyTasksOnly,
    loggedUserId,
    usuarioSeleccionado,
    soloFavoritosTareas,
    pchFavoritos,
  ]);

  const activeTaskId = reels?.[activeIndex]?.id ?? null;
  const uiSuppressedActive = isUiSuppressedFor(activeTaskId);

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

  useEffect(() => {
    setSelectedReelId(null);
    setPressHiddenTaskId(null);
    pressHiddenKeepPausedRef.current = false;
    setFilterOpen(false);
  }, [activeIndex]);

  useEffect(() => {
    const pressHiddenActive = isPressHidden(activeTaskId);

    Object.entries(videoRefs.current).forEach(([idxStr, vid]) => {
      const idx = Number(idxStr);
      if (!vid) return;

      if (idx === activeIndex) {
        if (uiSuppressedActive) {
          if (
            pressHiddenActive &&
            pressHiddenKeepPausedRef.current &&
            activeTaskId &&
            selectedReelId === activeTaskId
          ) {
            vid.pause?.();
            return;
          }

          vid.muted = muted;
          const p = vid.play?.();
          if (p && typeof p.catch === "function") p.catch(() => {});
          return;
        }

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
  }, [activeIndex, muted, reels, selectedReelId, activeTaskId, uiSuppressedActive, isPressHidden]);

  useEffect(() => {
    const task = reels?.[activeIndex];
    if (!task) return;
    if (isUiSuppressedFor(task.id)) return;
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
  }, [selectedReelId, activeIndex, reels, isUiSuppressedFor]);

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
    setLikesModalFilter("all");
    setListUsers(normalizeUsersResponse(data));
    setIsLikesModalOpen(true);
  } catch (err) {
    console.error("openLikesModal error:", err);
    setLikesModalFilter("all");
    setListUsers([]);
    setIsLikesModalOpen(true);
  }
};

const openSharedUsersModal = async (taskId) => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/tasks/${taskId}/shared-users/`, {
      headers: getAuthHeaders(),
    });

    setSharedModalFilter("all");
    setSharedUsers(normalizeUsersResponse(data));
    setIsSharedUsersModalOpen(true);
  } catch (err) {
    console.error("openSharedUsersModal error:", err);
    setSharedModalFilter("all");
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

  // ✅ SOLO CAMBIA VISTA
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

  // =========================
  // ✅ HOLD => ocultar temporal (POR REEL)
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
    if (isUiHidden(taskId)) return;
    if (selectedReelId && String(selectedReelId) !== String(taskId)) return;

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
      holdRef.current.triggered = true;
      suppressNextClickRef.current = true;

      const isSelectedHold = !!selectedReelId && String(selectedReelId) === String(taskId);

      pressHiddenKeepPausedRef.current = isSelectedHold;
      setPressHiddenTaskId(taskId);

      const v = videoRefs.current[idx];
      if (!v) return;

      if (isSelectedHold) {
        v.pause?.();
      } else {
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
      setPressHiddenTaskId(null);
      pressHiddenKeepPausedRef.current = false;
    }
  };

  // =========================
  // ✅ SWIPE helper
  // =========================
  const swipeRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    taskId: null,
  });

  const SWIPE_MIN_X = 45;
  const SWIPE_MAX_Y = 80;

  // ✅ EDITADO: agrego badge/desc como "interactivos"
  const isInteractiveTarget = (target) => {
    if (!target) return false;
    return !!target.closest(
      "button, a, input, textarea, select, label, .reel-player, .MuiMenu-root, .MuiPopover-root, .texto-con-ver-mas, .reel-cats, .shared-byName, .shared-by-badge, .shared-by-desc"
    );
  };

  const beginSwipe = useCallback((x, y, taskId) => {
    swipeRef.current = { active: true, startX: x, startY: y, taskId };
  }, []);

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

      beginSwipe(t.clientX, t.clientY, task.id);
      startHold(t.clientX, t.clientY, task.id, idx);
    },
    [beginSwipe]
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

      beginSwipe(e.clientX, e.clientY, task.id);
      startHold(e.clientX, e.clientY, task.id, idx);
    },
    [beginSwipe]
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

  const getViewLabel = (mode, temaValue) => {
    if (mode === "main") return temaValue;
    if (mode === "factores") return "factor";
    return "fuente";
  };

  return (
    <div ref={rootRef} className={`reels-root ${uiSuppressedActive ? "ui-hidden" : ""}`}>
      {!uiSuppressedActive && (
        <>
          <div className="reels-topbar">
            <div className="reels-topbar-left" onClick={(e) => e.stopPropagation()}>
              <button
                className={["reels-back", selectedReelId ? "" : "is-hidden"].join(" ")}
                onClick={goBack}
                title="Regresar"
                type="button"
                aria-hidden={!selectedReelId}
                tabIndex={selectedReelId ? 0 : -1}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            </div>

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

            <div className="reels-topbar-right" onClick={(e) => e.stopPropagation()}>
              <button
                className={[
                  "reels-filter-icon",
                  filterOpen ? "active" : "",
                  selectedReelId ? "" : "is-hidden",
                ].join(" ")}
                onClick={toggleFilter}
                title="Filtros"
                type="button"
                aria-hidden={!selectedReelId}
                tabIndex={selectedReelId ? 0 : -1}
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          {selectedReelId && filterOpen && (
            <div
              ref={selectedExtraRef}
              className="reels-selected-extra"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedReelId && (
                <TaskFilterMenu
                  open={filterOpen}
                  anchorEl={filterAnchorEl}
                  onClose={closeFilter}
                  tema={tema}
                  setSoloFavoritosTareas={setSoloFavoritosTareas}
                  mostrarSoloFavoritos={mostrarSoloFavoritos}
                  cargarFavoritosUsuarioSeleccionado={cargarFavoritosUsuarioSeleccionado}
                  usuarioSeleccionado={usuarioSeleccionado}
                  mostrarSoloFavoritosUsuarioSeleccionado={mostrarSoloFavoritosUsuarioSeleccionado}
                  setMostrarSoloFavoritosUsuarioSeleccionado={
                    setMostrarSoloFavoritosUsuarioSeleccionado
                  }
                  soloFavoritosTareas={soloFavoritosTareas}
                  mostrarUsuarios={mostrarUsuarios}
                  setFiltro={setFiltro}
                  handleMostrarCompartidos={handleMostrarCompartidos}
                  showMyTasksOnly={showMyTasksOnly}
                  toggleMostrarFavoritos={toggleMostrarFavoritos}
                />
              )}

              <CategoriesMenu
                style={{
                  color: tema === "consejos" ? "rgb(84, 175, 255)" : "black",
                }}
                className="category-menu"
                onCategorySelected={setSelectedCategory}
                tema={tema}
              />

              {showMyTasksOnly && (
                <div
                  className="category-menu"
                  style={{
                    color: tema === "consejos" ? "rgb(84, 175, 255)" : "black",
                  }}
                >
                  <div className="horizontal-scroll">
                    <ul>
                      {predefinedCategories.map((cat, index) => (
                        <li key={index} onClick={() => setSelectedCategory(cat)}>
                          {cat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {usuarioSeleccionado && (
                <div
                  className="category-menu"
                  style={{
                    color: tema === "consejos" ? "#3bce0f" : "black",
                    marginTop: "11px",
                  }}
                >
                  <div className="horizontal-scroll">
                    <ul>
                      {predefinedCategoriesUserSelect.map((cat, index) => (
                        <li key={index} onClick={() => setSelectedCategory(cat)}>
                          {cat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
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
            // ✅ IMPORTANTE: declarar isSelected ANTES (para que no dependa de paused)
            const isSelected = selectedReelId === t.id;

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

            const isMainContribution = eff.mode === "main" && entry?.groupIndex != null;
            const subtask = isMainContribution ? entry?.item : null;

            const mainPrimaryTitle = t.title || "";
            const mainSecondaryTitle = isMainContribution ? subtask?.title || "" : "";

            const mainDesc = isMainContribution
              ? [t.description, subtask?.description].filter(Boolean).join("  •  ")
              : t.description || "";

            const isDetailMode = eff.mode === "factores" || eff.mode === "fuentes";
            const detailItem = isDetailMode ? entry?.item : null;

            const detailTitle =
              detailItem?.title ||
              detailItem?.name ||
              detailItem?.nombre ||
              (eff.mode === "factores" ? "Factor" : eff.mode === "fuentes" ? "Fuente" : "");

            const detailDesc = detailItem?.description || detailItem?.descripcion || "";
            const detailLink = cleanVal(detailItem?.link) || cleanVal(detailItem?.url) || null;

            const videoUrl = entry?.src ? toSrc(entry.src) : toSrc(t._anyVideo);
            const avatar = t.user_image ? toSrc(t.user_image) : null;

            // ✅ shared info
            const sharedByInfo = getSharedByInfo(t);
            const sharedByName = sharedByInfo?.name || null;
            const sharedByDesc = sharedByInfo?.description || null;

            // ✅ notificación de descripción (1) antes de seleccionar
            const sharedBadgeCount = sharedByDesc ? 1 : 0;
const sharedByAvatar = getSharedByAvatarSrc(t);

            // (lo dejo tal cual tu lógica, aunque no lo uses)
            const isPausedSelectedThis =
              isSelected && playerState?.id === t.id && !!playerState?.paused;

            const counterLabel = list.length ? `${eff.pos + 1}/${list.length}` : "—";
            const viewLabel = getViewLabel(eff.mode, tema);

            const perfilId = getTaskUserId(t);
            const isFav = perfilId ? !!favUsers[perfilId] : false;
            // const flashing = perfilId ? !!favFlash[perfilId] : false;

            const ownerUserId = t?.user?.id ?? t?.user_id ?? t?.user ?? null;

            const suppressedThisReel = isUiSuppressedFor(t.id);

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

                  if (suppressNextClickRef.current) {
                    suppressNextClickRef.current = false;
                    return;
                  }

                  if (isUiHidden(t.id)) {
                    setUiHiddenById((prev) => {
                      const next = { ...(prev || {}) };
                      delete next[t.id];
                      return next;
                    });
                    return;
                  }

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

                {!suppressedThisReel && (
                  <div className="reel-overlay">
                    <div className="reel-left">
                      {/* {!isSelected && sharedBadgeCount > 0 ? (
                        <div className="reel-mode-indicator shared-byName">
                          <div className="shared-by-row">
                            <span className="shared-by-title" style={{ fontWeight: 700 }}>
                              {sharedByName}
                            </span>
                            <span className="shared-by-badge">{sharedBadgeCount}</span>
                          </div>
                        </div>
                      ) : null} */}

                      {sharedByName ? (
  <div
    className={[
      "reel-mode-indicator",
      "shared-byName",
      isSelected && sharedOpenById?.[t.id] ? "is-selected" : "",
    ].join(" ")}
    role="button"
    tabIndex={0}
    onClick={(e) => {
      e.stopPropagation();
      toggleSharedByIndicator(t.id, idx);
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggleSharedByIndicator(t.id, idx);
      }
    }}
  >
<div className="shared-by-row" style={{ display: "flex", alignItems: "center", gap: 8 }}>
  {/* ✅ avatar del que compartió */}
  <span
    className="shared-by-avatar"
    style={{
      width: 22,
      height: 22,
      borderRadius: "50%",
      overflow: "hidden",
      flex: "0 0 auto",
      display: "grid",
      placeItems: "center",
    }}
  >
    {sharedByAvatar ? (
      <img
        src={sharedByAvatar}
        alt={sharedByName}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/placeholder.png";
        }}
      />
    ) : (
      <FontAwesomeIcon icon={faUser} />
    )}
  </span>

  {/* <span className="shared-by-title" style={{ fontWeight: 700 }}>
    {sharedByName}
  </span> */}

  {!sharedOpenById?.[t.id] && sharedByDesc ? (
    <span className="shared-by-badge">1</span>
  ) : null}
</div>



    {/* ✅ descripción SOLO cuando el shared-byName está seleccionado/abierto
        (y además requiere que el reel esté seleccionado) */}
    {isSelected && sharedOpenById?.[t.id] && sharedByDesc ? (
      <div>
  <span className="shared-by-title" style={{ fontWeight: 700 }}>
    {sharedByName}
  </span>
      <div className="shared-by-desc">{sharedByDesc}</div>
      </div>
   
    ) : null}
  </div>
) : null}


                      <div className="reel-userline">
                        <div className="reel-username">{t.username}</div>
                      </div>

                      <TextoConVerMas
                        primaryTitle={mainPrimaryTitle}
                        title={mainSecondaryTitle}
                        description={mainDesc}
                        tema={tema}
                        variant="reels"
                        maxLines={3}
                        clickAnywhere={true}
                        maxOpenVh={26}
                      />

                      {isDetailMode ? (
                        <>
                          <TextoConVerMas
                            title={detailTitle}
                            description={detailDesc}
                            tema={tema}
                            variant="reels"
                            maxLines={3}
                            clickAnywhere={true}
                            maxOpenVh={26}
                          />

                          {detailLink ? (
                            <a
                              className="reel-section-item-link"
                              href={detailLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Abrir link
                            </a>
                          ) : null}
                        </>
                      ) : null}

                      {isSelected && t.categories && (
                        <div className="reel-cats" onClick={(e) => e.stopPropagation()}>
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

             {perfilId && !isFav ? (
  <div className="reel-avatar-heart reel-avatar-heart--idle">
    <FontAwesomeIcon icon={faHeart} />
  </div>
) : null}


                        </div>
                      </button>

                      <button
                        className="reel-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleViewOnly(t);
                        }}
                        title="Cambiar vista"
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

                      <div
                        className="icon2"
                        style={{
                          position: "relative",
                          marginTop: "-16px",
                          marginBottom: "16px",
                          marginLeft: "0px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="menuPCH">
                          <Button
                            aria-controls={`simple-menu-${t.id}`}
                            aria-haspopup="true"
                            onClick={(event) => handleClickMenu(event, t.id)}
                          >
                            <div className="iconBarraPch">
                              <FontAwesomeIcon icon={faEllipsis} />
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

                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();

                                setUiHiddenById((prev) => ({ ...(prev || {}), [t.id]: true }));

                                setSelectedReelId(null);
                                setPressHiddenTaskId(null);
                                pressHiddenKeepPausedRef.current = false;
                                setFilterOpen(false);

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
                    </div>

                   {isSelected && (
  <div className="reel-player" onClick={(e) => e.stopPropagation()}>
    <div className="reel-player-timebar">
      {formatTime(playerState.current)} / {formatTime(playerState.duration)}
    </div>

    <div className="reel-player-controls">
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

      <button
        className="reel-player-close"
        type="button"
        onClick={() => closeSelected(idx)}
        title="Cerrar reproductor"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
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

                    {idx < reels.length - 1 && <div className="reel-nav reel-nav-down" />}
                  </div>
                )}
              </section>
            );
          })}

          {isFetching && !uiSuppressedActive && <div className="reels-loading">Cargando…</div>}
        </div>
      )}

<Modal
  isOpen={isLikesModalOpen}
  onRequestClose={() => setIsLikesModalOpen(false)}
  contentLabel="Usuarios que dieron like"
  className="users-modal"
  overlayClassName="users-modal-overlay"
>
  <TierTabs
    tabs={tierTabs}
    counts={likesCounts}
    activeKey={likesModalFilter}
    onChange={setLikesModalFilter}
  />

  <ul className="users-modal__list">
    {(listUsersFiltered || []).map((u, i) => {
      const meta = getTierMeta(u);
      const avatar = getUserAvatarSrc(u);
      const badge = meta.key !== "regular" ? meta.label : null;

      return (
        <UserRow
          key={`like-${u.id ?? u.username}-${i}`}
          avatarSrc={avatar}
          username={u.username}
          badgeLabel={badge}
          right={
            <>
              <span className="user-row__count">{u.likes_count ?? 0}</span>
              <FontAwesomeIcon icon={faHeart} style={{ color: meta.color }} />
            </>
          }
        />
      );
    })}
  </ul>
</Modal>



<Modal
  isOpen={isSharedUsersModalOpen}
  onRequestClose={() => setIsSharedUsersModalOpen(false)}
  contentLabel="Usuarios que compartieron"
  className="users-modal"
  overlayClassName="users-modal-overlay"
>
  <TierTabs
    tabs={tierTabs}
    counts={sharedCounts}
    activeKey={sharedModalFilter}
    onChange={setSharedModalFilter}
  />

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
