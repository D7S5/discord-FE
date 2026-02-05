// websocket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;
let connecting = false;
let isRefreshing = false;
let connectCallbacks = [];

/* =========================
   Refresh 상태 연동
========================= */

/**
 * refresh 시작 시 호출
 */
export const onRefreshStart = () => {
  isRefreshing = true;
};

/**
 * refresh 성공 후 호출 (⭐ 핵심)
 */
export const onRefreshSuccess = (newAccessToken) => {
  localStorage.setItem("accessToken", newAccessToken);
  isRefreshing = false;

  // refresh 성공 후에만 재연결
  reconnectWebSocket(newAccessToken);
};

/**
 * refresh 실패 시 호출
 */
export const onRefreshFail = () => {
  isRefreshing = false;
  disconnectWebSocket();
};


export const connectWebSocket = (onConnect, overrideToken) => {
  if (isRefreshing) {
    console.warn("⏸ refresh 중 → WS connect 차단");
    return;
  }

  const token = overrideToken ?? localStorage.getItem("accessToken");

  if (!token) {
    console.warn("❌ accessToken 없음 → WS 연결 중단");
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

  // 연결 중이면 중복 방지
  if (connecting) return;
  connecting = true;

  client = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws"),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 0,

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
      client = null;
    },
  });

  client.activate();
};

export const reconnectWebSocket = (token) => {
  if (connecting) return;

  console.log("🔄 STOMP reconnect");

  disconnectWebSocket();

  setTimeout(() => {
    connectWebSocket(null, token);
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

/* =========================
   Getter
========================= */

export const getClient = () => client;
