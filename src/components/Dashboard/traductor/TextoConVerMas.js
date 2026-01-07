// src/components/Dashboard/traductor/TextoConVerMas.js
import React, { useMemo, useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";

const defaultMax = 140;

const TextoConVerMas = ({
  primaryTitle = "",
  title = "",
  description = "",
  tema,

  maxChars = defaultMax,
  maxLines = 3,
  truncate = "chars", // "chars" | "lines"
  variant, // "reels"

  clickAnywhere = true,

  // ✅ cuando está abierto, límite de alto y scroll
  maxOpenVh = 26,
}) => {
  const isReels = variant === "reels";
  const mode = isReels ? "lines" : truncate;

  const [open, setOpen] = useState(false);
  const [needsMore, setNeedsMore] = useState(false);

  const textRef = useRef(null);

  const pTitleRaw = useMemo(() => String(primaryTitle || ""), [primaryTitle]);
  const sTitleRaw = useMemo(() => String(title || ""), [title]);
  const safeDesc = useMemo(() => String(description || ""), [description]);

  const pTitle = useMemo(() => pTitleRaw.trim(), [pTitleRaw]);
  const sTitle = useMemo(() => sTitleRaw.trim(), [sTitleRaw]);

  // ✅ evita repetir el mismo título 2 veces
  const showSecondaryTitle = useMemo(() => {
    if (!sTitle) return false;
    if (!pTitle) return true;
    return pTitle !== sTitle;
  }, [pTitle, sTitle]);

  const needsMoreChars = useMemo(() => {
    if (mode !== "chars") return false;
    return safeDesc.length > maxChars;
  }, [mode, safeDesc, maxChars]);

  const shownDescChars = useMemo(() => {
    if (mode !== "chars") return safeDesc;
    if (open) return safeDesc;
    if (!needsMoreChars) return safeDesc;
    return safeDesc.slice(0, maxChars).trimEnd() + "…";
  }, [mode, open, safeDesc, needsMoreChars, maxChars]);

  const shownDesc = mode === "chars" ? shownDescChars : safeDesc;

  const recomputeOverflow = useCallback(() => {
    if (mode !== "lines") return;
    const el = textRef.current;
    if (!el) return;

    // si está clamped, overflow => hay más
    const overflow = el.scrollHeight > el.clientHeight + 1;
    setNeedsMore(overflow);
  }, [mode]);

  useLayoutEffect(() => {
    if (mode !== "lines") return;
    const raf = requestAnimationFrame(() => recomputeOverflow());
    return () => cancelAnimationFrame(raf);
  }, [mode, open, pTitle, sTitle, safeDesc, maxLines, recomputeOverflow]);

  useEffect(() => {
    if (mode !== "lines") return;

    const onResize = () => recomputeOverflow();
    window.addEventListener("resize", onResize);

    let ro = null;
    if (typeof ResizeObserver !== "undefined" && textRef.current) {
      ro = new ResizeObserver(() => recomputeOverflow());
      ro.observe(textRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [mode, recomputeOverflow]);

  const canToggle = useMemo(() => {
    // ✅ en reels y en normal: permitimos toggle tocando el bloque (sin botón)
    return mode === "lines" ? needsMore || open : needsMoreChars || open;
  }, [mode, needsMore, open, needsMoreChars]);

  const toggle = useCallback(() => {
    if (!canToggle) return;
    setOpen((p) => !p);
  }, [canToggle]);

  const stopAll = (e) => {
    e.stopPropagation();
    // evita que el touch dispare selección del reel
    if (e.cancelable) e.preventDefault();
  };

  return (
    <div
      className={[
        "texto-con-ver-mas",
        open ? "open" : "",
        tema || "",
        isReels ? "is-reels" : "",
        open && needsMore ? "scrollable" : "",
      ].join(" ")}
      onPointerDown={stopAll}
      onClick={(e) => {
        stopAll(e);
        if (!clickAnywhere) return;
        if (!canToggle) return;
        toggle();
      }}
      role={clickAnywhere && canToggle ? "button" : undefined}
      tabIndex={clickAnywhere && canToggle ? 0 : undefined}
      onKeyDown={(e) => {
        if (!clickAnywhere || !canToggle) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }
      }}
    >
      <div
        ref={textRef}
        className={[
          "texto-con-ver-mas__text",
          mode === "lines" && !open ? "clamped" : "",
        ].join(" ")}
        style={{
          ...(mode === "lines" ? { "--tclamp": maxLines } : null),
          ...(open && needsMore
            ? { maxHeight: `${maxOpenVh}vh`, overflowY: "auto" }
            : null),
        }}
      >
        {pTitle ? <span className="pt">{pTitle}</span> : null}
        {pTitle && (showSecondaryTitle || shownDesc) ? <br /> : null}

        {showSecondaryTitle ? <span className="t">{sTitle}</span> : null}
        {showSecondaryTitle && shownDesc ? <br /> : null}

        {shownDesc ? <span className="d">{shownDesc}</span> : null}
      </div>
    </div>
  );
};

export default TextoConVerMas;
