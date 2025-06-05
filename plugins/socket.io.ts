import { io, Socket } from "socket.io-client";
import { API_URL } from "~/constants/api-url.const";

// const API_URL = "https://drifters-api-v2.fly.dev"

export default defineNuxtPlugin((nuxtApp) => {
  const socket: Socket = io(API_URL, {
    transports: ["websocket", "polling"],
  }); // tai oma API-osoitteesi

  socket.on("connect", () => {
    console.log("✅ Socket.io connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket.io disconnected");
  });

  // Tuo socket käyttöön appin sisällä (esim. this.$socket tai useNuxtApp().$socket)
  nuxtApp.provide("socket", socket);
});
