import React, { useState, useEffect } from 'react';

function BuscarPeticion(props) {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]); // Lista de objetos con 'username' y 'id'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then((response) => response.json())
      .then((data) => {
        setData(data);

        // Extraer y filtrar los usernames y ids sin repetir
        const uniqueUsers = data.reduce((acc, item) => {
          if (!acc.some(user => user.username === item.username)) {
            acc.push({ username: item.username, id: item.user });
          }
          return acc;
        }, []);
        setUsers(uniqueUsers);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    props.setSearchTerm(value);  // Pasar el valor de búsqueda al componente padre
  };

  const handleSelect = (user) => {
    setSelectedUsername(user.username);
    props.setPeticionajena(user.id);  // Asignar el ID del usuario seleccionado
    props.setPeticionajenaa(user.id);  // Asignar el ID del usuario seleccionado
    setSearchTerm('');  // (Opcional) Limpiar la barra de búsqueda
  };

  const filteredUsers = users.filter((user) => user.username.includes(searchTerm));

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Buscar username..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: "100%" }}
        className='buscadorpeticion'
      />
      {searchTerm &&
        <ul>
          {filteredUsers.map((user, index) => (
            <li key={index} onClick={() => handleSelect(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      }
      {selectedUsername && <p>Username seleccionado {props.peticionajenaa}: {selectedUsername}</p>}
    </div>
  );
}

export default BuscarPeticion;
