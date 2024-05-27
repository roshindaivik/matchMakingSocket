const { RedisClient } = require("./client-redis");

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    socket.on("disconnect", async () => {
      await RedisClient.del(`${socket.id}`);
    });

    socket.on("addPlayerToQueue", async (playerId) => {
      try {
        const serverId = socket.id;
        await RedisClient.lpush(`${serverId}`, playerId);
        const redisLen = await RedisClient.llen(`${serverId}`);
        await RedisClient.expire(`${serverId}`, 60 * 60);
        if (redisLen >= 2) {
          const playerId = await RedisClient.lpop(`${serverId}`);
          const opponentId = await RedisClient.lpop(`${serverId}`);
          io.to(serverId).emit("matchFound", {
            players: [playerId, opponentId],
          });
        }
        io.to(serverId).emit("playerAdded", {
          success: true,
          msg: "Player added to queue",
        });
      } catch (err) {
        console.log("Error in addPlayerToQueue:", { error: err });
      }
    });

    socket.on("removePlayerFromQueue", async (playerId) => {
      try {
        await RedisClient.lrem(`${socket.id}`, 0, playerId);
        io.to(socket.id).emit("removedPlayer", {
          success: true,
          msg: "Player removed from queue",
        });
      } catch (err) {
        console.log("Error in removePlayerFromQueue:", { error: err });
      }
    });
  });
};

module.exports = {
  socketHandler,
};
