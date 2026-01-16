import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServerLobby } from "../api/serverApi";
import ChannelItem from "../components/ChannelItem";
import "../styles/ServerLobby.css";
import ChannelPage from "./ChannelPage";

const ServerLobby = () => {
  const { serverId } = useParams();
  const [server, setServer] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  useEffect(() => {
    getServerLobby(serverId).then((data) => {
      setServer(data.server);
      setChannels(data.channels);

      // ✅ 첫 채널 자동 선택
      if (data.channels.length > 0) {
        setSelectedChannelId(data.channels[0].id);
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
              onClick={() => setSelectedChannelId(channel.id)}
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
