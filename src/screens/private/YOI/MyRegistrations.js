import React, { Fragment } from "react";
import { useEffect } from "react";
import Axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { capitalizeWord, pluralize } from "../../../utils/String";
import Modal from "react-modal";
import { loadStripe } from "@stripe/stripe-js";
import { getShirtSizes } from "../../../utils/Yoi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChild } from "@fortawesome/free-solid-svg-icons";

function MyRegistrations() {
  const [kids, setKids] = useState({ registered: [], unRegistered: [] });
  const [success, setSuccess] = useState(new URLSearchParams(window.location.search).has('success'))

  const updateKids = registrations => {
    const kidsByRegisterStatus = { registered: [], unRegistered: [] }

    registrations.forEach(registration => {
      if (registration.payment_complete) {
        kidsByRegisterStatus.registered.push(registration)
      } else {
        kidsByRegisterStatus.unRegistered.push(registration)
      }
    })

    setKids(kidsByRegisterStatus);
  }

  const getRegistrations = () => {
    Axios.get("http://127.0.0.1:8000/api/YOI_Registration/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((res) => {
      updateKids(res.data.registrations || [])
    });
  };

  useEffect(() => {
    Modal.setAppElement("body");
    getRegistrations();

    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000)

      return () => clearTimeout(timer)
    }
  }, []);

  return (
    <div className="my-registrations">
      <a className="yoi-form-link" href="/dashboard/YOI/register">
        <FontAwesomeIcon className="link-icon" icon={faChild} /> YOI youth registration form
      </a>
      {success && <p className="successful">Kids were registered again</p>}
      <h2>My Registered Kids</h2>
      {kids.registered.length > 0
        ? <Kids kids={kids.registered} setKids={updateKids} />
        : <p>You currently don't have any registered kids.</p>
      }
      <h2>My Unregistered Kids</h2>
      {kids.unRegistered.length > 0
        ? <Kids kids={kids.unRegistered} setKids={updateKids} isUnregistered />
        : <p>You currently don't have any unregistered kids.</p>
      }
    </div>
  );
};

function Kids({ kids, setKids, isUnregistered = false }) {
  const [kidsToRegisterAgain, setKidsToRegisterAgain] = useState(new Set())
  const [editing, setEditing] = useState(null)
  const [registeringAgain, setRegisteringAgain] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showNoKidsSelectedError, setShowNoKidsSelectedError] = useState(false)
  const shirtSizes = getShirtSizes()

  const getShirtSize = kid => {
    let size = shirtSizes.youth.find(possibleSize => possibleSize.value === kid.size)

    if (size === undefined) {
      size = shirtSizes.adult.find(possibleSize => possibleSize.value === kid.size)
    }

    return size.label || ''
  }

  const onCheck = id => {
    setShowNoKidsSelectedError(false)
    setSuccess(false)
    if (kidsToRegisterAgain.has(id)) {
      setKidsToRegisterAgain(previous => {
        const updatedKids = new Set(previous);
        updatedKids.delete(id);
        return updatedKids;
      });
    } else {
      setKidsToRegisterAgain(previous => new Set(previous).add(id));
    }
  }

  const onRegisterAgain = e => {
    e.preventDefault()

    if (kidsToRegisterAgain.size === 0) {
      setShowNoKidsSelectedError(true)
      return
    }

    setRegisteringAgain(true)
  }

  return (
    <div className="kids-list">
      <RegisterAgainModal kidsToRegisterAgain={kidsToRegisterAgain} setRegisteringAgain={setRegisteringAgain} registeringAgain={registeringAgain} />
      {editing !== null &&
        <EditModal
          setKids={setKids}
          kidToEdit={editing}
          setSuccess={setSuccess}
          setKidToEdit={
            kid => {
              setEditing(kid)
              setSuccess(false)
            }
          }
        />}
      {isUnregistered && (
        <form onSubmit={onRegisterAgain}>
          <div className="register-again-button-wrapper">
            <button type="submit" className="register-again-button">
              Register selected kids again
            </button>
            {showNoKidsSelectedError && <p className="register-again-error">Please select the children you would like to register again in the table below.</p>}
          </div>
          <div className="confirmation-checkbox-input-wrapper">
            <input
              id="transportation-confirmation"
              name="transportation-confirmation"
              type="checkbox"
              required
            />
            <label htmlFor="transportation-confirmation">
              I understand that I am responsible for my teens' transportation, to and from Rancho Parapetos.
            </label>
          </div>
          <div className="confirmation-checkbox-input-wrapper">
            <input
              id="shirt-size-confirmation"
              name="shirt-size-confirmation"
              type="checkbox"
              required
            />
            <label htmlFor="shirt-size-confirmation">
              I have edited my teens shirt size from previous registration. (See edit button below)
            </label>
          </div>
        </form>
      )}
      {success && <p className="successful">Changes were saved correctly</p>}
      <div className="headers">
        <p>Name</p>
        <p className="mobile-hidden">Birthdate</p>
        <p className="mobile-hidden">Shirt size</p>
      </div>
      <div className="info">
        {kids.map(kid => (
          <div key={kid.id}>
            {isUnregistered && <input type="checkbox" checked={kidsToRegisterAgain.has(kid.id)} onChange={() => onCheck(kid.id)} />}
            <p>{`${capitalizeWord(kid.first_name)} ${kid.last_name}`}</p>
            <p className="mobile-hidden">{kid.birthdate}</p>
            <p className="mobile-hidden">{getShirtSize(kid)}</p>
            {isUnregistered && (
              <Fragment>
                <div>
                  <button className="rowButton" onClick={() => setEditing(kid)}>
                    Edit
                  </button>
                </div>
              </Fragment>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function RegisterAgainModal({ kidsToRegisterAgain, registeringAgain, setRegisteringAgain }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const registerKids = async () => {
    setSubmitted(true)
    setError('')

    const stripe = await loadStripe(
      "pk_test_51GrtUoHuoQnP408hk6dnSJKGungKZi3NqsYBBKhx2BJnzKpX0MMNuLOxXKTRleXogSS4tQghf4ZSsqDodxOuZZTz006S8g1HjE"
    );

    Axios.patch(
      "http://127.0.0.1:8000/api/YOI_Create_Session/",
      {
        children: kidsToRegisterAgain,
        price: 7000,
        quantity: kidsToRegisterAgain.size,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        stripe.redirectToCheckout({ sessionId: res.data.sessionId });
      })
      .catch(() => {
        setSubmitted(false)
        setError("We're having some issues completing your request right now, please try again later.")
      });
  };

  return (
    <Modal
      className="pricing-modal Modal"
      overlayClassName="Overlay"
      isOpen={registeringAgain}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setRegisteringAgain(false)}
    >
      <div className="pricing-wrapper">
        {error !== '' && <p className="error">{error}</p>}
        <p className="pricing-header">Total Cost for Registration</p>
        <div className="pricing-details">
          <p>
            $70 * {kidsToRegisterAgain.size} {pluralize(kidsToRegisterAgain.size, 'Child', 'Children')}
          </p>
          <p>
            Total: ${70 * kidsToRegisterAgain.size}
          </p>
        </div>
        <button onClick={registerKids} disabled={submitted}>Pay Now</button>
        <p className="pricing-disclaimer" style={{ color: "red" }}>
          *If child does not attend mandatory classes, you will be charged an additional $70 USD*
        </p>
      </div>
    </Modal>
  )
}

function EditModal({ kidToEdit, setSuccess, setKidToEdit, setKids }) {
  const [values, setValues] = useState({
    size: kidToEdit.size,
    email: kidToEdit.email,
    phone_number: kidToEdit.phone_number,
    allergies: kidToEdit.allergies || '',
    price: 7000,
    quantity: 1,
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const shirtSizes = getShirtSizes()

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitted(true)
    setError('')

    Axios.patch(`http://127.0.0.1:8000/api/YOI_Registration/${kidToEdit.id}`, values, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then(res => {
      setKids(res.data.registrations || [])
      setKidToEdit(null)
      setSuccess(true)
    })
      .catch(() => {
        setError("We're having some issues completing your request right now, please try again later.")
        setSubmitted(false)
      })
  }

  return (
    <Modal
      className="register-again-modal Modal"
      overlayClassName="Overlay"
      isOpen={kidToEdit !== null}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setKidToEdit(null)}
    >
      <Fragment>
        <p className="header">Edit {capitalizeWord(kidToEdit.first_name)} {capitalizeWord(kidToEdit.last_name)}</p>
        {error !== '' && <p className="error">{error}</p>}
        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="inputWrapper">
            <label htmlFor="email">Email:</label>
            <input
              onChange={e => setValues({ ...values, email: e.target.value })}
              value={values.email}
              name="email"
              id="email"
              type="text"
              required
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              onChange={e => setValues({ ...values, phone_number: e.target.value })}
              value={values.phone_number}
              name="phone_number"
              id="phone_number"
              type="text"
              required
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="allergies">Allergies:</label>
            <input
              onChange={e => setValues({ ...values, allergies: e.target.value })}
              value={values.allergies}
              name="allergies"
              id="allergies"
              type="text"
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="size">Shirt Size:</label>
            <select
              onChange={e => setValues({ ...values, size: e.target.value })}
              value={values.size}
              name="size"
              required
            >
              <option value="" disabled hidden>
                Please Choose...
              </option>
              <optgroup label="Youth Sizes">
                {shirtSizes.youth.map(size => (<option key={size.value} value={size.value}>{size.label}</option>))}
              </optgroup>
              <optgroup label="Adult Sizes">
                {shirtSizes.adult.map(size => (<option key={size.value} value={size.value}>{size.label}</option>))}
              </optgroup>
            </select>
          </div>
          <button disabled={submitted} type="submit" className="rowButton">
            Save
          </button>
        </form>
      </Fragment>
    </Modal>
  )
}

export default MyRegistrations;