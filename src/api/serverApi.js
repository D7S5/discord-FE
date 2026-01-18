import api from "../api";

export const getServerLobby = async (serverId) => {
  const res = await api.get(`/channels/${serverId}/lobby`);
  return res.data;
};