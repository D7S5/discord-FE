import { useEffect, useState } from "react";
import api from "../api";
import "../styles/FriendsViews.css";

export default function FriendsViews({ onOpenDm }) {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const load = async () => {
    const reqRes = await api.get("/friends/requests");
    setRequests(reqRes.data);

    const friendRes = await api.get("/friends"); // ACCEPTED 목록
    setFriends(friendRes.data);
  };

  const openDm = async (friendId) => {
    const res = await api.post(`/dm/open/${friendId}`);
    onOpenDm(res.data); // roomId
  };

  useEffect(() => {
    load();
  }, []);

  const accept = async (id) => {
    await api.post(`/friends/${id}/accept`);
    load();
  };

  return (
    <div className="friends-view">
      {/* ===== 친구 요청 ===== */}
      <h3>Friend Requests</h3>

      {requests.length === 0 && (
        <p className="empty">No pending requests</p>
      )}

      {requests.map((r) => (
        <div key={r.friendshipId} className="friend-row">
          <span>{r.username}</span>
          <button onClick={() => accept(r.friendshipId)}>
            Accept
          </button>
        </div>
      ))}

      {/* ===== 친구 목록 ===== */}
      <h3>Friends</h3>
      {friends.map((f) => (
        <div
          key={f.userId}
          className="friend-row clickable"
          onClick={() => openDm(f.userId)}
        >
          {f.username}
        </div>
      ))}
    </div>
  );
}
