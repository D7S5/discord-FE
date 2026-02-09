import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  connectWebSocket,
  safePublish
} from "../websocket";
import "../styles/ChannelPage.css";
import api from "../api";

export default function ChannelPage({ channel }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef(null);
  const subscriptionRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 메시지 불러오기
  useEffect(() => {
    if (!channel) return;
    api.get(`/channels/${channel.id}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("메시지 불러오기 실패", err));
  }, [channel]);

  // WebSocket 구독
  useEffect(() => {
    if (!channel) return;

    connectWebSocket((client) => {
      subscriptionRef.current?.unsubscribe();

      subscriptionRef.current = client.subscribe(
        `/topic/channels/${channel.id}`,
        (msg) => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        }
      );
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [channel]);

  // 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ESC 키로 이미지 모달 닫기
  useEffect(() => {
    if (!previewImage) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage]);

  // 텍스트 전송
  const sendText = () => {
    if (!content.trim() || !channel) return;

    safePublish(
      `/app/channels/${channel.id}/messages`,
      {
        type: "TEXT",
        content
      }
    );

    setContent("");
  };

  // 이미지 업로드
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/chat/image", formData);

      safePublish(
        `/app/channels/${channel.id}/messages`,
        {
          type: "IMAGE",
          content: res.data.imageUrl
        }
      );
    } catch (e) {
      console.error("이미지 업로드 실패", e);
      alert("이미지 업로드 실패");
    }
  };

  // 붙여넣기 처리
  const handlePaste = (e) => {
    const items = e.clipboardData.items;

    for (let item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        uploadImage(item.getAsFile());
        e.preventDefault();
      }
    }
  };

  if (!channel) {
    return <div className="empty-channel"></div>;
  }

  return (
    <div className="channel-page">
      <div className="channel-header">
        <span># {channel.name}</span>
      </div>

      <div className="message-list">
        {messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            onImageClick={setPreviewImage}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="message-input">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendText();
            }
          }}
          onPaste={handlePaste}
          placeholder="메시지를 입력하세요"
        />
      </div>

      {previewImage && (
        <div
          className="image-modal"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="image-modal-content"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

/* ================= MessageItem ================= */

function MessageItem({ message, onImageClick }) {
  const navigate = useNavigate();

  const myUserId = localStorage.getItem("userId");
  const isMe = String(message.senderId) === String(myUserId);

  const goProfileSettings = () => {
  console.log("🔥 avatar click", {
    senderId: message.senderId,
    myUserId,
  });

  if (isMe) {
    navigate("/settings/profile");
  }
};


  const isImage = message.content?.startsWith("/images/chat");
  const imageUrl = isImage
    ? `http://localhost:8080${message.content}`
    : null;

  return (
    <div className="message-item">
      <div
        className={`message-avatar ${isMe ? "clickable" : ""}`}
        onClick={goProfileSettings}
      >
        {message.senderName?.[0] ?? "?"}
      </div>
      <div className="message-body">
        <div className="message-meta">
          <span
            className={`message-author ${isMe ? "clickable" : ""}`}
            onClick={goProfileSettings}
          >
            {message.senderName}
          </span>

          <span className="message-time">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>

        <div className="message-content">
          {isImage ? (
            <img
              src={imageUrl}
              className="chat-image"
              onClick={() => onImageClick?.(imageUrl)}
            />
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}
