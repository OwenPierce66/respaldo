import React, { Component } from "react";
import Axios from "axios";
import SignaturePad from "react-signature-canvas";

export default class SecurityPetition extends Component {
  constructor() {
    super();

    this.state = {
      Error: null,
      successMessage: null,
      formComplete: true,
      petitonID: 1,

      name: null,
      phone: null,
      img: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePOST = this.handlePOST.bind(this);
  }

  sigPad = {};

  clear = () => {
    this.sigPad.clear();
  };

  trim = () => {
    this.setState(
      {
        img: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
      },
      () => {
        this.handlePOST();
      }
    );
  };

  handlePOST() {
    Axios.post("http://127.0.0.1:8000/api/petition/", {
      petition: this.state.petitonID,
      name: this.state.name,
      phone_number: this.state.phone,
      signature: this.state.img,
    })
      .then((res) => {
        if (res.data.Error) {
          this.setState({
            Error: "Signature with that phone number already exists.",
            successMessage: null,
          });
        } else {
          this.setState({
            Error: null,
            successMessage: "Submission Sucessful",
          });
        }
      })
      .catch((error) => {
        console.log("Errors ", error);
      });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (this.state.name && this.state.phone) {
      this.setState({
        formComplete: false,
      });
    }
  }

  render() {
    return (
      <div className="petitionApp">
        {/* work on this */}
        <div className="petitionHeader">
          <div className="petitionTitle" style={{ fontSize: "30px" }}>
            To all concerned residents of LeBaron
          </div>
          <div className="petitionTopText">
            YOU can be a key participant in the growth and future of our
            community. YOU can have an active role in helping regulate the use
            of existing services and utilities in Lebaron. We at Whistle Coding
            would like to help provide a system to alert the proper people of
            criminal activity. To be able to expand our freedoms through a safe
            environment, to take control of our future, and become independent
            as a community bound together by a common purpose. If you feel that
            LeBaron needs fresh new ideas and technologies to secure a more
            independent future, join us in our efforts to make this a reality.
            This is ONLY a start to form a petition to secure our future, we
            would like to establish a common core value of freedoms through
            active participation in our community. If you would like Whistle
            Coding to move forward in making this possible through the use of
            apps, and security systems for the community. Residents 18+ <br />
            <div className="CLH"></div>
          </div>
        </div>
        {/* work on this end */}
        <div className="petitionHeader" id="petitionHeader">
          Petition
        </div>
        <div className="petitionSS">
          <div className="petitionS">
            C. AMMON DAYER LEBARON TRACY PRESIDENTE MUNICIPAL DE GALEANA
            CHIHUAHUA P R E S E N T E <br /> <br /> Por medio de la presente, le
            solicitamos la comunidad de lebaron su apoyo para solicitar a CFE
            (Comisión Federal de Electricidad) para que nos de permiso de
            conectar cámaras de vigilancia las cuales tendrán sus propios
            postes, pero se alimentaran con la energía de la zona, de lo cual
            son pocos watts los que se requieren para su conexión. <br /> <br />{" "}
            Esto se esta buscando con el propósito de tener mayor seguridad en
            nuestra comunidad, donde buscamos prevenir el ingreso actos
            criminales en la comunidad. <br /> <br /> Anexo a este oficio le
            agrego una lista de firmada por residentes de la comunidad, quienes
            están interesados en apoyar este proyecto y le solicitan de la misma
            manera su apoyo.
            <br /> <br /> Sin mas que agregar y agradeciendo su apoyo. <br />{" "}
            <br />
            Atentamente <br />
            Colonia LEBARON
          </div>
        </div>

        <div className="bottomContainer">
          <div className="pleaseSignBelow">Please Sign Below</div>

          {this.state.Error ? (
            <div className="errorMessage">{this.state.Error}</div>
          ) : null}
          {this.state.successMessage ? (
            <div className="errorMessage">{this.state.successMessage}</div>
          ) : null}
          <div className="petitionInput">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={() => this.handleChange(event)}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={() => this.handleChange(event)}
            />
          </div>
          <SignaturePad
            canvasProps={{
              className: "signatureCanvas",
            }}
            ref={(ref) => {
              this.sigPad = ref;
            }}
          />
          <div>
            <button className="petitionBtn" onClick={this.clear}>
              Clear
            </button>
            <button className="petitionBtn" onClick={this.trim}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
