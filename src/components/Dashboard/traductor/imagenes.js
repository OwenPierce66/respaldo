import React, { useState, useEffect } from "react";
import axios from 'axios';
import Axios from "axios";
import "../owenscss/traductor.scss";
import { useSelector } from "react-redux";



const Imagenes = (props) => {
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
  const [peticionajena, setPeticionajena] = useState("");
  const [peticionajenaa, setPeticionajenaa] = useState("");

  const [correoUsuario, setCorreoUsuario] = useState(localStorage.getItem("userTokenLG"));
  const [mostrarUsuario, setMostrarUusario] = useState(props.usuario);
  const [mostrar, setMostrar] = useState("");
  const [peticion, setPeticion] = useState("");
  const [dataa, setDataa] = useState("");
  const [listUsers, setListUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  
  useEffect(() => {
    if(dataa===""){
    addOrEditTiendaa();
    }else{
    getTasks();
    }
    // fetchComments();
  }, [dataa]);

  const addOrEditTiendaa= async () =>  {
    try {
      const token = localStorage.getItem("userTokenLG");
      const response = await axios.get('http://127.0.0.1:8000/api/get-user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const userDetails  = response.data;
      console.log(userDetails);
      console.log(userDetails.user.id);

      console.log(userDetails.user.email);
      console.log(userDetails.user.id);
      props.setUsuario(userDetails.user.id);
      props.setUsuarioName(userDetails.user.username);
      setDataa(userDetails.user.id);
      // console.log(user);
    } catch (error) {
      console.error('Error creating task:', error);
    }

  }

  const getTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/imagen/`, {
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





//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
//         headers: {
//           Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
//         },
//       });
//       const updatedTasks = tasks.filter((task) => task.id !== id);
//       setTasks(updatedTasks);
//       setData(updatedTasks);
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const user = useSelector(state => state.auth.isAuthenticated)

  const addOrEditTienda= async () =>  {
    try {
      const formData = new FormData();
      formData.append('title', normal);
      formData.append('description', translatedText);
      formData.append('image', selectedImage);


      const response = await axios.post(`http://127.0.0.1:8000/api/imagen/`, formData, {
        headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
    });
      setTasks([...tasks, response.data]);
      setData([...data, response.data]);
      setNewTask({ title: '', description: '' });
  } catch (error) {
      console.error('Error creating task:', error);
      console.error('Error creating task:', error.response.data);
  }
}
  
  const translateText = async (text) => {
    setNormal(text);
    const apiKey = "AIzaSyA1pr1L0zW8cv6TNwadyjFHqUhh11POuAQ"; // Tu clave de API
    const targetLanguage = "es"; // Idioma objetivo para la traducción
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      });

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      setTranslatedText(translatedText);
      setNormal(text);
    } catch (error) {
      console.error("Error al traducir el texto:", error);
    }
  };


  return (
    <div>

      <div style={{ paddingTop: "10px" }}>
        <div className="whatpetition">
          <div className="whatpetitiontitle">Cual es tu peticion?
          </div>

        
      <input type="text" onChange={(e) => translateText(e.target.value)} />
      <p style={{paddingLeft:"15px", paddingRight:"15px"}}>{translatedText}</p>
      {/* <input type='file' onChange={event => setSelectedImage(event.target.files[0])} /> */}
      <input
  type="file"
  accept="image/*" 
  onChange={(e) => setSelectedImage(e.target.files[0])}
/>
      <div> <button className="btnpetition" onClick={addOrEditTienda}>
  Agregar
 </button></div>
 </div>
 <div>{peticion}</div>
 <div>{peticionajena}</div>
 

 {/* <div> <button >
  user{props.usuario}
 </button></div> */}
 <div className="contenido-pagin">
            {data.map((link) => (
              <div key={link.id} style={{ borderRadius: "10px" }} className="comment" >
<div>
    {link.title}
    {link.description}
    <img src={link.image} alt="Imagen" style={{height:"100px", width:"100px"}}/>
</div>
              </div>
            ))}
          </div>
 </div>
 

        </div>
  );
};

export default Imagenes;
