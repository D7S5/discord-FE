import { useEffect, useState } from "react";
import { useNavigate, useParams, Routes, Route } from "react-router-dom";
import api from "../api";
import ServerLayout from "../components/ServerLayout";

export default function ServerLayoutPage() {
  const { serverId } = useParams();
  const navigate = useNavigate();

  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get(`/channels/${serverId}/lobby`).then(res => {
      setChannels(res.data.channels);
      setMembers(res.data.members);
      setLoaded(true);
    });
  }, [serverId]);

  // ✅ 서버 진입 시 첫 채널 자동 이동
  useEffect(() => {
    if (!loaded || channels.length === 0) return;

    const path = window.location.pathname;
    if (path.split("/").length >= 4) return; // 이미 channelId 있음

    navigate(`${channels[0].id}`, { replace: true });
  }, [loaded, channels, navigate]);

  return (
    <Routes>
      <Route
        path=":channelId"
        element={
          <ServerLayout
            channels={channels}
            members={members}
          />
        }
      />
    </Routes>
  );
}
