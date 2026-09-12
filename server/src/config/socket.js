import { Server } from "socket.io";
import { env } from "./env.js";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.on("connection", (socket) => {
    // Customers join the room for the order they're tracking; vendors could
    // extend this to a vendor-wide room for a live incoming-orders feed.
    socket.on("order:subscribe", (orderId) => {
      if (typeof orderId === "string") socket.join(`order:${orderId}`);
    });
  });

  return io;
}

export function emitOrderUpdate(order) {
  if (!io) return;
  io.to(`order:${order._id}`).emit("order:updated", {
    orderId: String(order._id),
    status: order.status,
    statusHistory: order.statusHistory,
    estimatedDeliveryAt: order.estimatedDeliveryAt,
  });
}
