import { useState, useEffect } from "react";
import * as mediasoupClient from "mediasoup-client";
import axios from "axios";

export function useMediasoup(roomId) {
  const [device, setDevice] = useState(null);
  const [sendTransport, setSendTransport] = useState(null);
  const [recvTransport, setRecvTransport] = useState(null);
  const [producers, setProducers] = useState([]);
  const [consumers, setConsumers] = useState([]);

  useEffect(() => {
    const init = async () => {
      const rtp = await axios.get(`http://localhost:3001/rooms/${roomId}/rtp-capabilities`);
      const d = new mediasoupClient.Device();
      await d.load({ routerRtpCapabilities: rtp.data });
      setDevice(d);
    };
    init();
  }, [roomId]);

  return { device, sendTransport, recvTransport, producers, consumers };
}
