import { useState } from "react";
import api from "../api";
import "../styles/CreateServerModal.css";
import { useNavigate } from "react-router-dom";

export default function CreateServerModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("서버 이름을 입력하세요");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/channels", { name });
      onCreated(res.data);
      onClose();
      
      const serverId = res.data.id;

      // 생성 직후 해당 서버로 이동
      navigate(`/channels/${serverId}`);
    } catch (e) {
      alert("서버 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 className="modal-title">서버 만들기</h3>

        <input
          className="server-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="서버 이름"
        />

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            취소
          </button>
          <button
            className="btn create"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "생성 중..." : "생성"}
          </button>
        </div>
      </div>
    </div>
  );
}
