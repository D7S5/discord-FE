import { useEffect, useState } from "react";
import api from "../api";
import {
  connectWebSocket,
  getClient,
} from "../websocket";
import "../styles/DmChatView.css";

export default function DmChatView({ roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    let mounted = true;

    let subscription;
    // 기존 메시지 조회
    api.get(`/dm/messages/${roomId}`).then((res) => {
      if (mounted) setMessages(res.data);
    });

      try {
        connectWebSocket((client) => {
          subscription = client.subscribe(`/user/queue/dm`, (msg) => {
            const body = JSON.parse(msg.body);

            if (body.senderId === userId) return;

            setMessages((prev) => [...prev, body]);
          });
        });
      } catch (err) {
        console.error("WS 연결 실패:", err);
      };

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [roomId, userId]);

  /* 2️⃣ 메시지 전송 */
  const sendMessage = () => {
    if (!text.trim()) return;

    const payload = {
      roomId,
      senderId: userId,
      content: text,
      sentAt: Date.now(),
    };

    const client = getClient();

    if (client && client.connected) {
      client.publish({
        destination: "/app/dm.send",
        body: JSON.stringify(payload),
      });

      // ✅ optimistic update
      setMessages((prev) => [
        ...prev,
        {
          ...payload,
          tempId: `temp-${Date.now()}`,
          isRead: true,
        },
      ]);
    } else {
      console.warn("WebSocket 미연결 상태");
    }

    setText("");
  };

  return (
    <div className="dm-chat">
      <div className="messages">
      {messages.map((m) => (
        <div
          key={m.id ?? m.tempId}
          className={`message ${m.senderId === userId ? "me" : ""}`}
        >
          {m.content}
        </div>
      ))}
    </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder="메시지 입력..."
      />
    </div>
  );
}
