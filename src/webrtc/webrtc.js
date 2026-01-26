let pc = null;
let localStream = null;

const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const initPeer = (sendSignal, onRemoteStream) => {
  pc = new RTCPeerConnection(ICE_CONFIG);

  pc.ontrack = (e) => {
    onRemoteStream(e.streams[0]);
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      sendSignal("ICE", e.candidate);
    }
  };

  return pc;
};

export const getMic = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  return localStream;
};

export const createOffer = async (sendSignal, onRemoteStream) => {
  const pc = initPeer(sendSignal, onRemoteStream);

  const stream = await getMic();
  stream.getTracks().forEach(t => pc.addTrack(t, stream));

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  sendSignal("OFFER", offer);
};

export const handleOffer = async (offer, sendSignal, onRemoteStream) => {
  const pc = initPeer(sendSignal, onRemoteStream);

  const stream = await getMic();
  stream.getTracks().forEach(t => pc.addTrack(t, stream));

  await pc.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  sendSignal("ANSWER", answer);
};

export const handleAnswer = async (answer) => {
  await pc.setRemoteDescription(new RTCSessionDescription(answer));
};

export const handleIce = async (candidate) => {
  await pc.addIceCandidate(new RTCIceCandidate(candidate));
};

export const closeCall = () => {
  pc?.close();
  pc = null;

  localStream?.getTracks().forEach(t => t.stop());
  localStream = null;
};
