import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const ServerSidebar = () => {
  const [servers, setServers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/servers/me")
      .then(res => {
        console.log(res.data);
        setServers(res.data);
      });
  }, []);

  return (
    <>
      {Array.isArray(servers) &&
        servers.map(server => (
          <div
            key={server.id}
            onClick={() => navigate(`/servers/${server.id}`)}
          >
            {server.name}
          </div>
        ))}
    </>
  );
};

export default ServerSidebar;
