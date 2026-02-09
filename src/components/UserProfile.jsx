import React, { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileImageModal from "./ProfileImageModal";

export default function UserProfile({ user }) {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profileImageUrl);

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
