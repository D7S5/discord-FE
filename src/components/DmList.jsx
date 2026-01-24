// components/DmList.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function DmList({ onSelect }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/channels/@me").then(res => {
      setRooms(res.data.dmRooms);
    });
  }, []);

  return (
    <div className="dm-list">
      {rooms.map(room => (
        <div
          key={room.roomId}
          className="dm-item"
          onClick={() => onSelect(room.roomId)}       >
          <span>{room.username}</span>
          {room.unreadCount > 0 && (
            <span className="badge">{room.unreadCount}</span>
          )}
        </div>
      ))}
    </div>
  );
}
