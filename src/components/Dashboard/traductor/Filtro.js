import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faClipboardList, faCalendar, faStar, faUser, faHeart, faGlobe, faUsers } from '@fortawesome/free-solid-svg-icons';
import "../owenscss/traductor.scss";

const TaskFilterMenu = ({ tema, mostrarSoloFavoritos, setSoloFavoritosTareas, cargarFavoritosPerfilesUsuarioSeleccionado, cargarFavoritosUsuarioSeleccionado, mostrarSoloFavoritosUsuarioSeleccionado, setMostrarSoloFavoritosUsuarioSeleccionado, usuarioSeleccionado, setFiltro, soloFavoritosTareas, toggleMostrarFavoritosTareas, mostrarUsuarios, toggleMostrarFavoritos, handleMostrarCompartidos, showMyTasksOnly }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [filtroSeleccionado, setFiltroSeleccionado] = useState('popularidad'); // Predeterminado por popularidad

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilterByDate = () => {
        setFiltro('fecha');
        setFiltroSeleccionado('fecha'); // Cambiar estado para indicar que está seleccionado "Fecha"
        handleClose();
    };

    const handleFilterByPopularity = () => {
        setFiltro('popularidad');
        setFiltroSeleccionado('popularidad'); // Cambiar estado para indicar que está seleccionado "Popularidad"
        handleClose();
    };

    const handleFilterByFavorites = async () => {
        toggleMostrarFavoritos();  // Esto controla los favoritos globales
        handleClose();
    };

    const handleFilterByFavoritesTareas = () => {
        if (usuarioSeleccionado) {
            cargarFavoritosUsuarioSeleccionado(usuarioSeleccionado);
            setMostrarSoloFavoritosUsuarioSeleccionado(!mostrarSoloFavoritosUsuarioSeleccionado);
        } else {
            toggleMostrarFavoritosTareas();
        }
        handleClose();
    };

    return (
        <div>
            <div onClick={handleClick}>
                <div className='' style={{
                    color: tema === "consejos" ? "#bce0fd" : "black", // Color de texto
                }}>Filtro</div>
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
                        {filtroSeleccionado !== 'fecha' && (
                            <MenuItem onClick={handleFilterByDate}>
                                <FontAwesomeIcon icon={faCalendar} />
                                <div style={{ paddingLeft: "5px" }}>Fecha</div>
                            </MenuItem>
                        )}
                        {filtroSeleccionado !== 'popularidad' && (
                            <MenuItem onClick={handleFilterByPopularity}>
                                <FontAwesomeIcon icon={faStar} />
                                <div style={{ paddingLeft: "5px" }}>Popularidad</div>
                            </MenuItem>
                        )}
                        <MenuItem onClick={() => {
                            handleMostrarCompartidos(); // Ejecuta la función que muestra tareas compartidas
                            handleClose(); // Cierra el menú
                        }}>
                            <FontAwesomeIcon icon={showMyTasksOnly ? faGlobe : faUser} />
                            <div style={{ paddingLeft: "5px" }}>{showMyTasksOnly ? 'Alls' : 'Yours'}</div>
                        </MenuItem>
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

                <MenuItem onClick={() => { setSoloFavoritosTareas(prevState => !prevState), handleClose() }// Alterna el estado de soloFavoritosTareas entre true y false
                }>
                    <FontAwesomeIcon icon={mostrarSoloFavoritos ? faUsers : faHeart} />
                    <div style={{ paddingLeft: "5px" }}>{mostrarSoloFavoritos ? 'Todos los Perfiles' : 'Perfiles Favoritos'}</div>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default TaskFilterMenu;
