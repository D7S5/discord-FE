import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getMessages = async (channelId) => {
  const res = await axios.get(
    `${API_BASE}/channels/${channelId}/messages`,
    { headers: authHeader() }
  );
  return res.data;
};

export const sendMessage = async (channelId, content) => {
  const res = await axios.post(
    `${API_BASE}/channels/${channelId}/messages`,
    { content },
    { headers: authHeader() }
  );
  return res.data;
};
