import React, { useState, useEffect } from "react";

export default function Slideshow({ images = [], interval = 3000 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideUrl, setCurrentSlideUrl] = useState();

  useEffect(() => {
    setCurrentSlideUrl(images[currentSlide]);

    const loop = setInterval(() => {
      if (currentSlide === images.length - 1) {
        setCurrentSlide(0);
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    }, interval);
    return () => clearInterval(loop);
  }, [images, currentSlide, interval]);

  return <img src={"../../../static/" + currentSlideUrl} className="slide-thumbnail" />;
}
