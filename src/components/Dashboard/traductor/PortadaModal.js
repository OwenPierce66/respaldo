import React, { useState } from "react";
import { Menu, MenuItem, Button, BottomNavigation } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPen, faQuestionCircle, faUsers, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PortadaModal = ({ imagenFija, portadas, restartTutorial, fetchPortadas, fetchImagenFija, isOpen, onRequestClose, usuarioSeleccionado }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");  // For differentiating between 'portada' and 'perfil'
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpenImage, setModalOpenImage] = useState(false);

    const [portadaTitle, setPortadaTitle] = useState("");
    const [portadaImage, setPortadaImage] = useState(null);
    const [fijaImage, setFijaImage] = useState(null);
    const [activeId, setActiveId] = useState(null);

    const slickSettings = {
        dots: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 1, // Solo mostrar una imagen por pantalla
        slidesToScroll: 1,
        arrows: false, // Quita las flechas si no las necesitas
    };

const getMediaUrl = (path) => {
  return path ? `http://127.0.0.1:8000${path}` : '';
};



    const getToken = () => {
        return localStorage.getItem("userTokenLG");
    };

    const openMenu = (event) => setAnchorEl(event.currentTarget);
    const closeMenu = () => setAnchorEl(null);

    const handleClickOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
        closeMenu();
    };

    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("image", selectedImage);
        if (modalType === "portada") {
            formData.append("title", portadaTitle || "");  // Asegúrate de que si el título está vacío, se envíe una cadena vacía
        }
        const token = getToken();

        try {
            if (modalType === "portada") {
                await axios.post("http://127.0.0.1:8000/api/portada/", formData, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                fetchPortadas();
            } else if (modalType === "perfil") {
                await axios.post("http://127.0.0.1:8000/api/imagen-fija/", formData, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                fetchImagenFija();
            }
            setModalOpen(false);
        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código diferente de 2xx
                console.error('Error al agregar portada:', error.response.data);
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                console.error('No se recibió respuesta del servidor:', error.request);
            } else {
                // Algo pasó al configurar la solicitud
                console.error('Error al configurar la solicitud:', error.message);
            }
        }
    };

    const handleViewImage = () => {
        setModalOpenImage(true);
        closeMenu();
    };

    const handlePortadaSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", portadaTitle || "");
        formData.append("image", portadaImage);

        try {
            await axios.post("http://127.0.0.1:8000/api/portada/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Token ${getToken()}`, // Añadir token
                },
            });
            fetchPortadas(); // Actualiza las portadas
            onRequestClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al agregar portada:", error);
        }
    };

    const handleFijaSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", fijaImage);
        formData.append("title", portadaTitle)

        const token = localStorage.getItem("userTokenLG");

        try {
            await axios.post("http://127.0.0.1:8000/api/imagen-fija/", formData, {
                headers: {
                    Authorization: `Token ${token}`,  // Añade el token aquí
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchPortadas(); // Actualiza las portadas
            onRequestClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al agregar imagen fija:", error);
        }
    };

    const deletePortada = async (portadaId) => {
        console.log("alo policia");
        try {
            const token = localStorage.getItem("userTokenLG");
            await axios.delete(`http://127.0.0.1:8000/api/portada/${portadaId}/`, {
                headers: {
                    Authorization: `Token ${token}`, // Token de autenticación
                },
            });
            fetchPortadas();  // Refrescar portadas después de eliminar
        } catch (error) {
            console.error('Error deleting portada:', error);
        }
    };

    const handleMouseDown = (id) => {
        setActiveId(id); // Marca el div como activo cuando se presiona el botón
    };

    const handleMouseUp = () => {
        setActiveId(null); // Quita el resaltado cuando se suelta el botón
    };

    console.log("Valor original de imagenFija:", imagenFija);
console.log("URL final de imagen:", getMediaUrl(imagenFija));

    return (
        <div>
            <div className="slider-container">
                <Slider {...slickSettings}>
                    {portadas.map((item) => (
                        <div
                            key={item.id}
                            className={`slide-item ${activeId === item.id ? 'active' : ''}`} // Añade la clase 'active' si el div está siendo presionado
                            onMouseDown={() => handleMouseDown(item.id)} // Detecta cuando se presiona el botón del mouse
                            onMouseUp={handleMouseUp} // Detecta cuando se suelta el botón del mouse
                            onMouseLeave={handleMouseUp} // Detecta cuando se mueve el mouse fuera del div (opcional)
                            style={activeId === item.id ? { zIndex: 1000 } : {}} // Aplica z-index más alto si está activo
                        >
                            <div className="contenedorImagen">
                                {!usuarioSeleccionado && (
                                    <div className="iconDelete" onClick={() => deletePortada(item.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                )}

                                {item.title && <div className="textoEnImagen">{item.title}</div>}
                                <img src={getMediaUrl(item.image)}  alt="Imagen de la portada" className="imagenPeticionn" onMouseDown={(e) => {
                                    e.preventDefault();  // Evita que la imagen interrumpa el evento del contenedor
                                    handleMouseDown(item.id);  // Propaga el evento al contenedor
                                }}
                                    onMouseUp={handleMouseUp} />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
            <div className={`centrarImagenPCH ${portadas.length > 0 ? '' : 'margin-negativo'}`}>

                <div className="whatpetitiontitle" >
                    {imagenFija ? (
                        <img
                            src={getMediaUrl(imagenFija)}
                            alt="Imagen fija"
                            className="imagenFija"
                            onClick={openMenu}
                        />

                    ) : (
                        !usuarioSeleccionado && ( // Solo mostrar el botón si no hay un usuario seleccionado
                            <button className="btnPortadas" onClick={openMenu}>
                                Agregar
                            </button>
                        )

                    )}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={closeMenu}
                    >
                        <MenuItem onClick={() => handleClickOpenModal("portada")}>
                            <FontAwesomeIcon icon={faPen} style={{ marginRight: 5 }} /> Cambiar Portada
                        </MenuItem>
                        <MenuItem onClick={() => handleClickOpenModal("perfil")}>
                            <FontAwesomeIcon icon={faPen} style={{ marginRight: 5 }} /> Cambiar Perfil
                        </MenuItem>
                        <MenuItem onClick={handleViewImage}>
                            <FontAwesomeIcon icon={faImage} style={{ marginRight: 5 }} /> Ver Imagen Completa
                        </MenuItem>
                        {/* <MenuItem onClick={restartTutorial}>
                            <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: 5 }} /> Tutorial
                        </MenuItem> */}
                        {/* <MenuItem onClick={toggleMostrarUsuarios}>
                                <FontAwesomeIcon icon={faUsers} style={{ marginRight: 5 }} />
                            </MenuItem> */}
                    </Menu>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={() => setModalOpen(false)}
                        contentLabel="Cambiar Imagen"
                    >
                        <h2>Cambiar {modalType === "portada" ? "Portada" : "Perfil"}</h2>
                        {modalType === "portada" && (
                            <input
                                type="text"
                                value={portadaTitle}
                                onChange={(e) => setPortadaTitle(e.target.value)}
                                placeholder="Título de la portada"
                            />
                        )}
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleSave}>Guardar</button>
                        <button onClick={() => setModalOpen(false)}>Cerrar</button>
                    </Modal>

                    <Modal
                        isOpen={isModalOpenImage}
                        onRequestClose={() => setModalOpenImage(false)}
                        contentLabel="Ver Imagen Completa"
                    >
                        {/* <img src={imagenFija} alt="Imagen fija completa" style={{ width: "100%" }} /> */}
                       <img src={getMediaUrl(imagenFija)} alt="Imagen fija" className="imagenPeticion" />


                        <button onClick={() => setModalOpenImage(false)}>Cerrar</button>
                    </Modal>
                </div>
            </div>

            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Agregar Portada</h2>
                <form onSubmit={handlePortadaSubmit}>
                    <input
                        type="text"
                        value={portadaTitle}
                        onChange={(e) => setPortadaTitle(e.target.value)}
                        placeholder="Título de la portada"
                    />
                    <input
                        type="file"
                        onChange={(e) => setPortadaImage(e.target.files[0])}
                    />
                    <button type="submit">Agregar Portada</button>
                </form>

                <h2>Agregar Imagen Fija</h2>
                <form onSubmit={handleFijaSubmit}>
                    <input
                        type="file"
                        onChange={(e) => setFijaImage(e.target.files[0])}
                    />
                    <button type="submit">Agregar Imagen Fija</button>
                </form>

                <button onClick={onRequestClose}>Cerrar</button>
            </Modal>
        </div >
    );
};

export default PortadaModal;
