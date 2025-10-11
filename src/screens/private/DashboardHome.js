import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Peticiones from "../../components/Dashboard/traductor/peticiones";
import ImageTwo from "../../../static/assets/images/ads/ad-2.png";

const DashboardHome = () => {
  const [usuarioName, setUsuarioName] = useState("");
  const [usuario, setUsuario] = useState("");
  const subscriptionStatus = useSelector((state) => state.auth.subscriptionStatus);
  const isTabletOrMobileDevice = useMediaQuery({ query: "(max-device-width: 800px)" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("userTokenLG");
        const { data } = await axios.get("http://127.0.0.1:8000/api/get-user/", {
          headers: { Authorization: `Token ${token}` },
        });
        setUsuario(data.user.id);
        setUsuarioName(data.user.username);
         console.log("📩 Backend respondió:", data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  if (!subscriptionStatus.active) {
    return (
      <div className="dashboard-subscription-update-disclaimer">
        <p>
          Your subscription is out of date. Update it{" "}
          <Link to="/dashboard/subscription/">here</Link>.
        </p>
        <div>
          {/* Ya puedes mostrar Peticiones aunque no haya suscripción */}
          <Peticiones {...{ usuario, usuarioName }} />
        </div>
      </div>
    );
  }

  return (
    <div className="all-vw">
      <div className="dashboard-header">
        <h1>Welcome, {usuarioName}</h1>
        <div className="dashboard-shortcuts">
          <a className="dashboard-shortcuts-a-tags" href="/dashboard/home">
            <FontAwesomeIcon className="link-icon" icon="home" /> Home
          </a>
          <a className="dashboard-shortcuts-a-tags" href="/dashboard/raffle/MyTickets">
            <FontAwesomeIcon className="link-icon" icon={faTicketAlt} /> My raffle tickets
          </a>
        </div>
        <div className="horizontal-line"></div>
        {isTabletOrMobileDevice && (
          <h4>
            Click the <FontAwesomeIcon icon={faBars} /> icon at the top to open the menu
          </h4>
        )}
      </div>

      <div className="ads">
        <div className="ad">
          <img src={ImageTwo} alt="ad" />
        </div>
      </div>

      {/* Feed de peticiones normalizado */}
      {/* <div className="dashboard-feed">
        <Peticiones {...{ usuario, usuarioName }} />
      </div> */}
    </div>
  );
};

export default DashboardHome;
