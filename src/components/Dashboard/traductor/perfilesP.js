import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryForm from './categoryForm';
import Modal from 'react-modal';
import CategoriesMenu from './cetegorymenu';
import Carousel from './carusel';
import "../owenscss/traductor.scss";
import {
    faBlog,
    faPen,
    faNewspaper,
    faUsersCog,
    faAddressBook,
    faMoneyBill,
    faCalendar,
    faTicketAlt,
    faChild,
    faStoreAlt,
    faUsers,
    faUser,
    faEnvelope,
    faHeart,
    faTrash,
    faImage,
    faGlobe,
    faArrowRight,
    faBars,
    faMinus,
    faPlus,
    faPenToSquare,
    faUpload
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";

const PerfilesP = ({ mostrarUsuarios, favoritosPerfilesUsuarioSeleccionado, usuarioSeleccionado, mostrarSoloFavoritos, mostrarFormulario, selectedCategory, combinedSearchTerm }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [likes, setLikes] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [perfilFavoritos, setPerfilFavoritos] = useState([]);
    const [likesUsuarios, setLikesUsuarios] = useState([]);  // IDs de los usuarios a los que se les ha dado "like"

    useEffect(() => {
        cargarFavoritos();
        obtenerUsuariosYCategorias();
    }, []);

    const cargarFavoritos = async () => {
        try {
            const token = localStorage.getItem("userTokenLG");
            const response = await axios.get(`http://127.0.0.1:8000/api/pfavoritos/listar/`, {
                headers: { Authorization: `Token ${token}` }, // Error corregido aquí
            });
            const favoritosIds = response.data.map(favorito => favorito.id);
            setPerfilFavoritos(favoritosIds);  // Solo guardamos los IDs de los usuarios en favoritos
            console.log("IDs de perfiles favoritos:", favoritosIds);
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    };


    const obtenerUsuariosYCategorias = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/users/?page=1`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            const sortedUsers = res.data.sort((a, b) => b.likes_count - a.likes_count);
            setUsuarios(sortedUsers);
            console.log(sortedUsers);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const token = localStorage.getItem("userTokenLG");
                const response = await axios.get(`http://localhost:8000/api/likes/`, {
                    headers: { Authorization: `Token ${token}` },
                });

                const likedUsers = response.data.map(user => user.id);
                setLikesUsuarios(likedUsers);

                console.log('Usuarios que tienen like al cargar la página:', likedUsers);

            } catch (error) {
                console.error('Error al obtener likes:', error);
            }
        };

        fetchLikes();
    }, []);

    const handleLike = async (profileId) => {
        try {
            const token = localStorage.getItem("userTokenLG");
            await axios.post(`http://localhost:8000/api/profiles/${profileId}/like/`, {}, {
                headers: { Authorization: `Token ${token}` },
            });
            console.log('Antes de actualizar likesUsuarios:', likesUsuarios);
            setUsuarios((prevUsuarios) => {
                const updatedUsuarios = prevUsuarios.map((usuario) => {
                    if (usuario.id === profileId) {
                        const newLikesCount = usuario.has_liked
                            ? usuario.likes_count - 1
                            : usuario.likes_count + 1;

                        return {
                            ...usuario,
                            likes_count: newLikesCount,
                            has_liked: !usuario.has_liked,  // Cambia el estado de "has_liked"
                        };
                    }
                    return usuario;
                });
                return updatedUsuarios.sort((a, b) => b.likes_count - a.likes_count);
            });
            if (likesUsuarios.includes(profileId)) {
                setLikesUsuarios(likesUsuarios.filter(id => id !== profileId));  // Quita el "like"
            } else {
                setLikesUsuarios([...likesUsuarios, profileId]);  // Agrega el "like"
            }

            console.log('Después de actualizar likesUsuarios:', likesUsuarios);

        } catch (error) {
            console.error('Error al manejar el like:', error);
        }
    };

    const closeModal = () => setModalIsOpen(false);

    const obtenerLikes = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/profiles/${userId}/likes/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            setLikes(res.data);
            console.log("likes de perfiles", res.data);
            setModalIsOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if (!loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const agregarAFavoritos = async (perfilId) => {
        try {
            if (perfilFavoritos.includes(perfilId)) {
                setPerfilFavoritos(perfilFavoritos.filter(id => id !== perfilId)); // Remueve de favoritos
            } else {
                setPerfilFavoritos([...perfilFavoritos, perfilId]); // Agrega a favoritos
            }


            const token = localStorage.getItem("userTokenLG");
            await axios.post('http://127.0.0.1:8000/api/pfavoritos/agregar/', { perfil_id: perfilId }, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error al agregar a favoritos:', error);
        }
    };


    const history = useHistory();

    const navigateToUserMesseges = (userId) => {
        history.push(`/dashboard/direcmassaging/${userId}`);
    };

    const navigateToUserForum = (userId) => {
        history.push(`/dashboard/newcommunity/${userId}`);
    };


    const usuariosFiltrados = usuarios.filter((usuario) => {
        const searchLower = combinedSearchTerm.toLowerCase();

        const matchesCategory = selectedCategory === "Todas las categorías" ||
            usuario.categoriesp.some(categoria => categoria.name === selectedCategory);

        const matchesSearch = searchLower === '' ||
            usuario.username.toLowerCase().includes(searchLower) ||
            usuario.categoriesp.some(categoria => categoria.name.toLowerCase().includes(searchLower));

        const matchesFavoritos = usuarioSeleccionado && mostrarUsuarios
            ? favoritosPerfilesUsuarioSeleccionado.includes(usuario.id)
            : !mostrarSoloFavoritos || perfilFavoritos.includes(usuario.id);

        return matchesCategory && matchesSearch && matchesFavoritos;
    });



    return (
        <div>

            <div>
                {mostrarFormulario ? (
                    <CategoryForm />
                ) : (null)}
            </div>
            <div>
            </div>
            {usuariosFiltrados.map((usuario) => (
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

                        <div className='bajarIIiCONS'>
                            <div className='namePerfil' >{usuario.username}</div>

                            <div className="botonesPerfiles">
                                <div className="iconsPerfiles" >
                                    <div className="iconpchMensaje" onClick={() => navigateToUserMesseges(usuario.id)}>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>

                                    <div className="iconpchUsers" onClick={() => navigateToUserForum(usuario.id)}>
                                        <FontAwesomeIcon icon={faUsers} />
                                    </div>
                                </div>

                                <button className='botonesPerfilesLikes' onClick={() => agregarAFavoritos(usuario.id)}>
                                    <FontAwesomeIcon icon={faHeart} style={{ color: perfilFavoritos.includes(usuario.id) ? "Black" : "grey" }} />
                                </button>
                                <button className='botonesPerfilesLikes' onClick={() => handleLike(usuario.id)}>
                                    <FontAwesomeIcon icon={faHeart} style={{ color: usuario.has_liked ? "red" : "grey" }} />
                                </button>


                                <div onClick={() => obtenerLikes(usuario.id)}> {usuario.likes_count}</div>

                            </div>
                        </div>
                    </div>
                    <ul className="perfilesCategory">
                        {usuario.categoriesp.map((categoria) => (
                            <div key={categoria.id}>
                                <li>{categoria.name}</li>
                            </div>
                        ))}
                    </ul>
                </div>
            ))}
            {loading && <div>Loading...</div>}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Lista de Likes">
                <h2>Usuarios que dieron Like</h2>
                <ul>
                    {likes.map((user) => (
                        <div key={user.id}>
                            <li>{user.username}</li>
                            <li>{user.likes_count}</li>
                        </div>
                    ))}
                </ul>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default PerfilesP;
