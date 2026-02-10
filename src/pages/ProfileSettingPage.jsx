import UserProfile from "../components/UserProfile";
import "../styles/ProfileSettings.css";

export default function ProfileSettingsPage() {
  const userId = JSON.parse(localStorage.getItem("userId"));

  return (
    <div className="profile-settings-layout">
      {/* Sidebar */}
      <aside className="settings-sidebar">
        <div className="sidebar-title">사용자 설정</div>
        <div className="sidebar-item active">프로필</div>
        <div className="sidebar-item">개인정보</div>
        <div className="sidebar-item">알림</div>
      </aside>

      {/* Content */}
      <main className="profile-settings-content">
        <UserProfile userId={userId} />
      </main>
    </div>
  );
}
