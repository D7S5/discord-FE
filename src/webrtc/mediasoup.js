// webrtc/mediasoup.js
import * as mediasoupClient from "mediasoup-client";
import { socket } from "./socket";

let device;
let sendTransport;
let recvTransport;
let producer;
let consumers = {};

export async function initDevice() {
  const routerRtpCapabilities = await socketRequest("getRtpCapabilities");

  device = new mediasoupClient.Device();
  await device.load({ routerRtpCapabilities });
}

export async function createSendTransport() {
  const data = await socketRequest("createWebRtcTransport");

  sendTransport = device.createSendTransport(data);

  sendTransport.on("connect", ({ dtlsParameters }, cb) => {
    socket.emit("connectTransport", {
      transportId: sendTransport.id,
      dtlsParameters,
    });
    cb();
  });

  sendTransport.on("produce", async ({ kind, rtpParameters }, cb) => {
    const { id } = await socketRequest("produce", {
      transportId: sendTransport.id,
      kind,
      rtpParameters,
    });
    cb({ id });
  });
}

export async function startMic() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const track = stream.getAudioTracks()[0];

  producer = await sendTransport.produce({ track });
}

export async function createRecvTransport() {
  const data = await socketRequest("createWebRtcTransport");

  recvTransport = device.createRecvTransport(data);

  recvTransport.on("connect", ({ dtlsParameters }, cb) => {
    socket.emit("connectTransport", {
      transportId: recvTransport.id,
      dtlsParameters,
    });
    cb();
  });
}

export async function consume(producerId) {
  const data = await socketRequest("consume", {
    transportId: recvTransport.id,
    producerId,
    rtpCapabilities: device.rtpCapabilities,
  });

  const consumer = await recvTransport.consume(data);

  consumers[producerId] = consumer;

  const audio = document.createElement("audio");
  audio.srcObject = new MediaStream([consumer.track]);
  audio.autoplay = true;

  document.body.appendChild(audio);
}

/* util */
function socketRequest(type, data = {}) {
  return new Promise((resolve) => {
    socket.emit(type, data, resolve);
  });
}
