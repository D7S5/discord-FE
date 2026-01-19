import React, { useState } from "react";
import "../styles/CreateChannelModal.css";
import api from "../api";

export default function CreateChannelModal({
  serverId,
  onClose,
  onCreated
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("TEXT");

  const createChannel = async () => {
    if (!name.trim()) return;

    await api.post(`/channels/${serverId}/channels`, {
      name,
      type
    });

    onCreated(); // ✅ 채널 목록 reload
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>채널 만들기</h2>

        <label>채널 타입</label>
        <div className="channel-type">
          <button
            className={type === "TEXT" ? "active" : ""}
            onClick={() => setType("TEXT")}
          >
            💬 텍스트
          </button>
          <button
            className={type === "VOICE" ? "active" : ""}
            onClick={() => setType("VOICE")}
          >
            🔊 음성
          </button>
        </div>

        <label>채널 이름</label>
        <input
          placeholder="새 채널"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>취소</button>
          <button className="create" onClick={createChannel}>생성</button>
        </div>
      </div>
    </div>
  );
}
