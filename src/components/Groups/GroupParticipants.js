import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faTrash,
  faUser,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import Axios from "axios";

const GroupParticipants = (props) => {
  const [group, setGroup] = useState(props.group);
  const user = props.user;

  const makeUserLeader = (member) => {
    if (
      confirm(`Confirm you want to make ${member.usernamer} the group leader?`)
    )
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
        return;
      } else {
        return (
          <div className="participant">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <p className="name">
              {member.first_name} {member.last_name}
            </p>
            {user.id === group.leader.id ? (
              <div className="adminOptions">
                <FontAwesomeIcon
                  icon={faPhone}
                  data-tip
                  data-for="contactInfo"
                  className="icon"
                />
                <ReactTooltip id="contactInfo" place="top" effect="solid">
                  Contact Info: Phone # :{" "}
                  {member.profile.phone_number
                    ? member.profile.phone_number
                    : "Not Available"}
                </ReactTooltip>

                <FontAwesomeIcon
                  icon={faTrash}
                  data-tip
                  data-for="deleteTip"
                  className="icon"
                  onClick={() => removeUser(member)}
                />
                <ReactTooltip id="deleteTip" place="top" effect="solid">
                  Remove User From Group
                </ReactTooltip>

                <FontAwesomeIcon
                  icon={faCrown}
                  data-tip
                  data-for="makeLeaderTip"
                  className="icon"
                  onClick={() => makeUserLeader(member)}
                />
                <ReactTooltip id="makeLeaderTip" place="top" effect="solid">
                  Make Group Leader
                </ReactTooltip>
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
