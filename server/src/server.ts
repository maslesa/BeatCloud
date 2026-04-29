import "dotenv/config";
import app from "./app";
import { connectToMongoDB } from "./config/mongo";
import { Server } from "socket.io";
import http from "http";
import redis from "./config/redis";
import { logger } from "./config/logger";

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

export { io };

connectToMongoDB();

server.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`);
});
