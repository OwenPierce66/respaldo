import React, { Component } from "react";
import Mailer from './cantactForm'



export default class Contact extends Component {



  render() {
    return (
      <div>
        <div className="contact-component">
          <div className="contactWrapper">
            <div className="contactBox">
              <div className="holder">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkuZgBSuu-ewcYYzDSKsNC_FRiD_0v46Wwxw&usqp=CAU" className="contactImage" />
              </div>
              <div className="contactTitle">Whistle Coding Support</div>
              <div className="contactInfoWrapper">
                <div className="contactContent">
                  <a
                    href="mailto:support@whistle-coding.awsapps.com?subject=I%20had%20a%20question"
                    className="email"
                  >
                    <i className="far fa-envelope"></i>
                  </a>
                </div>

              </div>
            </div>
            <div className="contactBox">
              <div className="holder">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkuZgBSuu-ewcYYzDSKsNC_FRiD_0v46Wwxw&usqp=CAU" className="contactImage" />
              </div>
              <div className="contactTitle">Adrian Lebaron</div>
              <div className="contactInfoWrapper">

                <div className="contactInfo">
                  <a
                    href="https://wa.me/+18018353995"
                    target="blank"
                    className="email"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>

                <div className="contactContent">
                  <a
                    href="mailto:adrianlebaron@gmail.com?subject=I%20had%20a%20question"
                    className="email"
                  >
                    <i className="far fa-envelope"></i>
                  </a>
                </div>

              </div>
            </div>

            <div className="contactBox">
              <div className="holder">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkuZgBSuu-ewcYYzDSKsNC_FRiD_0v46Wwxw&usqp=CAU" className="contactImage" />
              </div>
              <div className="contactTitle">Hector Sanchez</div>
              <div className="contactInfoWrapper">

                <div className="contactInfo">
                  <a
                    href="https://wa.me/+5216361159300"
                    target="blank"
                    className="email"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="contactBox">
              <div className="holder">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkuZgBSuu-ewcYYzDSKsNC_FRiD_0v46Wwxw&usqp=CAU" className="contactImage" />
              </div>
              <div className="contactTitle">Carlos Leany</div>
              <div className="contactInfoWrapper">

                <div className="contactInfo">
                  <a
                    href="https://wa.me/+5216361219574"
                    target="blank"
                    className="email"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
        {/* <div className="contactFormComponentWrapper">
          <Mailer />
        </div> */}
      </div>
    );
  }
}
