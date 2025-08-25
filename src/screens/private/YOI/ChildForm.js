import React, { Component } from "react";
import Axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { getShirtSizes } from "../../../utils/Yoi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

class ChildForm extends Component {
  constructor() {
    super();

    this.state = {
      children: [
        {
          allergies: "None",
          birthday: "",
          email: "",
          first_name: "",
          last_name: "",
          phone_number: "",
          size: "",
          gender: "",
          translation_assistance: 0,
          spanish_shirt: 0,
        },
      ],
      errors: null,
      price: 9000,
      isSubmitted: false,
    };

    this.showChildren = this.showChildren.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemoveChild = this.handleRemoveChild.bind(this);
    this.handleAddChild = this.handleAddChild.bind(this);
  }

  handleAddChild() {
    let children = [...this.state.children];
    children.push({
        allergies: "None",
        birthday: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        size: "",
        gender: "",
        translation_assistance: 0,
        spanish_shirt: 0,
    });
    this.setState({
      children,
    });
  }

  handleRemoveChild(i) {
    let newChildren = [...this.state.children];
    newChildren.splice(i, 1);

    this.setState({
      children: newChildren,
    });
  }

  validateBirthday(id, input) {
    const currentYear = new Date().getFullYear()
    // Kids must be between 13 and 18 by the end of the current year
    const maxYear = currentYear - 13
    const minYear = currentYear - 18
    const selectedYear = input.value.split('-')[0]

    if (selectedYear < minYear) {
      input.setCustomValidity('Your child is too old to register, children must be between 13 and 18 by the end of the current year to be able to register.')
      return
    }

    if (selectedYear > maxYear) {
      input.setCustomValidity('Your child is too young to register, children must be between 13 and 18 by the end of the current year to be able to register.')
      return
    }

    input.setCustomValidity('')
  }

  handleChange(e) {
    let [id, name] = e.target.name.split("-");
    let newChildren = [...this.state.children];

    newChildren[id] = { ...this.state.children[id], [name]: e.target.value };

    this.setState({ children: newChildren });

    if (name === 'birthday') {
      this.validateBirthday(id, e.target)
    }
  }

  showChildren() {
    const shirtSizes = getShirtSizes()
    return [...Array(this.state.children.length)].map((e, i) => {
      return (
        <div key={`child-${i}`} className="child">
          {i > 0 ? (
            <div className="removeChild">
              <button type="button" onClick={() => this.handleRemoveChild(i)}>
                <FontAwesomeIcon icon={faMinus} /> Remove this teen
              </button>
            </div>
          ) : null}
          <div className="inputWrapper">
            <label htmlFor="">First name:</label>
            <input
              onChange={this.handleChange}
              value={this.state.children[i].first_name || ''}
              name={i + "-first_name"}
              type="text"
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="">Last name:</label>
            <input
              onChange={this.handleChange}
              value={this.state.children[i].last_name || ''}
              name={i + "-last_name"}
              type="text"
              placeholder="Enter last name"
              required
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="">Birthdate:</label>
            <input
              onChange={this.handleChange}
              value={this.state.children[i].birthday || ''}
              name={i + "-birthday"}
              type="date"
              required
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="">Email:</label>
            <input
              onChange={this.handleChange}
              value={this.state.children[i].email || ''}
              name={i + "-email"}
              type="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="">Phone Number:</label>
            <input
              onChange={this.handleChange}
              value={this.state.children[i].phone_number || ''}
              name={i + "-phone_number"}
              type="text"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="">Allergies:</label>
            <input
              onChange={this.handleChange}
              value={this.state.children[i].allergies || 'None'}
              name={i + "-allergies"}
              type="text"
              placeholder="Enter allergies"
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="">Shirt Size:</label>
            <select
              onChange={this.handleChange}
              value={this.state.children[i].size || ''}
              name={i + "-size"}
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
          <div className="inputWrapper">
            <label htmlFor="">Gender:</label>
            <select
              onChange={this.handleChange}
              value={this.state.children[i].gender || ''}
              name={i + "-gender"}
              required
            >
              <option value="" disabled hidden>
                Please Choose...
              </option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>
          <div className="inputWrapper">
            <label htmlFor="">
              ¿Necesita ayuda con la traducción del inglés al español?
            </label>
            <select
              onChange={this.handleChange}
              value={this.state.children[i].translation_assistance || 0}
              name={i + "-translation_assistance"}
              required
            >
              <option value="" disabled hidden>
                Please Choose...
              </option>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          <div className="inputWrapper">
            <label htmlFor="">
              ¿Le gustaría que el logo de su camiseta fuera en español?
            </label>
            <select
              onChange={this.handleChange}
              value={this.state.children[i].spanish_shirt || 0}
              name={i + "-spanish_shirt"}
              required
            >
              <option value="" disabled hidden>
                Please Choose...
              </option>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>
      );
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      isSubmitted: true,
      errors: null,
    });

    const stripe = await loadStripe(
      "pk_test_51GrtUoHuoQnP408hk6dnSJKGungKZi3NqsYBBKhx2BJnzKpX0MMNuLOxXKTRleXogSS4tQghf4ZSsqDodxOuZZTz006S8g1HjE"
    );

    Axios.post(
      "http://127.0.0.1:8000/api/YOI_Create_Session/",
      {
        children: this.state.children,
        price: this.state.price,
        quantity: this.state.children.length,
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
        this.setState({
          isSubmitted: false,
          errors: "We're having some issues completing your request right now, please try again later."
        });
      });
  };

  render() {
    return (
      <div className="childFormContainer">
        <form onSubmit={this.handleSubmit} className="childForm">
          <div className="formHeader">YOI youth registration form</div>
          <h3 style={{ width: "100%", textAlign: "center", color: "red" }}>
            {this.state.errors}
          </h3>
          <h3 className="registerAgainDisclaimer">
            ⚠️Note: if you have registered teens before, you can re-register them on the link below!<br />
            <Link className="form-link-to-registrations" to="/dashboard/YOI/registrations">
              <FontAwesomeIcon icon={faUsers} /> See my registered kids
            </Link>
          </h3>
          <br />
          <h2>
            Enter teens information below
          </h2>
          {this.showChildren()}
          <div className="buttonContainer">
            <button
              className="addChild"
              type="button"
              onClick={this.handleAddChild}
            >
              <FontAwesomeIcon icon={faPlus} /> Add another teen
            </button>
          </div>
          <div className="pricing">
            <div className="transportationConfirmation">
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

            <div className="pricingTitle">Total cost for registration</div>
            <div className="totalWrapper">
              <div className="userCost">
                $90 * {this.state.children.length} Teen(s)
              </div>
              <div className="total">
                TOTAL: <strong>${90 * this.state.children.length}</strong>
              </div>
            </div>

            <div className="buttonWrapper">
              <button
                type="submit"
                className="submitButton"
                disabled={this.state.isSubmitted}
              >
                Pay now
              </button>
            </div>

            <div className="warning" style={{ color: "red" }}>
              *If teen does not attend mandatory classes, you will be charged an additional $70 USD*
            </div>
            <div className="warning">
              *Teens must be between 13 and 18 years old by the end of the current year to be able to register*
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ChildForm;
