import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServerLobby } from "../api/serverApi";
import api from "../api"; // ✅ 추가
import ChannelItem from "../components/ChannelItem";
import ChannelPage from "./ChannelPage";
import MemberList from "../components/MemberList";
import VoiceChannelItem from "../components/voice/VoiceChannelItem";
import ServerSidebar from "../components/ServerSidebar";
import { connectWebSocket, getClient, safePublish } from "../websocket";
import CreateChannelModal from "../components/CreateChannelModal";
import VoicePannel from "../components/voice/VoicePannel";
import "../styles/ServerLobby.css";
import InviteModal from "./InviteModal";

const ServerLobby = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();

  const [server, setServer] = useState(null);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [openCreateChannel, setOpenCreateChannel] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const selectedChannelId = channelId ? Number(channelId) : null;
  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  const [voiceUsers, setVoiceUsers] = useState({});     

  const [currentVoiceChannelId, setCurrentVoiceChannelId] = useState(null);

  const [myRole, setMyRole] = useState(null);
  const roleAdmin = myRole === "OWNER" || myRole === "ADMIN";

  useEffect(() => {
    if (!serverId) return 

  connectWebSocket((client) => {

    client.subscribe(`/topic/voice/${serverId}`, msg => {
      const event = JSON.parse(msg.body);
      console.log("VOICE EVENT:", event);

      if (event.type === "JOIN") {
        
        setVoiceUsers(prev => ({
          ...prev,
          [event.channelId]: [...(prev[event.channelId] || []), event.userId],
        }));
      }

      if (event.type === "LEAVE") {
        setVoiceUsers(prev => ({
          ...prev,
          [event.channelId]:
            (prev[event.channelId] || []).filter(id => id !== event.userId),
        }));
      }
    });

      const subscription = client.subscribe(
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
      return () => subscription.unsubscribe();
    });
}, [serverId]);

  /* ✅ 서버 로비 데이터 로딩 */
  useEffect(() => {
    if (!serverId) return ;
    
    getServerLobby(serverId).then((data) => {
      setServer(data.server);
      setChannels(data.channels);
      setMembers(data.members || []);
      setMyRole(data.myRole);

      console.log("=== members ===");
      console.log(data.members);

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

  const joinVoiceChannel = (channelId) => {
    const client = getClient();
    if (!client?.connected) return;

    safePublish(`/app/voice.join`, {
      serverId, channelId
    })
    };

const leaveVoiceChannel = (channelId) => {
  const client = getClient();
  if (!client?.connected) return;

  safePublish(`/app/voice.leave`, {
    serverId, channelId
    })
  };

const currentVoiceChannel = channels.find(
  c => c.id === currentVoiceChannelId
);

const fetchMembers = async () => {
  const res = await api.get(`/channels/${serverId}/members`);
  setMembers(res.data);
};

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
            {roleAdmin && (
              <>
                <button
                  className="invite-btn"
                  onClick={() => setInviteOpen(true)}
                >
                  + 사람 초대
                </button>

                {inviteOpen && (
                  <InviteModal
                    serverId={server.id}
                    onClose={() => setInviteOpen(false)}
                  />
                )}
              </>
            )}
          <h2>{server.name}</h2>
          {roleAdmin && (
            <>
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
          </>
        )}
        </div>

        <div className="channel-list">
          {channels.map(channel => (
            channel.type === "VOICE" ? (
              <VoiceChannelItem
                  key={channel.id}
                  channel={channel}
                  users={(voiceUsers[channel.id] || []).map(userId =>
                    members.find(m => m.userId === userId)
                  ).filter(Boolean)}
                  selected={currentVoiceChannelId === channel.id}
                  onClick={() => {
                    if (currentVoiceChannelId !== channel.id) {
                      if (currentVoiceChannelId) {
                        leaveVoiceChannel(currentVoiceChannelId);
                      }
                      joinVoiceChannel(channel.id);
                      setCurrentVoiceChannelId(channel.id);
                    }
                  }}
                />
            ) : (
              <ChannelItem
                key={channel.id}
                channel={channel}
                selected={selectedChannelId === channel.id}
                onClick={() =>
                  navigate(`/channels/${serverId}/${channel.id}`)
                }
              />
            )
            ))}
        </div>
            {currentVoiceChannel && (
            <VoicePannel
              channel={currentVoiceChannel}
              users={voiceUsers[currentVoiceChannelId] || []}
              onLeave={() => {
                leaveVoiceChannel(currentVoiceChannelId);
                setCurrentVoiceChannelId(null);
              }}
            />
          )}
      </aside>
      {/* 채팅 영역 */}
      <main className="channel-content">
        <ChannelPage channel={selectedChannel} />
      </main>

      {/* 멤버 리스트 */}
      <MemberList members={members}
                  myRole={myRole}
                  serverId={serverId}
                  refetchMembers={fetchMembers} />
    </div>
    
  );
};

export default ServerLobby;