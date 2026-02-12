import React from "react";
import "../../styles/VoiceChannelItem.css";

const VoiceChannelItem = ({ channel, users = [], selected, onClick }) => {
  return (
    <div className="voice-channel-wrapper">
      {/* 채널 이름 */}
      <div
        className={`channel-item ${selected ? "active" : ""}`}
        onClick={onClick}
      >
        <span className="channel-prefix">🔊</span>
        <span className="channel-name">{channel.name}</span>
      </div>

      {/* 🔽 채널 아래 유저 목록 */}
      <div className="voice-users">
        {users.map(user => (
          <div key={user.id} className="voice-user-row">
            <span className="voice-user-avatar">
              {user.iconUrl ? (
                <img
                  src={`http://localhost:8080${user.iconUrl}` || "/images/avatar/default-avatar.png"}
                  alt="avatar"
                />
              ) : (
                user.name[0]
              )}
            </span>
            <span className="voice-user-name">
              {user.name}
            </span>
            {user.muted && <span className="voice-user-muted">🔇</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceChannelItem;
