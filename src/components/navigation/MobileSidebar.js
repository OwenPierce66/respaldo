// MobileSidebar.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBlog, faPen, faNewspaper, faUsersCog, faAddressBook, faMoneyBill,
  faCalendar, faTicketAlt, faChild, faStoreAlt, faUsers, faPhone, faChevronRight, faHome
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const MobileSidebar = ({ isOpen, handleSidebar }) => {
  const user = useSelector((state) => state.auth.user);

  // si tus rutas están montadas bajo /dashboard, usa el prefijo
  const prefix = "/dashboard";

  const mk = (to, content) => (
    <NavLink
      to={to}
      onClick={handleSidebar}
      className={({ isActive }) => `link ${isActive ? "active" : ""}`}
    >
      {content}
      <FontAwesomeIcon className="link-chev" icon={faChevronRight} />
    </NavLink>
  );

  return (
    <div className={isOpen ? "mobileSidebar" : "mobileSidebar collapse"}>
      {mk(`${prefix}/`, (
        <>
          <FontAwesomeIcon className="link-icon" icon={faHome} />
          <p className="link-title">Dashboard</p>
        </>
      ))}

      {mk(`${prefix}/calendar`, <> <FontAwesomeIcon className="link-icon" icon={faCalendar} /> <p className="link-title">Calendar</p> </>)}

      {/* {mk(`${prefix}/traductor`, <> <FontAwesomeIcon className="link-icon" icon={faAddressBook} /> <p className="link-title">Traductor</p> </>)} */}

      {mk(`${prefix}/peticiones`, <> <FontAwesomeIcon className="link-icon" icon={faPen} /> <p className="link-title">Peticiones</p> </>)}

      {/* {mk(`${prefix}/nuevaspeticiones`, <> <FontAwesomeIcon className="link-icon" icon={faPen} /> <p className="link-title">NuevasPeticiones</p> </>)} */}

      {/* {mk(`${prefix}/imagen`, <> <FontAwesomeIcon className="link-icon" icon={faAddressBook} /> <p className="link-title">Imagen</p> </>)} */}

      {/* {mk(`${prefix}/sociales`, <> <FontAwesomeIcon className="link-icon" icon={faAddressBook} /> <p className="link-title">Sociales</p> </>)} */}

      {/* {mk(`${prefix}/diagram`, <> <FontAwesomeIcon className="link-icon" icon={faAddressBook} /> <p className="link-title">Diagram</p> </>)} */}

      {/* {mk(`${prefix}/groupss`, <> <FontAwesomeIcon className="link-icon" icon={faUsers} /> <p className="link-title">Groups Messaging</p> </>)} */}
      {mk(`${prefix}/groups`, <> <FontAwesomeIcon className="link-icon" icon={faUsers} /> <p className="link-title">Groups</p> </>)}

      {/* {mk(`${prefix}/addmember`, <> <FontAwesomeIcon className="link-icon" icon={faUsers} /> <p className="link-title">Add Member</p> </>)} */}

      {mk(`${prefix}/direcmassaging/1`, <> <FontAwesomeIcon className="link-icon" icon={faUsers} /> <p className="link-title">Messages</p> </>)}

      {mk(`${prefix}/blog`, <> <FontAwesomeIcon className="link-icon" icon={faBlog} /> <p className="link-title">Blog</p> </>)}

      {mk(`${prefix}/classifieds`, <> <FontAwesomeIcon className="link-icon" icon={faStoreAlt} /> <p className="link-title">Classifieds</p> </>)}

      {mk(`${prefix}/exchange`, <> <FontAwesomeIcon className="link-icon" icon={faMoneyBill} /> <p className="link-title">Exchange</p> </>)}

      {mk(`${prefix}/contact`, <> <FontAwesomeIcon className="link-icon" icon={faPhone} /> <p className="link-title">Contact</p> </>)}

      {mk(`${prefix}/community`, <> <FontAwesomeIcon className="link-icon" icon={faNewspaper} /> <p className="link-title">Community</p> </>)}

      {mk(`${prefix}/raffle`, <> <FontAwesomeIcon className="link-icon" icon={faTicketAlt} /> <p className="link-title">Raffle</p> </>)}

      {mk(`${prefix}/YOI`, <> <FontAwesomeIcon className="link-icon" icon={faChild} /> <p className="link-title">Youth of Israel</p> </>)}

      {user?.profile?.role === "Admin" && mk(`${prefix}/admin`, <> <FontAwesomeIcon className="link-icon" icon={faUsersCog} /> <p className="link-title">Admin</p> </>)}
    </div>
  );
};

export default MobileSidebar;
