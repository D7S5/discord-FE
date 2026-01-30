import "./MemberList.css";

const ROLE_ORDER = ["OWNER", "ADMIN", "MEMBER"];
const ROLE_LABEL = {
  OWNER: "👑 OWNER",
  ADMIN: "🛡 ADMIN",
  MEMBER: "👤 MEMBER",
};

export default function MemberList({ members = [] }) {
  const onlineMembers = members.filter(m => m.online);
  const offlineMembers = members.filter(m => !m.online);

  return (
    <aside className="member-list">
      {/* 온라인 */}
      <MemberSection
        title={`온라인 — ${onlineMembers.length}`}
        members={onlineMembers}
      />

      {/* 오프라인 */}
      <MemberSection
        title={`오프라인 — ${offlineMembers.length}`}
        members={offlineMembers}
        offline
      />
    </aside>
  );
}

/* ===================== */
/* Section by Role       */
/* ===================== */

function MemberSection({ title, members, offline }) {
  const grouped = ROLE_ORDER.reduce((acc, role) => {
    acc[role] = members.filter(m => m.role === role);
    return acc;
    }, {});

  return (
    <div className="member-group">
      <div className="member-group-title">{title}</div>

      {ROLE_ORDER.map(role =>
        grouped[role].length > 0 ? (
          <div key={role} className="member-role-group">
            <div className="member-role-title">
              {ROLE_LABEL[role]} — {grouped[role].length}
            </div>

            {grouped[role].map(member => (
              <MemberItem
                key={member.userId}
                member={member}
                offline={offline}
              />
            ))}
          </div>
        ) : null
      )}
    </div>
  );
}

/* ===================== */
/* Member Item           */
/* ===================== */

function MemberItem({ member, offline }) {
  return (
    <div className={`member-item ${offline ? "offline" : ""}`}>
      <div className="avatar">
        {member.username[0]}
        <span className={`status ${member.online ? "online" : "offline"}`} />
      </div>

      {/* ⭐ role class 추가 */}
      <span className={`username role-${member.role.toLowerCase()}`}>
        {member.username}
      </span>
    </div>
  );
}

