import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServerLobby } from "../api/serverApi";
import api from "../api"; // ✅ 추가
import ChannelItem from "../components/ChannelItem";
import ChannelPage from "./ChannelPage";
import MemberList from "../components/MemberList";
import ServerSidebar from "../components/ServerSidebar";
import { connectWebSocket, getClient } from "../websocket";
import CreateChannelModal from "../components/CreateChannelModal";
import "../styles/ServerLobby.css";

const ServerLobby = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();

  const [server, setServer] = useState(null);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [openCreateChannel, setOpenCreateChannel] = useState(false);

  const selectedChannelId = channelId ? Number(channelId) : null;
  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  /* ✅ WebSocket 최초 1회 연결 */
  useEffect(() => {
  connectWebSocket(serverId, async () => {
    if (!serverId) return ;
      const client = getClient();

      client.subscribe(
        `/topic/presence/${serverId}`,
        msg => {
          const { userId, status } = JSON.parse(msg.body);
          setMembers(prev =>
            prev.map(m =>
              m.id === userId
                ? { ...m, online: status === "ONLINE" }
                : m
            )
          );
        }
      );
      // await reloadMembers();
    });
}, [serverId]);

  /* ✅ 서버 로비 데이터 로딩 */
  useEffect(() => {
    if (!serverId) return ;
    
    getServerLobby(serverId).then((data) => {
      setServer(data.server);
      setChannels(data.channels);
      setMembers(data.members || []);

      // 첫 채널 자동 진입
      if (!channelId && data.channels.length > 0) {
        navigate(`/channels/${serverId}/${data.channels[0].id}`, {
          replace: true,
        });
      }
    });
  }, [serverId, channelId, navigate]);

  const reloadMembers = async () => {
      const res = await api.get(`/channels/${serverId}/members`)
      setMembers(res.data);
  }

  /* ✅ 채널 목록 재로딩 (채널 생성 후 사용) */
  const reloadChannels = async () => {
    if (!serverId) return ;
    const res = await api.get(`/channels/${serverId}/lobby`);
    setChannels(res.data.channels);
  };

  if (!server) return <div className="loading">Loading...</div>;

  return (
    <div className="server-lobby">
      <ServerSidebar />
      <aside className="channel-sidebar">
        <div className="server-header">
          <h2>{server.name}</h2>
          <button
            className="add-channel-btn"
            onClick={() => setOpenCreateChannel(true)}
          >
            +
          </button>
          {openCreateChannel && (
            <CreateChannelModal
              serverId={serverId}
              onClose={() => setOpenCreateChannel(false)}
              onCreated={reloadChannels}
            />
          )}
        </div>

        <div className="channel-list">
          {channels.map(channel => (
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

      {/* 채팅 영역 */}
      <main className="channel-content">
        <ChannelPage channel={selectedChannel} />
      </main>

      {/* 멤버 리스트 */}
      <MemberList members={members} />
    </div>
  );
};

export default ServerLobby;