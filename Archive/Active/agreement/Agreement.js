import React, { Component } from "react";
import Axios from "axios";
import Cookies from "js-cookie";

class Agreement extends Component {
  constructor() {
    super();

    this.state = {
      checked: false,
      disabled: true,
      alert: false,
    };

    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
  }

  handleStatus() {
    Axios.get("http://127.0.0.1:8000/api/agreement/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        if (res.data.Agreement === "Submitted") {
          this.setState({
            submitted: true,
          });
        } else if (res.data.Agreement === "Pending") {
          this.setState({
            submitted: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCheck() {
    this.setState({
      checked: !this.state.checked,
      disabled: !this.state.disabled,
    });
  }

  handleSubmit() {
    if (this.state.checked) {
      Axios.post(
        "http://127.0.0.1:8000/api/agreement/",
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      )
        .then((res) => {
          if (res.data.Success) {
            this.setState({
              alert: true,
            });
            this.handleStatus();
          } else {
            console.log("errors submitting");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Not checked");
    }
  }

  componentDidMount() {
    this.handleStatus();
  }

  render() {
    return (
      <div className="agreements-container">
        <div className="agreement">
          <div className="header">Agreement #1</div>
          <div className="body">
            {this.state.alert ? (
              <div className="alert">Submitted Successfully</div>
            ) : null}

            <div className="agreement-info">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Fermentum leo vel orci porta non pulvinar neque laoreet
              suspendisse. A lacus vestibulum sed arcu. Suspendisse in est ante
              in nibh mauris cursus. Senectus et netus et malesuada. Sed velit
              dignissim sodales ut eu sem integer vitae. Sit amet commodo nulla
              facilisi nullam vehicula ipsum a. Sagittis eu volutpat odio
              facilisis. Posuere morbi leo urna molestie at elementum. Aliquam
              sem fringilla ut morbi tincidunt. At auctor urna nunc id cursus
              metus aliquam eleifend. Integer enim neque volutpat ac tincidunt
              vitae semper quis. Volutpat est velit egestas dui id ornare.
              Tortor consequat id porta nibh venenatis cras sed. Dui ut ornare
              lectus sit amet est. Eu non diam phasellus vestibulum lorem sed
              risus ultricies. Sem viverra aliquet eget sit. Cras ornare arcu
              dui vivamus arcu. Non odio euismod lacinia at quis. Mattis
              molestie a iaculis at erat pellentesque adipiscing. Aliquet
              bibendum enim facilisis gravida neque convallis a. Adipiscing elit
              pellentesque habitant morbi tristique senectus et. Pulvinar
              pellentesque habitant morbi tristique senectus et netus. Proin
              sagittis nisl rhoncus mattis. Fusce ut placerat orci nulla.
              Malesuada proin libero nunc consequat interdum varius sit amet
              mattis. Mi eget mauris pharetra et ultrices. Convallis convallis
              tellus id interdum velit laoreet id. Ornare quam viverra orci
              sagittis eu volutpat. Netus et malesuada fames ac turpis egestas
              integer. Hac habitasse platea dictumst quisque sagittis. Mauris in
              aliquam sem fringilla ut morbi tincidunt augue. Arcu felis
              bibendum ut tristique et egestas. Dignissim cras tincidunt
              lobortis feugiat vivamus at augue eget. Nec dui nunc mattis enim
              ut. Ut sem viverra aliquet eget sit. Nisi quis eleifend quam
              adipiscing vitae proin. Gravida cum sociis natoque penatibus. Ut
              sem nulla pharetra diam. Sem integer vitae justo eget magna
              fermentum. Vitae congue eu consequat ac felis donec et odio
              pellentesque. Nisl rhoncus mattis rhoncus urna neque viverra
              justo. Quis lectus nulla at volutpat. Ridiculus mus mauris vitae
              ultricies leo integer malesuada. Nibh ipsum consequat nisl vel. Ac
              tincidunt vitae semper quis lectus nulla at. Lectus proin nibh
              nisl condimentum id venenatis a.
            </div>
            <div className="agreement-checkbox">
              {this.state.submitted ? (
                <input
                  type="checkbox"
                  onChange={this.handleCheck}
                  disabled={true}
                  checked={true}
                />
              ) : (
                <input type="checkbox" onChange={this.handleCheck} />
              )}
              <label>I hereby agree to the terms above</label>
            </div>
            <div className="agreement-submission">
              <button
                disabled={this.state.disabled}
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Agreement;
