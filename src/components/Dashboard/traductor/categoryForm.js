import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryForm = () => {
    const [nombre, setNombre] = useState('');
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        // Llamada para obtener las categorías al cargar el componente

        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/categories/', {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            setCategorias(res.data);
            console.log(res.data); // Agrega la nueva categoría a la lista

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/categories/', { name: nombre }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            setCategorias([...categorias, res.data]); // Agrega la nueva categoría a la lista
            console.log(res.data); // Agrega la nueva categoría a la lista
            setNombre(''); // Resetea el campo de entrada
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarCategoria = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/categories/${id}`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
                },
            });
            setCategorias(categorias.filter(categoria => categoria.id !== id)); // Actualiza la lista sin la categoría eliminada
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <div className='botonCategoryUser'>
                    <button type="submit">Crear Categoría</button>
                </div>
            </form>
            <ul>
                {categorias.map(categoria => (
                    <li key={categoria.id}>{categoria.name} <button onClick={() => eliminarCategoria(categoria.id)}>X</button></li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryForm;
