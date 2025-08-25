import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    faEnvelope,
    faUsers,
    faHeart,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";

const PerfilesP = ({ mostrarFavoritos, selectedCategory, searchCategory, combinedSearchTerm }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [perfilFavoritos, setPerfilFavoritos] = useState([]); // Guardar favoritos en un estado
    const [likesUsuarios, setLikesUsuarios] = useState([]); // IDs de usuarios a los que has dado "like"
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarFavoritos(); // Cargar los perfiles favoritos
        obtenerUsuariosYCategorias(); // Cargar todos los usuarios
    }, []);

    const cargarFavoritos = async () => {
        try {
            const token = localStorage.getItem("userTokenLG");
            const response = await axios.get('http://127.0.0.1:8000/api/pfavoritos/listar/', {
                headers: { Authorization: `Token ${token}` },
            });

            const favoritosIds = response.data.map(favorito => favorito.id); // Obtener IDs de favoritos
            setPerfilFavoritos(favoritosIds); // Guardar en el estado
            console.log("Favoritos IDs:", favoritosIds);
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    };

    const obtenerUsuariosYCategorias = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/users/`, {
                headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
            });
            const sortedUsers = res.data.sort((a, b) => b.likes_count - a.likes_count); // Ordenar por likes
            setUsuarios(sortedUsers);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleLike = async (profileId) => {
        try {
            await axios.post(`http://localhost:8000/api/profiles/${profileId}/like/`, {}, {
                headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` },
            });
            // Actualizar los likes en el estado de usuarios
            setUsuarios(prevUsuarios =>
                prevUsuarios.map(usuario => {
                    if (usuario.id === profileId) {
                        return {
                            ...usuario,
                            has_liked: !usuario.has_liked,
                            likes_count: usuario.has_liked ? usuario.likes_count - 1 : usuario.likes_count + 1,
                        };
                    }
                    return usuario;
                })
            );
        } catch (error) {
            console.error('Error al manejar el like:', error);
        }
    };

    // Filtro de usuarios, incluyendo la lógica de favoritos
    const usuariosFiltrados = usuarios.filter(usuario => {
        const searchLower = combinedSearchTerm.toLowerCase();

        // Verificar si el perfil está en favoritos (solo si `mostrarFavoritos` está activado)
        const matchesFavoritos = !mostrarFavoritos || perfilFavoritos.includes(usuario.id);

        // Filtrar por categoría seleccionada
        const matchesCategory = selectedCategory === "Todas las categorías" ||
            usuario.categoriesp.some(categoria => categoria.name === selectedCategory);

        // Filtrar por término de búsqueda (nombre de usuario o categorías)
        const matchesSearch = searchLower === '' ||
            usuario.username.toLowerCase().includes(searchLower) ||
            usuario.categoriesp.some(categoria => categoria.name.toLowerCase().includes(searchLower));

        return matchesFavoritos && matchesCategory && matchesSearch;
    });

    const history = useHistory();
    const navigateToUserMesseges = (userId) => history.push(`/dashboard/direcmassaging/${userId}`);
    const navigateToUserForum = (userId) => history.push(`/dashboard/newcommunity/${userId}`);

    return (
        <div>
            <button onClick={cargarFavoritos}>Mostrar Favoritos</button> {/* Botón para cargar solo favoritos */}
            {usuariosFiltrados.map(usuario => (
                <div key={usuario.id} className="carousel-item">
                    <div className="user-infoImage">
                        <div className="image-container">
                            {usuario.user_image !== "No image available" ? (
                                <img src={usuario.user_image} alt="Imagen de Usuario" className="circle-image" />
                            ) : (
                                <div className="user-infoImageIcon">
                                    <FontAwesomeIcon icon={faUser} style={{ color: "grey", cursor: "pointer" }} />
                                </div>
                            )}
                        </div>
                        <div className="bajarIIiCONS">
                            <div className="namePerfil">{usuario.username}</div>
                            <div className="botonesPerfiles">
                                <div className="iconsPerfiles">
                                    <div className="iconpchMensaje" onClick={() => navigateToUserMesseges(usuario.id)}>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                    <div className="iconpchUsers" onClick={() => navigateToUserForum(usuario.id)}>
                                        <FontAwesomeIcon icon={faUsers} />
                                    </div>
                                </div>
                                <button className='botonesPerfilesLikes' onClick={() => handleLike(usuario.id)}>
                                    <FontAwesomeIcon icon={faHeart} style={{ color: usuario.has_liked ? "red" : "grey" }} />
                                </button>
                                <div>{usuario.likes_count}</div>
                            </div>
                        </div>
                    </div>
                    <ul className="perfilesCategory">
                        {usuario.categoriesp.map(categoria => (
                            <li key={categoria.id}>{categoria.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
            {loading && <div>Cargando...</div>}
        </div>
    );
};

export default PerfilesP;
