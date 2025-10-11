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
  faPhone,
  faChevronRight,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const MobileSidebar = ({ isOpen, handleSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  const { pathname } = useLocation(); // ruta actual

  return (
    <div className={isOpen ? "mobileSidebar" : "mobileSidebar collapse"}>
      {/* Dashboard */}
      <Link to="/" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faHome} />
        <p className="link-title">Dashboard</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      {/* Calendar */}
     <Link
          to="/dashboard/calendar"
          className={pathname.includes("/dashboard/calendar") ? "active" : ""}
          onClick={handleSidebar}
        >
          Calendar
        </Link>
      {/* Traductor / Peticiones */}
      <Link to="/traductor" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Traductor</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

     <Link
          to="/dashboard/peticiones"
          className={pathname.includes("/dashboard/peticiones") ? "active" : ""}
          onClick={handleSidebar}
        >
        <FontAwesomeIcon className="link-icon" icon={faPen} />
        <p className="link-title">Peticiones</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/nuevaspeticiones" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faPen} />
        <p className="link-title">NuevasPeticiones</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/imagen" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Imagen</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/sociales" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Sociales</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/diagram" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Diagram</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/groupss" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faUsers} />
        <p className="link-title">Groups Messaging</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/addmember" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faUsers} />
        <p className="link-title">Add Member</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/direcmassaging/1" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faUsers} />
        <p className="link-title">Direct Messaging</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      {/* Blog */}
      <Link to="/blog" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faBlog} />
        <p className="link-title">Blog</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      {/* Classifieds */}
      <Link to="/classifieds" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faStoreAlt} />
        <p className="link-title">Classifieds</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      {/* Exchange / Contact */}
      <Link to="/exchange" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faMoneyBill} />
        <p className="link-title">Exchange</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/contact" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faPhone} />
        <p className="link-title">Contact</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      {/* Community / Raffle / YOI */}
      <Link to="/community" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">Community</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/raffle" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faTicketAlt} />
        <p className="link-title">Raffle</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      <Link to="/YOI" className="link" onClick={handleSidebar}>
        <FontAwesomeIcon className="link-icon" icon={faChild} />
        <p className="link-title">Youth of Israel</p>
        <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
      </Link>

      {/* Admin */}
      {user?.profile?.role === "Admin" && (
        <Link to="/admin" className="link" onClick={handleSidebar}>
          <FontAwesomeIcon className="link-icon" icon={faUsersCog} />
          <p className="link-title">Admin</p>
          <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
        </Link>
      )}
    </div>
  );
};

export default MobileSidebar;
