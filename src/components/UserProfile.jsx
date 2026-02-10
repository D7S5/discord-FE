import React, { useEffect, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileImageModal from "./ProfileImageModal";
import api from "../api";
import "../styles/ProfileSettings.css";

export default function UserProfile({ userId }) {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");

  /* ===== 유저 정보 로드 ===== */
  useEffect(() => {
    api.get(`/users/me`)
      .then((res) => {
        console.log(res);
        setProfileImage(res.data.iconUrl);
        setNickname(res.data.username);
        // setStatus(res.data.statusMessage ?? "");
      })
      .catch((err) =>
        console.error("유저 정보 불러오기 실패", err)
      );
  }, [userId]);

  /* ===== 저장 ===== */
  const saveProfile = async () => {
    try {
      await api.patch(`/me/profile`, {
        nickname,
        status,
      });
      alert("프로필 저장 완료");
    } catch (e) {
      alert("프로필 저장 실패");
    }
  };

  return (
    <>
      <h2>프로필</h2>

      <div className="profile-editor-layout">
        {/* ===== 왼쪽 편집 영역 ===== */}
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
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
              src={
                profileImage
                  ? profileImage.startsWith("http")
                    ? profileImage
                    : `http://localhost:8080${profileImage}`
                  : "/default-avatar.png"
              }
              className="preview-avatar"
            />
            <div className="preview-name">{nickname}</div>
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
