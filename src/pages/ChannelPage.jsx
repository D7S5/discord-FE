import React, { useEffect, useState, useRef } from "react";
import {
  connectWebSocket,
  subscribeChannel,
  sendSocketMessage
} from "../websocket";
import "../styles/ChannelPage.css";

export default function ChannelPage({ channelId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const subscriptionRef = useRef(null);

  /* ✅ 1. 채널 변경 시 과거 메시지 로딩 */
  useEffect(() => {
    if (!channelId) return;

    fetch(`/api/channels/${channelId}/messages`)
      .then(res => res.json())
      .then(setMessages);
  }, [channelId]);

  /* ✅ 2. WebSocket 연결 + 구독 */
  useEffect(() => {
    if (!channelId) return;

    connectWebSocket(() => {
      subscriptionRef.current = subscribeChannel(channelId, (msg) => {
        setMessages(prev => [...prev, msg]);
      });
    });

    console.log("channelId prop:", channelId);

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [channelId]);

  /* ✅ 3. 자동 스크롤 */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ✅ 4. 메시지 전송 */
  const sendMessage = () => {
    if (!input.trim()) return;

    sendSocketMessage(channelId, input);
    setInput("");
  };

  if (!channelId) {
    return <div className="empty-channel"></div>;
  }

  return (
    <div className="channel-page">
      {/* 채널 헤더 */}
      <div className="channel-header">
        <span># Channel {channelId}</span>
      </div>

      {/* 메시지 리스트 */}
      <div className="message-list">
        {messages.map(msg => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="message-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요"
        />
      </div>
    </div>
  );
}

function MessageItem({ message }) {
  return (
    <div className="message-item">
      <span className="author">{message.sender}</span>
      <span className="content">{message.content}</span>
    </div>
  );
}
