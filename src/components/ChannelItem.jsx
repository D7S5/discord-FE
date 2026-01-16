import React from "react";

const ChannelItem = ({ channel, selected, onClick }) => {
  return (
    <div
      className={`channel-item ${selected ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="channel-prefix">
        {channel.type === "VOICE" ? "🔊" : "#"}
      </span>
      <span className="channel-name">{channel.name}</span>
    </div>
  );
};

export default ChannelItem;
