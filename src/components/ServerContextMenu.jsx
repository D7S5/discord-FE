import api from "../api";
import "../styles/ServerContextMenu.css";

export default function ServerContextMenu({
  x,
  y,
  server,
  onClose,
  onLeave,
}) {
  const isOwner = server.myRole === "OWNER";

  const leaveServer = async () => {

    console.log("server =", server);
    console.log(isOwner)

    // ⭐ 서버 소유자인 경우
    if (isOwner) {
      alert(
        "서버 소유자는 서버를 나갈 수 없습니다.\n\n" +
        "서버를 나가려면:\n" +
        "서버를 삭제하거나\n" +
        "다른 멤버에게 소유권을 이전하세요."
      );
      onClose();
      return;
    }

    // 일반 멤버
    if (!window.confirm("정말 서버를 나가시겠습니까?")) return;

    await api.delete(`/channels/${server.id}/leave`);
    onLeave(server.id);
    onClose();
  };

  const deleteServer = async () => {
    if (
      !window.confirm(
        "서버를 삭제하면 모든 채널과 메시지가 영구적으로 삭제됩니다.\n\n정말 삭제할까요?"
      )
    ) {
      return;
    }

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
        <>
          <button onClick={() => alert("서버 설정 (미구현)")}>
            서버 설정
          </button>

          <button className="danger" onClick={deleteServer}>
            서버 삭제
          </button>

          {/* ⭐ 소유자도 서버 나가기는 보이게 */}
          <button className="danger subtle" onClick={leaveServer}>
            서버 나가기
          </button>
        </>
      )}

      {!isOwner && (
        <button className="danger" onClick={leaveServer}>
          서버 나가기
        </button>
      )}
    </div>
  );
}
