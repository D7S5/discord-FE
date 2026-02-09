import React from "react";
import "../styles/Profile.css";

export default function ProfileAvatar({ imageUrl, onClick }) {
  return (
    <img
      src={
        imageUrl
          ? `http://localhost:8080${imageUrl}`
          : "/default-avatar.png"
      }
      alt="profile"
      className="profile-avatar"
      onClick={onClick}
    />
  );
}
