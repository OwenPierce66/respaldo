import Axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";


class Mailer extends Component {
    constructor() {
        super();

        this.state = {
            username: '',
            email: '',
            message: '',
            submitted: false,
            submitMessage: 'Write your message'        
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:8000/api/mail-sender/", {
            username: this.props.user.username,
            email: this.props.user.email,
            message: this.state.message,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('userTokenLG')}`,
          },
        })
            .then(() => {
                this.setState({
                    submitted: true,
                    message: '',
                    submitMessage: 'Message has been sent we will get back to you soon'
                });
            })
            .catch((e) => {
                console.log(e);
                this.setState({
                    submitMessage: "Sorry were having problems there has been an error"
                })
            });
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            submitMessage: 'Write your message'
        });
    };

    render() {
        return (
              <div>
                <div className="CF-container">
                  <div className="CF-formWrapper">
                      <div className="CF-formTitleWapper">    
                          <div className="CF-formTitle">Send AD LeBaron A Message</div>
                      </div>
                      <div className='messageOverMessage'>
                          { this.state.submitMessage }
                      </div>
                      
                      <form className="CF-form" onSubmit={(e) => this.handleSubmit(e)}>
                          <div className="CF-labelWrapper">
                              {/* <label className="CF-label">message</label> */}

                        <input hidden type="text" value={this.props.user.username} name="username" onChange={(e) => this.handleChange(e)} />
                        <input hidden type="text" value={ this.props.user.email } name="email" onChange={(e) => this.handleChange(e)} />

                          </div>
                          <textarea placeholder="Message" className="CF-textarea" value={this.state.message} type="text" placeholder="" name="message" onChange={(e) => this.handleChange(e)} />

                          <div className="CF-buttonWrapper">
                              <button className="CF-button" value="Send"  type="submit">Send Message</button>
                          </div>
                      </form>
                  </div>
              </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};


export default connect(mapStateToProps)(Mailer);