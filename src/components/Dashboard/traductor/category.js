import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Category() {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        // Obtener todas las categorías
        axios.get('http://127.0.0.1:8000/api/manage-categories/', {
            headers: {
                Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
            },
        })
            .then(response => {
                setCategories(response.data);
                console.log(response.data);
                // Suponiendo que tu API pueda enviar también las categorías seleccionadas para el usuario en sesión,
                // necesitarás ajustar esto para obtener solo los IDs y actualizar selectedCategories
                // const selectedIds = response.data.filter(cat => cat.isSelected).map(cat => cat.id);
                // setSelectedCategories(selectedIds);
            })
            .catch(error => console.error('There was an error!', error));
    }, []);


    const handleCategorySelect = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Envía las categorías seleccionadas al backend
        axios.post('http://127.0.0.1:8000/api/manage-categories/', {
            categories: selectedCategories  // Envía solo los IDs
        }, {
            headers: {
                Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
            },
        })
            .then(response => {
                console.log('Categories updated successfully', response.data);
            })
            .catch(error => console.error('There was an error!', error));
    };

    return (
        <div>
            <h2>que categorias tiene tu perfil?</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category.id)}
                            className={selectedCategories.includes(category.id) ? 'selected' : ''}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                <button type="submit">Save Post</button>
            </form>
        </div>
    );
}

export default Category;

