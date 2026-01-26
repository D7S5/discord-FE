import React, { useEffect } from "react";
import { useMediasoup } from "../hooks/useMediasoup";

export default function VoiceChannelPage({ roomId }) {
  const { device } = useMediasoup(roomId);

  useEffect(() => {
    if (!device) return;
    // getUserMedia, transport 생성, produce/consume 로직 추가
  }, [device]);

  return <div>🎙 Voice Channel: {roomId}</div>;
}
