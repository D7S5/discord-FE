import api from "./api";

export const getMyServers = () =>
  api.get("/servers/me");

useEffect(() => {
  getMyServers().then(res => setServers(res.data));
}, []);