import React, { useEffect, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileImageModal from "./ProfileImageModal";
import api from "../api";
import "../styles/ProfileSettings.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserProfile({ }) {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get(`/users/me`)
      .then((res) => {
        console.log(res);
        setProfileImage(res.data.iconUrl);
        setUsername(res.data.username);
        setStatus(res.data.statusMessage ?? "");
      })
      .catch((err) =>
        console.error("유저 정보 불러오기 실패", err)
      );
  }, []);

  const saveProfile = async () => {
    try {
      await api.patch(`/users/me/profile`, {
        username,
        status,
      });      
      alert("프로필 저장 완료");
      
    navigate(-1);
    } catch (e) {
      alert("프로필 저장 실패");
    }
  };

  const imageSrc = profileImage
    ? profileImage.startsWith("http")
    ? profileImage
    : `http://localhost:8080${profileImage}`
    : "/default-avatar.png";

  return (
    <>
      <div className="profile-editor-layout">
        <div className="profile-editor-form">
          <div className="avatar-edit-row">
            <ProfileAvatar
              imageUrl={profileImage}
              onClick={() => setOpen(true)}
            />
            <span className="avatar-edit-text">
              프로필 사진을 클릭하여 변경
            </span>
          </div>

          <label>별명</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>상태 메시지</label>
          <input
            placeholder="상태를 입력하세요"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <button className="save-btn" onClick={saveProfile}>
            변경사항 저장
          </button>
        </div>

        {/* ===== 오른쪽 미리보기 ===== */}
        <div className="profile-preview">
          <div className="preview-card">
            <img
              src={imageSrc
              }
              className="preview-avatar"
            />
            <div className="preview-name">{username}</div>
            {status && (
              <div className="preview-status">{status}</div>
            )}
          </div>
        </div>
      </div>

      {/* ===== 이미지 변경 모달 ===== */}
      {open && (
        <ProfileImageModal
          currentImage={profileImage}
          onClose={() => setOpen(false)}
          onUploaded={setProfileImage}
        />
      )}
    </>
  );
}
