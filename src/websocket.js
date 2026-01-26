// websocket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;
let connecting = false;
let connectCallbacks = [];

export const connectWebSocket = (onConnect) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("accessToken 없음. WebSocket 연결 중단");
    return;
  }

  if (onConnect) connectCallbacks.push(onConnect);

  // 이미 연결되어 있으면 콜백만 실행
  if (client?.connected) {
    connectCallbacks.forEach(cb => cb(client));
    connectCallbacks = [];
    return;
  }

  // 연결 중이면 대기
  if (connecting) return;
  connecting = true;

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      console.log("✅ STOMP connected");
      connecting = false;

      connectCallbacks.forEach(cb => cb(client));
      connectCallbacks = [];
    },

    onStompError: (frame) => {
      console.error("❌ STOMP ERROR");
      console.error("headers:", frame.headers);
      console.error("body:", frame.body);
    },

    onWebSocketClose: () => {
      console.warn("⚠️ WebSocket closed");
      connecting = false;
    },
  });

  client.activate();
};

export const disconnectWebSocket = () => {
  if (client) {
    console.log("🔌 WebSocket disconnect");
    client.deactivate();
    client = null;
    connecting = false;
    connectCallbacks = [];
  }
};

export const getClient = () => client;
