import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CreateServerModal from "../components/CreateServerModal";
import "../styles/ServerSidebar.css";

export default function ServerSidebar() {
  const [servers, setServers] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { serverId } = useParams(); // @me or serverId

  useEffect(() => {
    api.get("/channels/me").then((res) => {
      setServers(res.data);
    });
  }, []);

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
                serverId === s.id ? "active" : ""
              }`}
              onClick={() => navigate(`/channels/${s.id}`)}
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