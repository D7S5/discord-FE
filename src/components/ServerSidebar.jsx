import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CreateServerModal from "../components/CreateServerModal";
import "../styles/ServerSidebar.css";

export default function ServerSidebar() {
  const [servers, setServers] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { serverId } = useParams();

  useEffect(() => {
    api.get("/channels/me").then((res) => {
      setServers(res.data);
    });
  }, []);

  return (
    <>
      <aside className="server-sidebar">
        {Array.isArray(servers) &&
          servers.map((s) => (
            <div
              key={s.id}
              className="server-icon"
              onClick={() => navigate(`/channels/${s.id}`)}
              title={s.name}
            >
              {s.name?.[0]}
            </div>
          ))}

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
