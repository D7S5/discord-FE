import React from "react";
import VoiceUserItem from "./VoiceUserItem";
import "../../styles/VoiceUserList.css";

export default function VoiceUserList({ users }) {
  return (
    <div className="voice-user-list">
      {users.map(user => (
        <VoiceUserItem key={user.userId} user={user} />
      ))}
    </div>
  );
}
