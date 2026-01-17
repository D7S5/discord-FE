import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ServerSidebar = () => {
  const [servers, setServers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/channels/me")
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
            onClick={() => navigate(`/channels/${server.id}`)}
          >
            {server.name}
          </div>
        ))}
    </>
  );
};

export default ServerSidebar;
