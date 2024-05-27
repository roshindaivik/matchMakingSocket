const ioRedis = require("ioredis");

const RedisClient = new ioRedis.Redis({
  host: "localhost",
  port: 6379,
});

module.exports = {
  RedisClient,
};
