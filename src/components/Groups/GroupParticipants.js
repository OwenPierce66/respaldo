import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faTrash,
  faUser,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";  // ✅ nueva forma de importarlo
import Axios from "axios";

const GroupParticipants = (props) => {
  const [group, setGroup] = useState(props.group);
  const user = props.user;

  const makeUserLeader = (member) => {
    if (confirm(`Confirm you want to make ${member.username} the group leader?`))
      Axios.post(
        `http://127.0.0.1:8000/api/my_group/`,
        {
          post_type: "makeLeader",
          group: group.id,
          user: member.id,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      ).then((res) => {
        setGroup(res.data.group);
      });
  };

  const removeUser = (member) => {
    if (
      confirm(`Confirm you want to remove ${member.username} from group?`) ===
      true
    ) {
      Axios.post(
        `http://127.0.0.1:8000/api/my_group/`,
        {
          post_type: "removeUser",
          group: group.id,
          user: member.id,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      ).then((res) => {
        setGroup(res.data.group);
      });
    }
  };

  const handleMembers = () => {
    return group.members.map((member) => {
      if (member.id === group.leader.id) {
        return null;
      } else {
        return (
          <div className="participant" key={member.id}>
            <FontAwesomeIcon icon={faUser} className="icon" />
            <p className="name">
              {member.first_name} {member.last_name}
            </p>
            {user.id === group.leader.id ? (
              <div className="adminOptions">
                {/* 📞 Contact Info */}
                <FontAwesomeIcon
                  icon={faPhone}
                  data-tooltip-id="contactInfo"
                  data-tooltip-content={`Contact Info: Phone # : ${
                    member.profile.phone_number || "Not Available"
                  }`}
                  className="icon"
                />
                <Tooltip id="contactInfo" place="top" />

                {/* 🗑 Remove User */}
                <FontAwesomeIcon
                  icon={faTrash}
                  data-tooltip-id="deleteTip"
                  data-tooltip-content="Remove User From Group"
                  className="icon"
                  onClick={() => removeUser(member)}
                />
                <Tooltip id="deleteTip" place="top" />

                {/* 👑 Make Leader */}
                <FontAwesomeIcon
                  icon={faCrown}
                  data-tooltip-id="makeLeaderTip"
                  data-tooltip-content="Make Group Leader"
                  className="icon"
                  onClick={() => makeUserLeader(member)}
                />
                <Tooltip id="makeLeaderTip" place="top" />
              </div>
            ) : null}
          </div>
        );
      }
    });
  };

  return (
    <div className="participants">
      <div className="participant">
        <FontAwesomeIcon icon={faCrown} className="icon" />
        <p className="name">
          {group.leader.first_name} {group.leader.last_name}
        </p>
      </div>
      {handleMembers()}
    </div>
  );
};

export default GroupParticipants;
