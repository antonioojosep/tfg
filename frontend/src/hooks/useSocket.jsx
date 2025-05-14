import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(eventHandler) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });
    socketRef.current = socket;

    if (eventHandler) {
      // Escuchar todos los eventos relevantes
      socket.on("new-command", (data) => eventHandler({ type: 'new-command', command: data }));
      socket.on("command-completed", eventHandler);
      socket.on("table-updated", (data) => eventHandler({ type: 'table-updated', ...data }));
      socket.on("bill-paid", (data) => eventHandler({ type: 'bill-paid', bill: data }));
    }

    return () => {
      if (socket) {
        socket.off("new-command");
        socket.off("command-completed");
        socket.off("table-updated");
        socket.off("bill-paid");
        socket.disconnect();
      }
    };
  }, [eventHandler]);

  return socketRef.current;
}