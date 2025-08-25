import React, { useState, useEffect } from "react";
import axios from 'axios';
import Axios from "axios";
import "../owenscss/traductor.scss";
import { useSelector } from "react-redux";
import { Link } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";


const Alllikes = (props) => {
  const [translatedText, setTranslatedText] = useState("");
  const [tokenn, setTokenn] = useState("");
  const [tasks, setTasks] = useState([]);
  const [normal, setNormal] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [newComment, setNewComment] = useState('');

  const [comments, setComments] = useState([]);
  const [juntar, setJuntar] = useState("");
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState("");

  const [correoUsuario, setCorreoUsuario] = useState(localStorage.getItem("userTokenLG"));
  const [mostrarUsuario, setMostrarUusario] = useState(props.usuario);
  const [mostrar, setMostrar] = useState("");


  useEffect(() => {
   
    getTasks();

  }, []);



  const getTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      setTasks(response.data);
      setData(response.data);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };




  const addOrEditTienda= async () =>  {
    try {
      const formData = new FormData();
      // Asegúrate de agregar todos los campos necesarios a formData
      formData.append('title', normal);
      formData.append('description', translatedText);
      formData.append('like', 0);
      // Crear un array de likes (puede ser una lista de IDs de usuarios, por ejemplo)
      const likesArray = [];
      formData.append('likes', JSON.stringify(likesArray)); // Convierte a cadena JSON
      formData.append('username', props.usuarioName);

      // if (selectedImage) {
      //   formData.append('image', selectedImage);
      // }
      // ...

      const response = await axios.post(`http://127.0.0.1:8000/api/tasks/${dataa}/`, formData, {
        headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
    });
      setTasks([...tasks, response.data]);
      setData([...data, response.data]);
      setNewTask({ title: '', description: '' });
      // Aquí puedes manejar la respuesta. Por ejemplo, podrías añadir la nueva tarea a tu estado local.
  } catch (error) {
      console.error('Error creating task:', error);
      console.error('Error creating task:', error.response.data);
  }
}
  

  return (
    <div style={{ paddingTop: "100px" }}>


    <div className="contenido-pagin">
            {tasks.map((link) => (
              <div key={link.id} style={{ borderRadius: "10px" }} className="comment" >
           
          {link.id}
              </div>
            ))}
          </div>
        
    </div>
  );
};

export default Alllikes;
