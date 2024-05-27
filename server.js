const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { socketHandler } = require("./matchmaking.socket");

function createServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new socketIo.Server(server, {
    cors: {
      origin: ["https://4.224.161.180:8888", "https://qj5sdf.csb.app"],
      credentials: true,
    },
  });
  app.set("trust proxy", 1);
  app.use(express.json());
  socketHandler(io);
  return server;
}

module.exports = {
  createServer,
};
