import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServerLobby } from "../api/serverApi";
import ChannelItem from "../components/ChannelItem";
import "../styles/ServerLobby.css";
import ChannelPage from "./ChannelPage";


const ServerLobby = () => {
  const { serverId, channelId } = useParams();
  const [server, setServer] = useState(null);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();
  const selectedChannelId = channelId ? Number(channelId) : null;

  useEffect(() => {
    getServerLobby(serverId).then((data) => {
      setServer(data.server);
      setChannels(data.channels);

      // ✅ 첫 채널 자동 선택
      if (!channelId && data.channels.length > 0) {
        navigate(
          `/channels/${serverId}/${data.channels[0].id}`,
          { replace: true }
        );
      }
    });
  }, [serverId]);

  if (!server) return <div className="loading">Loading...</div>;

  return (
    <div className="server-lobby">
      <aside className="channel-sidebar">
        <div className="server-header">
          <h2>{server.name}</h2>
        </div>

        <div className="channel-list">
          {channels.map((channel) => (
            <ChannelItem
                key={channel.id}
                channel={channel}
                selected={channel.id === selectedChannelId}
                onClick={() =>
                    navigate(`/channels/${serverId}/${channel.id}`)
                }
                />
          ))}
        </div>
      </aside>

      <main className="channel-content">
        <ChannelPage channelId={selectedChannelId} />
        {selectedChannelId ? (
          <div className="channel-placeholder">
            Channel ID: {selectedChannelId}
          </div>
        ) : (
          <div className="channel-placeholder">채널을 선택하세요</div>
        )}
      </main>
    </div>
  );
};

export default ServerLobby;
