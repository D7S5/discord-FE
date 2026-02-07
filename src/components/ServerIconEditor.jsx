import { useRef, useState } from "react";
import api from "../api";
import "../styles/ServerIconEditor.css";

export default function ServerIconEditor({ server, isOwner, onUpdated }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOwner) return null;

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  const saveIcon = async () => {
    if (!fileInputRef.current.files[0]) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    await api.post(`/servers/${server.id}/icon`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setPreview(null);
    setLoading(false);
    onUpdated();
  };

  const deleteIcon = async () => {
    if (!window.confirm("서버 아이콘을 삭제할까요?")) return;

    await api.delete(`/servers/${server.id}/icon`);
    onUpdated();
  };

  return (
    <div className="server-icon-editor">
      <div className="icon-preview" onClick={openFilePicker}>
        <img
          src={
            preview ||
            (server.iconUrl
              ? `http://localhost:8080${server.iconUrl}`
              : "/default-server.png")
          }
          alt="server icon"
        />
        <div className="overlay">변경</div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onFileChange}
      />

      <div className="actions">
        <button
          className="primary"
          disabled={!preview || loading}
          onClick={saveIcon}
        >
          저장
        </button>

        {server.iconUrl && (
          <button className="danger" onClick={deleteIcon}>
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
