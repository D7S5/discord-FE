import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CreateServerModal from "../components/CreateServerModal";
import ServerContextMenu from "../components/ServerContextMenu";
import "../styles/ServerSidebar.css";

export default function ServerSidebar() {
  const [servers, setServers] = useState([]);
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(null);

  const navigate = useNavigate();
  const { serverId } = useParams();

  /** ⭐ 서버 목록 다시 로드 */
  const reloadServers = async () => {
    const res = await api.get("/channels/me");
    setServers(res.data);
  };

  useEffect(() => {
    reloadServers();
  }, []);

  const onRightClick = (e, server) => {
    e.preventDefault();
    setContext({
      x: e.clientX,
      y: e.clientY,
      server,
    });
  };

  return (
    <>
      <aside className="server-sidebar">
        {/* ===== @me ===== */}
        <div
          className={`server-icon me ${serverId === "@me" ? "active" : ""}`}
          onClick={() => navigate("/channels/@me")}
          title="다이렉트 메시지"
        >
          🟣
        </div>

        <div className="server-separator" />

        {/* ===== servers ===== */}
        {servers.map((s) => (
          <div
            key={s.id}
            className={`server-icon ${String(serverId) === String(s.id) ? "active" : ""}`}
            onClick={() => navigate(`/channels/${s.id}`)}
            onContextMenu={(e) => onRightClick(e, s)}
            title={s.name}
          >
            {s.iconUrl ? (
              <img
                src={`http://localhost:8080${s.iconUrl}`}
                alt={s.name}
                className="server-icon-img"
              />
            ) : (
              s.name?.[0]
            )}
          </div>
        ))}

        {/* ===== add server ===== */}
        <div className="server-add" onClick={() => setOpen(true)}>
          +
        </div>
      </aside>

      {/* ===== 우클릭 메뉴 ===== */}
      {context && (
        <ServerContextMenu
          x={context.x}
          y={context.y}
          server={context.server}
          onClose={() => setContext(null)}
          onLeave={(id) => {
            // 즉시 UI 반영
            setServers((prev) => prev.filter((s) => s.id !== id));
            navigate("/channels/@me");
          }}
          onUpdated={reloadServers} // ⭐ 서버 삭제 / 설정 변경 시
        />
      )}

      {/* ===== 서버 생성 ===== */}
      {open && (
        <CreateServerModal
          onClose={() => setOpen(false)}
          onCreated={() => reloadServers()}
        />
      )}
    </>
  );
}
