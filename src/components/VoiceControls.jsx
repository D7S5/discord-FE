export default function VoiceControls({ onLeave }) {
  return (
    <div className="voice-controls">
      <button className="leave-btn" onClick={onLeave}>
        Leave
      </button>
      <button disabled>🎤 Mic ON</button>
      <button disabled>🎧 Headset</button>
    </div>
  );
}
