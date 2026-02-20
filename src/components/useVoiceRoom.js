import { useEffect, useRef, useState } from "react";
import { Device } from "mediasoup-client";
import voiceApi from "../voiceApi";
import { useSpeakingDetector } from "../hooks/useSpeakingDetector";
import { getClient } from "../websocket";

export function useVoiceRoom(roomId) {
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [stream, setStream] = useState(null);

  const [muted, setMuted] = useState(false);

  const transportRef = useRef(null);
  const deviceRef = useRef(null);
  const audioTrackRef = useRef(null);
  const producerRef = useRef(null);

  const speakingRaw = useSpeakingDetector(stream);
  const speaking = muted ? false : speakingRaw; // ✅ mute면 말하는 중도 false 취급

  const joinRoom = async () => {
    if (joined) return;

    const client = getClient();
    if (!client || !client.connected) return;

    client.publish({
      destination: "/app/voice.join",
      body: JSON.stringify({ channelId: roomId }),
    });

    const media = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(media);

    const { data: rtpCapabilities } = await voiceApi.get(
      `/rooms/${roomId}/rtp-capabilities`
    );

    const device = new Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    deviceRef.current = device;

    const { data: transportInfo } = await voiceApi.post(
      `/rooms/${roomId}/transports`
    );

    const transport = device.createSendTransport(transportInfo);
    transportRef.current = transport;

    transport.on("connect", async ({ dtlsParameters }, callback) => {
      await voiceApi.post(`/transports/${transport.id}/connect`, { dtlsParameters });
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
    audioTrackRef.current = track;

    // ✅ join 전에 muted 상태였으면 바로 적용
    track.enabled = !muted;

    const producer = await transport.produce({ track });
    producerRef.current = producer;

    setJoined(true);
  };

  const leaveRoom = () => {
    const client = getClient();

    if (client?.connected) {
      client.publish({
        destination: "/app/voice.leave",
        body: JSON.stringify({ channelId: roomId }),
      });
    }

    producerRef.current?.close();
    transportRef.current?.close();
    stream?.getTracks().forEach((t) => t.stop());

    producerRef.current = null;
    transportRef.current = null;
    audioTrackRef.current = null;

    setStream(null);
    setJoined(false);
    setMuted(false); // 선택: 나가면 mute 초기화
  };

  // ✅ mute 토글
  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      const track = audioTrackRef.current;
      if (track) track.enabled = !next; // next=true면 enabled=false
      // console.log("Track enabled:", track.enabled);
      return next;
    });
  };

  useEffect(() => {
    const track = audioTrackRef.current;
    if (track) track.enabled = !muted;
  }, [muted]);

  // SPEAKING 이벤트 (mute면 false)
  useEffect(() => {
    if (!joined) return;
    const client = getClient();
    if (!client?.connected) return;

    client.publish({
      destination: `/app/voice/${roomId}/speaking`,
      body: JSON.stringify({ speaking }),
    });
  }, [speaking, joined, roomId]);

  useEffect(() => {
    const client = getClient();
    if (!client) return;

    const sub = client.subscribe(`/topic/voice/${roomId}`, (msg) =>
      setUsers(JSON.parse(msg.body))
    );
    return () => sub.unsubscribe();
  }, [roomId]);

  return {
    joinRoom,
    leaveRoom,
    joined,
    users,
    speaking,
    muted,
    toggleMute,
    setMuted, 
  };
}
