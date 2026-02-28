import "../styles/MemberList.css";
import api from "../api";
import { useState } from "react";

/* ===================== */
/* Role Config           */
/* ===================== */

const ROLE_ORDER = ["OWNER", "ADMIN", "MEMBER"];
const ROLE_LABEL = {
  OWNER: "👑 OWNER",
  ADMIN: "🛡 ADMIN",
  MEMBER: "👤 MEMBER",
};

export default function MemberList({
  members = [],
  myRole,
  serverId,
  refetchMembers,
}) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const toggleAdmin = async (userId) => {
    await api.patch(
      `/servers/${serverId}/members/${userId}/role/toggle`
    );
    setSelectedUserId(null);
    refetchMembers();
  };

  const onlineMembers = members.filter((m) => m.online);
  const offlineMembers = members.filter((m) => !m.online);

  return (
    <aside className="member-list">
      <MemberSection
        title={`온라인 — ${onlineMembers.length}`}
        members={onlineMembers}
        myRole={myRole}
        selectedUserId={selectedUserId}
        onSelect={setSelectedUserId}
        onToggleAdmin={toggleAdmin}
      />

      <MemberSection
        title={`오프라인 — ${offlineMembers.length}`}
        members={offlineMembers}
        offline
        myRole={myRole}
        selectedUserId={selectedUserId}
        onSelect={setSelectedUserId}
        onToggleAdmin={toggleAdmin}
      />
    </aside>
  );
}

/* ===================== */
/* Section by Role       */
/* ===================== */

function MemberSection({
  title,
  members,
  offline,
  myRole,
  selectedUserId,
  onSelect,
  onToggleAdmin,
}) {
  const grouped = ROLE_ORDER.reduce((acc, role) => {
    acc[role] = members.filter((m) => m.role === role);
    return acc;
  }, {});

  return (
    <div className="member-group">
      <div className="member-group-title">{title}</div>

      {ROLE_ORDER.map(
        (role) =>
          grouped[role].length > 0 && (
            <div key={role} className="member-role-group">
              <div className="member-role-title">
                {ROLE_LABEL[role]} — {grouped[role].length}
              </div>

              {grouped[role].map((member) => (
                <MemberItem
                  key={member.userId}
                  member={member}
                  offline={offline}
                  myRole={myRole}
                  selected={selectedUserId === member.userId}
                  onClick={() =>
                    onSelect(
                      selectedUserId === member.userId
                        ? null
                        : member.userId
                    )
                  }
                  onToggleAdmin={onToggleAdmin}
                />
              ))}
            </div>
          )
      )}
    </div>
  );
}

/* ===================== */
/* Member Item           */
/* ===================== */

function MemberItem({
  member,
  offline,
  myRole,
  selected,
  onClick,
  onToggleAdmin,
}) {
  const isOwner = myRole === "OWNER";
  const isMember = member.role === "MEMBER";
  const isAdmin = member.role === "ADMIN";

  const avatarUrl = member.iconUrl
  ? member.iconUrl.startsWith("http")
    ? member.iconUrl
    : `http://localhost:8080${member.iconUrl}`
  : null;

  return (
    <div
      className={`member-item ${offline ? "offline" : ""} ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="avatar">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="avatar-img"
            draggable={false}
          />
        ) : (
          <span className="avatar-fallback">
            {member.username?.[0] ?? "?"}
          </span>
        )}

        <span className={`status ${offline ? "offline" : "online"}`} />
      </div>

      <span className={`username role-${member.role.toLowerCase()}`}>
        {member.username}
      </span>

      {/* OWNER 전용 버튼 */}
      {selected && isOwner && isMember && (
        <button
          className="member-action admin-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAdmin(member.userId);
          }}
        >
          🛡 관리자 부여
        </button>
      )}

      {selected && isOwner && isAdmin && (
        <button
          className="member-action revoke-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAdmin(member.userId);
          }}
        >
          ❌ 관리자 회수
        </button>
      )}
    </div>
  );
}
