import FriendsViews from "../components/FriendsViews";
import "../styles/MePage.css";

export default function MePage({ onOpenDm }) {
  return (
    <div className="me-layout">
      {/* 왼쪽 @me 전용 사이드바 */}
      <aside className="dm-sidebar">
        <div className="dm-search">대화 찾기 또는 시작하기</div>

        <nav className="dm-nav">
          <button className="dm-nav-item active">👥 친구</button>
          <button className="dm-nav-item">🎮 Nitro</button>
          <button className="dm-nav-item">🛍️ 상점</button>
          <button className="dm-nav-item">✅ 퀘스트</button>
        </nav>

        <div className="dm-section-header">
          <span>다이렉트 메시지</span>
          <button className="dm-add-btn">＋</button>
        </div>

        <div className="dm-list">
          {/* 나중에 DM 목록 map */}
          <div className="dm-item skeleton" />
          <div className="dm-item skeleton" />
          <div className="dm-item skeleton" />
        </div>

        <div className="me-user-panel">
          <div className="me-user-avatar">A</div>
          <div className="me-user-meta">
            <div className="name">Austin</div>
            <div className="status">온라인</div>
          </div>
          <div className="me-user-actions">
            <button>🎤</button>
            <button>🎧</button>
            <button>⚙</button>
          </div>
        </div>
      </aside>

      {/* 중앙 메인 */}
      <section className="me-main">
        <header className="friends-topbar">
          <div className="friends-topbar-left">
            <span className="friends-title">👥 친구</span>
            <div className="friends-tabs">
              <button className="tab active">온라인</button>
              <button className="tab">모두</button>
              <button className="tab">대기 중</button>
              <button className="tab">차단 목록</button>
              <button className="tab add-friend">친구 추가하기</button>
            </div>
          </div>
        </header>

        <div className="friends-main-content">
          <FriendsViews onOpenDm={onOpenDm} />
        </div>
      </section>

      {/* 오른쪽 패널 */}
      <aside className="friends-right-panel">
        <h3>현재 활동 중</h3>
        <div className="activity-card">
          <p className="activity-title">지금은 조용하네요...</p>
          <p className="activity-desc">
            친구가 게임이나 음성 채팅과 같은 활동을 시작하면 여기에 표시돼요!
          </p>
        </div>
      </aside>
    </div>
  );
}