// components/FriendsView.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function FriendsView() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // api.get("/channels/friends").then(res => {
    //   setFriends(res.data);
    // });
  }, []);

  return (
    <div>
      <h2>Friends</h2>
      {friends.map(f => (
        <div key={f.userId} className="friend-item">
          <span>{f.username}</span>
          <span className={`status ${f.status.toLowerCase()}`} />
        </div>
      ))}
    </div>
  );
}
