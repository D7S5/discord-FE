import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSend(content);
    setContent("");
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="메시지 보내기"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
};

export default MessageInput;
