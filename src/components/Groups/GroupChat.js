import React, { Component } from "react";
import Axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEllipsisH,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

class Groupchat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverID: "",
      messageText: null,
      messages: [],
      user: {},
      isAuthenticated: true,
      newMessage: null,
    };
    // this.GUID = config.GUID;
    this.getMessages = this.getMessages.bind(this);
    this.displayMessages = this.displayMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  handleDelete(id) {
    if (confirm("Confirm you want to delete message.") === true) {
      let groupId = this.props.groupId;

      Axios.post(
        `http://127.0.0.1:8000/api/group_messages/${groupId}`,
        {
          post_type: "delete",
          messageId: id,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      ).then((res) => {
        if (res.data.success) {
          this.setState({ messages: res.data.groupMessages });
        } else {
          // handle failed message creation
        }
      });
    } else {
      return;
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  sendMessage(e) {
    e.preventDefault();

    let groupId = this.props.groupId;

    Axios.post(
      `http://127.0.0.1:8000/api/group_messages/${groupId}`,
      {
        post_type: "create",
        messageData: {
          group: groupId,
          message: this.state.newMessage,
          creator: this.props.user.id,
        },
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.success) {
        this.setState({ messages: res.data.groupMessages, newMessage: "" });
      } else {
        // handle failed message creation
      }
    });
  }

  displayMessages() {
    const user = this.props.user;

    return this.state.messages.map((message) => {
      if (user.id === message.creator.id) {
        return (
          <li className="self">
            <p>{message.creator.username}</p>
            <div className="msg">
              <div className="message">{message.message}</div>
            </div>
            <div className="info">
              <p className="options">
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => this.handleDelete(message.id)}
                />
              </p>
              <p className="timeStamp">
                {moment(message.created).format("LT")}
              </p>
            </div>
          </li>
        );
      } else {
        return (
          <li className="other">
            <p>{message.creator.username}</p>
            <div className="msg">
              <div className="message">{message.message}</div>
            </div>
            <p className="timeStamp">{moment(message.created).format("LT")}</p>
          </li>
        );
      }
    });
  }

  getMessages() {
    let groupId = this.props.groupId;
    Axios.get(`http://127.0.0.1:8000/api/group_messages/${groupId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        this.setState({ messages: res.data.messages });
      })
      .catch((error) => {});
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.getMessages();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <div className="chatWindow">
        <ul className="chat" id="chatList">
          {this.displayMessages()}
          <li
            className="bottom"
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></li>
        </ul>
        <div className="chatInputWrapper">
          <form onSubmit={this.sendMessage}>
            <input
              className="textarea input"
              type="text"
              placeholder="Enter your message..."
              value={this.state.newMessage}
              name="newMessage"
              onChange={this.handleChange}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faArrowRight} className="inputIcon" />
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default Groupchat;
