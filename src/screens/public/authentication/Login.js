import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes, faEye } from "@fortawesome/free-solid-svg-icons";
import Slideshow from "../../../components/misc/Slideshow";
import * as authActions from '../../../store/actions/auth';
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [invalidCredentialsOpen, setInvalidCredentialsOpen] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("userTokenLG");
  if (token) {
    // Verificamos si el token es válido y a dónde debe ir
    fetch("http://127.0.0.1:8000/api/get-user/", {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("User details:", data);
        if (data.user?.is_admin) {
          navigate("/dashboard/admin");
        } else if (!data.subscriptionStatus?.active) {
          navigate("/dashboard/manage");
        } else {
          navigate("/dashboard/home");
        }
      })
      .catch(err => {
        console.error("Token inválido:", err);
        localStorage.removeItem("userTokenLG");
      });
  }
}, [navigate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      // login() guardará el token en localStorage
      dispatch(authActions.login(username, password));
      // darle chance a que Redux/acción asíncrona guarde token
      setTimeout(() => {
        const token = localStorage.getItem("userTokenLG");
        if (token) {
          navigate("/dashboard");
        } else {
          setInvalidCredentialsOpen(true);
          setTimeout(() => setInvalidCredentialsOpen(false), 5000);
        }
      }, 1000);
    } else {
      setInvalidCredentialsOpen(true);
      setTimeout(() => setInvalidCredentialsOpen(false), 5000);
    }
  };

  return (
    <div className="login-grid">
      {invalidCredentialsOpen && (
        <div className="login-form-bad-request">
          <div className="login-form-bad-request-text">
            Error: Invalid credentials
          </div>
          <button
            onClick={() => setInvalidCredentialsOpen(false)}
            className="login-form-bad-request-close-button"
          >
            X
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form-wrapper">
        <button type="button" onClick={() => navigate(-1)} className="close-me">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="login-form">
          <h1 className="login-form-header">Sign In</h1>

          <div className="form-input-container stacked-inputs">
            <div className="form-input-wrapper">
              <FontAwesomeIcon className="form-icon" icon={faUser} />
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-input-wrapper cursor-pointer">
              <FontAwesomeIcon
                className="form-icon"
                icon={faEye}
                onClick={() => setShowPassword(!showPassword)}
              />
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-bottom-wrapper">
            <div className="form-bottom-left">
              <Link to="../registration">Register Now</Link>
              <h3 style={{ color: 'red' }}>
                Did you forget your username or password? <br />
                <a
                  href="https://wa.me/+5216361159300"
                  target="blank"
                  style={{ color: 'red', textDecoration: 'underline' }}
                >
                  Contact Hector Sanchez <i className="fab fa-whatsapp"></i>
                </a>
              </h3>
            </div>
            <div className="btn-wrapper">
              <button className="btn" type="submit">Login</button>
            </div>
          </div>
        </div>
      </form>
    const backgroundImageUrl = "../../../static/assets/images/image2.jpg";

      <Slideshow
        interval={5000}
        images={[
          "../../../static/assets/images/scenery-1.png",
          "../../../static/assets/images/scenery-2.png",
          "../../../static/assets/images/scenery-3.png",
          "../../../static/assets/images/scenery-4.png",
          "../../../static/assets/images/scenery-5.png",
          "../../../static/assets/images/scenery-6.png",
          "../../../static/assets/images/scenery-4.png",
        ]}
      />
    </div>
  );
};

export default Login;
