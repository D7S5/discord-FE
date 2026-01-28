import { useVoiceRoom } from "../useVoiceRoom";
import VoiceUserList from "./VoiceUserList";
import VoiceControls from "./VoiceControls";

export default function VoiceChannel({ channel }) {
  const {
    joinRoom,
    leaveRoom,
    joined,
    users
  } = useVoiceRoom(channel.id);

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
        <VoiceControls onLeave={leaveRoom} />
      )}
    </div>
  );
}
