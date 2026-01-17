import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CreateServerModal from "../components/CreateServerModal";
import "../styles/ServerListPage.css";

export default function ServerListPage() {
  const [servers, setServers] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/channels/me").then((res) => {
      setServers(res.data);
    });
  }, []);

  return (
    <div className="layout">
      <aside className="server-sidebar">
        {servers.map((s) => (
          <div
            key={s.id}
            className="server-icon"
            onClick={() => navigate(`/channels/${s.id}`)}
          >
            {s.name[0]}
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
    </div>
  );
}
