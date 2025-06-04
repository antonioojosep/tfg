import { Server } from "socket.io";

let ioInstance;

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://frontend:5173", "http://172.20.0.5:5173", "https://frontend-production-a79c4.up.railway.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    // Handle new command
    socket.on("new-command", (command) => {
      console.log("🆕 New command received:", command);
      io.emit("command-updated", command);
    });

    // Handle table status update
    socket.on("update-table-status", (table) => {
      io.emit("table-status-updated", table);
    });
  });

  ioInstance = io;
}

export function getIO() {
  if (!ioInstance) throw new Error("Socket.io has not been initialized.");
  return ioInstance;
}
