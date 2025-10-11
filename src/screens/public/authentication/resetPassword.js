import React, { useState } from "react";
import Axios from "axios";
import { Navigate } from "react-router-dom"; // ✅ usar Navigate en vez de Redirect

const ResetPassword = (props) => {
  const Token = props.match.params.tokenId;
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passwordTwo) {
      setError("Passwords don't match.");
      return;
    }

    Axios.post("http://localhost:8000/api/password-reset/", {
      token: Token,
      password: password,
    }).then(() => {
      setRedirect(true);
    });
  };

  if (redirect) {
    return <Navigate to="/app/login" />; // ✅ Aquí cambiamos Redirect por Navigate
  }

  return (
    <div className="forgotPassword">
      <h1>Reset Password</h1>
      <h3>{error}</h3>
      <form className="forgotPasswordForm" onSubmit={handleSubmit}>
        <div className="inputWrapper">
          <label>New Password:</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="inputWrapper">
          <label>Confirm New Password:</label>
          <input type="password" onChange={(e) => setPasswordTwo(e.target.value)} />
        </div>
        <button className="saveButton">Save</button>
      </form>
    </div>
  );
};

export default ResetPassword;
