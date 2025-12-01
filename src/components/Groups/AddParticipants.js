import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

class AddParticipants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupDataID: null,
      group: null,
      groupLeader: null,
      users: [],
      previous: null,
      next: null,
      count: 0,
      pages: 0,
      members: null,
      loadingGroup: false,
      loadingUsers: false,
      error: null,
    };
    this.getGroup = this.getGroup.bind(this);
    this.handleUsers = this.handleUsers.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleAddParticipants = this.handleAddParticipants.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  async getGroup() {
    this.setState({ loadingGroup: true, error: null });
    try {
      const res = await Axios.get("http://127.0.0.1:8000/api/my_group/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      if (res.data && res.data.group) {
        this.setState({
          groupDataID: res.data.group.id,
          group: res.data.group,
          groupLeader: res.data.group.leader ?? null,
        });
      } else {
        // respuesta inesperada
        this.setState({ error: "No se encontró group en la respuesta del servidor." });
      }
    } catch (err) {
      console.error("getGroup error:", err);
      this.setState({ error: "Error al obtener grupo (ver consola)." });
      // No redirigir aquí; deja que el usuario vea el modal con mensaje.
    } finally {
      this.setState({ loadingGroup: false });
    }
  }

  // si no pasas URL, usamos este por defecto
  async getUsers(URL = "http://127.0.0.1:8000/api/admin/users/") {
    this.setState({ loadingUsers: true, error: null });
    try {
      const response = await Axios.get(URL, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      });
      const data = response.data;
      this.setState({
        previous: data.previous ?? null,
        next: data.next ?? null,
        users: data.results ?? data ?? [],
        count: data.count ?? (Array.isArray(data) ? data.length : 0),
        pages: data.count ? Math.ceil(data.count / 10) : 1,
      });
    } catch (err) {
      console.error("getUsers error:", err);
      this.setState({ error: "Error al obtener usuarios. Revisa la consola." });
    } finally {
      this.setState({ loadingUsers: false });
    }
  }

  handleUsers() {
    const { users } = this.state;
    if (!users || users.length === 0) return null;

    return users.map((user) => {
      // comparacion, no asignacion
      const isInactive = user?.profile?.subscriptionActive === "Inactive";
      // si quieres filtrar solo inactive, usa isInactive en condicional
      if (!isInactive) return null;

      return (
        <div key={user.id} className="handleUserWrapper">
          <div className="handleUser">{user.username}</div>
          <div className="handleUser">{/* first/last if needed */}</div>
          <div className="DoNotDisplay">-</div>
          <div className="handleUserButton">
            <FontAwesomeIcon
              className="buttonadduser"
              icon={faPlus}
              onClick={() => this.handleAddParticipants(user)}
            />
          </div>
        </div>
      );
    });
  }

  handleSearch(e) {
    const q = e.target.value || "";
    const url = `http://127.0.0.1:8000/api/admin/users/?search=${encodeURIComponent(q)}`;
    this.getUsers(url);
  }

  async handleAddParticipants(user) {
    if (!this.state.groupDataID) {
      alert("No se encontró el ID del grupo. Asegúrate de que el grupo esté cargado.");
      return;
    }
    try {
      const res = await Axios.post(
        `http://127.0.0.1:8000/api/my_group/`,
        {
          post_type: "addUser",
          user: user.id,
          group: this.state.groupDataID,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      );
      // espera éxito del backend
      if (res.data && (res.data.success || res.data === "success")) {
        // actualizar UI sin recargar
        // ideal: backend devuelve members o grupo actualizado -> actualizar state
        // aquí forzamos recarga ligera
        await this.getGroup();
        await this.getUsers(); // refrescar lista si necesario
      } else {
        console.warn("handleAddParticipants response:", res.data);
        alert("No se pudo añadir el usuario. Revisa la consola.");
      }
    } catch (err) {
      console.error("handleAddParticipants error:", err);
      alert("Error al añadir participante. Revisa la consola para más detalles.");
    }
  }

  componentDidMount() {
    this.getGroup();
    this.getUsers(); // ahora con URL por defecto
    // no llamamos a handleUsers() aquí
  }

  render() {
    const { loadingGroup, loadingUsers, error } = this.state;

    return (
      <div className="modal-wrapper">
        <div className="adminModal-body">
          {loadingGroup ? <div>Cargando grupo...</div> : null}
          {error ? <div style={{ color: "red" }}>{error}</div> : null}

          <div className="modal-box">
            <div className="modal-header">Add User To Group Participants</div>

            <div className="flex-center">
              <div className="SearchUserParticipantsWrapper">
                <div className="SearchUserParticipantsTitle">Search User</div>
                <input
                  className="SearchUserParticipants"
                  type="text"
                  placeholder="Search User"
                  onChange={this.handleSearch}
                />
              </div>

              {loadingUsers ? <div>Cargando usuarios...</div> : null}

              <div style={{ width: "100%", marginTop: 12 }}>
                {this.handleUsers()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddParticipants;
