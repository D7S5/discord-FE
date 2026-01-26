import React from "react";
import "../styles/VoiceUserItem.css";

export default function VoiceUserItem({ user }) {
  return (
    <div className={`voice-user-item ${user.muted ? "muted" : ""}`}>
      <div className="avatar">{user.name[0]}</div>
      <div className="username">{user.name}</div>
      {user.muted && <span className="mic-off">🔇</span>}
    </div>
  );
}