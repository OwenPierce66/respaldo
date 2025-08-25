import React, { useRef } from 'react';
import "../owenscss/traductor.scss";

const Carousel = ({ usuariosFiltrados, agregarAFavoritos, handleLike, obtenerLikes }) => {
    const carouselRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);

    const handlePointerDown = (e) => {
        const carousel = carouselRef.current;
        isDown.current = true;
        startX.current = e.pageX - carousel.offsetLeft;
        scrollLeftStart.current = carousel.scrollLeft;
        carousel.style.cursor = 'grabbing';
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    };

    const handlePointerUp = () => {
        const carousel = carouselRef.current;
        isDown.current = false;
        carousel.style.cursor = 'grab';
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    };

    const handlePointerMove = (e) => {
        if (!isDown.current) return;
        const carousel = carouselRef.current;
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX.current) * 3; // Ajusta la velocidad de desplazamiento
        carousel.scrollLeft = scrollLeftStart.current - walk;
    };

    return (
        <div
            ref={carouselRef}
            className="carousel-container"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            <div className="carousel-content">
                {usuariosFiltrados.map((usuario) => (
                    <div
                        key={usuario.id}
                        className="carousel-item"
                    >
                        <div>
                            <h2>{usuario.username}</h2>
                            <button onClick={() => agregarAFavoritos(usuario.id)}>Agregar a Favoritos</button>
                            <button onClick={() => handleLike(usuario.id)}>Like</button>
                            <button onClick={() => obtenerLikes(usuario.id)}>Ver Likes</button>
                            <span>Likes: {usuario.likes_count}</span>
                        </div>
                        <ul>
                            {usuario.categoriesp.map((categoria) => (
                                <div key={categoria.id}>
                                    <li>{categoria.name}</li>
                                </div>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
