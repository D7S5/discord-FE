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

  useEffect(() => {
    api.get("/channels/me").then((res) => {
      setServers(res.data);
    });
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
        {/* @me */}
        <div
          className={`server-icon me ${serverId === "@me" ? "active" : ""}`}
          onClick={() => navigate("/channels/@me")}
        >
          🟣
        </div>

        <div className="server-separator" />

        {/* servers */}
        {servers.map((s) => (
          <div
            key={s.id}
            className={`server-icon ${serverId == s.id ? "active" : ""}`}
            onClick={() => navigate(`/channels/${s.id}`)}
            onContextMenu={(e) => onRightClick(e, s)}
            title={s.name}
          >
            {s.name?.[0]}
          </div>
        ))}

        {/* add */}
        <div className="server-add" onClick={() => setOpen(true)}>
          +
        </div>
      </aside>

      {/* 우클릭 메뉴 */}
      {context && (
        <ServerContextMenu
          x={context.x}
          y={context.y}
          server={context.server}
          onClose={() => setContext(null)}
          onLeave={(id) => {
            setServers((prev) => prev.filter((s) => s.id !== id));
            navigate("/channels/@me");
          }}
        />
      )}

      {open && (
        <CreateServerModal
          onClose={() => setOpen(false)}
          onCreated={(server) => setServers((prev) => [...prev, server])}
        />
      )}
    </>
  );
}
