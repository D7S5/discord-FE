import api from "../api";

export const getServerLobby = async (serverId) => {
  const res = await api.get(`/servers/${serverId}/lobby`);
  return res.data;
};