import React, { useState } from 'react';

const getMediaUrl = (path) => {
  return path ? `http://127.0.0.1:8000${path}` : '';
};

const MediaImage = ({ path, alt = "Imagen", className = "", fallback = "/img/fallback.jpg", style = {}, onClick }) => {
  const [error, setError] = useState(false);
  const imageUrl = getMediaUrl(path);

  return (
    <img
      src={error || !path ? fallback : imageUrl}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
      onError={() => setError(true)}
    />
  );
};

export default MediaImage;
