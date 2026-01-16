import React, { useEffect, useState } from "react";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { getMessages, sendMessage } from "../api/messageApi";
import "../styles/ChannelPage.css";

const ChannelPage = ({ channelId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!channelId) return;

    getMessages(channelId).then(setMessages);
  }, [channelId]);

  const handleSend = async (content) => {
    const message = await sendMessage(channelId, content);
    setMessages((prev) => [...prev, message]);
  };

  if (!channelId) {
    return <div className="empty-channel">채널을 선택하세요</div>;
  }

  return (
    <div className="channel-page">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChannelPage;
