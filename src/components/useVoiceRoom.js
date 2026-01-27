import { useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import axios from "axios";

const MS_URL = "http://localhost:3001";

export function useVoiceRoom(roomId) {
  const deviceRef = useRef(null);
  const sendTransportRef = useRef(null);
  const recvTransportRef = useRef(null);

  const producers = useRef(new Map());
  const consumers = useRef(new Map());

  const [joined, setJoined] = useState(false);

  /* 1️⃣ Device 로드 */
  const loadDevice = async () => {
    const { data: rtpCapabilities } = await axios.get(
      `${MS_URL}/rooms/${roomId}/rtp-capabilities`
    );

    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });

    deviceRef.current = device;
  };

  /* 2️⃣ Transport 생성 */
  const createTransport = async () => {
    const { data } = await axios.post(
      `${MS_URL}/rooms/${roomId}/transports`
    );

    const device = deviceRef.current;

    sendTransportRef.current = device.createSendTransport(data);
    recvTransportRef.current = device.createRecvTransport(data);

    // SEND connect
    sendTransportRef.current.on("connect", async ({ dtlsParameters }, cb) => {
      await axios.post(`${MS_URL}/transports/${sendTransportRef.current.id}/connect`, {
        dtlsParameters,
      });
      cb();
    });

    // PRODUCE
    sendTransportRef.current.on(
      "produce",
      async ({ kind, rtpParameters }, cb) => {
        const { data } = await axios.post(
          `${MS_URL}/transports/${sendTransportRef.current.id}/produce`,
          { kind, rtpParameters }
        );
        cb({ id: data.id });
      }
    );

    // RECV connect
    recvTransportRef.current.on("connect", async ({ dtlsParameters }, cb) => {
      await axios.post(`${MS_URL}/transports/${recvTransportRef.current.id}/connect`, {
        dtlsParameters,
      });
      cb();
    });
  };

  /* 3️⃣ 마이크 송출 */
  const startMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];

    const producer = await sendTransportRef.current.produce({
      track,
      codecOptions: {
        opusStereo: true,
        opusDtx: true,
      },
    });

    producers.current.set(producer.id, producer);
  };

  /* 4️⃣ 다른 사람 음성 수신 */
  const consume = async (producerId) => {
    const { data } = await axios.post(`${MS_URL}/consume`, {
      roomId,
      transportId: recvTransportRef.current.id,
      producerId,
      rtpCapabilities: deviceRef.current.rtpCapabilities,
    });

    const consumer = await recvTransportRef.current.consume({
      id: data.id,
      producerId,
      kind: data.kind,
      rtpParameters: data.rtpParameters,
    });

    const audio = new Audio();
    audio.srcObject = new MediaStream([consumer.track]);
    audio.autoplay = true;

    consumers.current.set(consumer.id, consumer);
  };

  /* 5️⃣ 방 입장 */
  const joinRoom = async () => {
    await loadDevice();
    await createTransport();
    await startMic();
    setJoined(true);
  };

  /* 6️⃣ 방 나가기 */
  const leaveRoom = () => {
    producers.current.forEach(p => p.close());
    consumers.current.forEach(c => c.close());

    sendTransportRef.current?.close();
    recvTransportRef.current?.close();

    producers.current.clear();
    consumers.current.clear();

    setJoined(false);
  };

  return {
    joinRoom,
    leaveRoom,
    consume,
    joined,
  };
}
