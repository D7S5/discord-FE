import React from "react";
import { useVoiceRoom } from "../components/useVoiceRoom";
import VoiceControls from "../components/VoiceControls";
import "../styles/Voice.css";

export default function VoiceChannelPage({ roomId }) {
  const { joinRoom, leaveRoom, joined } = useVoiceRoom(roomId);

  return (
    <div className="voice-channel">
      <h2>🔊 Voice Channel</h2>

      {!joined ? (
        <button className="join-btn" onClick={joinRoom}>
          Join Voice
        </button>
      ) : (
        <VoiceControls onLeave={leaveRoom} />
      )}
    </div>
  );
}
