import React, { useMemo, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCalendar,
  faStar,
  faUser,
  faHeart,
  faGlobe,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "../owenscss/traductor.scss";

const TaskFilterMenu = ({
  // =========================
  // ✅ REELS (CONTROLADO)
  // =========================
  // Si pasas open/anchorEl/onClose => se abre desde el ícono (NO muestra "Filtro")
  open,
  anchorEl,
  onClose,

  // =========================
  // ✅ PETICIONES (LEGACY)
  // =========================
  // Si NO pasas open/anchorEl/onClose => se usa el trigger "Filtro" como antes
  triggerLabel = "Filtro",

  // =========================
  // props existentes
  // =========================
  tema,
  mostrarSoloFavoritos,
  setSoloFavoritosTareas,
  cargarFavoritosUsuarioSeleccionado,
  mostrarSoloFavoritosUsuarioSeleccionado,
  setMostrarSoloFavoritosUsuarioSeleccionado,
  usuarioSeleccionado,
  setFiltro,
  soloFavoritosTareas,
  mostrarUsuarios,
  toggleMostrarFavoritos,
  handleMostrarCompartidos,
  showMyTasksOnly,
}) => {
  // ✅ detecta modo controlado (reels)
  const isControlled = useMemo(() => typeof open === "boolean", [open]);

  // ✅ estado legacy interno (peticiones)
  const [localAnchorEl, setLocalAnchorEl] = useState(null);

  const effectiveAnchorEl = isControlled ? anchorEl : localAnchorEl;
  const effectiveOpen = isControlled ? !!open : Boolean(localAnchorEl);

  const [filtroSeleccionado, setFiltroSeleccionado] = useState("popularidad");

  const handleClickLegacy = (event) => {
    setLocalAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
      return;
    }
    setLocalAnchorEl(null);
  };

  const handleFilterByDate = () => {
    setFiltro("fecha");
    setFiltroSeleccionado("fecha");
    handleClose();
  };

  const handleFilterByPopularity = () => {
    setFiltro("popularidad");
    setFiltroSeleccionado("popularidad");
    handleClose();
  };

  const handleFilterByTopDay = () => {
    setFiltro("top_day");
    setFiltroSeleccionado("top_day");
    handleClose();
  };

  const handleFilterByTopWeek = () => {
    setFiltro("top_week");
    setFiltroSeleccionado("top_week");
    handleClose();
  };

  const handleFilterByTopMonth = () => {
    setFiltro("top_month");
    setFiltroSeleccionado("top_month");
    handleClose();
  };

  const handleFilterByFavoritesTareas = () => {
    if (usuarioSeleccionado) {
      cargarFavoritosUsuarioSeleccionado(usuarioSeleccionado);
      setMostrarSoloFavoritosUsuarioSeleccionado((prev) => !prev);
    } else {
      setSoloFavoritosTareas((prev) => !prev);
    }
    handleClose();
  };

  return (
    <div>
      {/* ✅ SOLO PETICIONES (legacy): aquí SÍ aparece "Filtro" */}
      {!isControlled && (
        <div onClick={handleClickLegacy}>
          <div style={{ color: tema === "consejos" ? "#bce0fd" : "black" }}>
            {triggerLabel}
          </div>
        </div>
      )}

      {/* ✅ Menu: sirve para ambos modos */}
      <Menu
        id="simple-menu"
        anchorEl={effectiveAnchorEl}
        keepMounted
        open={effectiveOpen}
        onClose={handleClose}
      >
        {!mostrarUsuarios && (
          <div>
            {filtroSeleccionado !== "fecha" && (
              <MenuItem onClick={handleFilterByDate}>
                <FontAwesomeIcon icon={faCalendar} />
                <div style={{ paddingLeft: "5px" }}>Fecha</div>
              </MenuItem>
            )}

            {filtroSeleccionado !== "popularidad" && (
              <MenuItem onClick={handleFilterByPopularity}>
                <FontAwesomeIcon icon={faStar} />
                <div style={{ paddingLeft: "5px" }}>Popularidad</div>
              </MenuItem>
            )}

            {filtroSeleccionado !== "top_day" && (
              <MenuItem onClick={handleFilterByTopDay}>
                <FontAwesomeIcon icon={faClipboardList} />
                <div style={{ paddingLeft: "5px" }}>Top de hoy</div>
              </MenuItem>
            )}

            {filtroSeleccionado !== "top_week" && (
              <MenuItem onClick={handleFilterByTopWeek}>
                <FontAwesomeIcon icon={faClipboardList} />
                <div style={{ paddingLeft: "5px" }}>Top de la semana</div>
              </MenuItem>
            )}

            {filtroSeleccionado !== "top_month" && (
              <MenuItem onClick={handleFilterByTopMonth}>
                <FontAwesomeIcon icon={faClipboardList} />
                <div style={{ paddingLeft: "5px" }}>Top del mes</div>
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                handleMostrarCompartidos();
                handleClose();
              }}
            >
              <FontAwesomeIcon icon={showMyTasksOnly ? faGlobe : faUser} />
              <div style={{ paddingLeft: "5px" }}>
                {showMyTasksOnly ? "Alls" : "Yours"}
              </div>
            </MenuItem>

            <MenuItem onClick={handleFilterByFavoritesTareas}>
              <FontAwesomeIcon icon={faHeart} />
              <div style={{ paddingLeft: "5px" }}>
                {usuarioSeleccionado
                  ? mostrarSoloFavoritosUsuarioSeleccionado
                    ? "Todas las Aportaciones"
                    : "Aportaciones Favoritas del Perfil"
                  : soloFavoritosTareas
                  ? "Todas las Aportaciones"
                  : "Mis Aportaciones Favoritas"}
              </div>
            </MenuItem>
          </div>
        )}

        <MenuItem
          onClick={() => {
            toggleMostrarFavoritos();
            handleClose();
          }}
        >
          <FontAwesomeIcon icon={mostrarSoloFavoritos ? faUsers : faHeart} />
          <div style={{ paddingLeft: "5px" }}>
            {mostrarSoloFavoritos ? "Todos los Perfiles" : "Perfiles Favoritos"}
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TaskFilterMenu;
