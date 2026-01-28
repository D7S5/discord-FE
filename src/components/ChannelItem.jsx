import VoiceUserItem from "./voice/VoiceUserItem";

const ChannelItem = ({
  channel,
  selected,
  onClick,
  voiceUsers = []
}) => {
  return (
    <div>
      <div
        className={`channel-item ${selected ? "active" : ""}`}
        onClick={onClick}
      >
        <span className="channel-prefix">
          {channel.type === "VOICE" ? "🔊" : "#"}
        </span>
        <span className="channel-name">{channel.name}</span>
      </div>

      {/* ✅ 보이스 채널 + 유저 있을 때만 */}
      {channel.type === "VOICE" && voiceUsers.length > 0 && (
        <div className="voice-user-list">
          {voiceUsers.map(user => (
            <VoiceUserItem key={user.userId} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelItem;
