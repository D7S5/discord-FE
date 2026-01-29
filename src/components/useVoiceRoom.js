import { useEffect, useRef, useState } from "react";
import { Device } from "mediasoup-client";
import voiceApi from "../voiceApi";
import { useSpeakingDetector } from "../hooks/useSpeakingDetector"; 
import { getClient } from "../websocket";

export function useVoiceRoom(roomId) {
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [stream, setStream] = useState(null);

  const transportRef = useRef(null);
  const deviceRef = useRef(null);

  const speaking = useSpeakingDetector(stream);

  /* 🎧 음성 채널 입장 */
  const joinRoom = async () => {
    if (joined) return;

    const client = getClient();
    if (!client || !client.connected) return;

    // ✅ 1. WebSocket JOIN 이벤트
    client.publish({
      destination: "/app/voice.join",
      body: JSON.stringify({
        channelId: roomId,
      }),
    });

    // 🎤 2. 마이크 권한
    const media = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(media);

    // 3. RTP Capabilities
    const { data: rtpCapabilities } = await voiceApi.get(
      `/rooms/${roomId}/rtp-capabilities`
    );

    const device = new Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    deviceRef.current = device;

    // 4. Transport 생성
    const { data: transportInfo } = await voiceApi.post(
      `/rooms/${roomId}/transports`
    );

    const transport = device.createSendTransport(transportInfo);
    transportRef.current = transport;

    transport.on("connect", async ({ dtlsParameters }, callback) => {
      await voiceApi.post(`/transports/${transport.id}/connect`, {
        dtlsParameters,
      });
      callback();
    });

    transport.on("produce", async ({ kind, rtpParameters }, callback) => {
      const { data } = await voiceApi.post(
        `/transports/${transport.id}/produce`,
        { kind, rtpParameters }
      );
      callback({ id: data.id });
    });

    const track = media.getAudioTracks()[0];
    await transport.produce({ track });

    setJoined(true);
  };

  /* 🚪 음성 채널 퇴장 */
  const leaveRoom = () => {
    const client = getClient();

    if (client?.connected) {
      client.publish({
        destination: "/app/voice.leave",
        body: JSON.stringify({
          channelId: roomId,
        }),
      });
    }

    stream?.getTracks().forEach(t => t.stop());
    transportRef.current?.close();

    setStream(null);
    setJoined(false);
  };

  /* 🟢 SPEAKING 이벤트 */
  useEffect(() => {
    if (!joined) return;
    const client = getClient();
    if (!client?.connected) return;

    client.publish({
      destination: `/app/voice/${roomId}/speaking`,
      body: JSON.stringify({ speaking }),
    });
  }, [speaking, joined, roomId]);

  /* 👥 음성 채널 유저 목록 */
  useEffect(() => {
    const client = getClient();
    if (!client) return;

    const sub = client.subscribe(
      `/topic/voice/${roomId}`,
      msg => setUsers(JSON.parse(msg.body))
    );

    return () => sub.unsubscribe();
  }, [roomId]);

  return {
    joinRoom,
    leaveRoom,
    joined,
    users,
    speaking,
  };
}