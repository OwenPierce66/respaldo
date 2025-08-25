import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";

function NuevasPeticiones() {
    const [tasks, setTasks] = useState([{
        title: '',
        description: '',
        image: null,
        video: null,
        imagePreview: null,
        videoPreview: null
    }]);

    // Función para manejar cambios en los campos del formulario
    const handleInputChange = (index, e) => {
        const newTasks = tasks.map((task, idx) => {
            if (idx === index) {
                return { ...task, [e.target.name]: e.target.value };
            }
            return task;
        });
        setTasks(newTasks);
    };

    // Función para manejar cambios en los archivos
    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileType = file.type.split('/')[0]; // 'image' o 'video'
        const updatedTasks = tasks.map((task, idx) => {
            if (idx === index) {
                if (fileType === 'image') {
                    return {
                        ...task,
                        image: file,
                        video: null,
                        imagePreview: URL.createObjectURL(file),
                        videoPreview: null
                    };
                } else if (fileType === 'video') {
                    return {
                        ...task,
                        video: file,
                        image: null,
                        videoPreview: URL.createObjectURL(file),
                        imagePreview: null
                    };
                }
            }
            return task;
        });
        setTasks(updatedTasks);
    };


    // Función para agregar un nuevo formulario de tarea
    const addTaskForm = () => {
        setTasks([...tasks, { title: '', description: '', image: null, video: null }]);
    };

    // Función para enviar todas las tareas
    const submitAllTasks = async () => {
        // Aquí implementarías la lógica para enviar todas las tareas al servidor
    };

    return (
        <div>
            {tasks.map((task, index) => (
                <div key={index}>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Title"
                    />
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Description"
                    />
                    <input
                        type="file"
                        id={`fileInput-${index}`}
                        name="file"
                        onChange={(e) => handleFileChange(index, e)}
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor={`fileInput-${index}`} className="imagenIcon">
                        <FontAwesomeIcon icon={faImage} /> {/* Ícono para cargar archivos */}
                        {/* Upload Image/Video */}
                    </label>
                    {task.imagePreview && (
                        <img src={task.imagePreview} alt="Preview" style={{ height: "100px", width: "100px" }} />
                    )}
                    {task.videoPreview && (
                        <video src={task.videoPreview} controls style={{ width: '250px' }} />
                    )}
                </div>
            ))}
            <button onClick={addTaskForm}>Add Another Task</button>
            <button onClick={submitAllTasks}>Submit All Tasks</button>
        </div>
    );
}

export default NuevasPeticiones;
