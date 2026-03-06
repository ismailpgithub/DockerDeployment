import { prismaClient } from "db/client";

Bun.serve({
  port: 8081,

  fetch(req, server) {
    // Upgrade to WebSocket if requested
    if (server.upgrade(req)) {
      return; // upgrade successful → Bun handles the connection
    }

    // Not a WS request → return plain response
    return new Response("Upgrade failed", { status: 400 });
  },

  websocket: {
    async message(ws, message) {
      try {
        // Create user (use await since it's async)
        await prismaClient.user.create({
          data: {
            username: Math.random().toString(36).slice(2),
            password: Math.random().toString(36).slice(2),
          },
        });

        // Echo back the message
        ws.send(message);
      } catch (err) {
        console.error("Database error:", err);
        ws.send("Error creating user");
      }
    },

    // Optional: handle open/close events
    open(ws) {
      console.log("WebSocket connected");
    },
    close(ws, code, reason) {
      console.log("WebSocket closed", code, reason);
    },
  },
});

console.log("WebSocket server running on ws://localhost:8081");