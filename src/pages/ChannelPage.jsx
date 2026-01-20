import React, { useEffect, useState, useRef } from "react";
import {
  connectWebSocket,
  getClient
} from "../websocket";
import "../styles/ChannelPage.css";
import api from "../api";

export default function ChannelPage({ channel }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef(null);
  const subscriptionRef = useRef(null);

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

  useEffect(() => {
    if (!channel) return;

    // connectWebSocket(() => {
      const client = getClient();
      if (!client) return;

      subscriptionRef.current?.unsubscribe();

      subscriptionRef.current = client.subscribe(
        `/topic/channels/${channel.id}`,
        (msg) => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        }
      );
    // });
    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    }
  }, [channel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!content.trim() || !channel) return;

    const client = getClient();
    if (!client || !client.connected) {
      console.warn("STOMP not connected");
      return;
    }

    client.publish({
      destination: `/app/channels/${channel.id}/messages`,
      body: JSON.stringify({ content }),
    });

    setContent("");
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
          value={content}
          onChange={e => setContent(e.target.value)}
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
      <span className="author">{message.senderName}</span>
      <span className="content">{message.content}</span>
    </div>
  );
}