const socketIO = require("socket.io");
let io;
const connectedUsers = new Map();

function initSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket.id);

    socket.on("register", (username) => {
      connectedUsers.set(username, socket.id);
      console.log(`✅ Registered: ${username} → ${socket.id}`);
    });

    socket.on("disconnect", () => {
      // Remove user from connectedUsers
      for (const [username, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(username);
          console.log(`❌ User disconnected: ${username}`);
          break;
        }
      }
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
  connectedUsers,
};
