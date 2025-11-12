import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faClipboardList,
  faCalendar,
  faStar,
  faUser,
  faHeart,
  faGlobe,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import "../owenscss/traductor.scss";

const TaskFilterMenu = ({
  tema,
  mostrarSoloFavoritos,
  setSoloFavoritosTareas,
  cargarFavoritosPerfilesUsuarioSeleccionado,
  cargarFavoritosUsuarioSeleccionado,
  mostrarSoloFavoritosUsuarioSeleccionado,
  setMostrarSoloFavoritosUsuarioSeleccionado,
  usuarioSeleccionado,
  setFiltro,
  soloFavoritosTareas,
  mostrarUsuarios,
  toggleMostrarFavoritos,
  handleMostrarCompartidos,
  showMyTasksOnly
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('popularidad'); // Predeterminado

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterByDate = () => {
    setFiltro('fecha');
    setFiltroSeleccionado('fecha');
    handleClose();
  };

  const handleFilterByPopularity = () => {
    setFiltro('popularidad');
    setFiltroSeleccionado('popularidad');
    handleClose();
  };

  // 🔹 NUEVOS HANDLERS
  const handleFilterByTopDay = () => {
    setFiltro('top_day');
    setFiltroSeleccionado('top_day');
    handleClose();
  };

  const handleFilterByTopWeek = () => {
    setFiltro('top_week');
    setFiltroSeleccionado('top_week');
    handleClose();
  };

  const handleFilterByTopMonth = () => {
    setFiltro('top_month');
    setFiltroSeleccionado('top_month');
    handleClose();
  };

  const handleFilterByFavorites = async () => {
    toggleMostrarFavoritos();  // Esto controla los favoritos globales
    handleClose();
  };

  const handleFilterByFavoritesTareas = () => {
    if (usuarioSeleccionado) {
      cargarFavoritosUsuarioSeleccionado(usuarioSeleccionado);
      setMostrarSoloFavoritosUsuarioSeleccionado(prev => !prev);
    } else {
      setSoloFavoritosTareas(prev => !prev);
    }
    handleClose();
  };

  return (
    <div>
      <div onClick={handleClick}>
        <div
          style={{
            color: tema === "consejos" ? "#bce0fd" : "black",
          }}
        >
          Filtro
        </div>
      </div>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {!mostrarUsuarios && (
          <div>
            {/* FECHA */}
            {filtroSeleccionado !== 'fecha' && (
              <MenuItem onClick={handleFilterByDate}>
                <FontAwesomeIcon icon={faCalendar} />
                <div style={{ paddingLeft: "5px" }}>Fecha</div>
              </MenuItem>
            )}

            {/* POPULARIDAD (all time) */}
            {filtroSeleccionado !== 'popularidad' && (
              <MenuItem onClick={handleFilterByPopularity}>
                <FontAwesomeIcon icon={faStar} />
                <div style={{ paddingLeft: "5px" }}>Popularidad</div>
              </MenuItem>
            )}

            {/* 🔹 TOP DÍA */}
            {filtroSeleccionado !== 'top_day' && (
              <MenuItem onClick={handleFilterByTopDay}>
                <FontAwesomeIcon icon={faClipboardList} />
                <div style={{ paddingLeft: "5px" }}>Top de hoy</div>
              </MenuItem>
            )}

            {/* 🔹 TOP SEMANA */}
            {filtroSeleccionado !== 'top_week' && (
              <MenuItem onClick={handleFilterByTopWeek}>
                <FontAwesomeIcon icon={faClipboardList} />
                <div style={{ paddingLeft: "5px" }}>Top de la semana</div>
              </MenuItem>
            )}

            {/* 🔹 TOP MES */}
            {filtroSeleccionado !== 'top_month' && (
              <MenuItem onClick={handleFilterByTopMonth}>
                <FontAwesomeIcon icon={faClipboardList} />
                <div style={{ paddingLeft: "5px" }}>Top del mes</div>
              </MenuItem>
            )}

            {/* TUS / TODAS */}
            <MenuItem
              onClick={() => {
                handleMostrarCompartidos();
                handleClose();
              }}
            >
              <FontAwesomeIcon icon={showMyTasksOnly ? faGlobe : faUser} />
              <div style={{ paddingLeft: "5px" }}>
                {showMyTasksOnly ? 'Alls' : 'Yours'}
              </div>
            </MenuItem>

            {/* FAVORITOS DE TAREAS */}
            <MenuItem onClick={handleFilterByFavoritesTareas}>
              <FontAwesomeIcon icon={faHeart} />
              <div style={{ paddingLeft: "5px" }}>
                {usuarioSeleccionado
                  ? mostrarSoloFavoritosUsuarioSeleccionado
                    ? 'Todas las Aportaciones'
                    : 'Aportaciones Favoritas del Perfil'
                  : soloFavoritosTareas
                    ? 'Todas las Aportaciones'
                    : 'Mis Aportaciones Favoritas'}
              </div>
            </MenuItem>
          </div>
        )}

        {/* PERFILES FAVORITOS GLOBAL */}
        <MenuItem onClick={() => { toggleMostrarFavoritos(); handleClose(); }}>
          <FontAwesomeIcon icon={mostrarSoloFavoritos ? faUsers : faHeart} />
          <div style={{ paddingLeft: "5px" }}>
            {mostrarSoloFavoritos ? 'Todos los Perfiles' : 'Perfiles Favoritos'}
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TaskFilterMenu;
