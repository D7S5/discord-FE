import axios from "axios";

const voiceApi = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

export default voiceApi;