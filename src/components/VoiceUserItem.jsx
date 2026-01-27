import "../styles/VoiceUserItem.css";

export default function VoiceUserItem({ user }) {
  return (
    <div className="voice-user">
      <span className={`status ${user.muted ? "muted" : "online"}`} />
      <span className="name">{user.username}</span>
    </div>
  );
}
