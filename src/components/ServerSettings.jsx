import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../styles/ServerSettings.css";

export default function ServerSettings() {
  const { serverId } = useParams();
  const fileRef = useRef(null);

  const [server, setServer] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadServer();
  }, []);

  const loadServer = async () => {
    try {
      const res = await api.get(`/channels/${serverId}`);
      setServer(res.data);
      setPreview(res.data.iconUrl);
  } catch (e) {
    console.error("[loadServer] error", e.response?.status, e.response?.data);
  }
  };

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const saveIcon = async () => {
  if (!file) return;
  const formData = new FormData();
  formData.append("icon", file);

  try {
    const res = await api.put(
      `/channels/${serverId}/icon`,
      formData,
      // { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("[saveIcon] success =", res.data);

    alert("서버 아이콘이 변경되었습니다");
    loadServer();
    setFile(null);
  } catch (e) {
    console.error("[saveIcon] ERROR");
    console.error("status =", e.response?.status);
    console.error("data =", e.response?.data);
    console.error("headers =", e.config?.headers);
  }
};

  const deleteIcon = async () => {
    if (!window.confirm("서버 아이콘을 삭제할까요?")) return;

    await api.delete(`/channels/${serverId}/icon`);
    alert("서버 아이콘이 삭제되었습니다");
    loadServer();
    setFile(null);
  };

  if (!server) return null;

  return (
    <div className="server-settings">
      <h2>서버 설정</h2>

      {/* ===== 아이콘 설정 ===== */}
      <section className="icon-section">
        <h3>서버 아이콘</h3>

        <div className="icon-row">
          <div
            className="icon-preview"
            onClick={() => fileRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="server icon" />
            ) : (
              <span>{server.name?.[0]}</span>
            )}
          </div>

          <div className="icon-actions">
            <button onClick={() => fileRef.current.click()}>
              아이콘 변경
            </button>

            {server.iconUrl && (
              <button className="danger" onClick={deleteIcon}>
                아이콘 삭제
              </button>
            )}

            {file && (
              <button className="primary" onClick={saveIcon}>
                저장
              </button>
            )}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileRef}
          onChange={onFileChange}
        />
      </section>
    </div>
  );
}
