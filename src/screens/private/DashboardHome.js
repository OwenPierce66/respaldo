import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicketAlt, faChild, faUsers } from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import ImageTwo from '../../../static/assets/images/ads/ad-2.png';
import axios from 'axios';
import Peticiones from "../../components/Dashboard/traductor/peticiones";


const DashboardHome = (props) => {
  const [usuarioName, setUsuarioName] = useState("");
  const [usuario, setUsuario] = useState("");

  const subscriptionStatus = useSelector(
    (state) => state.auth.subscriptionStatus
  );
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 800px)",
  });

 

  useEffect(() => {
    addOrEditTiendaa();
    // fetchComments();

  }, []);

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
      setUsuario(userDetails.user.id);
      setUsuarioName(userDetails.user.username);

      // console.log(user);
    } catch (error) {
      console.error('Error creating task:', error);
    }

  }

  if (!subscriptionStatus.active) {
    return (
      <div className="dashboard-subscription-update-disclaimer">
        <p>
          Your subscription information is out of date, to access the dashboard content, please update your subscription.{usuario}
        </p>
        <p>
          You can update your subscription <Link to="/dashboard/subscription/">here</Link>.
        </p>
        <div>
          <Peticiones {...{usuario, usuarioName, setUsuarioName, setUsuario}}/>
        </div>
      </div>
    )
  }

  return (
    <div className="all-vw">
      <div className="dashboard-header">
        <h1>Welcome to the dashboard{props.usuario}</h1>
        <div className="dashboard-shortcuts">
          <a className="dashboard-shortcuts-a-tags" href="/dashboard/home">
            <FontAwesomeIcon className="link-icon" icon="home" /> Home
          </a>
          <a className="dashboard-shortcuts-a-tags" href="/dashboard/raffle/MyTickets">
            <FontAwesomeIcon className="link-icon" icon={faTicketAlt} /> My raffle tickets
          </a>
          {/* Uncomment once YOI registrations are open again */}
          {/*
          <a className="dashboard-shortcuts-a-tags" href="/dashboard/YOI/register">
            <FontAwesomeIcon className="link-icon" icon={faChild} /> YOI youth registration
          </a>
          <a className="dashboard-shortcuts-a-tags" href="/dashboard/YOI/registrations">
            <FontAwesomeIcon icon={faUsers} /> My registered kids
          </a>
          */}
        </div>
        <div className="horizontal-line"></div>
        <br />
        {isTabletOrMobileDevice ? <h4>Click the <FontAwesomeIcon icon={faBars} /> icon at the top to open the menu</h4> : null}
      </div>
      <div className="ads">
        {/* <div className="ad">
          <img src={ImageOne} alt="ad" />
        </div> */}
        <div className="ad">
          <img src={ImageTwo} alt="ad" />
        </div>
      </div>
    </div >
  )
};

export default DashboardHome;
