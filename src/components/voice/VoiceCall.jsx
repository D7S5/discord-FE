// components/VoiceCall.jsx
import { useEffect, useRef } from "react";
import { connectWebSocket, getClient } from "../../websocket";
import {
  createOffer,
  handleOffer,
  handleAnswer,
  handleIce,
  closeCall,
} from "../../webrtc/webrtc";

export default function VoiceCall({ myId, targetId }) {
  const audioRef = useRef();

  useEffect(() => {
    connectWebSocket((client) => {
      client.subscribe("/user/queue/voice", (msg) => {
        const signal = JSON.parse(msg.body);

        switch (signal.type) {
          case "OFFER":
            handleOffer(signal.data, sendSignal, playRemote);
            break;
          case "ANSWER":
            handleAnswer(signal.data);
            break;
          case "ICE":
            handleIce(signal.data);
            break;
          default:
            break;
        }
      });
    });

    return () => closeCall();
  }, []);

  const sendSignal = (type, data) => {
    const client = getClient();
    client.publish({
      destination: "/app/voice.signal",
      body: JSON.stringify({
        type,
        to: targetId,
        from: myId,
        data,
      }),
    });
  };

  const playRemote = (stream) => {
    audioRef.current.srcObject = stream;
    audioRef.current.play();
  };

  return (
    <div>
      <audio ref={audioRef} autoPlay />

      <button onClick={() => createOffer(sendSignal, playRemote)}>
        📞 통화 시작
      </button>

      <button onClick={closeCall}>
        ❌ 종료
      </button>
    </div>
  );
}
