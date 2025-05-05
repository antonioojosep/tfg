import { Server } from "socket.io";

let ioInstance;

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });

    // Handle new command
    socket.on("new-command", (command) => {
      console.log("📦 Command received:", command);
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
