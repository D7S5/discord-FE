import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/ServerContextMenu.css";

export default function ServerContextMenu({
  x,
  y,
  server,
  onClose,
  onLeave,
}) {
  const navigate = useNavigate();

  const isOwner = server.owner === true;

  const leaveServer = async () => {
    if (isOwner) {
      const ok = window.confirm(
        "⚠ 서버 소유자입니다.\n서버를 나가면 서버가 삭제되거나 소유권이 이전됩니다.\n정말 나갈까요?"
      );
      if (!ok) return;
    }

    await api.delete(`/channels/${server.id}/leave`);
    onLeave(server.id);
    onClose();
  };

  const deleteServer = async () => {
    if (!window.confirm("⚠ 서버를 완전히 삭제할까요?")) return;

    await api.delete(`/channels/${server.id}`);
    onLeave(server.id);
    onClose();
  };

  return (
    <div
      className="server-context-menu"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {isOwner && (
        <button
          onClick={() => {
            navigate(`/channels/${server.id}/settings`);
            onClose();
          }}
        >
          서버 설정
        </button>
      )}

      <button className="danger" onClick={leaveServer}>
        서버 나가기
      </button>

      {isOwner && (
        <button className="danger" onClick={deleteServer}>
          서버 삭제
        </button>
      )}
    </div>
  );
}
