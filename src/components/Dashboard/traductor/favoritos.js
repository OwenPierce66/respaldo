// Favoritos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoriesMenu from './cetegorymenu';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Todas las categorías");
    const [searchCategory, setSearchCategory] = useState("");
    const [filtroUsername, setFiltroUsername] = useState("");

    useEffect(() => {
        const cargarFavoritos = async () => {
            try {
                const token = localStorage.getItem("userTokenLG");
                const response = await axios.get('http://127.0.0.1:8000/api/favoritos/listar/', {
                    headers: { Authorization: `Token ${token}` },
                });
                setFavoritos(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error al cargar favoritos:', error);
            }
        };
        cargarFavoritos();
    }, []);

    return (
        <div>
            <h2>Mis Favoritos</h2>
            <div>
                <input
                    placeholder="Buscar por nombre de usuario..."
                    style={{ border: "none", padding: "10px", marginBottom: "10px", width: "100%", borderRadius: "16px" }}
                    type="text"
                    value={filtroUsername}
                    onChange={(e) => setFiltroUsername(e.target.value)}
                />
            </div>
            <div>
                <input placeholder="Buscar Categoria..." style={{ border: "none", width: "100%", borderRadius: "16px" }} type="text" onChange={(e) => setSearchCategory(e.target.value)} />
            </div>
            <CategoriesMenu onCategorySelected={setSelectedCategory} />
            {favoritos.length > 0 ? (
                <ul>
                    {favoritos.filter(favorito =>
                        (selectedCategory === "Todas las categorías" ||
                            favorito.task.categories.split(',').some(cat => cat.trim() === selectedCategory)) &&
                        (searchCategory === "" ||
                            favorito.task.categories.split(',').map(cat => cat.trim().toLowerCase()).includes(searchCategory.trim().toLowerCase())) &&
                        (filtroUsername === "" || favorito.task.username.toLowerCase().includes(filtroUsername.trim().toLowerCase())) // Filtrado por username
                    ).map((favorito) => (
                        <li key={favorito.id}>
                            nombre: {favorito.task.username} Título: {favorito.task.title}  - Descripción: {favorito.task.description} - Categoría: {favorito.task.categories}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes favoritos aún.</p>
            )}
        </div>
    );
};

export default Favoritos;
