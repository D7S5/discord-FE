// websocket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;
let connecting = false;
let isRefreshing = false;
let connectCallbacks = [];

/**
 * refresh 시작 시 호출
 */
export const onRefreshStart = () => {
  isRefreshing = true;
};

/**
 * refresh 성공 후 호출 (⭐ 중요)
 */
export const onRefreshSuccess = (newAccessToken) => {
  localStorage.setItem("accessToken", newAccessToken);
  isRefreshing = false;

  // 기존 연결 있으면 재연결
  if (client) {
    reconnectWebSocket();
  }
};

/**
 * refresh 실패 시 호출
 */
export const onRefreshFail = () => {
  isRefreshing = false;
  disconnectWebSocket();
};



/**
 * WebSocket 연결
 */
export const connectWebSocket = (onConnect) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.warn("❌ accessToken 없음 → WebSocket 연결 중단");
    return;
  }

  if (onConnect) {
    connectCallbacks.push(onConnect);
  }

  // 이미 연결됨
  if (client?.connected) {
    connectCallbacks.forEach(cb => cb(client));
    connectCallbacks = [];
    return;
  }

  // 연결 중이면 대기
  if (connecting) return;
  connecting = true;

  client = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws"),

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

/**
 * WebSocket 재연결 (refresh 이후)
 */
export const reconnectWebSocket = () => {
  if (connecting) return;

  console.log("🔄 STOMP reconnect");

  disconnectWebSocket();

  setTimeout(() => {
    connectWebSocket();
  }, 100);
};


export const disconnectWebSocket = () => {
  if (client) {
    console.log("🔌 STOMP disconnect");
    client.deactivate();
  }

  client = null;
  connecting = false;
  connectCallbacks = [];
};

export const safePublish = (destination, body, headers = {}) => {
  if (isRefreshing) {
    console.warn("⏸ refresh 중 → STOMP publish 차단");
    return;
  }

  if (!client || !client.connected) {
    console.warn("❌ STOMP not connected → publish 취소");
    return;
  }

  client.publish({
    destination,
    body: JSON.stringify(body),
    headers,
  });
};

export const getClient = () => client;
