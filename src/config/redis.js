require("dotenv").config();

const { createClient } = require("redis");

const client = createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
    console.log("Redis client connected");
});

client.on("error", (error) => {
    console.log(error);
});

module.exports = client;
