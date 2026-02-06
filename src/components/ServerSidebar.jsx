import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CreateServerModal from "../components/CreateServerModal";
import ServerContextMenu from "../components/ServerContextMenu";
import "../styles/ServerSidebar.css";

export default function ServerSidebar() {
  const [servers, setServers] = useState([]);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null); 
  // { serverId, x, y }

  const navigate = useNavigate();
  const { serverId } = useParams(); // @me or serverId

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    const res = await api.get("/channels/me");
    setServers(res.data);
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setMenu({
      serverId: id,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeMenu = () => setMenu(null);

  const leaveServer = async (id) => {
    const ok = window.confirm("정말 이 서버에서 나가시겠습니까?");
    if (!ok) return;

    await api.delete(`/channels/${id}/leave`);
    setMenu(null);
    loadServers();

    // 나간 서버 보고 있었다면 @me로 이동
    if (String(serverId) === String(id)) {
      navigate("/channels/@me");
    }
  };

  return (
    <>
      <aside className="server-sidebar">
        {/* ===== @me ===== */}
        <div
          className={`server-icon me ${
            serverId === "@me" ? "active" : ""
          }`}
          onClick={() => navigate("/channels/@me")}
          title="다이렉트 메시지"
        >
          🟣
        </div>

        <div className="server-separator" />

        {/* ===== servers ===== */}
        {Array.isArray(servers) &&
          servers.map((s) => (
            <div
              key={s.id}
              className={`server-icon ${
                String(serverId) === String(s.id) ? "active" : ""
              }`}
              onClick={() => navigate(`/channels/${s.id}`)}
              onContextMenu={(e) => handleContextMenu(e, s.id)}
              title={s.name}
            >
              {s.name?.[0]}
            </div>
          ))}

        {/* ===== add server ===== */}
        <div className="server-add" onClick={() => setOpen(true)}>
          +
        </div>
      </aside>

      {menu && (
        <ServerContextMenu
          x={menu.x}
          y={menu.y}
          onClose={closeMenu}
          onLeave={() => leaveServer(menu.serverId)}
        />
      )}

      {open && (
        <CreateServerModal
          onClose={() => setOpen(false)}
          onCreated={(server) =>
            setServers((prev) => [...prev, server])
          }
        />
      )}
    </>
  );
}
