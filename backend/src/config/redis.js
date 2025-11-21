const Redis = require("ioredis");

const client = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

client.on("connect", () => console.log("Redis connected"));
client.on("error", (err) => console.error("Redis error", err));

module.exports = client;
