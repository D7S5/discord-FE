import React from "react";

const MessageItem = ({ message }) => {
  const myUserId = localStorage.getItem("userId");

  const isMine = String(message.senderId) === myUserId;

  return (
    <div className={`message-item ${isMine ? "mine" : ""}`}>
      <div className="message-author">{message.senderName}</div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

export default MessageItem;
