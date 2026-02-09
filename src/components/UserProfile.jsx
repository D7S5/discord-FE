import React, { useEffect, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileImageModal from "./ProfileImageModal";
import api from "../api";

export default function UserProfile({ userId }) {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    api.get(`/users/${userId}`)
      .then(res => {
        setProfileImage(res.data.iconUrl);
      })
      .catch(err => console.error("유저 정보 불러오기 실패", err));
  }, [userId]);

  return (
    <>
      <ProfileAvatar
        imageUrl={profileImage}
        onClick={() => setOpen(true)}
      />

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
