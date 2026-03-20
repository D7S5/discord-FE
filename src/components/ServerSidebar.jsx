import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CreateServerModal from "../components/CreateServerModal";
import ServerContextMenu from "../components/ServerContextMenu";
import "../styles/ServerSidebar.css";
import dmIcon from "../assets/dm-icon.svg";

const FILE_BASE_URL = "http://localhost:8080";

export default function ServerSidebar() {
  const [servers, setServers] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const navigate = useNavigate();
  const { serverId } = useParams();

  // 서버 목록 로드
  const reloadServers = useCallback(async () => {
    try {
      const res = await api.get("/channels/me");
      setServers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("서버 목록 불러오기 실패:", error);
      setServers([]);
    }
  }, []);

  useEffect(() => {
    reloadServers();
  }, [reloadServers]);

  const handleGoMe = () => {
    navigate("/channels/@me");
  };

  const handleServerClick = (id) => {
    navigate(`/channels/${id}`);
  };

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleRightClickServer = (e, server) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      server,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleLeaveServer = (leftServerId) => {
    setServers((prev) => prev.filter((s) => s.id !== leftServerId));
    setContextMenu(null);
    navigate("/channels/@me");
  };

  const handleServerUpdated = async () => {
    await reloadServers();
    setContextMenu(null);
  };

  return (
    <>
      <aside className="server-sidebar">
        {/* @me */}
        <div
          className={`server-icon me ${serverId === "@me" ? "active" : ""}`}
          onClick={handleGoMe}
          title="다이렉트 메시지"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleGoMe();
          }}
        >
          <img src={dmIcon} alt="DM" className="server-icon-image" />
        </div>

        <div className="server-separator" />

        {/* 서버 목록 */}
        {servers.map((server) => {
          const isActive = String(serverId) === String(server.id);
          const iconSrc = server.iconUrl
            ? server.iconUrl.startsWith("http")
            ? server.iconUrl
            : `${FILE_BASE_URL}${server.iconUrl}`
            : null;

          return (
            <div
              key={server.id}
              className={`server-icon ${isActive ? "active" : ""}`}
              onClick={() => handleServerClick(server.id)}
              onContextMenu={(e) => handleRightClickServer(e, server)}
              title={server.name}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleServerClick(server.id);
                }
              }}
            >
              {iconSrc ? (
                <img
                  src={iconSrc}
                  alt={server.name}
                  className="server-icon-img"
                />
              ) : (
                server.name?.[0] ?? "?"
              )}
            </div>
          );
        })}

        {/* 서버 추가 */}
        <div
          className="server-add"
          onClick={handleOpenCreate}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpenCreate();
          }}
          title="서버 생성"
        >
          +
        </div>
      </aside>

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <ServerContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          server={contextMenu.server}
          onClose={handleCloseContextMenu}
          onLeave={handleLeaveServer}
          onUpdated={handleServerUpdated}
        />
      )}
      {/* 서버 생성 모달 */}
      {isCreateOpen && (
        <CreateServerModal
          onClose={handleCloseCreate}
          onCreated={reloadServers}
        />
      )}
    </>
    
  );
}