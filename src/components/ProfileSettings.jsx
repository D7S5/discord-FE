import React from "react";
import UserProfile from "../components/UserProfile";
import "../styles/ProfileSettings.css";

export default function ProfileSettings() {
  const userId = localStorage.getItem("userId");
  
  return (
    <div className="profile-settings">
      <h2>내 계정</h2>
      <UserProfile userId={userId} />
    </div>
  );
}
