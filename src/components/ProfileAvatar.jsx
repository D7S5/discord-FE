import React, { useMemo, useState } from "react";
import "../styles/Profile.css";

export default function ProfileAvatar({ imageUrl, username, onClick }) {
  const [imgError, setImgError] = useState(false);

  const initial = useMemo(() => {
    return (username?.trim()?.[0] || "?").toUpperCase();
  }, [username]);

  const hasValidImage =
    !!imageUrl &&
    imageUrl !== "null" &&
    imageUrl !== "undefined" &&
    imageUrl.trim() !== "";

  const src = hasValidImage
    ? imageUrl.startsWith("http")
      ? imageUrl
      : imageUrl.startsWith("/default-avatar")
        ? imageUrl
        : `http://localhost:8080${imageUrl}`
    : "/default-avatar.png";

  const showImage = !!src && !imgError;

  return showImage ? (
    <img
      src={src}
      alt="profile"
      className="profile-avatar"
      onClick={onClick}
      onError={() => setImgError(true)}
    />
  ) : (
    <div
      className="profile-avatar profile-avatar-fallback"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(e);
      }}
      title="프로필 사진 변경"
    >
      {initial}
    </div>
  );
}