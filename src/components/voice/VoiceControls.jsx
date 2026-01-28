export default function VoiceControls({ onLeave }) {
  return (
    <div className="voice-controls">
      <button
        className="leave-btn"
        onClick={() => { onLeave();
        }}
      >
        나가기
      </button>
    </div>
  );
}
