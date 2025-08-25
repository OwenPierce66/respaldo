import React from "react";
import { useEffect } from "react";
import Axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);

  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 800px)",
  });

  const getTickets = () => {
    Axios.get("http://127.0.0.1:8000/api/raffle/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((res) => {
      setTickets(res.data.tickets);
    });
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="my-raffle-tickets">
      <h1 style={{marginLeft: "20px"}}>My Tickets</h1>
      <div className="raffle-tickets">
        {tickets.map((ticket) => {
          return (
            <div key={ticket.id} className="ticket-wrapper">
              <div className="ticket">
                <div className="title">Raffle Ticket</div>
                <div className="ticket-number"># {ticket.id}</div>
              </div>
            </div>
          );
        })}
      </div>
        {isTabletOrMobileDevice
        ?
          <h4 style={{marginLeft: "20px"}}>
            <Link to="/dashboard" style={{color: "unset"}}>Back to Dash</Link>
          </h4>
        :
          <h3 style={{marginLeft: "20px"}}>
            <Link to="/dashboard" style={{color: "unset"}}>Back to Dash</Link>
          </h3>
        }
    </div>
  );
};

export default MyTickets;
