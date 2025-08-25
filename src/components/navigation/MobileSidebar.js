import React from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MobileSidebar = (props) => {
  const user = useSelector((state) => state.auth.user);
  const { path, url } = props.match;

  return (
    <div className={props.isOpen ? "mobileSidebar" : "mobileSidebar collapse"}>
      <Link
        to={`${url}`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon="home" />
        <p className="link-title">Dashboard</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/calendar`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faCalendar} />
        <p className="link-title">Calendar</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/blog`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faBlog} />
        <p className="link-title">Blog</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/classifieds`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faStoreAlt} />
        <p className="link-title">Classifieds</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/petitions`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faPen} />
        <p className="link-title">Petitions</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>
      <Link
        to={`${url}/groups`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faUsers} />
        <p className="link-title">Groups</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/directory`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Directory</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/traductor`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Traductor</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/Diagram`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Diagram</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>


      <Link
        to={`${url}/peticiones`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Aportaciones</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      {/* <Link
        to={`${url}/aportaciones`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Aportaciones</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link> */}

      <Link
        to={`${url}/nuevaspeticiones`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">NuevasPeticiones</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/perfilesP`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">PerfilesP</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/favoritos`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">favoritos</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/Pfavoritos`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Pfavoritos</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>


      <Link
        to={`${url}/nuevotask`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">nuevotask</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/sociales`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">Sociales</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/imagen`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faAddressBook} />
        <p className="link-title">imagen</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/exchange`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faMoneyBill} />
        <p className="link-title">Exchange</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link
        to={`${url}/contact`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon="phone" />
        <p className="link-title">Contact</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>


      <Link to={`${url}/community`} className="link" onClick={() => props.handleSidebar()}>
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">Community</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/newcommunity`} className="link" onClick={() => props.handleSidebar()}>
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">newcommunity</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/direcmassaging`} className="link" onClick={() => props.handleSidebar()}>
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">direcmassaging</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      <Link to={`${url}/groupss`} className="link" onClick={() => props.handleSidebar()}>
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">groupss</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>



      <Link to={`${url}/addmember`} className="link" onClick={() => props.handleSidebar()}>
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">addmember</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>
      {/* <Link
        to={`${url}/news`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faNewspaper} />
        <p className="link-title">News</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link> */}

      <Link
        to={`${url}/raffle`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faTicketAlt} />
        <p className="link-title">Raffle</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>
      <Link
        to={`${url}/YOI`}
        className="link"
        onClick={() => props.handleSidebar()}
      >
        <FontAwesomeIcon className="link-icon" icon={faChild} />
        <p className="link-title">Youth of Israel</p>
        <FontAwesomeIcon className="link-chev" icon="chevron-right" />
      </Link>

      {user.profile.role === "Admin" ? (
        <Link
          to={`${url}/admin`}
          className="link"
          onClick={() => props.handleSidebar()}
        >
          <FontAwesomeIcon className="link-icon" icon={faUsersCog} />
          <p className="link-title">Admin</p>
          <FontAwesomeIcon className="link-chev" icon="chevron-right" />
        </Link>
      ) : null}
    </div>
  );
};

export default MobileSidebar;
