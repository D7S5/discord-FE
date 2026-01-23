// components/DmChatView.jsx
import { useEffect, useState } from "react";
import { getClient } from "../websocket";

export default function DmChatView({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const client = getClient();

    if (!client) return;    
        client.subscribe(
        `/topic/dm.${roomId}`,
        msg => setMessages(m => [...m, JSON.parse(msg.body)])
        );

    return () => client.unsubscribe();
  }, [roomId]);

  return (
    <div className="dm-chat">
      {messages.map(m => (
        <div key={m.id} className="msg">
          <b>{m.senderName}</b>: {m.content}
        </div>
      ))}
    </div>
  );
}
