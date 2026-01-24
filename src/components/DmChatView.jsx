import { useEffect, useState } from "react";
import api from "../api";
import "../styles/DmChatView.css";

export default function DmChatView({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    api.get(`/messages/dm/${roomId}`).then((res) => {
      setMessages(res.data);
    });
  }, [roomId]);

  const send = async () => {
    await api.post(`/messages/dm/${roomId}`, { content: text });
    setText("");
  };

  return (
    <div className="dm-chat">
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
    </div>
  );
}
