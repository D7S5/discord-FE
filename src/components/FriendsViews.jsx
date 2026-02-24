import { useCallback, useEffect, useState } from "react";
import api from "../api";
import "../styles/FriendsViews.css";

export default function FriendsViews({ onOpenDm }) {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [acceptingId, setAcceptingId] = useState(null);
  const [openingDmUserId, setOpeningDmUserId] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    try {
      setError("");

      if (silent) setIsRefreshing(true);
      else setIsLoading(true);

      const [reqRes, friendRes] = await Promise.all([
        api.get("/friends/requests"),
        api.get("/friends"),
      ]);

      setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      setFriends(Array.isArray(friendRes.data) ? friendRes.data : []);
    } catch (err) {
      console.error("친구 목록 로드 실패:", err);
      setError("친구 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setError("");
        setIsLoading(true);

        const [reqRes, friendRes] = await Promise.all([
          api.get("/friends/requests"),
          api.get("/friends"),
        ]);

        if (!mounted) return;

        setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
        setFriends(Array.isArray(friendRes.data) ? friendRes.data : []);
      } catch (err) {
        if (!mounted) return;
        console.error("친구 목록 초기 로드 실패:", err);
        setError("친구 목록을 불러오지 못했습니다.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAccept = async (friendshipId) => {
    if (acceptingId) return;

    try {
      setAcceptingId(friendshipId);
      await api.post(`/friends/${friendshipId}/accept`);

      // 낙관적 업데이트 (요청 목록에서 제거)
      setRequests((prev) =>
        prev.filter((r) => r.friendshipId !== friendshipId)
      );

      // 친구 목록은 서버 기준으로 다시 로드 (silent)
      await load({ silent: true });
    } catch (err) {
      console.error("친구 요청 수락 실패:", err);
      setError("친구 요청 수락에 실패했습니다.");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleOpenDm = async (friendId) => {
    if (openingDmUserId) return;

    try {
      setOpeningDmUserId(friendId);
      const res = await api.post(`/dm/open/${friendId}`);
      onOpenDm?.(res.data); // roomId
    } catch (err) {
      console.error("DM 열기 실패:", err);
      setError("DM을 여는 중 오류가 발생했습니다.");
    } finally {
      setOpeningDmUserId(null);
    }
  };

  return (
    <div className="friends-view">
      {/* 상태 메시지 */}
      {error && <p className="error-text">{error}</p>}
      {isLoading && <p className="empty">Loading...</p>}

      {!isLoading && (
        <>
          {/* ===== 친구 요청 ===== */}
          <div className="friends-section-header">
            <h3>Friend Requests</h3>
            {isRefreshing && <span className="mini-loading">Updating...</span>}
          </div>

          {requests.length === 0 ? (
            <p className="empty">No pending requests</p>
          ) : (
            requests.map((r) => {
              const isAccepting = acceptingId === r.friendshipId;

              return (
                <div key={r.friendshipId} className="friend-row">
                  <span>{r.username}</span>
                  <button
                    type="button"
                    onClick={() => handleAccept(r.friendshipId)}
                    disabled={isAccepting}
                  >
                    {isAccepting ? "Accepting..." : "Accept"}
                  </button>
                </div>
              );
            })
          )}

          {/* ===== 친구 목록 ===== */}
          <h3>Friends</h3>

          {friends.length === 0 ? (
            <p className="empty">No friends yet</p>
          ) : (
            friends.map((f) => {
              const isOpening = openingDmUserId === f.userId;

              return (
                <button
                  key={f.userId}
                  type="button"
                  className="friend-row clickable friend-row-button"
                  onClick={() => handleOpenDm(f.userId)}
                  disabled={!!openingDmUserId}
                  title={f.username}
                >
                  <span>{f.username}</span>
                  {isOpening && <span className="mini-loading">Opening...</span>}
                </button>
              );
            })
          )}
        </>
      )}
    </div>
  );
}