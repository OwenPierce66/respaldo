import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes, faEye } from "@fortawesome/free-solid-svg-icons";
import Slideshow from "../../../components/misc/Slideshow";
import * as authActions from '../../../store/actions/auth';
import { useDispatch } from "react-redux";

const Login = (props) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [invalidCredentialsOpen, setInvalidCredentialsOpen] = useState(false);

  function showAuthenticationError() {
    const isAuthenticated = localStorage.getItem("userTokenLG");
    if (!isAuthenticated) {
      setInvalidCredentialsOpen(true)
      setTimeout(() => setInvalidCredentialsOpen(false), 11000)
    }
  }

  const handleSubmit = (e) => {
    if (username && password) {
      dispatch(authActions.login(username, password));
      setTimeout(showAuthenticationError, 3000)
    } else {
      setInvalidCredentialsOpen(true);
      setTimeout(() => setInvalidCredentialsOpen(false), 11000)
    }
    e.preventDefault()
  }

  return (
    <div className="login-grid">
      {invalidCredentialsOpen === true ? (
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
      ) : null}

      <form onSubmit={(e) => handleSubmit(e)} className="login-form-wrapper">
        <button type="button" onClick={props.history.goBack} className="close-me">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="login-form">
          <h1 className="login-form-header">Sign In</h1>

          <div className="form-input-container stacked-inputs">
            <div className="form-input-wrapper">
              <FontAwesomeIcon className="form-icon " icon={faUser} />

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

              {/* <Link to="/app/forgotpassword">Did you forget your password?</Link> */}

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
              <button className="btn" type="submit" >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* <div className="divider" />

        <div className="google-button"></div> */}
      </form >

      <Slideshow
        interval={5000}
        images={[
          "../assets/images/alma.png",
          "../assets/images/scenery-1.png",
          "../assets/images/scenery-2.png",
          "../assets/images/scenery-3.png",
          "../assets/images/scenery-4.png",
          "../assets/images/scenery-5.png",
          "../assets/images/scenery-6.png",
          "../assets/images/scenery-4.png",
        ]}
      />
    </div >

  )
}

export default Login;