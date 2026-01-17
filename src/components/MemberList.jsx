import "./MemberList.css";

export default function MemberList({ members }) {
  return (
    <aside className="member-list">
      <div className="member-group">
        <div className="member-group-title">
          온라인 — {members.filter(m => m.online).length}
        </div>

        {members
          .filter(m => m.online)
          .map(m => (
            <MemberItem key={m.id} member={m} />
          ))}
      </div>

      <div className="member-group">
        <div className="member-group-title">
          오프라인 — {members.filter(m => !m.online).length}
        </div>

        {members
          .filter(m => !m.online)
          .map(m => (
            <MemberItem key={m.id} member={m} offline />
          ))}
      </div>
    </aside>
  );
}

function MemberItem({ member, offline }) {
  return (
    <div className={`member-item ${offline ? "offline" : ""}`}>
      <div className="avatar">
        {member.username[0]}
        <span className={`status ${member.online ? "online" : "offline"}`} />
      </div>

      <span className="username">{member.username}</span>
    </div>
  );
}
