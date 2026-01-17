import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export const connectWebSocket = (onMessage) => {
  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket Connected");
    },
  });

  client.activate();
};

export const subscribeChannel = (channelId, callback) => {
  client.subscribe(`/topic/channels/${channelId}`, (msg) => {
    callback(JSON.parse(msg.body));
  });
};

export const sendMessage = (message) => {
  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message),
  });
};
