// ImgWithFallback.jsx
import React, { useEffect, useRef, useState } from "react";

const FALLBACK_IMG = "data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23222'/><text x='50%' y='50%' fill='%23fff' font-size='20' text-anchor='middle' alignment-baseline='middle'>Imagen no disponible</text></svg>";

export function ImgWithFallback({ src, alt = "", className = "", style = {}, loading = "lazy", decoding = "async", ...rest }) {
  const imgRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
    setCurrentSrc("");
    const el = imgRef.current;
    if (!el) return;
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setInView(true);
          });
        },
        { rootMargin: "200px", threshold: 0.01 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    } else {
      // fallback si no hay IO
      setInView(true);
    }
  }, [src]);

  useEffect(() => {
    if (!inView) return;
    setCurrentSrc(src || "");
  }, [inView, src]);

  const handleError = (e) => {
    if (!errored) {
      setErrored(true);
      try { if (e?.target) e.target.src = FALLBACK_IMG; } catch {}
      console.warn("Img load error:", src);
    }
  };

  return (
    <img
      ref={imgRef}
      src={errored ? FALLBACK_IMG : (currentSrc || FALLBACK_IMG)}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      {...rest} // <-- important: reenvía onClick, title, etc.
    />
  );
}

export default ImgWithFallback;
