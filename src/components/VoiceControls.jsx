import React from "react";
import "../styles/VoiceControls.css";

export default function VoiceControls({ muted, onToggleMute, onLeave }) {
  return (
    <div className="voice-controls">
      <button className={`control-btn ${muted ? "active" : ""}`} onClick={onToggleMute}>
        {muted ? "🔇" : "🎤"}
      </button>
      <button className="control-btn leave" onClick={onLeave}>
        🚪 Leave
      </button>
    </div>
  );
}