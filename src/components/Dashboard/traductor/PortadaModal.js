import React, { useState } from "react";
import { Menu, MenuItem, Button, BottomNavigation } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPen,
  faQuestionCircle,
  faUsers,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PortadaModal = ({
  imagenFija,
  portadas,
  restartTutorial,
  fetchPortadas,
  fetchImagenFija,
  isOpen,
  onRequestClose,
  usuarioSeleccionado,

  // ✅ NUEVO (opcional):
  onOpenHistorias,
}) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'portada' | 'perfil'
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
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const getMediaUrl = (path) => {
    return path ? `http://127.0.0.1:8000${path}` : "";
  };

  const getToken = () => localStorage.getItem("userTokenLG");

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleClickOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    closeMenu();
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files?.[0] || null);
  };

  const handleSave = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    if (modalType === "portada") {
      formData.append("title", portadaTitle || "");
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
        fetchPortadas?.();
      } else if (modalType === "perfil") {
        await axios.post("http://127.0.0.1:8000/api/imagen-fija/", formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        fetchImagenFija?.();
      }

      setModalOpen(false);
    } catch (error) {
      if (error.response) {
        console.error("Error al guardar:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
      } else {
        console.error("Error al configurar la solicitud:", error.message);
      }
    }
  };

  const handleViewImage = () => {
    setModalOpenImage(true);
    closeMenu();
  };

  const handlePortadaSubmit = async (e) => {
    e.preventDefault();
    if (!portadaImage) return;

    const formData = new FormData();
    formData.append("title", portadaTitle || "");
    formData.append("image", portadaImage);

    try {
      await axios.post("http://127.0.0.1:8000/api/portada/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${getToken()}`,
        },
      });
      fetchPortadas?.();
      onRequestClose?.();
    } catch (error) {
      console.error("Error al agregar portada:", error);
    }
  };

  const handleFijaSubmit = async (e) => {
    e.preventDefault();
    if (!fijaImage) return;

    const formData = new FormData();
    formData.append("image", fijaImage);
    formData.append("title", portadaTitle);

    const token = getToken();

    try {
      await axios.post("http://127.0.0.1:8000/api/imagen-fija/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchPortadas?.();
      onRequestClose?.();
    } catch (error) {
      console.error("Error al agregar imagen fija:", error);
    }
  };

  const deletePortada = async (portadaId) => {
    try {
      const token = getToken();
      await axios.delete(`http://127.0.0.1:8000/api/portada/${portadaId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchPortadas?.();
    } catch (error) {
      console.error("Error deleting portada:", error);
    }
  };

  const handleMouseDown = (id) => setActiveId(id);
  const handleMouseUp = () => setActiveId(null);

  // ✅ NUEVO: abrir historias desde este menú
  const handleOpenHistorias = () => {
    closeMenu();
    if (typeof onOpenHistorias === "function") {
      onOpenHistorias();
      return;
    }
    navigate("/dashboard/historias24h");
  };

  // ✅ NUEVO: tutorial (si existe)
  const handleTutorial = () => {
    closeMenu();
    if (typeof restartTutorial === "function") restartTutorial();
  };

  return (
    <div>
      <div className="slider-container">
        <Slider {...slickSettings}>
          {(portadas || []).map((item) => (
            <div
              key={item.id}
              className={`slide-item ${activeId === item.id ? "active" : ""}`}
              onMouseDown={() => handleMouseDown(item.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={activeId === item.id ? { zIndex: 1000 } : {}}
            >
              <div className="contenedorImagen">
                {!usuarioSeleccionado && (
                  <div className="iconDelete" onClick={() => deletePortada(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                )}

                {item.title && <div className="textoEnImagen">{item.title}</div>}

                <img
                  src={getMediaUrl(item.image)}
                  alt="Imagen de la portada"
                  className="imagenPeticionn"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleMouseDown(item.id);
                  }}
                  onMouseUp={handleMouseUp}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className={`centrarImagenPCH ${portadas?.length > 0 ? "" : "margin-negativo"}`}>
        <div className="whatpetitiontitle">
          {imagenFija ? (
            <img
              src={getMediaUrl(imagenFija)}
              alt="Imagen fija"
              className="imagenFija"
              onClick={openMenu}
            />
          ) : (
            !usuarioSeleccionado && (
              <button className="btnPortadas" onClick={openMenu}>
                Agregar
              </button>
            )
          )}

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            <MenuItem onClick={() => handleClickOpenModal("portada")}>
              <FontAwesomeIcon icon={faPen} style={{ marginRight: 5 }} />
              Cambiar Portada
            </MenuItem>

            <MenuItem onClick={() => handleClickOpenModal("perfil")}>
              <FontAwesomeIcon icon={faPen} style={{ marginRight: 5 }} />
              Cambiar Perfil
            </MenuItem>

            <MenuItem onClick={handleViewImage}>
              <FontAwesomeIcon icon={faImage} style={{ marginRight: 5 }} />
              Ver Imagen Completa
            </MenuItem>

            {/* ✅ BOTÓN NUEVO: Historias 24h */}
            <MenuItem onClick={handleOpenHistorias}>
              <FontAwesomeIcon icon={faUsers} style={{ marginRight: 5 }} />
              Historias 24h
            </MenuItem>

            {/* ✅ BOTÓN NUEVO: Tutorial (solo si existe restartTutorial) */}
            {typeof restartTutorial === "function" && (
              <MenuItem onClick={handleTutorial}>
                <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: 5 }} />
                Tutorial
              </MenuItem>
            )}
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
          <input type="file" onChange={(e) => setPortadaImage(e.target.files?.[0] || null)} />
          <button type="submit">Agregar Portada</button>
        </form>

        <h2>Agregar Imagen Fija</h2>
        <form onSubmit={handleFijaSubmit}>
          <input type="file" onChange={(e) => setFijaImage(e.target.files?.[0] || null)} />
          <button type="submit">Agregar Imagen Fija</button>
        </form>

        <button onClick={onRequestClose}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default PortadaModal;
