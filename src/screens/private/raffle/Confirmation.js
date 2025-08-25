import React, { Component } from "react";
import { Redirect } from "react-router";

const Confirmation = () => {
  return (
    <div className="confirmation">
      <div className="card">
        <div className="header">
          <p className="title">Your Purchase Has Been Completed</p>
        </div>
        <div className="body">
          <p>Thank You!</p>
          <p>You may view your tickets on your dashboard</p>
        </div>
        <div className="footer">
          <a href="/dashboard">Dashboard</a>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
