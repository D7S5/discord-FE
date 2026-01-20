// websocket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;
let connectCallbacks = [];
let activating = false;

export const connectWebSocket = (serverId, onConnect) => {
  if (!serverId) {
    console.error("serverId is required to connect WebSocket");
    return;
  }

  if (onConnect) {
    connectCallbacks.push(onConnect);
  }

  // 이미 연결돼 있으면 즉시 콜백 실행
  if (client?.connected) {
    connectCallbacks.forEach(cb => cb());
    connectCallbacks = [];
    return;
  }

  // 이미 연결 시도 중이면 기다림
  if (activating) return;

  activating = true;

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    
    connectHeaders: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    serverId: String(serverId)
  },
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ STOMP connected");
      activating = false;
      connectCallbacks.forEach(cb => cb());
      connectCallbacks = [];
    },

    onWebSocketClose: () => {
      console.warn("⚠️ WebSocket closed");
      activating = false;
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error", frame);
    },
  });

  client.activate();
};

export const getClient = () => client;
