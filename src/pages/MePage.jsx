import { useState } from "react";
import DmList from "../components/DmList";
import FriendsViews from "../components/FriendsViews";
import DmChatView from "../components/DmChatView";
import AddFriendModal from "../components/AddFriendModal";
import ServerSidebar from "../components/ServerSidebar";
import "../styles/MePage.css";

export default function MePage() {
  const [view, setView] = useState("friends"); // friends | dm
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenFriends = () => {
    setView("friends");
  };

  const handleOpenDm = (roomId) => {
    setSelectedRoom(roomId);
    setView("dm");
  };

  return (
    <div className="me-layout">
      {/* 1) 서버 사이드바 */}
      <ServerSidebar />

      {/* 2) @me 왼쪽 패널 (DM 사이드바) */}
      <aside className="me-sidebar">
        <div className="me-search">대화 찾기 또는 시작하기</div>

        <div className="friends-header">
          <button
            type="button"
            className={view === "friends" ? "active" : ""}
            onClick={handleOpenFriends}
          >
            Friends
          </button>

          <button
            type="button"
            className="add-friend"
            onClick={() => setOpenAdd(true)}
          >
            Add Friend
          </button>
        </div>

        <div className="dm-list-wrap">
          <DmList onSelect={handleOpenDm} />
        </div>

        {/* 선택: 하단 내 계정 패널 (나중에 사용자 정보 연결) */}
        <div className="me-user-panel">
          <div className="me-user-avatar">나</div>
          <div className="me-user-meta">
            <div className="name">My Account</div>
            <div className="status">온라인</div>
          </div>
          <div className="me-user-actions">
            <button type="button" title="음소거">🎤</button>
            <button type="button" title="헤드셋">🎧</button>
            <button type="button" title="설정">⚙</button>
          </div>
        </div>
      </aside>

      {/* 3) 중앙 메인 */}
      <main className="me-content">
        {/* 친구 화면일 때 상단 탭바 */}
        {view === "friends" && (
          <header className="friends-topbar">
            <div className="friends-topbar-left">
              <span className="friends-title">👥 친구</span>
              <div className="friends-tabs">
                <button type="button" className="tab active">전체</button>
                <button type="button" className="tab">온라인</button>
                <button type="button" className="tab">대기 중</button>
                <button type="button" className="tab">차단 목록</button>
                <button
                  type="button"
                  className="tab add-friend-tab"
                  onClick={() => setOpenAdd(true)}
                >
                  친구 추가하기
                </button>
              </div>
            </div>
          </header>
        )}

        <section className="me-content-body">
          {view === "friends" && (
            <FriendsViews onOpenDm={handleOpenDm} />
          )}

          {view === "dm" && selectedRoom && (
            <DmChatView roomId={selectedRoom} />
          )}

          {view === "dm" && !selectedRoom && (
            <div className="dm-empty">
              <p>DM을 선택해주세요.</p>
            </div>
          )}
        </section>
      </main>

      {view === "friends" && (
        <aside className="friends-right-panel">
          <h3>현재 활동 중</h3>
          <div className="activity-card">
            <p className="activity-title">지금은 조용하네요...</p>
            <p className="activity-desc">
              친구가 게임이나 음성 채팅 같은 활동을 시작하면 여기에 표시돼요!
            </p>
          </div>
        </aside>
      )}

      {openAdd && (
        <AddFriendModal onClose={() => setOpenAdd(false)} />
      )}
    </div>
  );
}