import { useVoiceRoom } from "../useVoiceRoom";
import VoiceUserList from "./VoiceUserList";
import VoiceControls from "./VoiceControls";
import "../../styles/VoicePannel.css";

export default function VoiceChannel({ channel, onLeave }) {
  const {
    joinRoom,
    leaveRoom,
    joined,
    users,
    muted,
    toggleMute,
  } = useVoiceRoom(channel.id);

  const handleLeave = () => {
    leaveRoom();
    onLeave?.();
  };

  return (
    <div className="voice-panel">
      <div className="voice-panel-header">
        <div className="voice-channel-name">{channel.name}</div>
        <button className="voice-leave-btn" onClick={handleLeave}>✕</button>
      </div>

      <VoiceUserList users={users} />

      <div className="voice-panel-controls">
        {!joined ? (
          <button className="voice-join-btn" onClick={joinRoom}>
            음성 참여
          </button>
        ) : (
          <VoiceControls
            muted={muted}
            onToggleMute={toggleMute}
            onLeave={handleLeave}
          />
        )}
      </div>
    </div>
  );
}
