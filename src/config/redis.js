// config/redis.js
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = client;
