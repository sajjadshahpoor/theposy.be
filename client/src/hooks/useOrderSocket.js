import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

// Subscribes to live status pushes for one order, seeded with its
// already-known status/history so the UI has something to show
// immediately rather than waiting on the socket connection.
export function useOrderSocket(orderId, initialStatus, initialHistory) {
  const [status, setStatus] = useState(initialStatus);
  const [statusHistory, setStatusHistory] = useState(initialHistory);

  useEffect(() => {
    if (!orderId) return undefined;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socket.on("connect", () => socket.emit("order:subscribe", orderId));
    socket.on("order:updated", (payload) => {
      if (payload.orderId === orderId) {
        setStatus(payload.status);
        setStatusHistory(payload.statusHistory);
      }
    });

    return () => socket.disconnect();
  }, [orderId]);

  return { status, statusHistory };
}
