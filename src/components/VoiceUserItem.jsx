export default function VoiceUserItem({ user }) {
  return (
    <div className="voice-user">
      <span className="avatar" />
      <span>{user.name}</span>
      <span className={user.speaking ? "speaking" : ""}>🎤</span>
    </div>
  );
}
