import { useVoiceRoom } from "../useVoiceRoom";
import VoiceUserList from "./VoiceUserList";
import VoiceControls from "./VoiceControls";
import "../../styles/VoicePanel.css";

export default function VoiceChannel({ channel, onLeave }) {
  const {
    joinRoom,
    leaveRoom,
    joined,
    users,
  } = useVoiceRoom(channel.id);

  const handleLeave = () => {
    leaveRoom();
    onLeave?.();
  };

  return (
    <div className="voice-panel">
      {/* 채널 정보 */}
      <div className="voice-panel-header">
        <div className="voice-channel-name">
          🔊 {channel.name}
        </div>
        <button className="voice-leave-btn" onClick={handleLeave}>
          ✕
        </button>
      </div>

      {/* 유저 목록 */}
      <VoiceUserList users={users} />

      {/* 하단 컨트롤 */}
      <div className="voice-panel-controls">
        {!joined ? (
          <button className="voice-join-btn" onClick={joinRoom}>
            음성 참여
          </button>
        ) : (
          <VoiceControls onLeave={handleLeave} />
        )}
      </div>
    </div>
  );
}
