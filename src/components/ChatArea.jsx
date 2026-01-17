import { useEffect, useState } from "react";
import {
  connectWebSocket,
  subscribeChannel,
  sendMessage,
} from "../websocket";
import api from "../api/api";

export default function ChatArea({ channelId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!channelId) return;

    // 히스토리 로딩
    api.get(`/channels/${channelId}/messages`)
    .then(res => setMessages(res.data));


    connectWebSocket();
    subscribeChannel(channelId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, [channelId]);

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage({
      channelId,
      senderId: user.id,
      senderName: user.username,
      content: input,
    });

    setInput("");
  };

  return (
    <>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className="message">
            <strong>{m.senderName}</strong> {m.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="메시지 보내기"
        />
      </div>
    </>
  );
}
