import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/ServerListPage.css";

const ServerListPage = () => {
  const [servers, setServers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/servers/me")
      .then(res => setServers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleServerClick = (serverId) => {
    navigate(`/servers/${serverId}`);
  };

  return (
    <div className="server-list-container">
      <div className="server-list">
        {servers.map(server => (
          <div
            key={server.id}
            className="server-icon"
            onClick={() => handleServerClick(server.id)}
            title={server.name}
          >
            {server.iconUrl ? (
              <img src={server.iconUrl} alt={server.name} />
            ) : (
              <span>{server.name.charAt(0)}</span>
            )}
          </div>
        ))}

        <div className="server-icon add-server">+</div>
      </div>
    </div>
  );
};

export default ServerListPage;
