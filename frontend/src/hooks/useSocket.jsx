import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(onNewCommand) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });
    socketRef.current = socket;

    if (onNewCommand) {
      socket.on("new-command", onNewCommand);
    }

    return () => {
      socket.disconnect();
    };
  }, [onNewCommand]);

  return socketRef.current;
}