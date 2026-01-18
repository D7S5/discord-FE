import React, { useEffect, useState, useRef } from "react";
import {
  connectWebSocket,
  subscribeChannel,
  sendSocketMessage
} from "../websocket";
import "../styles/ChannelPage.css";
import api from "../api";

export default function ChannelPage({ channel }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const subscriptionRef = useRef(null);

  /* ✅ 1. 채널 변경 시 과거 메시지 로딩 */
  useEffect(() => {
    if (!channel) return;
    api.get(`/channels/${channel.id}/messages`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("메시지 불러오기 실패", err);
      });
  }, [channel]);
  /* ✅ 2. WebSocket 연결 + 구독 */
  useEffect(() => {
    if (!channel) return;

    connectWebSocket(() => {
      subscriptionRef.current = subscribeChannel(channel.id, (msg) => {
        setMessages(prev => [...prev, msg]);
      });
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [channel]);

  /* ✅ 3. 자동 스크롤 */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ✅ 4. 메시지 전송 */
  const sendMessage = () => {
    if (!input.trim()) return;

    sendSocketMessage(channel.id, input);
    setInput("");
  };

  if (!channel) {
    return <div className="empty-channel"></div>;
  }

  return (
    <div className="channel-page">
      {/* 채널 헤더 */}
      <div className="channel-header">
        <span># {channel.name}</span>
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
