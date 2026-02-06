import { useEffect } from "react";

export default function ServerContextMenu({ x, y, onClose, onLeave }) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [onClose]);

  return (
    <div
      className="context-menu"
      style={{ top: y, left: x }}
    >
      <button className="danger" onClick={onLeave}>
        서버 나가기
      </button>
    </div>
  );
}
