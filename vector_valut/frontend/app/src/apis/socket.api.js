import { io } from "socket.io-client";

// Relative path (no host): socket.io-client connects to the page's own origin,
// and Vite's dev server proxy (see vite.config.js) forwards it to the backend.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

const socket = io(`${SOCKET_URL}/voice`, {
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Connected to voice websocket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from voice websocket server");
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const startVoiceStream = (options) => {
  connectSocket();
  socket.emit("start_voice_stream", options);
};

export const sendAudioChunk = (chunk) => {
  if (socket.connected) {
    socket.emit("audio_chunk", chunk);
  }
};

export const endVoiceStream = () => {
  if (socket.connected) {
    socket.emit("end_voice_stream");
  }
};

export const onSpeechResponse = (callback) => {
  socket.off("speech_response");
  socket.on("speech_response", callback);
};

export const onSocketError = (callback) => {
  socket.off("socket_error");
  socket.on("socket_error", callback);
};

export default socket;