import VoiceControls from "../VoiceControls";
import VoiceUserList from "./VoiceUserList";
import { useVoiceRoom } from "../useVoiceRoom";

export default function VoicePanel({ channel }) {
  const {
    joined,
    joinRoom,
    leaveRoom,
    users,
    muted,
  } = useVoiceRoom(channel?.id);

  if (!channel || channel.type !== "VOICE") return null;

  return (
    <div className="voice-panel">
      <div className="voice-header">
        🔊 {channel.name}
      </div>

      <VoiceUserList users={users} />

      {!joined ? (
        <button className="join-btn" onClick={joinRoom}>
          음성 참여
        </button>
      ) : (
        <VoiceControls onLeave={leaveRoom} muted={muted} />
      )}
    </div>
  );
}
