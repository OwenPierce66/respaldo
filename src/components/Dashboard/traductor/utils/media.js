// src/components/Dashboard/traductor/utils/media.js
export const API_BASE = "http://127.0.0.1:8000";

export const cleanVal = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (!s || s === "No image available" || s === "undefined" || s === "null") return null;
  return s;
};

export const toSrc = (path) => {
  const p = cleanVal(path);
  if (!p) return "";
  if (/^(https?:\/\/|blob:|data:)/i.test(p)) return p;

  try {
    return new URL(p.startsWith("/") ? p : `/${p}`, API_BASE).href;
  } catch {
    return p;
  }
};

const first = (...vals) => vals.find(Boolean) || null;

export const getFirstImage = (link) => {
  const subImgs = []
    .concat((link?.subtasks || []).map((s) => cleanVal(s?.image)))
    .concat((link?.subfactores || []).map((s) => cleanVal(s?.image)))
    .concat((link?.subfuentes || []).map((s) => cleanVal(s?.image)));

  return first(
    cleanVal(link?.image),
    cleanVal(link?.image_url),
    cleanVal(link?.task?.image),
    cleanVal(link?.task?.image_url),
    ...subImgs
  );
};

export const getFirstVideo = (link) => {
  const subVids = []
    .concat((link?.subtasks || []).map((s) => cleanVal(s?.video)))
    .concat((link?.subfactores || []).map((s) => cleanVal(s?.video)))
    .concat((link?.subfuentes || []).map((s) => cleanVal(s?.video)));

  return first(
    cleanVal(link?.video),
    cleanVal(link?.video_url),
    cleanVal(link?.task?.video),
    ...subVids
  );
};
