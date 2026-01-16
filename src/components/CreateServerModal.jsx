import { useState } from "react";
import api from "../api/api";
import "../styles/CreateServerModal.css";

export default function CreateServerModal({ onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.post("/servers", { name });
      onClose();
      window.location.reload();
    } catch {
      alert("서버 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>서버 만들기</h2>
        <p>친구들과 대화할 서버를 생성하세요</p>

        <input
          className="modal-input"
          placeholder="서버 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={handleCreate}
        >
          {loading ? "생성 중..." : "생성"}
        </button>

        <button className="btn btn-link" onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
}
