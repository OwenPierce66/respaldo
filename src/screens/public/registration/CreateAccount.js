import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBlog,
  faMoneyBillWave,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

const CreateAccount = (props) => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({
    general: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const confirmPasswordInputRef = useRef(null)

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })

    if (e.target.name === 'confirmPassword') {
      confirmPasswordInputRef.current.setCustomValidity(values.password === e.target.value ? '' : "Passwords don't match")
    }

    if (e.target.name === 'password') {
      confirmPasswordInputRef.current.setCustomValidity(values.confirmPassword === e.target.value ? '' : "Passwords don't match")
    }
  };

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitting(true)

    Axios.post('http://127.0.0.1:8000/api/signup/validate-account/', { 'account': values })
      .then(() => {
        props.handleCreateAccount(values)
      })
      .catch((err) => {
        if (err.response.status === 422) {
          setErrors(err.response.data)
        } else {
          setErrors({ general: "We're having some issues completing your request right now, please try again later." })
        }
      })
      .finally(() => {
        setSubmitting(false)
      })
  };

  return (
    <div className="CreateAccount">
      <div className="left">
        <div className="title">Create an account</div>
        <div className="highlights">
          <div className="highlight">
            <FontAwesomeIcon className="highlight-icon" icon="info-circle" />
            <div>Access to instant information about your community.</div>
          </div>
          <div className="highlight">
            <FontAwesomeIcon className="highlight-icon" icon="address-book" />
            <div>Business Directory</div>
          </div>
          <div className="highlight">
            <FontAwesomeIcon
              className="highlight-icon"
              icon={faMoneyBillWave}
            />
            <div>View Exchange Rates</div>
          </div>
          <div className="highlight">
            <FontAwesomeIcon className="highlight-icon" icon={faBlog} />
            <div>Blog's for the latest information</div>
          </div>
          <div className="highlight">
            <FontAwesomeIcon
              className="highlight-icon"
              icon={faPen}
              id="pen-icon"
            />
            <div>Respond to local petitions</div>
          </div>
        </div>
      </div>
      <form className="right" onSubmit={handleSubmit}>
        {!!errors.general && <p className="error">{errors.general}</p>}
        <div className="input-wrapper">
          <label className="input-label pointer" htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => handleChange(e)}
            value={values.username}
            required
          />
          {!!errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="input-wrapper">
          <label className="input-label pointer" htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={(e) => handleChange(e)}
            values={values.email}
            required
          />
          {!!errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="input-wrapper">
          <label className="input-label pointer" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => handleChange(e)}
            value={values.password}
            required
          />
          {!!errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="input-wrapper pointer">
          <label className="input-label pointer" htmlFor="confirmPassword">Confirm Password</label>
          <input
            ref={confirmPasswordInputRef}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={(e) => handleChange(e)}
            value={values.confirmPassword}
            required
          />
          {!!errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <div className="agreement">
          <input
            className="pointer"
            type="checkbox"
            name="privacyPolicyAgreement"
            id="privacyPolicyAgreement"
            required
          />
          <label className="pointer" htmlFor="privacyPolicyAgreement">
            I have read and understand the
            <a
              href="https://www.privacypolicygenerator.info/live.php?token=jPvI8N4quWh5kzHSBULDNhTyxgLxH0jH"
              target="_blank"
            >
              Privacy Policy
            </a>
          </label>
        </div>
        <div className="agreement-2">
          By creating an account, I am agreeing to the responsibility of being
          involved in our community and voting on important decisions.
        </div>
        <button disabled={submitting} className="create-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
