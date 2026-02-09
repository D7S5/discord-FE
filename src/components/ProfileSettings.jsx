import React from "react";
import UserProfile from "../components/UserProfile";
import "../styles/ProfileSettings.css";

export default function ProfileSettings() {
  const user = JSON.parse(localStorage.getItem("user"));
  

  return (
    <div className="profile-settings">
      <h2>내 계정</h2>
      <UserProfile user={user} />
    </div>
  );
}
