import { useNavigate } from "react-router-dom";

function MessageItem({ message, onImageClick }) {
  const navigate = useNavigate();
  
  const myId = localStorage.getItem("userId");

  const isMe = message.senderId === myId;

  const goProfile = () => {
    if (isMe) {
      navigate("/settings/profile");
    }
  };
  const isImage = message.content?.startsWith("/images/chat");
  const imageUrl = isImage
    ? `http://localhost:8080${message.content}`
    : null;

  return (
    <div className="message-item">
      <div
        className="message-avatar clickable"
        onClick={goProfile}
      >
        {message.senderName?.[0] ?? "?"}
      </div>

      <div className="message-body">
        <div className="message-meta">
          <span
            className="message-author clickable"
            onClick={goProfile}
          >
            {message.senderName}
          </span>

          <span className="message-time">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>

        <div className="message-content">
          {isImage ? (
            <img
              src={imageUrl}
              className="chat-image"
              onClick={() => onImageClick?.(imageUrl)}
            />
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}
