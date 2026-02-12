import React, { useEffect, useState } from "react";
import api from "../api";

export default function VoiceRoomList({ onJoin }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/voice/rooms").then(res => setRooms(res.data));
  }, []);

  return (
    <div>
      {rooms.map(r => (
        <div key={r.roomId}>
          {r.name} <button onClick={() => onJoin(r.roomId)}>Join</button>
        </div>
      ))}
    </div>
  );
}
