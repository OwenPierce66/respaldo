import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function UserRow({
  avatarSrc,
  username,
  badgeLabel,
  right,
  onClick,
  onAvatarError,
}) {
  return (
    <li className="user-row" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="user-row__avatar">
        {avatarSrc ? (
          <img src={avatarSrc} alt={username || "usuario"} onError={onAvatarError} />
        ) : (
          <FontAwesomeIcon icon={faUser} />
        )}
      </div>

      <div className="user-row__main">
        <div className="user-row__name">
          <span className="user-row__username">{username}</span>
          {badgeLabel ? <span className="user-row__badge">{badgeLabel}</span> : null}
        </div>
      </div>

      <div className="user-row__right">{right}</div>
    </li>
  );
}
