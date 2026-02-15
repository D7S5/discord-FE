import "../../styles/VoiceControls.css";

export default function VoiceControls({
  muted,
  onToggleMute,
  onLeave
}) {
  return (
    <div className="voice-controls">

      {/* 🎤 Mute 버튼 */}
      <button
        className={`mute-btn ${muted ? "active" : ""}`}
        onClick={onToggleMute}
      >
        {muted ? "음소거 해제" : "🎤 음소거"}
      </button>

      {/* 🚪 나가기 */}
      <button
        className="leave-btn"
        onClick={onLeave}
      >
        나가기
      </button>

    </div>
  );
}
