import React, { Component } from "react";
import GroupParticipants from "../../../components/Groups/GroupParticipants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faPlus,
  faEllipsisH,
  faSignOutAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { connect } from "react-redux";
import GroupChat from "../../../components/Groups/GroupChat";
import AddParticipants from "../../../components/Groups/AddParticipants";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import Modal from "react-modal";

class Groups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatInput: null,
      chatError: null,
      groupData: null,
      groupMessages: null,
      groupTexts: {},
      isLeader: null,
      groupParticipants: {},
      description: "Nothing to see yet.",
      toggleModal: false,
      isModalOpen: false,
      message: "Test",
      settings: "groupChat",
      settingsParticipants: "groupParticipantsS",
      buttongroup: "Gbtn-class",
      editDesc: false,
      isMobileOrDesktop: null,
      windowSize: window.innerWidth,
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendText = this.sendText.bind(this);
    this.renderGroupTexts = this.renderGroupTexts.bind(this);
    this.deleteText = this.deleteText.bind(this);
    this.getGroup = this.getGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.HandleSettingsOpen = this.HandleSettingsOpen.bind(this);
    this.HandleSettingsClose = this.HandleSettingsClose.bind(this);
    this.HandleEditDesc = this.HandleEditDesc.bind(this);
    this.toggleEditDesc = this.toggleEditDesc.bind(this);
    this.handleIsMobile = this.handleIsMobile.bind(this);
    this.groupParticipantsOpen = this.groupParticipantsOpen.bind(this);
    this.groupParticipantsClosed = this.groupParticipantsClosed.bind(this);
  }

  groupParticipantsOpen() {
    this.setState({
      settingsParticipants: "groupParticipants",
    });
  }

  groupParticipantsClosed() {
    this.setState({
      settingsParticipants: "groupParticipantsS",
    });
  }

  handleIsMobile() {
    if (window.innerWidth <= "800") {
      this.setState({
        isMobileOrDesktop: "mobile",
      });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  deleteText(messageId) {
    Axios.post(
      `http://127.0.0.1:8000/api/group_messages/${this.state.groupData.id}`,
      {
        messageId: messageId,
        post_type: "delete",
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.success) {
        this.setState({
          groupMessages: res.data.groupMessages,
        });
      } else {
        // handle failed message creation
        console.log("failed");
      }
    });
  }

  renderGroupTexts() {
    const groupTexts = this.state.groupMessages;

    if (groupTexts) {
      return groupTexts.map((text) => {
        return (
          <div className="text">
            <h3>{text.creator.username}</h3>
            <p>{text.message}</p>
            <div className="timeDeleteContainer">
              <h4>{text.created}</h4>
              {this.props.user.id === text.creator.id ||
              this.props.user.id === this.state.groupData.leader.id ? (
                <button
                  onClick={() => {
                    this.deleteText(text.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              ) : null}
            </div>
          </div>
        );
      });
    }
  }

  sendText() {
    Axios.post(
      `http://127.0.0.1:8000/api/group_messages/${this.state.groupData.id}`,
      {
        post_type: "create",
        messageData: {
          group: this.state.groupData.id,
          message: "this is a test message from the dashboard.",
          creator: 1,
        },
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.success) {
        this.setState({
          groupMessages: res.data.groupMessages,
        });
      } else {
        // handle failed message creation
      }
    });
  }

  leaveGroup() {
    Axios.post(
      `http://127.0.0.1:8000/api/my_group/`,
      {
        post_type: "leaveGroup",
        group: this.state.groupData.id,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((res) => {
      if (res.data.success) {
        window.location.reload();
      }
    });
  }

  getGroup() {
    Axios.get("http://127.0.0.1:8000/api/my_group/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    })
      .then((res) => {
        if (res.data.error) {
          console.log("Group Text Error: ", res.data.error);
        } else {
          this.setState({
            groupData: res.data.group,
          });
        }
      })
      .catch((error) => {
        this.props.history.push("/dashboard/joinGroup");
      });
  }

  HandleSettingsOpen() {
    if ((this.state.settings = "groupChat")) {
      this.setState({
        settings: "groupChatS",
      });
    }
  }

  HandleSettingsClose() {
    if ((this.state.settings = "groupChatS")) {
      this.setState({
        settings: "groupChat",
      });
    }
  }

  toggleEditDesc() {
    this.setState({
      editDesc: !this.state.editDesc,
    });
  }

  HandleEditDesc(e) {
    this.setState({
      groupData: {
        ...this.state.groupData,
        description: e.target.value,
      },
    });

    Axios.post(
      `http://127.0.0.1:8000/api/my_group/`,
      {
        post_type: "editDesc",
        description: e.target.value,
        group: this.state.groupData.id,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    );
  }

  componentDidMount() {
    this.getGroup();
    this.handleIsMobile();
    Modal.setAppElement("body");
  }

  render() {
    if (!this.state.groupData) {
      return (
        <div>
          You Are Not In A Group <button>Join Groups</button>
        </div>
      );
    }

    if (this.state.isMobileOrDesktop === "mobile") {
      return (
        <div className="groups-wrapper">
          <div className="groups">
            <div className={this.state.settings}>
              <button
                className="Gbtn-classM"
                onClick={() => {
                  this.HandleSettingsOpen();
                  this.groupParticipantsOpen();
                }}
              >
                <FontAwesomeIcon className="Gbtn-icon" icon={faEllipsisH} />
              </button>
              <GroupChat
                groupId={this.state.groupData.id}
                user={this.props.user}
              />
            </div>
            <button
              className="Gbtn-classM"
              onClick={() => {
                this.HandleSettingsClose();
                this.groupParticipantsClosed();
              }}
            >
              <FontAwesomeIcon className="Gbtn-icon" icon={faSignOutAlt} />
            </button>
            <div className="upper">
              <div className="group">
                <div className="description">
                  <div className="desc-header">
                    Description
                    {this.state.groupData.leader.id === this.props.user.id ? (
                      <button
                        className="Gbtn-class"
                        onClick={this.toggleEditDesc}
                      >
                        <FontAwesomeIcon className="Gbtn-icon" icon={faEdit} />
                      </button>
                    ) : null}
                  </div>

                  {this.state.editDesc === false ? (
                    <div className="desc-body">
                      <div className="inner-desc">
                        {this.state.groupData.description}
                      </div>
                    </div>
                  ) : (
                    <div className="desc-body">
                      <textarea
                        type="text"
                        value={this.state.groupData.description}
                        onChange={(e) => this.HandleEditDesc(e)}
                        placeholder={this.state.groupData.description}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={this.state.settingsParticipants}>
              <div className="groupParticipantsHeader">
                <div className="gp-header">Participants</div>

                <div className="settings">
                  <button className="GroupButton" onClick={this.leaveGroup}>
                    Leave Group
                  </button>
                </div>

                <div className="btn-open-modal">
                  {this.state.groupData.leader.id === this.props.user.id ? (
                    <FontAwesomeIcon
                      icon={faPlus}
                      onClick={() => {
                        this.setState({ isModalOpen: true });
                      }}
                    />
                  ) : null}
                </div>
              </div>
              <GroupParticipants
                group={this.state.groupData}
                user={this.props.user}
              />
            </div>
          </div>

          <Modal
            className="Modal"
            overlayClassName="Overlay"
            isOpen={this.state.isModalOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => {
              this.setState({ isModalOpen: false });
            }}
          >
            <AddParticipants />
          </Modal>
        </div>
      );
    } else {
      return (
        <div className="groups-wrapper">
          <div className="groups">
            <div className="upper">
              <div className="group">
                <div className="description">
                  <div className="desc-top">
                    <div className="desc-header">Description</div>
                    <div className="Gbtn-class-edit-desc">
                      {this.state.groupData.leader.id === this.props.user.id ? (
                        <button
                          className="Gbtn-class"
                          onClick={this.toggleEditDesc}
                        >
                          <FontAwesomeIcon
                            className="Gbtn-icon"
                            icon={faEdit}
                          />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {this.state.editDesc === false ? (
                    <div className="desc-body">
                      <div className="inner-desc">
                        {this.state.groupData.description}
                      </div>
                    </div>
                  ) : (
                    <div className="desc-body">
                      <textarea
                        type="text"
                        value={this.state.groupData.description}
                        onChange={(e) => this.HandleEditDesc(e)}
                        placeholder={this.state.groupData.description}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lower">
              <div className={this.state.settings}>
                <GroupChat
                  groupId={this.state.groupData.id}
                  user={this.props.user}
                />
              </div>
              <div className="groupParticipants">
                <div className="groupParticipantsHeader">
                  <div className="gp-header">Participants</div>

                  <div className="settings">
                    <button className="GroupButton" onClick={this.leaveGroup}>
                      Leave Group
                    </button>
                  </div>

                  <div className="btn-open-modal">
                    {this.state.groupData.leader.id === this.props.user.id ? (
                      <FontAwesomeIcon
                        icon={faPlus}
                        onClick={() => {
                          this.setState({ isModalOpen: true });
                        }}
                      />
                    ) : null}
                  </div>
                </div>
                <GroupParticipants
                  group={this.state.groupData}
                  user={this.props.user}
                />
              </div>
            </div>
          </div>

          <Modal
            className="Modal"
            overlayClassName="Overlay"
            isOpen={this.state.isModalOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => {
              this.setState({ isModalOpen: false });
            }}
          >
            <AddParticipants />
          </Modal>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(Groups);
