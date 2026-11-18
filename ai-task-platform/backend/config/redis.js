const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis Connected Successfully!");
});

redis.on("error", (error) => {
  console.error("Redis Connection Error:", error);
});

module.exports = redis;
