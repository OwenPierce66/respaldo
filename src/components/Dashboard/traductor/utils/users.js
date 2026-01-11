// src/components/Dashboard/traductor/utils/users.js
import { cleanVal, toSrc } from "./media";

export const APP_USER_ID = 1;          // owen (ajusta si cambia)
export const APP_USERNAME = "owen";    // ajusta si cambia
export const SUB_PLUS_THRESHOLD = 8;   // “Suscripción +” desde este monto

export const tierTabs = [
  { key: "all", label: "Todos" },
  { key: "app", label: "App" },
  { key: "recommended", label: "Recomendados" },
  { key: "sub_red", label: "Suscripción +" },
  { key: "verified", label: "Verificados" },
  { key: "sub_green", label: "Suscripción" },
  { key: "regular", label: "Otros" },
];

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

export const normalizeUsersResponse = (data) => {
  let arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data?.users)
    ? data.users
    : [];

  arr = arr.filter(isObj);

  return arr.map((u) => {
    const id = u?.id ?? u?.user?.id ?? u?.pk ?? u?.user_id ?? null;
    const username = u?.username ?? u?.user?.username ?? "";
    const prof = u?.profile ?? u?.user?.profile ?? null;

    const subscriptionActive = Boolean(prof?.subscriptionActive ?? u?.subscriptionActive);
    const subscription_amount = parseFloat(prof?.subscription_amount ?? u?.subscription_amount ?? 0) || 0;
    const is_verified = Boolean(prof?.is_verified ?? u?.is_verified ?? u?.verified);
    const is_recommended = Boolean(prof?.is_recommended ?? u?.is_recommended);

    const uname = String(username).toLowerCase();
    const is_app =
      Boolean(u?.is_app) ||
      uname === "app-bot" ||
      uname === String(APP_USERNAME).toLowerCase() ||
      (id != null && id === APP_USER_ID);

    return {
      id,
      username,
      likes_count: u?.likes_count ?? 0,
      subscriptionActive,
      subscription_amount,
      is_verified,
      is_recommended,
      is_app,
      _orig: u,
    };
  });
};

export const getTierKey = (u) => {
  const raw = u?._orig ?? u;
  const prof = raw?.profile ?? raw?.user?.profile ?? null;

  const id = raw?.id ?? raw?.user?.id ?? u?.id ?? u?.user?.id ?? null;
  const username = String(raw?.username ?? u?.username ?? "").toLowerCase();

  const isVerified = Boolean(prof?.is_verified ?? raw?.is_verified ?? raw?.verified ?? u?.is_verified);
  const subActive = Boolean(prof?.subscriptionActive ?? raw?.subscriptionActive ?? u?.subscriptionActive);
  const subAmount = parseFloat(prof?.subscription_amount ?? raw?.subscription_amount ?? u?.subscription_amount ?? 0) || 0;
  const isRecommended = Boolean(prof?.is_recommended ?? raw?.is_recommended ?? u?.is_recommended);

  const isApp =
    Boolean(raw?.is_app ?? u?.is_app) ||
    username === "app-bot" ||
    username === String(APP_USERNAME).toLowerCase() ||
    (id != null && id === APP_USER_ID);

  if (isApp) return "app";
  if (isRecommended) return "recommended";
  if (subActive && subAmount >= SUB_PLUS_THRESHOLD) return "sub_red";
  if (isVerified) return "verified";
  if (subActive) return "sub_green";
  return "regular";
};

export const getTierMeta = (u) => {
  const key = getTierKey(u);
  switch (key) {
    case "app":
      return { key, label: "App", color: "#000" };
    case "recommended":
      return { key, label: "Recomendados", color: "#ff0000" };
    case "sub_red":
      return { key, label: "Suscripción +", color: "#ff2e2e" };
    case "verified":
      return { key, label: "Verificados", color: "#54afff" };
    case "sub_green":
      return { key, label: "Suscripción", color: "#3bce0f" };
    default:
      return { key: "regular", label: "Otros", color: "grey" };
  }
};

export const getUserAvatarSrc = (raw) => {
  const u = raw?._orig ?? raw;

  const candidates = [
    u?.user_image, u?.user_image_url, u?.image, u?.avatar, u?.avatar_url,
    u?.profile_image, u?.photo, u?.picture,
    u?.user?.user_image, u?.user?.image, u?.user?.avatar,
    u?.profile?.image, u?.profile?.avatar,
  ];

  const found = candidates.map(cleanVal).find(Boolean);
  return found ? toSrc(found) : null;
};
