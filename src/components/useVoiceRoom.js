import { useEffect, useRef, useState } from "react";
import { Device } from "mediasoup-client";
import voiceApi from "../voiceApi";
import { useSpeakingDetector } from "../hooks/useSpeakingDetector"; // ✅ 오타 수정
import { getClient } from "../websocket";

export function useVoiceRoom(roomId) {
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [stream, setStream] = useState(null);

  const transportRef = useRef(null);
  const deviceRef = useRef(null);

  // ✅ Hook은 무조건 최상단
  const speaking = useSpeakingDetector(stream);

  /* 🎧 음성 채널 입장 */
  const joinRoom = async () => {
    if (joined) return;

    // 🎤 마이크 권한
    const media = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(media);

    // RTP Capabilities
    const { data: rtpCapabilities } = await voiceApi.get(
      `/rooms/${roomId}/rtp-capabilities`
    );

    const device = new Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    deviceRef.current = device;

    // Transport 생성
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
      const { data } = await voiceApi.post(`/transports/${transport.id}/produce`, {
        kind,
        rtpParameters,
      });
      callback({ id: data.id });
    });

    const track = media.getAudioTracks()[0];
    await transport.produce({ track });

    setJoined(true);
  };

  /* ❌ 음성 채널 나가기 */
  const leaveRoom = () => {
    stream?.getTracks().forEach(t => t.stop());
    transportRef.current?.close();
    setStream(null);
    setJoined(false);
  };

  /* 🟢 SPEAKING 이벤트 전송 */
  useEffect(() => {
    if (!joined) return;
    const client = getClient();
    if (!client || !client.connected) return;

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
    speaking, // ✅ UI에서 초록불 표시 가능
  };
}
