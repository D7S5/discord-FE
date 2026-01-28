import React from "react";
import "../../styles/VoiceUserItem.css";

export default function VoiceUserItem({ user }) {
  return (
    <div className={`voice-user ${user.speaking ? "speaking" : ""}`}>
      <div className="avatar-wrapper">
        <img
          src={user.avatarUrl || "/default-avatar.png"}
          alt={user.username}
          className="avatar"
        />
        {user.speaking && <span className="speaking-ring" />}
      </div>

      <div className="voice-user-info">
        <span className="username">{user.username}</span>
        {user.muted && <span className="mute-icon">🔇</span>}
      </div>
    </div>
  );
}
