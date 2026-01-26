// webrtc/VoiceChannel.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket";
import {
  initDevice,
  createSendTransport,
  createRecvTransport,
  startMic,
  consume,
} from "./mediasoup";

export default function VoiceChannel() {

    const { channelId } = useParams();

  useEffect(() => {
    socket.emit("joinVoice", { channelId });

    socket.on("newProducer", async ({ producerId }) => {
      await consume(producerId);
    });

    init();

    return () => {
      socket.disconnect();
    };
  }, []);

  const init = async () => {
    await initDevice();
    await createSendTransport();
    await createRecvTransport();
    await startMic();
  };

  return (
    <div>
      <h2>🎧 Voice Channel</h2>
      <p>마이크 ON</p>
    </div>
  );
}
