// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Ajusta a la URL base de tu API

// Configura Axios con tu token de autenticación si es necesario
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Token ${localStorage.getItem("userTokenLG")}`, // Asume que guardas tu token aquí
    }
});

export const fetchCategories = () => {
    return axiosInstance.get('/new-categories/');
};

export const createCategory = (name) => {
    return axiosInstance.post('/new-categories/', { name });
};

export const deleteCategory = (id) => {
    return axiosInstance.delete(`/new-categories/${id}/`);
};
