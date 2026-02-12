import React from "react";
import "../../styles/VoiceUserList.css";

export default function VoiceUserList({ users = [] }) {
  return (
    <div className="voice-user-list">
      {users.map(user => (
        <div key={user.userId} className="voice-user">
          <img
            className="voice-user-avatar"
            src={`http://localhost:8080${user.iconUrl}` || "/images/avatar/default-avatar.png"}
            alt="avatar"
            onError={(e) => {
              e.target.src = "/images/avatar/default-avatar.png";
            }}
          />
          <div className="voice-user-name">
            {user.username}
          </div>

        </div>
      ))}
    </div>
  );
}
