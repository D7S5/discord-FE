import VoiceUserItem from "../VoiceUserItem";

export default function VoiceUserList({ users = [] }) {
  if (!users.length) {
    return (
      <div className="voice-users empty">
        접속 중인 유저 없음
      </div>
    );
  }

  return (
    <div className="voice-users">
      {users.map(user => (
        <VoiceUserItem key={user.userId} user={user} />
      ))}
    </div>
  );
}
