require('dotenv').config();

const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_KEY,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});
client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then(() => console.log('connected to Redis')).catch((err) => console.log(err));

module.exports = client;
