import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/Profile.css";

export default function ProfileImageModal({
  currentImage,
  onClose,
  onUploaded
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 미리보기
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // ESC 닫기
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/me/avatar", formData);
      onUploaded(res.data.iconUrl);
      onClose();
    } catch (e) {
      console.error(e);
      alert("프로필 이미지 업로드 실패");
    }
  };

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div
        className="profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>프로필 사진 변경</h3>

        <img
          className="profile-modal-avatar"
          src={
            preview
              ? preview
              : currentImage
              ? `http://localhost:8080${currentImage}`
              : "/default-avatar.png"
          }
          alt="preview"
        />

        <label className="profile-upload-btn">
          이미지 선택
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          className="profile-save-btn"
          disabled={!file}
          onClick={upload}
        >
          저장
        </button>
      </div>
    </div>
  );
}
