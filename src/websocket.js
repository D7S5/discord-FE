import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client;

export const connectWebSocket = (onConnect) => {
  if (client && client.connected) return;

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect,
    
    connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  },
  });

  client.activate();
};

export const subscribeChannel = (channelId, callback) => {
  if (!client) return;

  return client.subscribe(
    `/topic/channels/${channelId}`,
    (msg) => callback(JSON.parse(msg.body))
  );
};

export const sendSocketMessage = (channelId, content) => {
  if (!client) return;

  client.publish({
    destination: `/app/channels/${channelId}/messages`,
    body: JSON.stringify({ content }),
  });
};
