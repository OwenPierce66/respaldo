import React from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const Sidebar = (props) => {
  // 1) Toma el usuario (puede venir plano o anidado como { user: {...} })
  const reduxUser = useSelector((state) => state.auth?.user ?? null);
  const rawUser = props.user ?? reduxUser ?? null;

  // 2) Normaliza forma {user:{...}} -> {...}
  const normalizeUser = (u) => (u && u.user ? u.user : u) || null;
  const user = normalizeUser(rawUser);

  // 3) Rol robusto (tolera nulls y distintas formas del backend)
  const pickRole = (u) => {
    if (!u) return "guest";
    if (u.is_superuser) return "admin";
    if (u.is_staff) return "staff";
    if (u.role) return String(u.role).toLowerCase();
    if (u.profile?.role) return String(u.profile.role).toLowerCase();
    return "user";
  };
  const role = pickRole(user);
  const isAdmin =
    role === "admin" || (user?.profile?.role && String(user.profile.role).toLowerCase() === "admin");

  // 4) Base URL segura
  const resolved = useResolvedPath("");
  const match = useMatch("/dashboard/*");
  const url = match?.pathnameBase || resolved.pathname || "/dashboard";

  // (Opcional) Si quieres ocultar el sidebar hasta tener el usuario
  // if (!user) return <div className={props.sidebarOpen ? "sidebar" : "sidebar collapse"}>Cargando…</div>;

  return (
    <div className={props.sidebarOpen ? "sidebar" : "sidebar collapse"}>
      <Link to={`${url}`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon="home" />
        <p className="link-title">Dashboard</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/calendar`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faCalendar} />
        <p className="link-title">Calendar</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/blog`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faBlog} />
        <p className="link-title">Blog</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/classifieds`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faStoreAlt} />
        <p className="link-title">Classifieds</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/petitions`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faPen} />
        <p className="link-title">Petitions</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/groups`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faUsers} />
        <p className="link-title">Groups</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/directory`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Directory</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/exchange`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faMoneyBill} />
        <p className="link-title">Exchange</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/contact`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon="phone" />
        <p className="link-title">Contact</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/community`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">Community</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/raffle`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faTicketAlt} />
        <p className="link-title">Raffle</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/YOI`} className="link" onClick={() => props.handleSidebar?.()}>
        <FontAwesomeIcon className="link-icon" icon={faChild} />
        <p className="link-title">Youth of Israel</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      {isAdmin && (
        <Link to={`${url}/admin`} className="link" onClick={() => props.handleSidebar?.()}>
          <FontAwesomeIcon className="link-icon" icon={faUsersCog} />
          <p className="link-title">Admin</p>
          <FontAwesomeIcon className="link-chev" icon="chevron-right" />
        </Link>
      )}

      <a
        href="https://www.flaticon.com/free-icons/close"
        title="close icons"
        style={{ display: "none" }}
      >
        Close icons created by Freepik - Flaticon
      </a>
    </div>
  );
};

export default Sidebar;
