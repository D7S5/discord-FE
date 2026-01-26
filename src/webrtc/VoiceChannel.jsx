import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

export default function VoiceChannel({ roomId }) {
  const [joined, setJoined] = useState(false);
  const [producers, setProducers] = useState([]);
  const socketRef = useRef(null);
  const deviceRef = useRef(null);
  const sendTransportRef = useRef(null);
  const recvTransportRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("🔌 Socket.io connected");
      socketRef.current.emit("join-room", { roomId });
      setJoined(true);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const initDevice = async () => {
    const rtpCapabilities = await fetch(`http://localhost:3001/rooms/${roomId}/rtp-capabilities`).then(r => r.json());
    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    deviceRef.current = device;
  };

  const createSendTransport = async () => {
    const transportData = await new Promise(resolve =>
      socketRef.current.emit("create-transport", { roomId }, resolve)
    );

    const transport = deviceRef.current.createSendTransport(transportData);

    transport.on("connect", ({ dtlsParameters }, callback, errback) => {
      socketRef.current.emit("connect-transport", { transportId: transport.id, dtlsParameters }, () => callback());
    });

    transport.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
      const { id } = await new Promise(resolve =>
        socketRef.current.emit("produce", { transportId: transport.id, kind, rtpParameters }, resolve)
      );
      callback({ id });
    });

    sendTransportRef.current = transport;
  };

  const createRecvTransport = async () => {
    const transportData = await new Promise(resolve =>
      socketRef.current.emit("create-transport", { roomId }, resolve)
    );

    const transport = deviceRef.current.createRecvTransport(transportData);

    transport.on("connect", ({ dtlsParameters }, callback, errback) => {
      socketRef.current.emit("connect-transport", { transportId: transport.id, dtlsParameters }, () => callback());
    });

    recvTransportRef.current = transport;
  };

  const startAudio = async () => {
    await initDevice();
    await createSendTransport();
    await createRecvTransport();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];

    const producer = await sendTransportRef.current.produce({ track });
    setProducers(prev => [...prev, producer]);
  };

  return (
    <div>
      <h2>Voice Channel</h2>
      {!joined && <p>Connecting...</p>}
      {joined && <button onClick={startAudio}>Join Voice</button>}
    </div>
  );
}
