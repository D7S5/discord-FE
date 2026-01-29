import api from "../api";

export const createInvite = async (serverId, data) => {
  const res = await api.post(
    `/invites/servers/${serverId}`,
    data
  );
  return res.data;
};
