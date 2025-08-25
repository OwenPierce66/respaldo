import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory } from './apicategory';
import Modal from 'react-modal';
import axios from 'axios';
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

// Modal.setAppElement('#root'); 

const CategoriesMenu = ({ onCategorySelected, tema }) => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [userDetails, setUserDetails] = useState({});
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userTokenLG');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user-details/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setUserDetails(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const response = await fetchCategories();
        if (response.status === 200) {
            setCategories(response.data);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            const response = await createCategory(newCategoryName);
            if (response.status === 201) {
                setNewCategoryName('');
                loadCategories(); // Recargar las categorías
                setIsModalOpen(false); // Cerrar el modal tras añadir la categoría
            }
        } catch (error) {
            // Axios coloca el error HTTP en error.response
            if (error.response && error.response.status === 403) {
                alert("No tienes permiso para realizar esta acción.");
            } else {
                // Manejo general de otros errores no capturados específicamente
                console.error("Ocurrió un error al añadir la categoría", error);
                alert("Ocurrió un error al procesar tu solicitud.");
            }
        }
    };


    return (
        <div>
            <div className="category-menu"
                style={{
                    color: tema === "consejos" ? "rgb(84, 175, 255)" : "black"
                }}
            >
                <div className="horizontal-scroll">
                    <ul>
                        <li onClick={() => onCategorySelected("Todas las categorías")}>Elige una categoría</li>
                        {categories.map((category) => (
                            <li key={category.id} onClick={() => onCategorySelected(category.name)}>
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='masCategoriasCaja' style={{ marginTop: "-30pxs" }}>
                {/* Render user details */}
                {userDetails.is_staff ? (
                    <button className='masCategorias' onClick={() => setIsModalOpen(true)}> <FontAwesomeIcon icon={faPlus} className="faPlus" /></button>
                ) : (
                    <div></div>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Añadir nueva categoría"
            >
                <h2>Añadir Nueva Categoría</h2>
                <form onSubmit={handleAddCategory}>
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Nombre de la categoría"
                    />
                    <button type="submit">Agregar</button>
                    <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                </form>
            </Modal>
        </div>
    );
};

export default CategoriesMenu;
